/*
  # Fix Infinite Recursion in User Roles RLS

  1. Changes
    - Create helper function to check if user is admin without recursion
    - Replace recursive policies with function-based checks
    - Add proper indexes for performance
    - Enable proper admin role management

  2. Security
    - Only admins can manage roles (no recursion)
    - Users can view their own roles
    - System maintains security while avoiding recursion
*/

-- Create a helper function to check if user is admin (avoids recursion)
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = $1
    AND r.name IN ('admin', 'super_admin')
    AND r.is_system = true
  );
$$;

-- Drop all existing policies on user_roles
DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all user roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can assign roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can revoke roles" ON user_roles;

-- Create new non-recursive policies using the helper function
CREATE POLICY "Users can view own roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all user roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can assign roles"
  ON user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can revoke roles"
  ON user_roles
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update roles"
  ON user_roles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name) WHERE is_system = true;

-- Grant execute permission on the helper function
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;

-- Update profiles policies to use the same helper function
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update any profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Update roles policies
DROP POLICY IF EXISTS "Admins can manage roles" ON roles;
DROP POLICY IF EXISTS "Users can view roles" ON roles;

CREATE POLICY "Everyone can view roles"
  ON roles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert roles"
  ON roles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()) AND is_system = false);

CREATE POLICY "Admins can update custom roles"
  ON roles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()) AND is_system = false)
  WITH CHECK (public.is_admin(auth.uid()) AND is_system = false);

CREATE POLICY "Admins can delete custom roles"
  ON roles
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()) AND is_system = false);
