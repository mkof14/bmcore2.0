/*
  # Enhanced Email Templates System

  1. Changes to existing tables
    - Add new columns to email_templates for versioning and preview
    - Add email_template_versions table for version history
    - Add email_sends table for tracking actual email sends (separate from logs)

  2. New Tables
    - `email_template_versions`
      - Version history for templates
      - Track drafts and published versions
      
    - `email_sends`
      - Track actual email send attempts
      - Link to templates and users
      - Store delivery status and metrics

  3. Enhanced Features
    - Template versioning (draft/published)
    - Preview text support
    - Variable schema with types and validation
    - Send tracking with metrics
    - Test send capability
*/

-- Add new columns to email_templates
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'email_templates' AND column_name = 'preview_text'
  ) THEN
    ALTER TABLE email_templates ADD COLUMN preview_text text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'email_templates' AND column_name = 'variable_schema'
  ) THEN
    ALTER TABLE email_templates ADD COLUMN variable_schema jsonb DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'email_templates' AND column_name = 'version'
  ) THEN
    ALTER TABLE email_templates ADD COLUMN version integer DEFAULT 1;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'email_templates' AND column_name = 'published_version'
  ) THEN
    ALTER TABLE email_templates ADD COLUMN published_version integer;
  END IF;
END $$;

-- Create email template versions table
CREATE TABLE IF NOT EXISTS email_template_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES email_templates(id) ON DELETE CASCADE NOT NULL,
  version integer NOT NULL,
  subject_en text NOT NULL,
  subject_ru text,
  body_en text NOT NULL,
  body_ru text,
  preview_text text,
  variable_schema jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'draft',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  published_at timestamptz,
  CONSTRAINT valid_version_status CHECK (status IN ('draft', 'published')),
  CONSTRAINT unique_template_version UNIQUE (template_id, version)
);

-- Create email sends table for tracking actual sends
CREATE TABLE IF NOT EXISTS email_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES email_templates(id) ON DELETE SET NULL,
  template_version integer,
  recipient_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  recipient_email text NOT NULL,
  subject text NOT NULL,
  body_html text NOT NULL,
  body_text text,
  variables_used jsonb DEFAULT '{}'::jsonb,
  send_type text NOT NULL DEFAULT 'transactional',
  status text NOT NULL DEFAULT 'pending',
  provider text,
  provider_message_id text,
  sent_at timestamptz,
  delivered_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  bounced_at timestamptz,
  bounce_reason text,
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_send_type CHECK (send_type IN ('transactional', 'marketing', 'test')),
  CONSTRAINT valid_send_status CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_template_versions_template_id ON email_template_versions(template_id);
CREATE INDEX IF NOT EXISTS idx_email_template_versions_status ON email_template_versions(status);
CREATE INDEX IF NOT EXISTS idx_email_sends_template_id ON email_sends(template_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_recipient_user_id ON email_sends(recipient_user_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_recipient_email ON email_sends(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_sends_status ON email_sends(status);
CREATE INDEX IF NOT EXISTS idx_email_sends_created_at ON email_sends(created_at DESC);

-- Enable RLS
ALTER TABLE email_template_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_template_versions
CREATE POLICY "Admins can view all template versions"
  ON email_template_versions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.privacy_flags->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Admins can insert template versions"
  ON email_template_versions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.privacy_flags->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Admins can update template versions"
  ON email_template_versions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.privacy_flags->>'is_admin' = 'true'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.privacy_flags->>'is_admin' = 'true'
    )
  );

-- RLS Policies for email_sends
CREATE POLICY "Admins can view all email sends"
  ON email_sends FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.privacy_flags->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Users can view their own email sends"
  ON email_sends FOR SELECT
  TO authenticated
  USING (recipient_user_id = auth.uid());

CREATE POLICY "System can insert email sends"
  ON email_sends FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "System can update email sends"
  ON email_sends FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to create a new template version
CREATE OR REPLACE FUNCTION create_template_version()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO email_template_versions (
    template_id,
    version,
    subject_en,
    subject_ru,
    body_en,
    body_ru,
    preview_text,
    variable_schema,
    status,
    created_by
  ) VALUES (
    NEW.id,
    NEW.version,
    NEW.subject_en,
    NEW.subject_ru,
    NEW.body_en,
    NEW.body_ru,
    NEW.preview_text,
    NEW.variable_schema,
    NEW.status,
    NEW.updated_by
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create version on template update
DROP TRIGGER IF EXISTS email_template_version_trigger ON email_templates;
CREATE TRIGGER email_template_version_trigger
  AFTER INSERT OR UPDATE ON email_templates
  FOR EACH ROW
  WHEN (NEW.subject_en IS NOT NULL AND NEW.body_en IS NOT NULL)
  EXECUTE FUNCTION create_template_version();