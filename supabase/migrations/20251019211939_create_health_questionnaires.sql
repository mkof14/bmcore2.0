/*
  # Health Questionnaires System

  1. New Tables
    - `questionnaire_responses`
      - Stores all questionnaire responses with instant autosave
      - Tracks completion status per section
      - Supports metric/imperial preferences
      - Multi-language support

  2. Structure
    - Each user has one set of responses
    - Responses stored as JSONB for flexibility
    - Section completion tracked separately
    - Autosave timestamp for conflict resolution

  3. Security
    - Enable RLS
    - Users can only access their own responses
    - No sharing or visibility to others
*/

-- Create questionnaire responses table
CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Section responses stored as JSONB for flexibility
  categories jsonb DEFAULT '{}'::jsonb,
  personal_info jsonb DEFAULT '{}'::jsonb,
  medical_history jsonb DEFAULT '{}'::jsonb,
  medications jsonb DEFAULT '{}'::jsonb,
  allergies jsonb DEFAULT '{}'::jsonb,
  vital_signs jsonb DEFAULT '{}'::jsonb,
  lifestyle jsonb DEFAULT '{}'::jsonb,
  psychological_health jsonb DEFAULT '{}'::jsonb,
  mens_sexual_health jsonb DEFAULT '{}'::jsonb,
  womens_sexual_health jsonb DEFAULT '{}'::jsonb,

  -- Completion tracking
  categories_status text DEFAULT 'draft' CHECK (categories_status IN ('draft', 'complete')),
  personal_info_status text DEFAULT 'draft' CHECK (personal_info_status IN ('draft', 'complete')),
  medical_history_status text DEFAULT 'draft' CHECK (medical_history_status IN ('draft', 'complete')),
  medications_status text DEFAULT 'draft' CHECK (medications_status IN ('draft', 'complete')),
  allergies_status text DEFAULT 'draft' CHECK (allergies_status IN ('draft', 'complete')),
  vital_signs_status text DEFAULT 'draft' CHECK (vital_signs_status IN ('draft', 'complete')),
  lifestyle_status text DEFAULT 'draft' CHECK (lifestyle_status IN ('draft', 'complete')),
  psychological_health_status text DEFAULT 'draft' CHECK (psychological_health_status IN ('draft', 'complete')),
  mens_sexual_health_status text DEFAULT 'draft' CHECK (mens_sexual_health_status IN ('draft', 'complete')),
  womens_sexual_health_status text DEFAULT 'draft' CHECK (womens_sexual_health_status IN ('draft', 'complete')),

  -- Preferences
  unit_system text DEFAULT 'metric' CHECK (unit_system IN ('metric', 'imperial')),
  language text DEFAULT 'en',

  -- Sexual health access tracking
  mens_sexual_health_unlocked boolean DEFAULT false,
  womens_sexual_health_unlocked boolean DEFAULT false,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_autosave_at timestamptz DEFAULT now(),

  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own questionnaire responses"
  ON questionnaire_responses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own questionnaire responses"
  ON questionnaire_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own questionnaire responses"
  ON questionnaire_responses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own questionnaire responses"
  ON questionnaire_responses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS questionnaire_responses_user_id_idx ON questionnaire_responses(user_id);

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_questionnaire_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.last_autosave_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic timestamp update
DROP TRIGGER IF EXISTS update_questionnaire_responses_timestamp ON questionnaire_responses;
CREATE TRIGGER update_questionnaire_responses_timestamp
  BEFORE UPDATE ON questionnaire_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_questionnaire_timestamp();
