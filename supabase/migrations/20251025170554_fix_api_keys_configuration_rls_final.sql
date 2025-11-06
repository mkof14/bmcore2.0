/*
  # Fix api_keys_configuration RLS policies - Final Solution

  1. Changes
    - Create helper function to check if user is admin
    - Recreate all RLS policies using the helper function
    - Add policy for DELETE operations
    - Simplify permission checks

  2. Security
    - Only authenticated admins can access api_keys_configuration
    - Function uses security definer to bypass RLS during check
*/

-- Create helper function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM user_roles ur
    INNER JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = is_admin.user_id
    AND r.name IN ('admin', 'super_admin')
  );
$$;

-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can view API keys" ON api_keys_configuration;
DROP POLICY IF EXISTS "Admins can insert API keys" ON api_keys_configuration;
DROP POLICY IF EXISTS "Admins can update API keys" ON api_keys_configuration;
DROP POLICY IF EXISTS "Admins can delete API keys" ON api_keys_configuration;

-- Create new simple policies using helper function
CREATE POLICY "Admins can view API keys"
  ON api_keys_configuration
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert API keys"
  ON api_keys_configuration
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update API keys"
  ON api_keys_configuration
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete API keys"
  ON api_keys_configuration
  FOR DELETE
  TO authenticated
  USING (is_admin());
