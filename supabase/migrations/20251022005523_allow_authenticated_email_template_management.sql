/*
  # Allow Authenticated Users to Manage Email Templates

  Updates RLS policies to allow all authenticated users to manage
  email templates (not just admins).
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can insert email templates" ON email_templates;
DROP POLICY IF EXISTS "Admins can update email templates" ON email_templates;
DROP POLICY IF EXISTS "Admins can delete email templates" ON email_templates;

-- Create new policies for all authenticated users
CREATE POLICY "Authenticated users can insert email templates"
  ON email_templates FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update email templates"
  ON email_templates FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete email templates"
  ON email_templates FOR DELETE
  TO authenticated
  USING (true);