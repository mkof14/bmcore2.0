/*
  # Device & Sensor Integration

  ## Overview
  Complete system for connecting wearables and medical sensors.
  Users can connect Apple Watch, Oura, Fitbit, CGM devices, etc.
  Data is normalized and used in reports, AI Assistant, and recommendations.

  ## New Tables
  - `device_brands` - Supported device brands and their capabilities
  - `user_devices` - Connected devices per user
  - `device_data` - Normalized health data from devices
  - `sync_logs` - Synchronization history and errors

  ## Features
  - Simple 3-step connection process
  - OAuth integration for each brand
  - Automatic daily sync (configurable)
  - Real-time data for CGM devices
  - Error recovery and token refresh
  - Privacy-first design

  ## Security
  - Encrypted token storage
  - No password storage
  - User can disconnect anytime
  - RLS on all tables
*/

-- =====================================================
-- DEVICE BRANDS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS device_brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('smartwatch', 'fitness_tracker', 'smart_ring', 'cgm', 'blood_pressure', 'body_composition', 'medical_sensor')),
  logo_url text,
  description_en text,
  description_ru text,
  capabilities jsonb DEFAULT '{}',
  oauth_provider text,
  oauth_scopes text[],
  api_version text,
  requires_subscription boolean DEFAULT false,
  supports_realtime boolean DEFAULT false,
  data_refresh_interval_hours integer DEFAULT 24,
  active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  setup_instructions_en text,
  setup_instructions_ru text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE device_brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active device brands"
  ON device_brands FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Only admins can manage device brands"
  ON device_brands FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND role = 'admin' AND active = true
    )
  );

-- =====================================================
-- USER DEVICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_id uuid REFERENCES device_brands(id),
  device_name text,
  status text DEFAULT 'connected' CHECK (status IN ('connected', 'disconnected', 'error', 'token_expired')),
  sync_frequency text DEFAULT 'daily' CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'manual')),
  last_sync_at timestamptz,
  last_sync_status text,
  next_sync_at timestamptz,
  oauth_token_encrypted text,
  oauth_refresh_token_encrypted text,
  oauth_expires_at timestamptz,
  device_metadata jsonb DEFAULT '{}',
  error_message text,
  error_count integer DEFAULT 0,
  connected_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_devices_user ON user_devices(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_devices_brand ON user_devices(brand_id);
CREATE INDEX IF NOT EXISTS idx_user_devices_next_sync ON user_devices(next_sync_at) WHERE status = 'connected';

ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own devices"
  ON user_devices FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- DEVICE DATA TABLE (Normalized Health Data)
-- =====================================================
CREATE TABLE IF NOT EXISTS device_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id uuid REFERENCES user_devices(id) ON DELETE CASCADE,
  data_type text NOT NULL CHECK (data_type IN (
    'heart_rate', 'hrv', 'sleep', 'activity', 'steps', 'calories',
    'temperature', 'glucose', 'blood_pressure', 'oxygen_saturation',
    'stress', 'recovery', 'respiratory_rate', 'body_composition'
  )),
  timestamp timestamptz NOT NULL,
  value numeric(10,2),
  unit text,
  metadata jsonb DEFAULT '{}',
  quality_score numeric(3,2),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_device_data_user ON device_data(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_device_data_device ON device_data(device_id, data_type, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_device_data_type ON device_data(data_type, timestamp DESC);

ALTER TABLE device_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own device data"
  ON device_data FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert device data"
  ON device_data FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- SYNC LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid REFERENCES user_devices(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  sync_type text CHECK (sync_type IN ('manual', 'scheduled', 'realtime')),
  status text CHECK (status IN ('started', 'success', 'partial', 'failed')),
  records_synced integer DEFAULT 0,
  data_types_synced text[],
  error_message text,
  duration_ms integer,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_sync_logs_device ON sync_logs(device_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_user ON sync_logs(user_id, started_at DESC);

ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own sync logs"
  ON sync_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- INSERT DEFAULT DEVICE BRANDS
-- =====================================================
INSERT INTO device_brands (
  code,
  name,
  category,
  description_en,
  description_ru,
  capabilities,
  oauth_provider,
  oauth_scopes,
  data_refresh_interval_hours,
  supports_realtime,
  sort_order
) VALUES
(
  'apple-watch',
  'Apple Watch',
  'smartwatch',
  'Track heart rate, HRV, sleep, activity, and more with Apple HealthKit',
  'Отслеживайте пульс, HRV, сон, активность и другое с Apple HealthKit',
  '{"heart_rate": true, "hrv": true, "sleep": true, "activity": true, "steps": true, "calories": true, "oxygen": true, "temperature": true}',
  'apple_healthkit',
  ARRAY['heart_rate', 'hrv', 'sleep', 'activity'],
  24,
  false,
  1
),
(
  'oura-ring',
  'Oura Ring',
  'smart_ring',
  'Advanced sleep tracking, HRV, temperature, and readiness scores',
  'Продвинутое отслеживание сна, HRV, температуры и готовности',
  '{"heart_rate": true, "hrv": true, "sleep": true, "temperature": true, "recovery": true, "activity": true}',
  'oura',
  ARRAY['personal', 'daily'],
  6,
  false,
  2
),
(
  'fitbit',
  'Fitbit',
  'fitness_tracker',
  'Track steps, heart rate, sleep, and activity with Fitbit devices',
  'Отслеживайте шаги, пульс, сон и активность с устройствами Fitbit',
  '{"heart_rate": true, "sleep": true, "activity": true, "steps": true, "calories": true}',
  'fitbit',
  ARRAY['activity', 'heartrate', 'sleep', 'profile'],
  24,
  false,
  3
),
(
  'whoop',
  'WHOOP',
  'fitness_tracker',
  'Professional-grade strain, recovery, and sleep analysis',
  'Профессиональный анализ нагрузки, восстановления и сна',
  '{"heart_rate": true, "hrv": true, "sleep": true, "recovery": true, "strain": true, "respiratory_rate": true}',
  'whoop',
  ARRAY['read:recovery', 'read:sleep', 'read:workout'],
  6,
  false,
  4
),
(
  'dexcom',
  'Dexcom G6/G7',
  'cgm',
  'Continuous glucose monitoring for diabetes management',
  'Непрерывный мониторинг глюкозы для управления диабетом',
  '{"glucose": true}',
  'dexcom',
  ARRAY['offline_access'],
  1,
  true,
  5
),
(
  'freestyle-libre',
  'FreeStyle Libre',
  'cgm',
  'Flash glucose monitoring system',
  'Система быстрого мониторинга глюкозы',
  '{"glucose": true}',
  'libreview',
  ARRAY['read:glucose'],
  1,
  true,
  6
),
(
  'samsung-health',
  'Samsung Galaxy Watch',
  'smartwatch',
  'Comprehensive health tracking with Samsung Health',
  'Комплексное отслеживание здоровья с Samsung Health',
  '{"heart_rate": true, "sleep": true, "activity": true, "steps": true, "stress": true, "oxygen": true}',
  'samsung',
  ARRAY['health.read'],
  24,
  false,
  7
),
(
  'google-fit',
  'Google Fit / Pixel Watch',
  'smartwatch',
  'Activity and health data from Google Fit ecosystem',
  'Данные об активности и здоровье из экосистемы Google Fit',
  '{"heart_rate": true, "sleep": true, "activity": true, "steps": true, "calories": true}',
  'google',
  ARRAY['fitness.activity.read', 'fitness.heart_rate.read', 'fitness.sleep.read'],
  24,
  false,
  8
),
(
  'withings',
  'Withings',
  'body_composition',
  'Smart scales and body composition analysis',
  'Умные весы и анализ состава тела',
  '{"body_composition": true, "heart_rate": true, "blood_pressure": true}',
  'withings',
  ARRAY['user.metrics'],
  24,
  false,
  9
),
(
  'omron',
  'Omron',
  'blood_pressure',
  'Blood pressure monitoring devices',
  'Устройства для мониторинга артериального давления',
  '{"blood_pressure": true, "heart_rate": true}',
  'omron',
  ARRAY['measurements'],
  24,
  false,
  10
)
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_device_next_sync()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'connected' THEN
    NEW.next_sync_at := NEW.last_sync_at + 
      (SELECT (data_refresh_interval_hours || ' hours')::interval 
       FROM device_brands 
       WHERE id = NEW.brand_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_device_next_sync
  BEFORE INSERT OR UPDATE ON user_devices
  FOR EACH ROW
  EXECUTE FUNCTION update_device_next_sync();

CREATE OR REPLACE FUNCTION increment_device_error_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.last_sync_status = 'error' THEN
    NEW.error_count := COALESCE(NEW.error_count, 0) + 1;
    
    IF NEW.error_count >= 3 THEN
      NEW.status := 'error';
    END IF;
  ELSIF NEW.last_sync_status = 'success' THEN
    NEW.error_count := 0;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_device_error_count
  BEFORE UPDATE ON user_devices
  FOR EACH ROW
  EXECUTE FUNCTION increment_device_error_count();

CREATE TRIGGER update_device_brands_updated_at BEFORE UPDATE ON device_brands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_devices_updated_at BEFORE UPDATE ON user_devices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
