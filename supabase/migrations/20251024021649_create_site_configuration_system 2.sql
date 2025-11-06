/*
  # Site Configuration System

  1. New Tables
    - `api_keys_configuration`
      - Stores all API keys and service configurations
      - Supports multiple environments (dev, test, production)
      - Secure storage with encryption flags
    
    - `site_pages_configuration`
      - Controls visibility and availability of site pages
      - Supports page categorization
      - Tracks page metadata and descriptions
    
    - `site_settings`
      - General site configuration (maintenance mode, feature flags, etc.)
      - Key-value storage for flexible settings
      - Environment-specific settings

  2. Security
    - Enable RLS on all tables
    - Only admin users can read/write configuration
    - Audit logging for configuration changes
    
  3. Features
    - API keys management with encryption support
    - Page visibility toggle (enable/disable pages)
    - Site-wide settings management
    - Audit trail for all changes
*/

-- API Keys Configuration Table
CREATE TABLE IF NOT EXISTS api_keys_configuration (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name text NOT NULL,
  key_value text,
  service_name text NOT NULL,
  environment text DEFAULT 'production' CHECK (environment IN ('development', 'test', 'production')),
  is_secret boolean DEFAULT true,
  is_required boolean DEFAULT false,
  description text,
  setup_url text,
  icon text,
  category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(key_name, environment)
);

-- Site Pages Configuration Table
CREATE TABLE IF NOT EXISTS site_pages_configuration (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id text NOT NULL UNIQUE,
  page_name text NOT NULL,
  page_path text NOT NULL,
  is_enabled boolean DEFAULT true,
  category text NOT NULL CHECK (category IN ('main', 'legal', 'member', 'admin', 'marketing')),
  description text,
  icon_name text,
  display_order integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text NOT NULL,
  setting_value text,
  setting_type text DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
  environment text DEFAULT 'production' CHECK (environment IN ('development', 'test', 'production')),
  category text,
  description text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id),
  UNIQUE(setting_key, environment)
);

-- Configuration Audit Log
CREATE TABLE IF NOT EXISTS configuration_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('create', 'update', 'delete')),
  old_values jsonb,
  new_values jsonb,
  changed_by uuid REFERENCES auth.users(id),
  changed_at timestamptz DEFAULT now(),
  ip_address text,
  user_agent text
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_api_keys_environment ON api_keys_configuration(environment);
CREATE INDEX IF NOT EXISTS idx_api_keys_service ON api_keys_configuration(service_name);
CREATE INDEX IF NOT EXISTS idx_site_pages_category ON site_pages_configuration(category);
CREATE INDEX IF NOT EXISTS idx_site_pages_enabled ON site_pages_configuration(is_enabled);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_audit_log_table ON configuration_audit_log(table_name, record_id);

-- Enable RLS
ALTER TABLE api_keys_configuration ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_pages_configuration ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuration_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only admins can manage configuration

-- API Keys policies (admin only)
CREATE POLICY "Admins can view API keys"
  ON api_keys_configuration FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

CREATE POLICY "Admins can insert API keys"
  ON api_keys_configuration FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

CREATE POLICY "Admins can update API keys"
  ON api_keys_configuration FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

-- Site Pages policies (admin manages, everyone can read enabled pages)
CREATE POLICY "Everyone can view enabled pages"
  ON site_pages_configuration FOR SELECT
  TO authenticated
  USING (is_enabled = true);

CREATE POLICY "Admins can view all pages"
  ON site_pages_configuration FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

CREATE POLICY "Admins can manage pages"
  ON site_pages_configuration FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

-- Site Settings policies (admin manages, public settings readable by all)
CREATE POLICY "Everyone can view public settings"
  ON site_settings FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Admins can view all settings"
  ON site_settings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

CREATE POLICY "Admins can manage settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

-- Audit Log policies (admin only)
CREATE POLICY "Admins can view audit logs"
  ON configuration_audit_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_configuration_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for timestamp updates
DROP TRIGGER IF EXISTS update_api_keys_timestamp ON api_keys_configuration;
CREATE TRIGGER update_api_keys_timestamp
  BEFORE UPDATE ON api_keys_configuration
  FOR EACH ROW
  EXECUTE FUNCTION update_configuration_timestamp();

DROP TRIGGER IF EXISTS update_site_pages_timestamp ON site_pages_configuration;
CREATE TRIGGER update_site_pages_timestamp
  BEFORE UPDATE ON site_pages_configuration
  FOR EACH ROW
  EXECUTE FUNCTION update_configuration_timestamp();

DROP TRIGGER IF EXISTS update_site_settings_timestamp ON site_settings;
CREATE TRIGGER update_site_settings_timestamp
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_configuration_timestamp();

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, category, description, is_public)
VALUES
  ('maintenance_mode', 'false', 'boolean', 'system', 'Enable/disable maintenance mode', true),
  ('site_name', 'BioMath Core', 'string', 'general', 'Site name', true),
  ('contact_email', 'support@biomathcore.com', 'string', 'general', 'Contact email', true),
  ('max_upload_size_mb', '50', 'number', 'system', 'Maximum file upload size in MB', false),
  ('enable_analytics', 'true', 'boolean', 'features', 'Enable Google Analytics', false),
  ('enable_ai_assistant', 'true', 'boolean', 'features', 'Enable AI Health Assistant', true),
  ('enable_chat', 'true', 'boolean', 'features', 'Enable realtime chat', true)
ON CONFLICT (setting_key, environment) DO NOTHING;
