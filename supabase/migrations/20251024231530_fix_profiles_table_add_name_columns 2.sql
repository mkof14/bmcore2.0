/*
  # Fix profiles table - Add first_name and last_name columns

  1. Changes
    - Add `first_name` text column to `profiles` table
    - Add `last_name` text column to `profiles` table
    - Add `full_name` text column (computed from first_name + last_name or from existing name column)
    - Update trigger to maintain full_name when first_name or last_name changes

  2. Notes
    - Existing `name` column will remain for backward compatibility
    - Applications can use either `name` or `first_name`/`last_name` approach
*/

-- Add first_name and last_name columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN first_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'last_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN last_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN full_name text;
  END IF;
END $$;

-- Migrate existing name data to first_name/last_name if name exists
UPDATE profiles
SET 
  first_name = COALESCE(first_name, SPLIT_PART(name, ' ', 1)),
  last_name = COALESCE(last_name, NULLIF(TRIM(SUBSTRING(name FROM POSITION(' ' IN name))), '')),
  full_name = COALESCE(full_name, name)
WHERE name IS NOT NULL AND (first_name IS NULL OR last_name IS NULL OR full_name IS NULL);

-- Create function to auto-update full_name
CREATE OR REPLACE FUNCTION update_profile_full_name()
RETURNS TRIGGER AS $$
BEGIN
  NEW.full_name := TRIM(CONCAT(COALESCE(NEW.first_name, ''), ' ', COALESCE(NEW.last_name, '')));
  IF NEW.full_name = '' THEN
    NEW.full_name := NEW.name;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS trigger_update_profile_full_name ON profiles;

CREATE TRIGGER trigger_update_profile_full_name
  BEFORE INSERT OR UPDATE OF first_name, last_name, name
  ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_full_name();