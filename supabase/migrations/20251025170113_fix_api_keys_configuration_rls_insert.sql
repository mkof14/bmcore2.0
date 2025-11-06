/*
  # Fix RLS INSERT policy for api_keys_configuration

  1. Changes
    - Drop existing INSERT policy that might be too restrictive
    - Create new INSERT policy with simpler admin check
    - Ensure admins can insert new API keys without restrictions

  2. Security
    - Only authenticated users with admin role can insert
    - Uses simplified role check to avoid recursion issues
*/

-- Drop existing INSERT policy
DROP POLICY IF EXISTS "Admins can insert API keys" ON api_keys_configuration;

-- Create new INSERT policy with simplified check
CREATE POLICY "Admins can insert API keys"
  ON api_keys_configuration
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() 
      AND r.name IN ('admin', 'super_admin')
    )
  );
