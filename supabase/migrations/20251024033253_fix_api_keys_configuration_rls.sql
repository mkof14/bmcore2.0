/*
  # Fix API Keys Configuration RLS Policies

  1. Changes
    - Drop existing INSERT policy without proper checks
    - Create new INSERT policy with admin check
    - Ensure all policies require admin role

  2. Security
    - Only admins can insert API keys
    - Only admins can update API keys
    - Only admins can view API keys
*/

-- Drop existing INSERT policy
DROP POLICY IF EXISTS "Admins can insert API keys" ON api_keys_configuration;

-- Create new INSERT policy with admin check
CREATE POLICY "Admins can insert API keys"
  ON api_keys_configuration
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );
