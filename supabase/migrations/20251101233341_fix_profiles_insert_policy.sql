/*
  # Fix Profiles Table INSERT Policy

  1. Changes
    - Add INSERT policy to allow new user profile creation
    - Allow users to insert their own profile record on signup
    
  2. Security
    - Users can only insert a profile for their own auth.uid()
    - Prevents users from creating profiles for other users
*/

-- Drop existing insert policy if exists
DROP POLICY IF EXISTS "insert_own_profile" ON public.profiles;

-- Allow users to insert their own profile
CREATE POLICY "insert_own_profile" ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);