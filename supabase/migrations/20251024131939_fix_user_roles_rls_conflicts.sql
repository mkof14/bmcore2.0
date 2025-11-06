/*
  # Fix User Roles RLS - Complete Restructure

  1. Strategy
    - Create admin cache table WITHOUT RLS
    - Use trigger to maintain cache
    - Policies check cache table instead of user_roles
    - No recursion possible

  2. Changes
    - Create admin_cache table (no RLS)
    - Create trigger to update cache
    - Update all policies to use cache
    - Initialize cache with current admins

  3. Security
    - Cache table has no RLS but is managed by triggers
    - Only admins can modify user_roles
    - Cache automatically updates
*/

-- Create admin cache table (NO RLS!)
CREATE TABLE IF NOT EXISTS public.admin_cache (
  user_id uuid PRIMARY KEY,
  is_admin boolean DEFAULT false,
  is_super_admin boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

-- DO NOT enable RLS on admin_cache
ALTER TABLE admin_cache DISABLE ROW LEVEL SECURITY;

-- Function to update admin cache
CREATE OR REPLACE FUNCTION public.update_admin_cache()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete from cache
  DELETE FROM public.admin_cache WHERE user_id = COALESCE(NEW.user_id, OLD.user_id);
  
  -- Re-insert if user has admin roles
  INSERT INTO public.admin_cache (user_id, is_admin, is_super_admin)
  SELECT 
    ur.user_id,
    bool_or(r.name = 'admin') as is_admin,
    bool_or(r.name = 'super_admin') as is_super_admin
  FROM user_roles ur
  JOIN roles r ON r.id = ur.role_id
  WHERE ur.user_id = COALESCE(NEW.user_id, OLD.user_id)
  AND r.name IN ('admin', 'super_admin')
  AND r.is_system = true
  GROUP BY ur.user_id
  ON CONFLICT (user_id) 
  DO UPDATE SET
    is_admin = EXCLUDED.is_admin,
    is_super_admin = EXCLUDED.is_super_admin,
    updated_at = now();
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger to maintain cache
DROP TRIGGER IF EXISTS maintain_admin_cache ON user_roles;
CREATE TRIGGER maintain_admin_cache
  AFTER INSERT OR UPDATE OR DELETE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_cache();

-- Initialize cache with current admins
TRUNCATE admin_cache;
INSERT INTO admin_cache (user_id, is_admin, is_super_admin)
SELECT 
  ur.user_id,
  bool_or(r.name = 'admin') as is_admin,
  bool_or(r.name = 'super_admin') as is_super_admin
FROM user_roles ur
JOIN roles r ON r.id = ur.role_id
WHERE r.name IN ('admin', 'super_admin')
AND r.is_system = true
GROUP BY ur.user_id;

-- New helper function using cache (NO RECURSION!)
CREATE OR REPLACE FUNCTION public.is_admin_cached(check_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin OR is_super_admin FROM admin_cache WHERE user_id = $1),
    false
  );
$$;

-- Drop old policies
DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all user roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can assign roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can revoke roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON user_roles;

-- Create new policies using cache (NO RECURSION!)
CREATE POLICY "Users can view own roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all user roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (public.is_admin_cached(auth.uid()));

CREATE POLICY "Admins can assign roles"
  ON user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_cached(auth.uid()));

CREATE POLICY "Admins can revoke roles"
  ON user_roles
  FOR DELETE
  TO authenticated
  USING (public.is_admin_cached(auth.uid()));

CREATE POLICY "Admins can update roles"
  ON user_roles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

-- Grant permissions
GRANT SELECT ON admin_cache TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_cached(uuid) TO authenticated;

-- Update profiles policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (public.is_admin_cached(auth.uid()));

CREATE POLICY "Admins can update any profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

-- Update roles policies
DROP POLICY IF EXISTS "Everyone can view roles" ON roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON roles;
DROP POLICY IF EXISTS "Admins can update custom roles" ON roles;
DROP POLICY IF EXISTS "Admins can delete custom roles" ON roles;

CREATE POLICY "Everyone can view roles"
  ON roles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert roles"
  ON roles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_cached(auth.uid()) AND is_system = false);

CREATE POLICY "Admins can update custom roles"
  ON roles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin_cached(auth.uid()) AND is_system = false)
  WITH CHECK (public.is_admin_cached(auth.uid()) AND is_system = false);

CREATE POLICY "Admins can delete custom roles"
  ON roles
  FOR DELETE
  TO authenticated
  USING (public.is_admin_cached(auth.uid()) AND is_system = false);
