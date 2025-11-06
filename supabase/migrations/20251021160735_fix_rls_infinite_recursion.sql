/*
  # Fix RLS Infinite Recursion

  1. Problem
    - Policies checking admin_users create infinite recursion for anon users
    - "Admins can manage" policies should not apply to SELECT operations for public content
  
  2. Solution
    - Drop and recreate policies to separate public read access from admin write access
    - Ensure admin checks only apply to INSERT/UPDATE/DELETE, not SELECT
    - Public SELECT policies don't check admin_users table

  3. Changes
    - Drop existing policies on blog_posts, news_items, career_postings
    - Recreate with proper separation of concerns
    - Public can SELECT published/active content (no admin check)
    - Only authenticated admins can INSERT/UPDATE/DELETE (with admin check)
*/

-- Blog Posts Policies
DROP POLICY IF EXISTS "Public can view published blogs" ON blog_posts;
DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;

CREATE POLICY "Anyone can view published blogs"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admins can insert blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
      AND au.role IN ('super_admin', 'admin', 'editor')
      AND au.active = true
    )
  );

CREATE POLICY "Admins can update blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
      AND au.role IN ('super_admin', 'admin', 'editor')
      AND au.active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
      AND au.role IN ('super_admin', 'admin', 'editor')
      AND au.active = true
    )
  );

CREATE POLICY "Admins can delete blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
      AND au.role IN ('super_admin', 'admin', 'editor')
      AND au.active = true
    )
  );

-- News Items Policies
DROP POLICY IF EXISTS "Public can view published news" ON news_items;
DROP POLICY IF EXISTS "Admins can manage news" ON news_items;

CREATE POLICY "Anyone can view published news"
  ON news_items FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admins can insert news"
  ON news_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
      AND au.role IN ('super_admin', 'admin', 'editor')
      AND au.active = true
    )
  );

CREATE POLICY "Admins can update news"
  ON news_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
      AND au.role IN ('super_admin', 'admin', 'editor')
      AND au.active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
      AND au.role IN ('super_admin', 'admin', 'editor')
      AND au.active = true
    )
  );

CREATE POLICY "Admins can delete news"
  ON news_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
      AND au.role IN ('super_admin', 'admin', 'editor')
      AND au.active = true
    )
  );

-- Career Postings Policies
DROP POLICY IF EXISTS "Public can view active careers" ON career_postings;
DROP POLICY IF EXISTS "Admins can manage careers" ON career_postings;

CREATE POLICY "Anyone can view active careers"
  ON career_postings FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "Admins can insert careers"
  ON career_postings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
      AND au.role IN ('super_admin', 'admin', 'editor')
      AND au.active = true
    )
  );

CREATE POLICY "Admins can update careers"
  ON career_postings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
      AND au.role IN ('super_admin', 'admin', 'editor')
      AND au.active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
      AND au.role IN ('super_admin', 'admin', 'editor')
      AND au.active = true
    )
  );

CREATE POLICY "Admins can delete careers"
  ON career_postings FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
      AND au.role IN ('super_admin', 'admin', 'editor')
      AND au.active = true
    )
  );
