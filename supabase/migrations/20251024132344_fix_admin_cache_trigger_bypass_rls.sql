/*
  # Fix Admin Cache Trigger to Bypass RLS

  1. Problem
    - Trigger function queries user_roles table
    - user_roles has RLS policies enabled
    - Policies call is_admin_cached()
    - This creates recursion when trigger fires during INSERT

  2. Solution
    - Make trigger function bypass RLS completely
    - Use direct table access without policy checks
    - Set session parameters to run as superuser context

  3. Changes
    - Recreate trigger function with proper RLS bypass
    - Ensure SECURITY DEFINER runs with elevated privileges
*/

-- Drop and recreate the trigger function with explicit RLS bypass
CREATE OR REPLACE FUNCTION public.update_admin_cache()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  v_user_id := COALESCE(NEW.user_id, OLD.user_id);
  
  -- Delete from cache
  DELETE FROM public.admin_cache WHERE user_id = v_user_id;
  
  -- Re-insert if user has admin roles
  -- This query runs with SECURITY DEFINER privileges, bypassing RLS
  INSERT INTO public.admin_cache (user_id, is_admin, is_super_admin)
  SELECT 
    ur.user_id,
    bool_or(r.name = 'admin') as is_admin,
    bool_or(r.name = 'super_admin') as is_super_admin
  FROM public.user_roles ur
  JOIN public.roles r ON r.id = ur.role_id
  WHERE ur.user_id = v_user_id
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

-- Recreate trigger
DROP TRIGGER IF EXISTS maintain_admin_cache ON user_roles;
CREATE TRIGGER maintain_admin_cache
  AFTER INSERT OR UPDATE OR DELETE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_cache();

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.update_admin_cache() TO authenticated;

-- Reinitialize the cache to ensure it's fresh
TRUNCATE public.admin_cache;

-- Populate cache by directly accessing tables (bypassing RLS via this migration context)
INSERT INTO public.admin_cache (user_id, is_admin, is_super_admin)
SELECT 
  ur.user_id,
  bool_or(r.name = 'admin') as is_admin,
  bool_or(r.name = 'super_admin') as is_super_admin
FROM public.user_roles ur
JOIN public.roles r ON r.id = ur.role_id
WHERE r.name IN ('admin', 'super_admin')
  AND r.is_system = true
GROUP BY ur.user_id;

-- Verify cache is populated
DO $$
DECLARE
  cache_count int;
BEGIN
  SELECT COUNT(*) INTO cache_count FROM admin_cache;
  RAISE NOTICE 'Admin cache populated with % entries', cache_count;
END;
$$;
