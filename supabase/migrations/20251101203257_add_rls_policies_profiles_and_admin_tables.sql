/*
  # Add RLS Policies for Profiles and Admin Tables

  1. Changes
    - Enables RLS on profiles table
    - Creates policies for users to read/update own profile
    - Enables RLS on api_keys_configuration table
    - Creates admin-only policies for api_keys_configuration
    - Uses exists() with profiles.is_admin check for admin verification

  2. Security
    - Users can only read/update their own profile
    - api_keys_configuration table locked to admin users only
    - All policies check auth.uid() for authenticated access
*/

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "read_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;

-- Users can read their own profile
CREATE POLICY "read_own_profile" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile  
CREATE POLICY "update_own_profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Enable RLS on api_keys_configuration
ALTER TABLE public.api_keys_configuration ENABLE ROW LEVEL SECURITY;

-- Drop existing admin policies if they exist
DROP POLICY IF EXISTS "admin_read_api_keys" ON public.api_keys_configuration;
DROP POLICY IF EXISTS "admin_write_api_keys" ON public.api_keys_configuration;
DROP POLICY IF EXISTS "admin_insert_api_keys" ON public.api_keys_configuration;
DROP POLICY IF EXISTS "admin_update_api_keys" ON public.api_keys_configuration;
DROP POLICY IF EXISTS "admin_delete_api_keys" ON public.api_keys_configuration;

-- Admin can read API keys
CREATE POLICY "admin_read_api_keys" ON public.api_keys_configuration
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

-- Admin can insert API keys
CREATE POLICY "admin_insert_api_keys" ON public.api_keys_configuration
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

-- Admin can update API keys
CREATE POLICY "admin_update_api_keys" ON public.api_keys_configuration
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

-- Admin can delete API keys
CREATE POLICY "admin_delete_api_keys" ON public.api_keys_configuration
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );