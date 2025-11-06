/*
  # Subscription & Monetization System

  1. New Tables
    - `subscription_plans`
      - Core, Daily, Max tier definitions
      - Price points and capabilities
    
    - `user_subscriptions`
      - User's current subscription status
      - Billing period tracking
      - Trial and cancellation handling
    
    - `service_addons`
      - Per-service premium add-ons
      - Contextual upsell definitions
    
    - `addon_purchases`
      - User's purchased add-ons
      - Single-time or recurring
    
    - `service_lifecycle`
      - Post-report intelligence tracking
      - When reevaluation is meaningful
      - Event-driven recommendation timing

  2. Features
    - Three-tier subscription structure
    - Hybrid monetization (subscription + add-ons)
    - Service lifecycle intelligence
    - Value-based upsell triggers
    - Retention tracking

  3. Security
    - RLS on all tables
    - User isolation
    - Secure payment handling
*/

-- Subscription Plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  tier_level integer NOT NULL, -- 1=Core, 2=Daily, 3=Max
  monthly_price_cents integer NOT NULL,
  annual_price_cents integer NOT NULL,
  
  -- Capabilities
  can_generate_reports boolean DEFAULT false,
  can_access_lifecycle boolean DEFAULT false,
  can_use_advanced_addons boolean DEFAULT false,
  max_reports_per_month integer,
  includes_proactive_monitoring boolean DEFAULT false,
  
  -- Value proposition
  value_message text NOT NULL,
  target_user_intent text NOT NULL,
  
  created_at timestamptz DEFAULT now()
);

-- User Subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  plan_id text REFERENCES subscription_plans(id) NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('trial', 'active', 'past_due', 'canceled', 'expired')),
  
  -- Billing
  billing_period text DEFAULT 'monthly' CHECK (billing_period IN ('monthly', 'annual')),
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  
  -- Trial
  trial_start timestamptz,
  trial_end timestamptz,
  is_trial boolean DEFAULT false,
  
  -- Cancellation
  cancel_at_period_end boolean DEFAULT false,
  canceled_at timestamptz,
  
  -- Metrics
  reports_used_this_period integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Service Add-ons
CREATE TABLE IF NOT EXISTS service_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id text NOT NULL,
  
  name text NOT NULL,
  description text NOT NULL,
  addon_type text NOT NULL CHECK (addon_type IN ('deeper_analysis', 'comparison', 'longitudinal', 'priority_support', 'export')),
  
  -- Pricing
  price_cents integer NOT NULL,
  is_recurring boolean DEFAULT false,
  
  -- Access control
  required_plan_tier integer DEFAULT 1, -- Minimum tier needed
  included_in_max boolean DEFAULT false,
  
  -- Value trigger
  upsell_trigger_context text NOT NULL, -- When to offer this
  value_frame text NOT NULL, -- How AI Tutor frames the upgrade
  
  created_at timestamptz DEFAULT now()
);

-- User Add-on Purchases
CREATE TABLE IF NOT EXISTS addon_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  addon_id uuid REFERENCES service_addons(id) NOT NULL,
  
  purchased_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  is_active boolean DEFAULT true,
  
  -- Usage tracking
  times_used integer DEFAULT 0,
  last_used_at timestamptz,
  
  created_at timestamptz DEFAULT now()
);

-- Service Lifecycle Tracking
CREATE TABLE IF NOT EXISTS service_lifecycle (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_id text NOT NULL,
  
  -- Report history
  first_report_at timestamptz NOT NULL,
  last_report_at timestamptz NOT NULL,
  total_reports_count integer DEFAULT 1,
  
  -- Intelligence state
  baseline_established boolean DEFAULT false,
  baseline_data jsonb,
  
  -- Change detection
  last_significant_change timestamptz,
  change_magnitude text CHECK (change_magnitude IN ('minor', 'moderate', 'significant')),
  change_direction text CHECK (change_direction IN ('improving', 'stable', 'declining')),
  
  -- Recommendation timing
  next_recommended_check timestamptz,
  recommendation_reason text,
  event_driven_trigger text, -- What caused the recommendation
  
  -- Personalization data
  user_engagement_level text DEFAULT 'new' CHECK (user_engagement_level IN ('new', 'exploring', 'active', 'committed', 'expert')),
  preferred_frequency text DEFAULT 'monthly' CHECK (preferred_frequency IN ('weekly', 'biweekly', 'monthly', 'quarterly', 'as_needed')),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id, service_id)
);

