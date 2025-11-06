/*
  # Cost Tracking & Background Job Queue

  1. New Tables
    - `daily_usage_metrics`
      - Tracks API usage, tokens, costs per day
      - Aggregated by service provider
      - Used for cost monitoring and budgeting

    - `job_queue`
      - Background job queue system
      - Retry mechanism and status tracking
      - Concurrency control

  2. Indexes
    - daily_usage_metrics: date, provider
    - job_queue: status, scheduled_at, priority

  3. Security
    - RLS enabled on all tables
    - Admin-only access to metrics
    - System can insert/update jobs
*/

-- Daily usage metrics for cost tracking
CREATE TABLE IF NOT EXISTS daily_usage_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  provider text NOT NULL,
  service text NOT NULL,
  usage_count integer NOT NULL DEFAULT 0,
  tokens_used integer DEFAULT 0,
  estimated_cost_cents integer NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(date, provider, service)
);

CREATE INDEX IF NOT EXISTS idx_daily_usage_date ON daily_usage_metrics(date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_usage_provider ON daily_usage_metrics(provider, service);

ALTER TABLE daily_usage_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view usage metrics"
  ON daily_usage_metrics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "System can insert usage metrics"
  ON daily_usage_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "System can update usage metrics"
  ON daily_usage_metrics
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Background job queue
CREATE TABLE IF NOT EXISTS job_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  priority integer NOT NULL DEFAULT 5,
  scheduled_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz,
  error_message text,
  retry_count integer NOT NULL DEFAULT 0,
  max_retries integer NOT NULL DEFAULT 3,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_job_queue_status ON job_queue(status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_job_queue_type ON job_queue(job_type, status);
CREATE INDEX IF NOT EXISTS idx_job_queue_priority ON job_queue(priority DESC, scheduled_at);

ALTER TABLE job_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view jobs"
  ON job_queue
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "System can manage jobs"
  ON job_queue
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to increment usage metrics
CREATE OR REPLACE FUNCTION increment_usage_metric(
  p_date date,
  p_provider text,
  p_service text,
  p_usage_count integer DEFAULT 1,
  p_tokens_used integer DEFAULT 0,
  p_cost_cents integer DEFAULT 0
) RETURNS void AS $$
BEGIN
  INSERT INTO daily_usage_metrics (date, provider, service, usage_count, tokens_used, estimated_cost_cents)
  VALUES (p_date, p_provider, p_service, p_usage_count, p_tokens_used, p_cost_cents)
  ON CONFLICT (date, provider, service)
  DO UPDATE SET
    usage_count = daily_usage_metrics.usage_count + p_usage_count,
    tokens_used = daily_usage_metrics.tokens_used + p_tokens_used,
    estimated_cost_cents = daily_usage_metrics.estimated_cost_cents + p_cost_cents,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to enqueue job
CREATE OR REPLACE FUNCTION enqueue_job(
  p_job_type text,
  p_payload jsonb DEFAULT '{}'::jsonb,
  p_priority integer DEFAULT 5,
  p_scheduled_at timestamptz DEFAULT now()
) RETURNS uuid AS $$
DECLARE
  v_job_id uuid;
BEGIN
  INSERT INTO job_queue (job_type, payload, priority, scheduled_at)
  VALUES (p_job_type, p_payload, p_priority, p_scheduled_at)
  RETURNING id INTO v_job_id;

  RETURN v_job_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get next job
CREATE OR REPLACE FUNCTION get_next_job() RETURNS SETOF job_queue AS $$
BEGIN
  RETURN QUERY
  UPDATE job_queue
  SET
    status = 'processing',
    started_at = now(),
    updated_at = now()
  WHERE id = (
    SELECT id FROM job_queue
    WHERE status = 'pending'
    AND scheduled_at <= now()
    ORDER BY priority DESC, scheduled_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  RETURNING *;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark job completed
CREATE OR REPLACE FUNCTION complete_job(
  p_job_id uuid,
  p_success boolean,
  p_error_message text DEFAULT NULL
) RETURNS void AS $$
BEGIN
  IF p_success THEN
    UPDATE job_queue
    SET
      status = 'completed',
      completed_at = now(),
      updated_at = now()
    WHERE id = p_job_id;
  ELSE
    UPDATE job_queue
    SET
      status = CASE
        WHEN retry_count >= max_retries THEN 'failed'
        ELSE 'pending'
      END,
      retry_count = retry_count + 1,
      error_message = p_error_message,
      scheduled_at = CASE
        WHEN retry_count < max_retries THEN now() + (power(2, retry_count) * interval '1 minute')
        ELSE scheduled_at
      END,
      started_at = NULL,
      updated_at = now()
    WHERE id = p_job_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update job_queue updated_at
CREATE OR REPLACE FUNCTION update_job_queue_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER job_queue_updated_at
  BEFORE UPDATE ON job_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_job_queue_timestamp();

-- Cleanup old completed jobs (run via cron)
CREATE OR REPLACE FUNCTION cleanup_old_jobs(p_days_old integer DEFAULT 7)
RETURNS integer AS $$
DECLARE
  v_deleted_count integer;
BEGIN
  DELETE FROM job_queue
  WHERE status IN ('completed', 'failed')
  AND completed_at < now() - (p_days_old || ' days')::interval;

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
