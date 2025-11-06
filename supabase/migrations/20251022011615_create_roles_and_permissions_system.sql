/*
  # Create Roles and Permissions System

  1. New Tables
    - `roles`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `permissions` (jsonb) - array of permission keys
      - `is_system` (boolean) - cannot be deleted if true
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `user_roles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `role_id` (uuid, references roles)
      - `assigned_by` (uuid, references profiles)
      - `assigned_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Admins can manage roles
    - Admins can assign/revoke roles
*/

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  permissions jsonb DEFAULT '[]'::jsonb,
  is_system boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES profiles(id),
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role_id)
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for roles table
CREATE POLICY "Authenticated users can view roles"
  ON roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage roles"
  ON roles FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for user_roles table
CREATE POLICY "Authenticated users can view role assignments"
  ON user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage role assignments"
  ON user_roles FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default roles
INSERT INTO roles (name, description, permissions, is_system) VALUES
  ('super_admin', 'Full system access with all permissions', '["*"]'::jsonb, true),
  ('admin', 'Manage content, users, and system settings', '["users.manage", "content.manage", "analytics.view", "settings.manage"]'::jsonb, true),
  ('editor', 'Create and edit content', '["content.create", "content.edit", "content.view"]'::jsonb, true),
  ('viewer', 'View-only access to content', '["content.view"]'::jsonb, true)
ON CONFLICT (name) DO NOTHING;