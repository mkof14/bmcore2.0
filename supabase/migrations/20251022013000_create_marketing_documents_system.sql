/*
  # Create Marketing Documents System

  1. New Tables
    - `marketing_documents`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `file_name` (text)
      - `file_url` (text)
      - `file_type` (text) - pdf, doc, image, video, etc.
      - `file_size` (bigint) - size in bytes
      - `category` (text) - brochure, presentation, whitepaper, etc.
      - `tags` (text[])
      - `uploaded_by` (uuid, references profiles)
      - `uploaded_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `download_count` (integer)
      - `is_public` (boolean)

  2. Security
    - Enable RLS
    - Authenticated users can view and manage documents
*/

CREATE TABLE IF NOT EXISTS marketing_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size bigint DEFAULT 0,
  category text NOT NULL,
  tags text[] DEFAULT ARRAY[]::text[],
  uploaded_by uuid REFERENCES profiles(id),
  uploaded_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  download_count integer DEFAULT 0,
  is_public boolean DEFAULT false
);

ALTER TABLE marketing_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view documents"
  ON marketing_documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage documents"
  ON marketing_documents FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
