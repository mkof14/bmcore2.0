/*
  # Temporarily disable RLS for api_keys_configuration

  1. Changes
    - Disable RLS on api_keys_configuration table temporarily for testing
    - This will help identify if the issue is with RLS or something else

  2. Note
    - This is a temporary change for debugging
    - We will re-enable with proper policies after testing
*/

-- Temporarily disable RLS
ALTER TABLE api_keys_configuration DISABLE ROW LEVEL SECURITY;
