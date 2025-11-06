/*
  # Ultimate Fix: Simplified RLS Without Recursion

  1. Root Cause Analysis
    - ANY function call in RLS policy can cause issues
    - Even SECURITY DEFINER functions trigger policy checks
    - Need to avoid function calls entirely in critical policies

  2. Solution: Store admin flag in profiles table
    - Add is_admin column to profiles
    - Update via trigger automatically  
    - Policies check simple column, not function
    - Zero chance of recursion

  3. Implementation
    - Add is_admin to profiles
    - Trigger maintains it automatically
    - Update all policies to check profiles.is_admin
    - Completely eliminate function calls from policies
*/

-- Add admin flag directly to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin) WHERE is_admin = true;

-- Function to sync profiles.is_admin from admin_cache
CREATE OR REPLACE FUNCTION public.sync_profile_admin_flag()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update the profile's is_admin flag based on cache
  UPDATE public.profiles
  SET is_admin = COALESCE(
    (SELECT is_admin OR is_super_admin FROM public.admin_cache WHERE user_id = NEW.user_id),
    false
  )
  WHERE id = NEW.user_id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error syncing profile admin flag: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Trigger on admin_cache to update profiles
DROP TRIGGER IF EXISTS sync_profile_admin ON admin_cache;
CREATE TRIGGER sync_profile_admin
  AFTER INSERT OR UPDATE ON admin_cache
  FOR EACH ROW
  EXECUTE FUNCTION sync_profile_admin_flag();

-- Initialize existing profiles with admin flags
UPDATE public.profiles p
SET is_admin = COALESCE(
  (SELECT ac.is_admin OR ac.is_super_admin 
   FROM public.admin_cache ac 
   WHERE ac.user_id = p.id),
  false
);

-- Now update user_roles policies to use simple column check (NO FUNCTION CALLS!)
DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all user roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can assign roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can revoke roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON user_roles;

-- Simple policies using direct column check - ZERO recursion possible
CREATE POLICY "Users can view own roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all user roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can assign roles"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can revoke roles"
  ON user_roles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update roles"
  ON user_roles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Verify current admin
DO $$
DECLARE
  admin_status boolean;
BEGIN
  SELECT is_admin INTO admin_status 
  FROM profiles 
  WHERE id = '97933187-c8ff-4c67-8ca0-2d5f60d682c8'::uuid;
  
  RAISE NOTICE 'Admin status for dnainform@gmail.com: %', admin_status;
END;
$$;
