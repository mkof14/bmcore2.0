/*
  # Reports & Insights Engine Schema

  1. New Tables
    - `health_reports`
      - `id` (uuid, primary key)
      - `user_id` (uuid, FK to auth.users)
      - `report_type` (enum: general, thematic, dynamic, device_enhanced)
      - `topic` (text, nullable - for thematic reports)
      - `summary` (text - краткое резюме, 3-4 предложения)
      - `insights` (jsonb - основные выводы, массив)
      - `analysis` (text - детальный анализ)
      - `recommendations` (jsonb - массив рекомендаций)
      - `device_data` (jsonb - данные устройств, если подключены)
      - `second_opinion_a` (text, nullable - физиологический подход)
      - `second_opinion_b` (text, nullable - поведенческий подход)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `report_questions`
      - `id` (uuid, primary key)
      - `report_id` (uuid, FK to health_reports)
      - `question` (text - вопрос AI)
      - `answer` (text - ответ пользователя)
      - `order` (int - порядок в диалоге)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Users can only see and create their own reports
    - Questions linked to reports follow same permissions
*/

-- Create report_type enum
CREATE TYPE report_type AS ENUM ('general', 'thematic', 'dynamic', 'device_enhanced');

-- Create health_reports table
CREATE TABLE IF NOT EXISTS health_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  report_type report_type NOT NULL,
  topic text,
  summary text NOT NULL,
  insights jsonb NOT NULL DEFAULT '[]'::jsonb,
  analysis text NOT NULL,
  recommendations jsonb NOT NULL DEFAULT '[]'::jsonb,
  device_data jsonb,
  second_opinion_a text,
  second_opinion_b text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create report_questions table
CREATE TABLE IF NOT EXISTS report_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES health_reports(id) ON DELETE CASCADE NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  "order" int NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE health_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for health_reports
CREATE POLICY "Users can view own reports"
  ON health_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own reports"
  ON health_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports"
  ON health_reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports"
  ON health_reports
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for report_questions
CREATE POLICY "Users can view questions for own reports"
  ON report_questions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM health_reports
      WHERE health_reports.id = report_questions.report_id
      AND health_reports.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create questions for own reports"
  ON report_questions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM health_reports
      WHERE health_reports.id = report_questions.report_id
      AND health_reports.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_health_reports_user_id ON health_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_health_reports_created_at ON health_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_reports_type ON health_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_report_questions_report_id ON report_questions(report_id);
CREATE INDEX IF NOT EXISTS idx_report_questions_order ON report_questions(report_id, "order");

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_health_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER health_reports_updated_at
  BEFORE UPDATE ON health_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_health_reports_updated_at();