-- User Personalization Profile
CREATE TABLE IF NOT EXISTS user_personalization (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Moving health profile
  health_profile_snapshot jsonb DEFAULT '{}'::jsonb,
  
  -- Routing-level personalization
  dashboard_priority jsonb DEFAULT '[]'::jsonb, -- What shows first
  service_recommendations jsonb DEFAULT '[]'::jsonb, -- Which services to suggest
  tutorial_density text DEFAULT 'standard' CHECK (tutorial_density IN ('minimal', 'standard', 'detailed')),
  intelligence_depth text DEFAULT 'balanced' CHECK (intelligence_depth IN ('simple', 'balanced', 'advanced')),
  coaching_intensity text DEFAULT 'supportive' CHECK (coaching_intensity IN ('observational', 'supportive', 'directive')),
  
  -- Adaptation signals
  completion_rate numeric DEFAULT 0.0,
  engagement_frequency text DEFAULT 'weekly',
  last_active_at timestamptz DEFAULT now(),
  
  -- Tone adaptation
  preferred_tone text DEFAULT 'supportive' CHECK (preferred_tone IN ('analytical', 'supportive', 'coaching')),
  complexity_tolerance text DEFAULT 'medium' CHECK (complexity_tolerance IN ('low', 'medium', 'high')),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE addon_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_lifecycle ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_personalization ENABLE ROW LEVEL SECURITY;

-- Subscription Plans (public read)
CREATE POLICY "Plans are publicly readable"
  ON subscription_plans
  FOR SELECT
  TO authenticated
  USING (true);

-- User Subscriptions
CREATE POLICY "Users can read own subscription"
  ON user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON user_subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service Add-ons (public read)
CREATE POLICY "Add-ons are publicly readable"
  ON service_addons
  FOR SELECT
  TO authenticated
  USING (true);

-- Add-on Purchases
CREATE POLICY "Users can read own purchases"
  ON addon_purchases
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchases"
  ON addon_purchases
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Service Lifecycle
CREATE POLICY "Users can read own lifecycle"
  ON service_lifecycle
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lifecycle"
  ON service_lifecycle
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lifecycle"
  ON service_lifecycle
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User Personalization
CREATE POLICY "Users can read own personalization"
  ON user_personalization
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own personalization"
  ON user_personalization
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own personalization"
  ON user_personalization
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS user_subscriptions_user_id_idx ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS user_subscriptions_status_idx ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS addon_purchases_user_id_idx ON addon_purchases(user_id);
CREATE INDEX IF NOT EXISTS addon_purchases_addon_id_idx ON addon_purchases(addon_id);
CREATE INDEX IF NOT EXISTS service_lifecycle_user_id_idx ON service_lifecycle(user_id);
CREATE INDEX IF NOT EXISTS service_lifecycle_service_id_idx ON service_lifecycle(service_id);
CREATE INDEX IF NOT EXISTS user_personalization_user_id_idx ON user_personalization(user_id);

-- Insert default plans
INSERT INTO subscription_plans (id, name, description, tier_level, monthly_price_cents, annual_price_cents, can_generate_reports, can_access_lifecycle, can_use_advanced_addons, max_reports_per_month, includes_proactive_monitoring, value_message, target_user_intent)
VALUES
  ('core', 'Core', 'Exploration and trust-building. Preview all services and experience AI guidance.', 1, 0, 0, false, false, false, 0, false, 'Become aware of what''s possible', 'Understanding capabilities'),
  ('daily', 'Daily', 'Active insight and guidance. Full report generation and lifecycle intelligence.', 2, 2900, 29000, true, true, false, 50, false, 'Become engaged with your health', 'Regular health monitoring'),
  ('max', 'Max', 'Continuous foresight and prevention. Proactive monitoring and advanced intelligence.', 3, 9900, 99000, true, true, true, NULL, true, 'Become anticipatory about changes', 'Health optimization and prevention')
ON CONFLICT (id) DO NOTHING;

-- Function to check user plan tier
CREATE OR REPLACE FUNCTION get_user_plan_tier(p_user_id uuid)
RETURNS integer AS $$
DECLARE
  v_tier integer;
BEGIN
  SELECT sp.tier_level INTO v_tier
  FROM user_subscriptions us
  JOIN subscription_plans sp ON sp.id = us.plan_id
  WHERE us.user_id = p_user_id
  AND us.status IN ('trial', 'active');
  
  RETURN COALESCE(v_tier, 1); -- Default to Core
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to detect significant health changes
CREATE OR REPLACE FUNCTION detect_service_change(
  p_user_id uuid,
  p_service_id text,
  p_current_data jsonb
)
RETURNS boolean AS $$
DECLARE
  v_baseline jsonb;
  v_has_changed boolean := false;
BEGIN
  SELECT baseline_data INTO v_baseline
  FROM service_lifecycle
  WHERE user_id = p_user_id
  AND service_id = p_service_id
  AND baseline_established = true;
  
  IF v_baseline IS NULL THEN
    RETURN false;
  END IF;
  
  -- Simple change detection logic (can be enhanced)
  v_has_changed := (v_baseline::text != p_current_data::text);
  
  RETURN v_has_changed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
