/*
  # Simple Email Campaigns

  1. Tables
    - email_campaigns
    - email_campaign_logs

  2. No complex RLS - just authenticated check
*/

CREATE TABLE IF NOT EXISTS email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  status text DEFAULT 'draft',
  sent_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_campaign_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES email_campaigns(id) ON DELETE CASCADE,
  recipient text NOT NULL,
  status text DEFAULT 'sent',
  sent_at timestamptz DEFAULT now()
);

ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaign_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_read_campaigns" ON email_campaigns FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_write_campaigns" ON email_campaigns FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_read_logs" ON email_campaign_logs FOR SELECT TO authenticated USING (true);