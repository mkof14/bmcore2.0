/*
  # Key Vault & Audit Log System

  1. New Tables
    - `key_vault`
      - Stores encrypted API keys and secrets
      - Version control for key rotation
      - Health check status tracking

    - `audit_log`
      - Tracks all admin operations
      - Records user actions, IP, timestamp
      - Essential for compliance and security

    - `feature_flags`
      - Runtime feature toggles
      - Kill switches for external services
      - No-deploy feature management

  2. Security
    - RLS enabled on all tables
    - Admin-only access to key_vault
    - Audit log is append-only
    - Feature flags admin-managed

  3. Indexes
    - key_vault: provider, key_type, last_check
    - audit_log: actor_id, action, timestamp
    - feature_flags: flag_key, enabled
*/

-- Key Vault for encrypted secrets
CREATE TABLE IF NOT EXISTS key_vault (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  key_type text NOT NULL CHECK (key_type IN ('secret', 'public', 'webhook')),
  alias text NOT NULL,
  key_hash text NOT NULL,
  cipher_text bytea NOT NULL,
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by_id uuid NOT NULL REFERENCES auth.users(id),
  updated_by_id uuid REFERENCES auth.users(id),
  last_check_ok boolean NOT NULL DEFAULT false,
  last_check_at timestamptz,
  UNIQUE(provider, alias)
);

CREATE INDEX IF NOT EXISTS idx_key_vault_provider ON key_vault(provider, key_type);
CREATE INDEX IF NOT EXISTS idx_key_vault_last_check ON key_vault(last_check_ok, last_check_at);

ALTER TABLE key_vault ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage key vault"
  ON key_vault
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Audit Log for tracking admin operations
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  entity text NOT NULL,
  entity_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON audit_log(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity, entity_id);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit log"
  ON audit_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "System can insert audit log"
  ON audit_log
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Feature Flags for runtime toggles
CREATE TABLE IF NOT EXISTS feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_key text NOT NULL UNIQUE,
  enabled boolean NOT NULL DEFAULT false,
  description text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by_id uuid REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_feature_flags_key ON feature_flags(flag_key);
CREATE INDEX IF NOT EXISTS idx_feature_flags_enabled ON feature_flags(enabled);

ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read feature flags"
  ON feature_flags
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage feature flags"
  ON feature_flags
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Insert default feature flags
INSERT INTO feature_flags (flag_key, enabled, description) VALUES
  ('ai.second_opinion', true, 'Enable dual AI opinion feature'),
  ('ai.health_assistant', true, 'Enable AI health assistant'),
  ('devices.integration', true, 'Enable device integrations'),
  ('reports.generation', true, 'Enable report generation'),
  ('stripe.payments', true, 'Enable Stripe payments'),
  ('killswitch.openai', false, 'Emergency kill switch for OpenAI'),
  ('killswitch.anthropic', false, 'Emergency kill switch for Anthropic'),
  ('killswitch.stripe', false, 'Emergency kill switch for Stripe')
ON CONFLICT (flag_key) DO NOTHING;

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
  p_action text,
  p_entity text,
  p_entity_id text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
) RETURNS uuid AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO audit_log (actor_id, action, entity, entity_id, metadata)
  VALUES (auth.uid(), p_action, p_entity, p_entity_id, p_metadata)
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update key_vault updated_at
CREATE OR REPLACE FUNCTION update_key_vault_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER key_vault_updated_at
  BEFORE UPDATE ON key_vault
  FOR EACH ROW
  EXECUTE FUNCTION update_key_vault_timestamp();

-- Trigger to update feature_flags updated_at
CREATE OR REPLACE FUNCTION update_feature_flags_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER feature_flags_updated_at
  BEFORE UPDATE ON feature_flags
  FOR EACH ROW
  EXECUTE FUNCTION update_feature_flags_timestamp();
