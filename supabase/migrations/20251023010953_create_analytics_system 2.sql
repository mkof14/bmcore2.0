/*
  # Analytics & Performance Monitoring System

  1. New Tables
    - `analytics_events`
      - Stores user interaction events for analytics
      - Privacy-compliant tracking
      - Session-based grouping

    - `performance_metrics`
      - Stores application performance data
      - Web vitals tracking
      - Resource timing

  2. Security
    - Enable RLS on both tables
    - Users can only read their own analytics data
    - System can write all analytics data
    - Automatic cleanup of old data (90 days retention)

  3. Indexes
    - Optimized for time-based queries
    - Session and user lookups
    - Event type filtering
*/

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  properties jsonb DEFAULT '{}'::jsonb,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  session_id text NOT NULL,
  page_url text,
  referrer text,
  user_agent text,
  ip_address text,
  country text,
  city text,
  device_type text,
  browser text,
  os text,
  created_at timestamptz DEFAULT now()
);

-- Performance Metrics Table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  metric_type text NOT NULL,
  page_url text,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  session_id text NOT NULL,
  device_info jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Indexes for analytics_events
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_properties ON analytics_events USING gin(properties);

-- Indexes for performance_metrics
CREATE INDEX IF NOT EXISTS idx_performance_metrics_created_at ON performance_metrics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_id ON performance_metrics(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_metric_name ON performance_metrics(metric_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_session_id ON performance_metrics(session_id);

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for analytics_events

-- Allow system to insert all events (for service role)
CREATE POLICY "System can insert analytics events"
  ON analytics_events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can read their own events
CREATE POLICY "Users can read own analytics events"
  ON analytics_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can read all events
CREATE POLICY "Admins can read all analytics events"
  ON analytics_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for performance_metrics

-- Allow system to insert all metrics
CREATE POLICY "System can insert performance metrics"
  ON performance_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can read their own metrics
CREATE POLICY "Users can read own performance metrics"
  ON performance_metrics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can read all metrics
CREATE POLICY "Admins can read all performance metrics"
  ON performance_metrics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to cleanup old analytics data (90 days retention)
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM analytics_events
  WHERE created_at < now() - interval '90 days';

  DELETE FROM performance_metrics
  WHERE created_at < now() - interval '90 days';
END;
$$;

-- Create materialized view for daily analytics summary
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics_daily_summary AS
SELECT
  DATE(created_at) as date,
  event_name,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT session_id) as unique_sessions
FROM analytics_events
GROUP BY DATE(created_at), event_name
ORDER BY date DESC, event_count DESC;

-- Index for materialized view
CREATE INDEX IF NOT EXISTS idx_analytics_daily_summary_date ON analytics_daily_summary(date DESC);

-- Function to refresh analytics summary
CREATE OR REPLACE FUNCTION refresh_analytics_summary()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_daily_summary;
END;
$$;
