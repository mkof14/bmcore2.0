/*
  # Fix User Subscriptions - Allow Plan Changes V2

  1. Problem
    - UNIQUE constraint on user_id prevents users from changing plans
    - Cannot create new subscription when upgrading/downgrading
    - Error: "duplicate key value violates unique constraint"

  2. Solution
    - Remove UNIQUE constraint on user_id
    - Add stripe_subscription_id and stripe_customer_id columns
    - Add unique constraint on stripe_subscription_id instead
    - Allow multiple subscription records per user (for history)
    - Only one active subscription per user (enforced by application logic)

  3. Changes
    - Drop user_id unique constraint
    - Add Stripe-related columns
    - Add new unique constraint on stripe_subscription_id
    - Update RLS policies
*/

-- Drop the problematic unique constraint
ALTER TABLE user_subscriptions 
DROP CONSTRAINT IF EXISTS user_subscriptions_user_id_key;

-- Add Stripe-related columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_subscriptions' AND column_name = 'stripe_subscription_id'
  ) THEN
    ALTER TABLE user_subscriptions 
    ADD COLUMN stripe_subscription_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_subscriptions' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE user_subscriptions 
    ADD COLUMN stripe_customer_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_subscriptions' AND column_name = 'stripe_price_id'
  ) THEN
    ALTER TABLE user_subscriptions 
    ADD COLUMN stripe_price_id text;
  END IF;
END $$;

-- Add unique constraint on stripe_subscription_id (when set)
CREATE UNIQUE INDEX IF NOT EXISTS user_subscriptions_stripe_subscription_id_key 
  ON user_subscriptions(stripe_subscription_id) 
  WHERE stripe_subscription_id IS NOT NULL;

-- Add index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_status 
  ON user_subscriptions(user_id, status);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer 
  ON user_subscriptions(stripe_customer_id);

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON user_subscriptions;

-- Create new RLS policies
CREATE POLICY "Users can view own subscriptions"
  ON user_subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own subscription"
  ON user_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own subscription"
  ON user_subscriptions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role can manage all subscriptions"
  ON user_subscriptions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create a view for active subscriptions (one per user)
CREATE OR REPLACE VIEW active_user_subscriptions AS
SELECT DISTINCT ON (user_id) 
  id,
  user_id,
  plan_id,
  status,
  billing_period,
  current_period_start,
  current_period_end,
  stripe_subscription_id,
  stripe_customer_id,
  stripe_price_id,
  cancel_at_period_end,
  canceled_at,
  is_trial,
  trial_start,
  trial_end,
  reports_used_this_period,
  created_at,
  updated_at
FROM user_subscriptions
WHERE status IN ('active', 'trial', 'past_due')
ORDER BY user_id, 
  CASE status 
    WHEN 'active' THEN 1
    WHEN 'trial' THEN 2
    WHEN 'past_due' THEN 3
  END,
  created_at DESC;

-- Grant access to the view
GRANT SELECT ON active_user_subscriptions TO authenticated;

-- Create a function to handle subscription upsert logic
CREATE OR REPLACE FUNCTION upsert_user_subscription(
  p_user_id uuid,
  p_plan_id text,
  p_billing_period text,
  p_stripe_subscription_id text DEFAULT NULL,
  p_stripe_customer_id text DEFAULT NULL,
  p_stripe_price_id text DEFAULT NULL,
  p_status text DEFAULT 'active',
  p_current_period_start timestamptz DEFAULT now(),
  p_current_period_end timestamptz DEFAULT now() + interval '1 month'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_subscription_id uuid;
  v_existing_active uuid;
BEGIN
  -- Check if user has an existing active subscription
  SELECT id INTO v_existing_active
  FROM user_subscriptions
  WHERE user_id = p_user_id
    AND status IN ('active', 'trial', 'past_due')
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_existing_active IS NOT NULL THEN
    -- Update existing subscription
    UPDATE user_subscriptions
    SET 
      plan_id = p_plan_id,
      billing_period = p_billing_period,
      stripe_subscription_id = COALESCE(p_stripe_subscription_id, stripe_subscription_id),
      stripe_customer_id = COALESCE(p_stripe_customer_id, stripe_customer_id),
      stripe_price_id = COALESCE(p_stripe_price_id, stripe_price_id),
      status = p_status,
      current_period_start = p_current_period_start,
      current_period_end = p_current_period_end,
      updated_at = now()
    WHERE id = v_existing_active
    RETURNING id INTO v_subscription_id;
  ELSE
    -- Insert new subscription
    INSERT INTO user_subscriptions (
      user_id,
      plan_id,
      billing_period,
      stripe_subscription_id,
      stripe_customer_id,
      stripe_price_id,
      status,
      current_period_start,
      current_period_end
    ) VALUES (
      p_user_id,
      p_plan_id,
      p_billing_period,
      p_stripe_subscription_id,
      p_stripe_customer_id,
      p_stripe_price_id,
      p_status,
      p_current_period_start,
      p_current_period_end
    )
    RETURNING id INTO v_subscription_id;
  END IF;

  RETURN v_subscription_id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION upsert_user_subscription TO authenticated, service_role;

-- Add helpful comment
COMMENT ON FUNCTION upsert_user_subscription IS 
  'Upserts user subscription - updates existing active subscription or creates new one';

-- Log the changes
DO $$
BEGIN
  RAISE NOTICE '✓ User subscriptions table updated';
  RAISE NOTICE '✓ Removed UNIQUE constraint on user_id';
  RAISE NOTICE '✓ Added Stripe columns (subscription_id, customer_id, price_id)';
  RAISE NOTICE '✓ Created active_user_subscriptions view';
  RAISE NOTICE '✓ Created upsert_user_subscription function';
  RAISE NOTICE '✓ Updated RLS policies';
END $$;
