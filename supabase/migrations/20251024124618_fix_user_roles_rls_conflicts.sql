/*
  # Fix User Roles RLS Policy Conflicts

  1. Changes
    - Remove conflicting broad policies
    - Keep only admin-specific policies
    - Ensure only admins can manage roles

  2. Security
    - Only admins and super_admins can assign roles
    - Only admins and super_admins can revoke roles
    - Admins can view all user roles
    - Regular users cannot manage roles
*/

-- Remove conflicting policies
DROP POLICY IF EXISTS "Authenticated users can manage role assignments" ON user_roles;
DROP POLICY IF EXISTS "Authenticated users can view role assignments" ON user_roles;

-- Ensure admin policies are correct
DROP POLICY IF EXISTS "Admins can view all user roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can assign roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can revoke roles" ON user_roles;

-- Create clean admin-only policies
CREATE POLICY "Admins can view all user roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can assign roles"
  ON user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can revoke roles"
  ON user_roles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'super_admin')
    )
  );

-- Allow users to view their own roles
CREATE POLICY "Users can view own roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
