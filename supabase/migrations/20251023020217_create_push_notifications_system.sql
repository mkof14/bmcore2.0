/*
  # Push Notifications System

  1. New Tables
    - `push_subscriptions`
      - Stores user push notification subscriptions
      - Endpoint, keys for web push
      - Device information

    - `notification_queue`
      - Queue for scheduled notifications
      - Supports immediate and scheduled delivery
      - Tracks delivery status

    - `notification_history`
      - Audit log of sent notifications
      - Delivery status tracking
      - User engagement metrics

  2. Security
    - Enable RLS on all tables
    - Users can manage own subscriptions
    - Admins can send notifications
    - Public cannot access notification data

  3. Features
    - Web Push API support
    - Scheduled notifications
    - Delivery tracking
    - Engagement analytics
*/

-- Push Subscriptions Table
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  endpoint text NOT NULL,
  p256dh text NOT NULL,
  auth text NOT NULL,
  user_agent text,
  device_type text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

-- Notification Queue Table
CREATE TABLE IF NOT EXISTS notification_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  url text,
  icon text DEFAULT '/biomathcore_emblem_1024.png',
  badge text DEFAULT '/biomathcore_emblem_1024.png',
  tag text,
  data jsonb,
  scheduled_for timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  sent_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL
);

-- Notification History Table
CREATE TABLE IF NOT EXISTS notification_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subscription_id uuid REFERENCES push_subscriptions(id) ON DELETE SET NULL,
  title text NOT NULL,
  body text NOT NULL,
  url text,
  tag text,
  status text NOT NULL CHECK (status IN ('delivered', 'failed', 'clicked', 'dismissed')),
  error_message text,
  clicked_at timestamptz,
  delivered_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Indexes for push_subscriptions
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_is_active ON push_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- Indexes for notification_queue
CREATE INDEX IF NOT EXISTS idx_notification_queue_user_id ON notification_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_queue_status ON notification_queue(status, scheduled_for);
CREATE INDEX IF NOT EXISTS idx_notification_queue_scheduled_for ON notification_queue(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_notification_queue_priority ON notification_queue(priority, status);

-- Indexes for notification_history
CREATE INDEX IF NOT EXISTS idx_notification_history_user_id ON notification_history(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_history_status ON notification_history(status);
CREATE INDEX IF NOT EXISTS idx_notification_history_created_at ON notification_history(created_at DESC);

-- Enable RLS
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for push_subscriptions

-- Users can read own subscriptions
CREATE POLICY "Users can read own subscriptions"
  ON push_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create own subscriptions
CREATE POLICY "Users can create own subscriptions"
  ON push_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update own subscriptions
CREATE POLICY "Users can update own subscriptions"
  ON push_subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete own subscriptions
CREATE POLICY "Users can delete own subscriptions"
  ON push_subscriptions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can manage all subscriptions
CREATE POLICY "Admins can manage all subscriptions"
  ON push_subscriptions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for notification_queue

-- Users can read own queued notifications
CREATE POLICY "Users can read own queued notifications"
  ON notification_queue
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can manage all notifications
CREATE POLICY "Admins can manage all notifications"
  ON notification_queue
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for notification_history

-- Users can read own notification history
CREATE POLICY "Users can read own notification history"
  ON notification_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can read all notification history
CREATE POLICY "Admins can read all notification history"
  ON notification_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_push_subscription_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trigger_push_subscriptions_updated_at ON push_subscriptions;
CREATE TRIGGER trigger_push_subscriptions_updated_at
  BEFORE UPDATE ON push_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_push_subscription_updated_at();

-- Function to move sent notifications to history
CREATE OR REPLACE FUNCTION process_sent_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.status = 'sent' AND OLD.status = 'pending' THEN
    INSERT INTO notification_history (
      user_id,
      title,
      body,
      url,
      tag,
      status,
      delivered_at
    ) VALUES (
      NEW.user_id,
      NEW.title,
      NEW.body,
      NEW.url,
      NEW.tag,
      'delivered',
      NEW.sent_at
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger for notification history
DROP TRIGGER IF EXISTS trigger_process_sent_notification ON notification_queue;
CREATE TRIGGER trigger_process_sent_notification
  AFTER UPDATE ON notification_queue
  FOR EACH ROW
  EXECUTE FUNCTION process_sent_notification();
