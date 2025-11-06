/*
  # Fix analytics_events table

  1. New Tables
    - `analytics_events`
      - `id` (uuid, primary key)
      - `event_name` (text)
      - `event_data` (jsonb)
      - `user_id` (uuid, nullable)
      - `session_id` (text, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Allow inserts from everyone (for analytics tracking)
*/

CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  event_data jsonb DEFAULT '{}'::jsonb,
  user_id uuid,
  session_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert analytics events
CREATE POLICY "Anyone can insert analytics events"
  ON analytics_events
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
