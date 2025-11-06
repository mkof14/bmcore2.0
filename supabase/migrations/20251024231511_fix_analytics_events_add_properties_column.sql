/*
  # Fix analytics_events table - Add properties column

  1. Changes
    - Add `properties` jsonb column to `analytics_events` table
    - This column is used by the analytics tracking system to store event properties
    - Existing `event_data` column will remain for backward compatibility

  2. Notes
    - Non-breaking change - adds new column without affecting existing data
    - Applications can use either `event_data` or `properties` column
*/

-- Add properties column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analytics_events' AND column_name = 'properties'
  ) THEN
    ALTER TABLE analytics_events ADD COLUMN properties jsonb;
  END IF;
END $$;