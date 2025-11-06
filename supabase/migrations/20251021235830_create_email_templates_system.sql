/*
  # Email Templates and Notification System

  1. New Tables
    - `email_templates`
      - `id` (uuid, primary key)
      - `name` (text) - Template name for admin reference
      - `slug` (text, unique) - Unique identifier for the template
      - `category` (text) - Template category (welcome, payment, billing, etc.)
      - `subject_en` (text) - Email subject in English
      - `subject_ru` (text) - Email subject in Russian
      - `body_en` (text) - Email body content in English
      - `body_ru` (text) - Email body content in Russian
      - `variables` (jsonb) - Available variables/placeholders for personalization
      - `status` (text) - Template status (draft, active, archived)
      - `description` (text) - Description of the template's purpose
      - `created_by` (uuid) - Admin user who created the template
      - `updated_by` (uuid) - Admin user who last updated the template
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `email_logs`
      - `id` (uuid, primary key)
      - `template_id` (uuid, foreign key to email_templates)
      - `recipient_user_id` (uuid, foreign key to auth.users)
      - `recipient_email` (text) - Email address where it was sent
      - `subject` (text) - Actual subject sent (after variable replacement)
      - `body` (text) - Actual body sent (after variable replacement)
      - `status` (text) - Sending status (pending, sent, failed, bounced)
      - `sent_at` (timestamptz) - When the email was sent
      - `opened_at` (timestamptz) - When the email was opened (if tracked)
      - `clicked_at` (timestamptz) - When links were clicked (if tracked)
      - `error_message` (text) - Error details if sending failed
      - `metadata` (jsonb) - Additional metadata about the sending
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Only authenticated admin users can access email templates
    - Only authenticated admin users can view email logs
    - Regular users cannot access these tables

  3. Important Notes
    - Template variables support personalization like {{user_name}}, {{email}}, etc.
    - Categories include: welcome, payment_success, payment_failed, password_reset, 
      billing_invoice, subscription_update, general, promotion, notification
    - All timestamps use timestamptz for proper timezone handling
*/

-- Create email templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL DEFAULT 'general',
  subject_en text NOT NULL,
  subject_ru text,
  body_en text NOT NULL,
  body_ru text,
  variables jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'draft',
  description text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('draft', 'active', 'archived')),
  CONSTRAINT valid_category CHECK (category IN ('welcome', 'payment_success', 'payment_failed', 'password_reset', 'billing_invoice', 'subscription_update', 'general', 'promotion', 'notification'))
);

-- Create email logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES email_templates(id) ON DELETE SET NULL,
  recipient_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  recipient_email text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  sent_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'sent', 'failed', 'bounced'))
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_email_templates_slug ON email_templates(slug);
CREATE INDEX IF NOT EXISTS idx_email_templates_category ON email_templates(category);
CREATE INDEX IF NOT EXISTS idx_email_templates_status ON email_templates(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_template_id ON email_logs(template_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient_user_id ON email_logs(recipient_user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_templates
CREATE POLICY "Admins can view all email templates"
  ON email_templates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.privacy_flags->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Admins can insert email templates"
  ON email_templates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.privacy_flags->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Admins can update email templates"
  ON email_templates FOR UPDATE
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

CREATE POLICY "Admins can delete email templates"
  ON email_templates FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.privacy_flags->>'is_admin' = 'true'
    )
  );

-- RLS Policies for email_logs
CREATE POLICY "Admins can view all email logs"
  ON email_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.privacy_flags->>'is_admin' = 'true'
    )
  );

CREATE POLICY "System can insert email logs"
  ON email_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS email_templates_updated_at ON email_templates;
CREATE TRIGGER email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_email_templates_updated_at();

-- Insert default welcome email template
INSERT INTO email_templates (name, slug, category, subject_en, subject_ru, body_en, body_ru, variables, status, description)
VALUES (
  'Welcome Email',
  'welcome-new-user',
  'welcome',
  'Welcome to BioMath Core!',
  'Добро пожаловать в BioMath Core!',
  'Hi {{user_name}},

Welcome to BioMath Core! We''re excited to have you on board.

Your account has been successfully created with the email: {{user_email}}

Get started by exploring our features:
- Create personalized health reports
- Connect your wearable devices
- Track your wellness journey
- Get AI-powered health insights

If you have any questions, feel free to reach out to our support team.

Best regards,
The BioMath Core Team',
  'Привет {{user_name}},

Добро пожаловать в BioMath Core! Мы рады видеть вас!

Ваш аккаунт успешно создан с электронной почтой: {{user_email}}

Начните работу, изучив наши функции:
- Создавайте персонализированные отчеты о здоровье
- Подключайте свои носимые устройства
- Отслеживайте свой путь к здоровью
- Получайте советы на основе ИИ

Если у вас есть вопросы, обращайтесь в нашу службу поддержки.

С уважением,
Команда BioMath Core',
  '["user_name", "user_email"]'::jsonb,
  'active',
  'Welcome email sent to new users upon registration'
) ON CONFLICT (slug) DO NOTHING;

-- Insert default payment success template
INSERT INTO email_templates (name, slug, category, subject_en, subject_ru, body_en, body_ru, variables, status, description)
VALUES (
  'Payment Success',
  'payment-success',
  'payment_success',
  'Payment Confirmed - BioMath Core',
  'Платеж подтвержден - BioMath Core',
  'Hi {{user_name}},

Thank you for your payment of {{amount}} {{currency}}.

Your subscription to {{plan_name}} has been successfully activated.

Payment Details:
- Amount: {{amount}} {{currency}}
- Plan: {{plan_name}}
- Transaction ID: {{transaction_id}}
- Date: {{payment_date}}

Your subscription is now active and you have full access to all features.

Thank you for choosing BioMath Core!

Best regards,
The BioMath Core Team',
  'Привет {{user_name}},

Спасибо за ваш платеж в размере {{amount}} {{currency}}.

Ваша подписка на {{plan_name}} успешно активирована.

Детали платежа:
- Сумма: {{amount}} {{currency}}
- План: {{plan_name}}
- ID транзакции: {{transaction_id}}
- Дата: {{payment_date}}

Ваша подписка активна, и у вас есть полный доступ ко всем функциям.

Спасибо, что выбрали BioMath Core!

С уважением,
Команда BioMath Core',
  '["user_name", "amount", "currency", "plan_name", "transaction_id", "payment_date"]'::jsonb,
  'active',
  'Confirmation email sent after successful payment'
) ON CONFLICT (slug) DO NOTHING;