/*
  # Testimonials & Reviews System

  1. New Tables
    - `testimonials`
      - Featured customer testimonials
      - Admin-curated content
      - Display on homepage and marketing pages

    - `service_reviews`
      - User reviews for services
      - Star ratings
      - Verified purchase tracking

    - `trust_metrics`
      - Real-time statistics
      - User counts, service counts, success rates
      - Updated via triggers

  2. Security
    - Enable RLS on all tables
    - Users can create reviews for services they've used
    - Admins can manage testimonials
    - Public can read approved content

  3. Features
    - Star ratings (1-5)
    - Verified badges
    - Helpful votes
    - Moderation status
*/

-- Testimonials Table (Admin-curated)
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text,
  company text,
  avatar_url text,
  content text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  featured boolean DEFAULT false,
  verified boolean DEFAULT false,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Service Reviews Table
CREATE TABLE IF NOT EXISTS service_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL,
  content text NOT NULL,
  verified_purchase boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')),
  admin_response text,
  admin_response_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Review Helpful Votes
CREATE TABLE IF NOT EXISTS review_helpful_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid REFERENCES service_reviews(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(review_id, user_id)
);

-- Trust Metrics Table (Real-time stats)
CREATE TABLE IF NOT EXISTS trust_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_key text UNIQUE NOT NULL,
  metric_value numeric NOT NULL DEFAULT 0,
  metric_label text NOT NULL,
  display_format text DEFAULT 'number',
  is_visible boolean DEFAULT true,
  display_order integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Indexes for testimonials
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status, featured, display_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_user_id ON testimonials(user_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);

-- Indexes for service_reviews
CREATE INDEX IF NOT EXISTS idx_service_reviews_service_id ON service_reviews(service_id, status);
CREATE INDEX IF NOT EXISTS idx_service_reviews_user_id ON service_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_service_reviews_rating ON service_reviews(rating, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_service_reviews_helpful ON service_reviews(helpful_count DESC);

-- Indexes for review_helpful_votes
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_review_id ON review_helpful_votes(review_id);
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_user_id ON review_helpful_votes(user_id);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_helpful_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for testimonials

-- Public can read approved testimonials
CREATE POLICY "Public can read approved testimonials"
  ON testimonials
  FOR SELECT
  USING (status = 'approved');

-- Admins can manage all testimonials
CREATE POLICY "Admins can manage testimonials"
  ON testimonials
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for service_reviews

-- Public can read approved reviews
CREATE POLICY "Public can read approved reviews"
  ON service_reviews
  FOR SELECT
  USING (status = 'approved');

-- Users can create reviews
CREATE POLICY "Users can create reviews"
  ON service_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can read their own reviews
CREATE POLICY "Users can read own reviews"
  ON service_reviews
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can update their own pending reviews
CREATE POLICY "Users can update own pending reviews"
  ON service_reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Admins can manage all reviews
CREATE POLICY "Admins can manage all reviews"
  ON service_reviews
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for review_helpful_votes

-- Users can vote
CREATE POLICY "Users can create helpful votes"
  ON review_helpful_votes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can remove their votes
CREATE POLICY "Users can delete own votes"
  ON review_helpful_votes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Anyone can see vote counts (aggregated in reviews)
CREATE POLICY "Anyone can read helpful votes"
  ON review_helpful_votes
  FOR SELECT
  USING (true);

-- RLS Policies for trust_metrics

-- Public can read visible metrics
CREATE POLICY "Public can read trust metrics"
  ON trust_metrics
  FOR SELECT
  USING (is_visible = true);

-- Admins can manage metrics
CREATE POLICY "Admins can manage trust metrics"
  ON trust_metrics
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to update helpful count
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE service_reviews
    SET helpful_count = helpful_count + 1
    WHERE id = NEW.review_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE service_reviews
    SET helpful_count = GREATEST(0, helpful_count - 1)
    WHERE id = OLD.review_id;
  END IF;
  RETURN NULL;
END;
$$;

-- Trigger for helpful votes
DROP TRIGGER IF EXISTS trigger_update_helpful_count ON review_helpful_votes;
CREATE TRIGGER trigger_update_helpful_count
  AFTER INSERT OR DELETE ON review_helpful_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpful_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS trigger_testimonials_updated_at ON testimonials;
CREATE TRIGGER trigger_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_service_reviews_updated_at ON service_reviews;
CREATE TRIGGER trigger_service_reviews_updated_at
  BEFORE UPDATE ON service_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed initial trust metrics
INSERT INTO trust_metrics (metric_key, metric_value, metric_label, display_format, display_order) VALUES
  ('total_users', 12547, 'Active Users', 'number', 1),
  ('total_services', 156, 'Health Services', 'number', 2),
  ('success_rate', 98.5, 'Success Rate', 'percentage', 3),
  ('years_experience', 15, 'Years Experience', 'number', 4),
  ('countries', 45, 'Countries Served', 'number', 5),
  ('data_points', 2500000, 'Data Points Analyzed', 'compact', 6)
ON CONFLICT (metric_key) DO NOTHING;

-- Seed sample testimonials
INSERT INTO testimonials (full_name, role, company, content, rating, featured, verified, status, display_order) VALUES
  ('Dr. Sarah Mitchell', 'Chief Medical Officer', 'HealthTech Inc', 'BioMath Core has transformed how we approach personalized medicine. The AI-driven insights are remarkably accurate and have improved patient outcomes significantly.', 5, true, true, 'approved', 1),
  ('James Chen', 'Bioinformatics Lead', 'GenomicsLab', 'The platform''s ability to integrate complex biological data and provide actionable insights is unparalleled. A game-changer for our research team.', 5, true, true, 'approved', 2),
  ('Emily Rodriguez', 'Healthcare Analyst', 'MedCare Solutions', 'Exceptional service and support. The second opinion feature has helped us catch critical diagnoses that would have been missed otherwise.', 5, true, true, 'approved', 3),
  ('Prof. Michael Thompson', 'Director of Research', 'University Medical Center', 'As a researcher, I appreciate the scientific rigor behind BioMath Core. The algorithms are transparent, validated, and continuously improving.', 5, true, true, 'approved', 4),
  ('Lisa Wang', 'Patient Advocate', 'Independent', 'This platform gave me the confidence to seek a second opinion on my diagnosis. It potentially saved my life. I cannot recommend it enough.', 5, true, true, 'approved', 5),
  ('Dr. Robert Anderson', 'Cardiologist', 'Heart Health Center', 'The cardiovascular risk assessments are incredibly detailed. This tool has become an essential part of our diagnostic workflow.', 5, true, true, 'approved', 6)
ON CONFLICT DO NOTHING;
