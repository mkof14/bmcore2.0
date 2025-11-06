/*
  # Clean Stripe Configuration System

  1. New Tables
    - `stripe_config` - Simple key-value storage for Stripe settings
      - `key` (text, primary key) - Configuration key
      - `value` (text) - Configuration value
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
  
  2. Security
    - Enable RLS on stripe_config
    - Allow service_role full access (for edge functions)
    - Allow authenticated users read access to public keys only
  
  3. Initial Data
    - Live mode Price IDs
    - Placeholder for secret keys (to be set via Admin Panel)
*/

-- Create simple configuration table
CREATE TABLE IF NOT EXISTS stripe_config (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE stripe_config ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything (for edge functions)
CREATE POLICY "Service role full access"
  ON stripe_config
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can read public keys
CREATE POLICY "Authenticated read public keys"
  ON stripe_config
  FOR SELECT
  TO authenticated
  USING (key LIKE 'publishable_key%' OR key = 'environment');

-- Policy: Authenticated users can read prices
CREATE POLICY "Authenticated read prices"
  ON stripe_config
  FOR SELECT
  TO authenticated
  USING (key LIKE 'price_%');

-- Insert live mode Price IDs
INSERT INTO stripe_config (key, value) VALUES
  ('environment', 'live'),
  ('price_daily_monthly', 'price_1Ry1DrFeT62z7zOTWTEuqnQF'),
  ('price_daily_yearly', 'price_1Ry1ERFeT62z7zOTzqGU2Mb7'),
  ('price_core_monthly', 'price_1Ry1B0FeT62z7zOTfpYzRVgK'),
  ('price_core_yearly', 'price_1Ry1CeFeT62z7zOTtNyV6TRq'),
  ('price_max_monthly', 'price_1Ry1FRFeT62z7zOTRXDSDvmh'),
  ('price_max_yearly', 'price_1Ry1FyFeT62z7zOT2XxWrJPA'),
  ('publishable_key_live', 'NEED_TO_SET'),
  ('secret_key_live', 'NEED_TO_SET'),
  ('webhook_secret', 'NEED_TO_SET')
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = now();
