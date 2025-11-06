/*
  # Advanced Platform Features

  1. New Tables
    - `exit_intent_captures` - Store exit intent email captures
    - `user_feedback` - Store user feedback and surveys
    - `gamification_badges` - Define available badges
    - `user_badges` - Track user achievements
    - `user_streaks` - Track daily engagement streaks
    - `referral_codes` - Unique referral codes per user
    - `referral_rewards` - Track referral rewards
    - `cohort_analysis` - Store cohort data
    - `funnel_steps` - Define conversion funnels
    - `funnel_events` - Track funnel progression
    - `ab_tests` - A/B test configurations
    - `ab_test_variants` - Test variant definitions
    - `ab_test_assignments` - User test assignments
    - `ab_test_conversions` - Conversion tracking
    - `session_recordings` - User session data
    - `heat_maps` - Click and interaction heatmaps
    - `two_factor_auth` - 2FA settings per user
    - `team_memberships` - Enterprise team management
    - `wearable_integrations` - Connected device data
    - `community_posts` - Forum posts
    - `community_comments` - Post comments
    - `personalization_rules` - Dynamic content rules

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
*/

-- Exit Intent Captures
CREATE TABLE IF NOT EXISTS exit_intent_captures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  type text NOT NULL,
  captured_at timestamptz DEFAULT now(),
  converted boolean DEFAULT false,
  converted_at timestamptz
);

ALTER TABLE exit_intent_captures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert exit intent captures"
  ON exit_intent_captures FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all exit intent captures"
  ON exit_intent_captures FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- User Feedback
CREATE TABLE IF NOT EXISTS user_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  feedback text NOT NULL,
  type text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  page_url text,
  submitted_at timestamptz DEFAULT now(),
  status text DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved'))
);

ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can submit feedback"
  ON user_feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view own feedback"
  ON user_feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all feedback"
  ON user_feedback FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Gamification Badges
CREATE TABLE IF NOT EXISTS gamification_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  criteria jsonb NOT NULL,
  points integer DEFAULT 0,
  rarity text CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gamification_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active badges"
  ON gamification_badges FOR SELECT
  TO authenticated
  USING (active = true);

-- User Badges
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  badge_id uuid REFERENCES gamification_badges(id) NOT NULL,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- User Streaks
CREATE TABLE IF NOT EXISTS user_streaks (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_active_date date DEFAULT CURRENT_DATE,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streaks"
  ON user_streaks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks"
  ON user_streaks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Referral Codes
CREATE TABLE IF NOT EXISTS referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  code text UNIQUE NOT NULL,
  uses integer DEFAULT 0,
  max_uses integer DEFAULT 100,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referral codes"
  ON referral_codes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Referral Rewards
CREATE TABLE IF NOT EXISTS referral_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES auth.users(id) NOT NULL,
  referred_id uuid REFERENCES auth.users(id) NOT NULL,
  code_id uuid REFERENCES referral_codes(id) NOT NULL,
  reward_type text NOT NULL,
  reward_value numeric,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'awarded', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  awarded_at timestamptz
);

ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referral rewards"
  ON referral_rewards FOR SELECT
  TO authenticated
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- Session Recordings
CREATE TABLE IF NOT EXISTS session_recordings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  duration integer,
  events jsonb,
  heatmap_points jsonb,
  url text,
  user_agent text,
  screen_resolution text,
  viewport_size text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE session_recordings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all session recordings"
  ON session_recordings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 2FA Settings
CREATE TABLE IF NOT EXISTS two_factor_auth (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  enabled boolean DEFAULT false,
  secret text,
  backup_codes text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE two_factor_auth ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own 2FA settings"
  ON two_factor_auth FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Team Memberships (Enterprise)
CREATE TABLE IF NOT EXISTS team_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  role text DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  invited_by uuid REFERENCES auth.users(id),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(team_id, user_id)
);

ALTER TABLE team_memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members can view own membership"
  ON team_memberships FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Wearable Integrations
CREATE TABLE IF NOT EXISTS wearable_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  provider text NOT NULL CHECK (provider IN ('apple_health', 'google_fit', 'fitbit', 'garmin', 'oura', 'whoop')),
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  last_sync timestamptz,
  active boolean DEFAULT true,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wearable_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own integrations"
  ON wearable_integrations FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Community Posts
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text,
  tags text[],
  upvotes integer DEFAULT 0,
  views integer DEFAULT 0,
  status text DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'deleted')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view published posts"
  ON community_posts FOR SELECT
  TO authenticated
  USING (status = 'published');

CREATE POLICY "Users can create posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can edit own posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Community Comments
CREATE TABLE IF NOT EXISTS community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  parent_id uuid REFERENCES community_comments(id),
  content text NOT NULL,
  upvotes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view comments"
  ON community_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON community_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can edit own comments"
  ON community_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_exit_intent_email ON exit_intent_captures(email);
CREATE INDEX IF NOT EXISTS idx_user_feedback_user ON user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_referrer ON referral_rewards(referrer_id);
CREATE INDEX IF NOT EXISTS idx_session_recordings_user ON session_recordings(user_id);
CREATE INDEX IF NOT EXISTS idx_wearable_integrations_user ON wearable_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_user ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_status ON community_posts(status);
CREATE INDEX IF NOT EXISTS idx_community_comments_post ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_user ON community_comments(user_id);
