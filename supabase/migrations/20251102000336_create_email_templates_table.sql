/*
  # Create Email Templates System

  1. New Tables
    - email_templates: Store all email templates
    - email_logs: Track sent emails
    
  2. Security
    - Enable RLS
    - Admin-only access to templates
    - Users can view their own email logs
*/

-- Create email_templates table
CREATE TABLE IF NOT EXISTS public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL DEFAULT 'general',
  subject_en text NOT NULL,
  subject_ru text,
  body_en text NOT NULL,
  body_ru text,
  variable_schema jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create email_logs table
CREATE TABLE IF NOT EXISTS public.email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES public.email_templates(id) ON DELETE SET NULL,
  recipient_email text NOT NULL,
  subject text NOT NULL,
  body text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  error_message text,
  sent_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Policies for email_templates (admin only)
CREATE POLICY "admin_read_email_templates" ON public.email_templates
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

CREATE POLICY "admin_insert_email_templates" ON public.email_templates
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

CREATE POLICY "admin_update_email_templates" ON public.email_templates
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

CREATE POLICY "admin_delete_email_templates" ON public.email_templates
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

-- Policies for email_logs (admin can see all, users can see their own)
CREATE POLICY "admin_read_all_email_logs" ON public.email_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

CREATE POLICY "users_read_own_email_logs" ON public.email_logs
  FOR SELECT
  USING (
    recipient_email IN (
      SELECT email FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "admin_insert_email_logs" ON public.email_logs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_email_templates_slug ON public.email_templates(slug);
CREATE INDEX IF NOT EXISTS idx_email_templates_category ON public.email_templates(category);
CREATE INDEX IF NOT EXISTS idx_email_templates_status ON public.email_templates(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_template_id ON public.email_logs(template_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON public.email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs(status);

-- Insert invitation email templates
INSERT INTO public.email_templates (name, slug, category, subject_en, body_en, variable_schema, status, description)
VALUES 
(
  'Invitation Welcome',
  'invitation_welcome',
  'invitation',
  'You''re Invited to Join BioMath Core! 🎉',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; background: #f3f4f6; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #f97316 0%, #ec4899 100%); padding: 40px 20px; text-align: center; }
    .logo { font-size: 32px; font-weight: bold; color: #ffffff; margin-bottom: 10px; }
    .header-text { color: #ffffff; font-size: 18px; margin: 0; }
    .content { padding: 40px 30px; }
    .greeting { font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 20px; }
    .message { font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 30px; }
    .code-box { background: #fef3c7; border: 2px dashed #f59e0b; border-radius: 12px; padding: 24px; text-align: center; margin: 30px 0; }
    .code-label { font-size: 14px; color: #92400e; margin-bottom: 8px; font-weight: 600; }
    .code { font-size: 32px; font-weight: bold; color: #f97316; letter-spacing: 4px; font-family: monospace; }
    .plan-info { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .plan-info h3 { margin: 0 0 10px 0; color: #1e40af; font-size: 18px; }
    .plan-info p { margin: 5px 0; color: #1e3a8a; font-size: 14px; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ec4899 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0; }
    .feature { display: flex; align-items: start; margin-bottom: 12px; }
    .feature-icon { color: #10b981; margin-right: 12px; font-size: 20px; flex-shrink: 0; }
    .feature-text { color: #4b5563; font-size: 14px; }
    .footer { background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer-text { color: #6b7280; font-size: 14px; margin: 5px 0; }
    .footer-link { color: #f97316; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">BioMath Core</div>
      <p class="header-text">Advanced AI-Powered Health Analytics</p>
    </div>
    
    <div class="content">
      <h1 class="greeting">Welcome, {{recipient_name}}! 🎉</h1>
      
      <p class="message">
        You''ve been invited to join BioMath Core, the most advanced AI-powered health analytics platform. 
        Transform your health data into actionable insights with our dual AI system.
      </p>
      
      <div class="code-box">
        <div class="code-label">Your Exclusive Invitation Code</div>
        <div class="code">{{invitation_code}}</div>
      </div>
      
      <div class="plan-info">
        <h3>🎁 Your Invitation Includes:</h3>
        <p><strong>Plan:</strong> {{plan_name}}</p>
        <p><strong>Free Access:</strong> {{duration}}</p>
        <p><strong>Expires:</strong> {{expiry_date}}</p>
      </div>
      
      <div style="text-align: center;">
        <a href="{{redemption_link}}" class="cta-button">Activate Your Account →</a>
      </div>
      
      <div style="margin-top: 30px;">
        <h3 style="color: #1f2937; margin-bottom: 16px; font-size: 18px;">What You''ll Get:</h3>
        <div class="feature">
          <span class="feature-icon">✓</span>
          <span class="feature-text">Dual AI analysis for comprehensive health insights</span>
        </div>
        <div class="feature">
          <span class="feature-icon">✓</span>
          <span class="feature-text">Real-time data sync from 100+ devices</span>
        </div>
        <div class="feature">
          <span class="feature-icon">✓</span>
          <span class="feature-text">Personalized health reports and recommendations</span>
        </div>
        <div class="feature">
          <span class="feature-icon">✓</span>
          <span class="feature-text">HIPAA-compliant security</span>
        </div>
        <div class="feature">
          <span class="feature-icon">✓</span>
          <span class="feature-text">24/7 AI health assistant</span>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p class="footer-text"><strong>BioMath Core</strong></p>
      <p class="footer-text">Advanced Health Analytics Platform</p>
      <p class="footer-text">
        <a href="https://biomathcore.com" class="footer-link">biomathcore.com</a> | 
        <a href="mailto:support@biomathcore.com" class="footer-link">support@biomathcore.com</a>
      </p>
    </div>
  </div>
</body>
</html>',
  '[{"key": "recipient_name", "type": "string", "required": true}, {"key": "invitation_code", "type": "string", "required": true}, {"key": "plan_name", "type": "string", "required": true}, {"key": "duration", "type": "string", "required": true}, {"key": "expiry_date", "type": "string", "required": true}, {"key": "redemption_link", "type": "string", "required": true}]'::jsonb,
  'active',
  'Branded invitation email with BioMath Core styling'
)
ON CONFLICT (slug) DO UPDATE 
SET 
  subject_en = EXCLUDED.subject_en,
  body_en = EXCLUDED.body_en,
  variable_schema = EXCLUDED.variable_schema,
  updated_at = now();