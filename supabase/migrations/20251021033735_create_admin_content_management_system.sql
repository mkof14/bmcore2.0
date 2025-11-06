/*
  # Admin Panel & Content Management System

  1. New Tables
    - `admin_users` - System administrators with role-based access
    - `blog_posts` - Blog articles management
    - `news_items` - News/announcements management  
    - `career_postings` - Job listings
    - `marketing_documents` - Marketing materials storage
    - `business_metrics` - Platform analytics for Command Center
    - `audit_logs` - Track all admin actions

  2. Security
    - Enable RLS on all tables
    - Admin-only access policies
    - Audit trail for all changes

  3. Indexes
    - Performance indexes for queries
*/

-- Admin users with role-based access
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer')),
  permissions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  author_id uuid REFERENCES admin_users(id),
  featured_image text,
  category text,
  tags text[],
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- News items
CREATE TABLE IF NOT EXISTS news_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  author_id uuid REFERENCES admin_users(id),
  image_url text,
  priority integer DEFAULT 0,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Career postings
CREATE TABLE IF NOT EXISTS career_postings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  department text NOT NULL,
  location text NOT NULL,
  employment_type text NOT NULL,
  description text NOT NULL,
  requirements text NOT NULL,
  benefits text,
  salary_range text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
  posted_by uuid REFERENCES admin_users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Marketing documents
CREATE TABLE IF NOT EXISTS marketing_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size bigint,
  category text NOT NULL,
  tags text[],
  uploaded_by uuid REFERENCES admin_users(id),
  created_at timestamptz DEFAULT now()
);

-- Business metrics for Command Center
CREATE TABLE IF NOT EXISTS business_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date date NOT NULL,
  metric_type text NOT NULL,
  metric_value numeric NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(metric_date, metric_type)
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES admin_users(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  changes jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Admin users policies
CREATE POLICY "Super admins can manage all admin users"
  ON admin_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.role = 'super_admin'
    )
  );

CREATE POLICY "Admins can view all admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.role IN ('super_admin', 'admin')
    )
  );

-- Blog posts policies
CREATE POLICY "Admins can manage blog posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.role IN ('super_admin', 'admin', 'editor')
    )
  );

CREATE POLICY "Public can view published blogs"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- News items policies
CREATE POLICY "Admins can manage news"
  ON news_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.role IN ('super_admin', 'admin', 'editor')
    )
  );

CREATE POLICY "Public can view published news"
  ON news_items FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- Career postings policies
CREATE POLICY "Admins can manage careers"
  ON career_postings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.role IN ('super_admin', 'admin', 'editor')
    )
  );

CREATE POLICY "Public can view active careers"
  ON career_postings FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

-- Marketing documents policies
CREATE POLICY "Admins can manage marketing docs"
  ON marketing_documents FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.role IN ('super_admin', 'admin', 'editor')
    )
  );

-- Business metrics policies
CREATE POLICY "Admins can view metrics"
  ON business_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Super admins can manage metrics"
  ON business_metrics FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.role = 'super_admin'
    )
  );

-- Audit logs policies
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.role IN ('super_admin', 'admin')
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_items_status ON news_items(status);
CREATE INDEX IF NOT EXISTS idx_news_items_published_at ON news_items(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_career_postings_status ON career_postings(status);
CREATE INDEX IF NOT EXISTS idx_business_metrics_date ON business_metrics(metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
