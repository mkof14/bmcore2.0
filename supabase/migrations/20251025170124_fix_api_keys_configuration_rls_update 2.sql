/*
  # Fix RLS UPDATE policy for api_keys_configuration

  1. Changes
    - Drop existing UPDATE policy
    - Create new UPDATE policy with simplified admin check
    - Include super_admin role for consistency

  2. Security
    - Only authenticated users with admin or super_admin role can update
    - Consistent with INSERT policy
*/

-- Drop existing UPDATE policy
DROP POLICY IF EXISTS "Admins can update API keys" ON api_keys_configuration;

-- Create new UPDATE policy
CREATE POLICY "Admins can update API keys"
  ON api_keys_configuration
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() 
      AND r.name IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() 
      AND r.name IN ('admin', 'super_admin')
    )
  );
