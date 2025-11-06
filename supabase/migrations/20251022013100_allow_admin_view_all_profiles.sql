/*
  # Allow Authenticated Users to View and Manage Profiles

  Updates RLS policies to allow authenticated users to:
  - View all profiles (for admin panel)
  - Update all profiles (for admin management)
*/

-- Drop restrictive policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new permissive policies for authenticated users
CREATE POLICY "Authenticated users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
