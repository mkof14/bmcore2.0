/*
  # Social Media Integration Features

  1. New Tables
    - `social_connections` - User social media account connections
    - `social_shares` - Track content shares
    - `social_contests` - Social media contests and campaigns
    - `contest_entries` - User contest entries
    - `video_content` - YouTube and other video platform content
    - `instagram_feed` - Instagram feed cache
    - `social_media_posts` - Scheduled social media posts
    - `shareable_reports` - Public shareable health report links

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
    - Public access for shareable reports
*/

-- Social Connections
CREATE TABLE IF NOT EXISTS social_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider text NOT NULL CHECK (provider IN ('google', 'facebook', 'twitter', 'instagram', 'youtube', 'linkedin', 'tiktok')),
  provider_user_id text,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  profile_data jsonb DEFAULT '{}',
  connected_at timestamptz DEFAULT now(),
  last_synced timestamptz,
  active boolean DEFAULT true,
  UNIQUE(user_id, provider)
);

ALTER TABLE social_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own social connections"
  ON social_connections FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Social Shares
CREATE TABLE IF NOT EXISTS social_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  content_type text NOT NULL,
  content_id text NOT NULL,
  platform text NOT NULL,
  share_url text,
  shared_at timestamptz DEFAULT now(),
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  conversions integer DEFAULT 0
);

ALTER TABLE social_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own shares"
  ON social_shares FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create shares"
  ON social_shares FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Social Media Contests
CREATE TABLE IF NOT EXISTS social_contests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  contest_type text CHECK (contest_type IN ('photo', 'video', 'story', 'referral', 'engagement')),
  platforms text[] NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  rules jsonb DEFAULT '{}',
  prizes jsonb DEFAULT '[]',
  hashtags text[],
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'ended', 'cancelled')),
  winner_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE social_contests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active contests"
  ON social_contests FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Admins can manage contests"
  ON social_contests FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Contest Entries
CREATE TABLE IF NOT EXISTS contest_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id uuid REFERENCES social_contests(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  entry_type text NOT NULL,
  entry_url text,
  entry_data jsonb DEFAULT '{}',
  votes integer DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'winner')),
  submitted_at timestamptz DEFAULT now(),
  UNIQUE(contest_id, user_id)
);

ALTER TABLE contest_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own entries"
  ON contest_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can submit entries"
  ON contest_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Everyone can view approved entries"
  ON contest_entries FOR SELECT
  TO authenticated
  USING (status IN ('approved', 'winner'));

-- Video Content
CREATE TABLE IF NOT EXISTS video_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL CHECK (platform IN ('youtube', 'vimeo', 'wistia')),
  video_id text NOT NULL,
  title text NOT NULL,
  description text,
  thumbnail_url text,
  duration integer,
  category text,
  tags text[],
  publish_date timestamptz,
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  featured boolean DEFAULT false,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE video_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active videos"
  ON video_content FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Admins can manage videos"
  ON video_content FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Instagram Feed Cache
CREATE TABLE IF NOT EXISTS instagram_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id text UNIQUE NOT NULL,
  caption text,
  media_type text,
  media_url text,
  thumbnail_url text,
  permalink text,
  timestamp timestamptz,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  cached_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

ALTER TABLE instagram_feed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view Instagram feed"
  ON instagram_feed FOR SELECT
  TO authenticated, anon
  USING (expires_at > now() OR expires_at IS NULL);

-- Scheduled Social Media Posts
CREATE TABLE IF NOT EXISTS social_media_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  platforms text[] NOT NULL,
  content text NOT NULL,
  media_urls text[],
  hashtags text[],
  scheduled_for timestamptz NOT NULL,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'published', 'failed', 'cancelled')),
  published_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own scheduled posts"
  ON social_media_posts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Shareable Reports
CREATE TABLE IF NOT EXISTS shareable_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  report_id uuid,
  share_token text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  report_data jsonb NOT NULL,
  privacy_level text DEFAULT 'public' CHECK (privacy_level IN ('public', 'unlisted', 'private')),
  password_hash text,
  views integer DEFAULT 0,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  last_viewed_at timestamptz
);

ALTER TABLE shareable_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public shareable reports"
  ON shareable_reports FOR SELECT
  TO anon, authenticated
  USING (
    privacy_level = 'public' AND
    (expires_at IS NULL OR expires_at > now())
  );

CREATE POLICY "Users can view own shareable reports"
  ON shareable_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create shareable reports"
  ON shareable_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shareable reports"
  ON shareable_reports FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_social_connections_user ON social_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_social_connections_provider ON social_connections(provider);
CREATE INDEX IF NOT EXISTS idx_social_shares_user ON social_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_social_shares_platform ON social_shares(platform);
CREATE INDEX IF NOT EXISTS idx_contest_entries_contest ON contest_entries(contest_id);
CREATE INDEX IF NOT EXISTS idx_contest_entries_user ON contest_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_video_content_platform ON video_content(platform);
CREATE INDEX IF NOT EXISTS idx_video_content_featured ON video_content(featured);
CREATE INDEX IF NOT EXISTS idx_instagram_feed_timestamp ON instagram_feed(timestamp);
CREATE INDEX IF NOT EXISTS idx_social_media_posts_scheduled ON social_media_posts(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_social_media_posts_status ON social_media_posts(status);
CREATE INDEX IF NOT EXISTS idx_shareable_reports_token ON shareable_reports(share_token);
CREATE INDEX IF NOT EXISTS idx_shareable_reports_user ON shareable_reports(user_id);

-- Function to increment share views
CREATE OR REPLACE FUNCTION increment_shareable_report_views(report_token text)
RETURNS void AS $$
BEGIN
  UPDATE shareable_reports
  SET views = views + 1,
      last_viewed_at = now()
  WHERE share_token = report_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate share token
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS text AS $$
DECLARE
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  result text := '';
  i integer;
BEGIN
  FOR i IN 1..12 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;
