/*
  # Create testimonials table

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles) - optional, for authenticated testimonials
      - `name` (text) - testimonial author name
      - `role` (text) - author's role/title
      - `company` (text) - author's company
      - `avatar_url` (text) - author's avatar image URL
      - `content` (text) - testimonial text content
      - `rating` (integer) - rating 1-5
      - `status` (text) - approved, pending, rejected
      - `featured` (boolean) - whether to feature on homepage
      - `display_order` (integer) - order for displaying testimonials
      - `metadata` (jsonb) - additional metadata
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `approved_at` (timestamptz)
      - `approved_by` (uuid, references profiles)

  2. Security
    - Enable RLS on `testimonials` table
    - Public can read approved testimonials
    - Only admins can create/update/delete testimonials
*/

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  role text,
  company text,
  avatar_url text,
  content text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  status text DEFAULT 'pending' CHECK (status IN ('approved', 'pending', 'rejected')),
  featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  approved_at timestamptz,
  approved_by uuid REFERENCES profiles(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read approved testimonials
CREATE POLICY "Public can view approved testimonials"
  ON testimonials FOR SELECT
  TO public
  USING (status = 'approved');

-- Policy: Authenticated users can read approved testimonials
CREATE POLICY "Authenticated users can view approved testimonials"
  ON testimonials FOR SELECT
  TO authenticated
  USING (status = 'approved');

-- Policy: Admins can view all testimonials
CREATE POLICY "Admins can view all testimonials"
  ON testimonials FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
  );

-- Policy: Admins can insert testimonials
CREATE POLICY "Admins can insert testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
  );

-- Policy: Admins can update testimonials
CREATE POLICY "Admins can update testimonials"
  ON testimonials FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
  );

-- Policy: Admins can delete testimonials
CREATE POLICY "Admins can delete testimonials"
  ON testimonials FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_testimonials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_testimonials_updated_at ON testimonials;

CREATE TRIGGER trigger_update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_testimonials_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON testimonials(display_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);

-- Insert sample testimonials
INSERT INTO testimonials (name, role, company, content, rating, status, featured, display_order)
VALUES
  ('Dr. Sarah Mitchell', 'Chief Medical Officer', 'HealthTech Solutions', 'BioMath Core has transformed how we analyze patient data. The AI-driven insights are invaluable.', 5, 'approved', true, 1),
  ('Michael Chen', 'Research Director', 'BioAnalytics Institute', 'Outstanding platform for health data analysis. The second opinion feature is game-changing.', 5, 'approved', true, 2),
  ('Dr. Emily Roberts', 'Wellness Consultant', 'Vitality Clinic', 'Exceptional accuracy and ease of use. My clients love the personalized health insights.', 5, 'approved', true, 3),
  ('James Anderson', 'Fitness Coach', 'Peak Performance', 'The device integration works flawlessly. Real-time health tracking has never been easier.', 4, 'approved', true, 4),
  ('Dr. Lisa Wang', 'Nutritionist', 'NutriHealth Center', 'Comprehensive health analysis at your fingertips. Highly recommend for health professionals.', 5, 'approved', true, 5),
  ('Robert Taylor', 'Health Enthusiast', null, 'Changed my approach to personal health. The insights are incredibly detailed and actionable.', 5, 'approved', true, 6)
ON CONFLICT DO NOTHING;