/*
  # Fix Email Templates RLS - Allow Read Access

  Updates RLS policies for email_templates to allow all authenticated users
  to read templates, while keeping write operations admin-only.
*/

-- Drop existing restrictive SELECT policy
DROP POLICY IF EXISTS "Admins can view all email templates" ON email_templates;

-- Create new SELECT policy for all authenticated users
CREATE POLICY "Authenticated users can view email templates"
  ON email_templates FOR SELECT
  TO authenticated
  USING (true);

-- Keep admin-only policies for modifications
-- (INSERT, UPDATE, DELETE policies remain unchanged)