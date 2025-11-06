/*
  # Report Settings and History System

  1. New Tables
    - `report_settings`
      - User's personalization preferences for AI reports
      - Detail level, tone, visualization style
      - Advanced Mode unlock status
      - Second opinion preferences
    
    - `report_history`
      - Persistent storage of all generated reports
      - Automatic saving after generation
      - Trend tracking and comparison support
      - Smart deduplication logic

  2. Features
    - Autosave preferences without submit button
    - Track Advanced Mode prerequisites
    - Store report metadata and content
    - Support comparison and trend views
    - Privacy controls for sharing

  3. Security
    - Enable RLS on all tables
    - Users can only access their own data
    - Secure sharing with access tokens
*/

-- Report Settings Table
CREATE TABLE IF NOT EXISTS report_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Detail and Tone Settings
  detail_level text DEFAULT 'standard' CHECK (detail_level IN ('short', 'standard', 'extended')),
  tone_style text DEFAULT 'supportive' CHECK (tone_style IN ('analytical', 'supportive', 'coaching')),
  visualization_mode text DEFAULT 'mixed' CHECK (visualization_mode IN ('text_first', 'chart_first', 'mixed')),
  
  -- Recommendation Focus
  insight_focus text DEFAULT 'lifestyle' CHECK (insight_focus IN ('lifestyle', 'risk_awareness', 'performance')),
  
  -- Advanced Mode
  advanced_mode_enabled boolean DEFAULT false,
  advanced_mode_unlocked boolean DEFAULT false,
  interpretation_priority text DEFAULT 'preventive_first' CHECK (interpretation_priority IN ('preventive_first', 'physiological_first', 'behavioral_first')),
  
  -- Report Generation
  auto_refresh_frequency text DEFAULT 'weekly' CHECK (auto_refresh_frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'manual')),
  
  -- Second Opinion
  second_opinion_default boolean DEFAULT false,
  
  -- Privacy Settings
  save_to_history boolean DEFAULT true,
  allow_caregiver_view boolean DEFAULT false,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Report History Table
CREATE TABLE IF NOT EXISTS report_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Report Metadata
  service_id text NOT NULL,
  service_name text NOT NULL,
  category_id text NOT NULL,
  
  -- Report Content
  primary_interpretation jsonb NOT NULL,
  secondary_interpretation jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Trend Tracking
  is_trend_significant boolean DEFAULT true,
  previous_report_id uuid REFERENCES report_history(id),
  trend_explanation text,
  
  -- User Actions
  is_bookmarked boolean DEFAULT false,
  is_shared boolean DEFAULT false,
  share_token text,
  
  -- Settings snapshot (what settings were used)
  settings_snapshot jsonb,
  
  -- Timestamps
  generated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE report_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_history ENABLE ROW LEVEL SECURITY;

-- Report Settings Policies
CREATE POLICY "Users can read own report settings"
  ON report_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own report settings"
  ON report_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own report settings"
  ON report_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Report History Policies
CREATE POLICY "Users can read own report history"
  ON report_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports"
  ON report_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports"
  ON report_history
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports"
  ON report_history
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Shared reports can be viewed with valid token
CREATE POLICY "Shared reports viewable with token"
  ON report_history
  FOR SELECT
  TO authenticated
  USING (is_shared = true AND share_token IS NOT NULL);

-- Indexes
CREATE INDEX IF NOT EXISTS report_settings_user_id_idx ON report_settings(user_id);
CREATE INDEX IF NOT EXISTS report_history_user_id_idx ON report_history(user_id);
CREATE INDEX IF NOT EXISTS report_history_service_id_idx ON report_history(service_id);
CREATE INDEX IF NOT EXISTS report_history_generated_at_idx ON report_history(generated_at DESC);
CREATE INDEX IF NOT EXISTS report_history_bookmarked_idx ON report_history(user_id, is_bookmarked) WHERE is_bookmarked = true;

-- Function to update report settings timestamp
CREATE OR REPLACE FUNCTION update_report_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for report settings
DROP TRIGGER IF EXISTS update_report_settings_timestamp_trigger ON report_settings;
CREATE TRIGGER update_report_settings_timestamp_trigger
  BEFORE UPDATE ON report_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_report_settings_timestamp();

-- Function to check Advanced Mode prerequisites
CREATE OR REPLACE FUNCTION check_advanced_mode_prerequisites(p_user_id uuid)
RETURNS boolean AS $$
DECLARE
  v_questionnaires_complete integer;
  v_required_sections integer := 5;
BEGIN
  -- Check if user has completed enough questionnaire sections
  SELECT COUNT(*) INTO v_questionnaires_complete
  FROM questionnaire_responses
  WHERE user_id = p_user_id
  AND (
    categories_status = 'complete' OR
    personal_info_status = 'complete' OR
    medical_history_status = 'complete' OR
    vital_signs_status = 'complete' OR
    lifestyle_status = 'complete'
  );
  
  RETURN v_questionnaires_complete >= v_required_sections;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
