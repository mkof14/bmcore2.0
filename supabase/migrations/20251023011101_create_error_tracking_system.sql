/*
  # Error Tracking System

  1. New Tables
    - `error_logs`
      - Comprehensive error logging
      - Stack traces and context
      - Severity levels
      - User and session tracking

  2. Security
    - Enable RLS
    - Admins can read all errors
    - System can insert errors
    - Users can read their own errors

  3. Indexes
    - Optimized for time-based queries
    - Severity filtering
    - User lookup
*/

-- Error Logs Table
CREATE TABLE IF NOT EXISTS error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  stack text,
  component text,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  url text,
  user_agent text,
  severity text NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  context jsonb DEFAULT '{}'::jsonb,
  resolved boolean DEFAULT false,
  resolved_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON error_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_resolved ON error_logs(resolved, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_component ON error_logs(component, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_context ON error_logs USING gin(context);

-- Enable RLS
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- System can insert all errors
CREATE POLICY "System can insert error logs"
  ON error_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can read their own errors
CREATE POLICY "Users can read own error logs"
  ON error_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can read all errors
CREATE POLICY "Admins can read all error logs"
  ON error_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can update errors (mark as resolved)
CREATE POLICY "Admins can update error logs"
  ON error_logs
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to cleanup old resolved errors (180 days retention)
CREATE OR REPLACE FUNCTION cleanup_old_error_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM error_logs
  WHERE resolved = true
  AND resolved_at < now() - interval '180 days';

  DELETE FROM error_logs
  WHERE created_at < now() - interval '90 days'
  AND severity IN ('low', 'medium');
END;
$$;

-- Create materialized view for error summary
CREATE MATERIALIZED VIEW IF NOT EXISTS error_summary AS
SELECT
  DATE(created_at) as date,
  severity,
  component,
  COUNT(*) as error_count,
  COUNT(DISTINCT user_id) as affected_users,
  COUNT(CASE WHEN resolved THEN 1 END) as resolved_count
FROM error_logs
GROUP BY DATE(created_at), severity, component
ORDER BY date DESC, error_count DESC;

-- Index for materialized view
CREATE INDEX IF NOT EXISTS idx_error_summary_date ON error_summary(date DESC);
CREATE INDEX IF NOT EXISTS idx_error_summary_severity ON error_summary(severity, date DESC);

-- Function to refresh error summary
CREATE OR REPLACE FUNCTION refresh_error_summary()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY error_summary;
END;
$$;
