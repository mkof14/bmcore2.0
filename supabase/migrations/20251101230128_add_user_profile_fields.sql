/*
  # Add User Profile Fields

  1. Changes
    - Add phone column to profiles table
    - Add bio column to profiles table
    - Add role column for user roles (admin, super_admin, user, tester, guest)
    
  2. Notes
    - Uses IF NOT EXISTS to prevent errors if columns already exist
*/

-- Add phone column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN phone text;
  END IF;
END $$;

-- Add bio column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'bio'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN bio text;
  END IF;
END $$;

-- Add role column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN role text DEFAULT 'user' CHECK (role IN ('super_admin', 'admin', 'user', 'tester', 'guest'));
  END IF;
END $$;

-- Add index on role for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Update existing users to have 'admin' role if they are is_admin=true
UPDATE public.profiles SET role = 'admin' WHERE is_admin = true AND role IS NULL;

-- Update remaining users to have 'user' role
UPDATE public.profiles SET role = 'user' WHERE role IS NULL;
