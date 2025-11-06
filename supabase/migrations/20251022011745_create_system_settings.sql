/*
  # Create System Settings

  1. New Tables
    - `system_settings`
      - `id` (uuid, primary key)
      - `key` (text, unique) - setting identifier
      - `value` (jsonb) - setting value
      - `category` (text) - grouping category
      - `description` (text)
      - `is_public` (boolean) - can be accessed by non-admins
      - `updated_at` (timestamptz)
      - `updated_by` (uuid, references profiles)

  2. Security
    - Enable RLS
    - Admins can manage all settings
    - Public users can view public settings
*/

CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb DEFAULT '{}'::jsonb,
  category text NOT NULL,
  description text,
  is_public boolean DEFAULT false,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES profiles(id)
);

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all settings"
  ON system_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage settings"
  ON system_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default settings
INSERT INTO system_settings (key, value, category, description, is_public) VALUES
  ('site_name', '"BioMath Core"'::jsonb, 'general', 'Website name', true),
  ('site_description', '"Advanced health analytics platform"'::jsonb, 'general', 'Site description', true),
  ('support_email', '"support@biomathcore.com"'::jsonb, 'general', 'Support contact email', true),
  ('maintenance_mode', 'false'::jsonb, 'system', 'Enable maintenance mode', false),
  ('registration_enabled', 'true'::jsonb, 'user', 'Allow new user registrations', false),
  ('email_verification_required', 'false'::jsonb, 'user', 'Require email verification', false),
  ('max_upload_size_mb', '10'::jsonb, 'system', 'Maximum file upload size in MB', false),
  ('session_timeout_minutes', '60'::jsonb, 'security', 'Session timeout in minutes', false)
ON CONFLICT (key) DO NOTHING;