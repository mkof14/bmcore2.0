/*
  # Second Opinion Engine - Database Extension

  ## Overview
  Adds support for dual-AI reasoning in all health reports and services.
  Users can generate a second opinion using a different AI model/approach
  and compare results side-by-side.

  ## New Tables
  - `second_opinions` - Stores second opinion reports
  - `opinion_comparisons` - Stores user feedback on opinion differences
  - `ai_models` - Configuration for different AI reasoning models

  ## Modified Tables
  - `reports` - Add fields for second opinion linking
  - `report_templates` - Add dual-model configurations

  ## Security
  - RLS enabled on all new tables
  - Users can only access their own opinions
  - Admins can manage AI model configurations
*/

-- =====================================================
-- AI MODELS TABLE (Configuration)
-- =====================================================
CREATE TABLE IF NOT EXISTS ai_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name_en text NOT NULL,
  name_ru text NOT NULL,
  description_en text,
  description_ru text,
  reasoning_style text NOT NULL CHECK (reasoning_style IN ('evidence_based', 'contextual', 'empathetic', 'conservative', 'progressive')),
  provider text NOT NULL CHECK (provider IN ('openai', 'anthropic', 'google', 'custom')),
  model_name text NOT NULL,
  temperature numeric(3,2) DEFAULT 0.7,
  system_prompt text NOT NULL,
  characteristics jsonb DEFAULT '{}',
  active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active AI models"
  ON ai_models FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Only admins can manage AI models"
  ON ai_models FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND role = 'admin' AND active = true
    )
  );

-- =====================================================
-- SECOND OPINIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS second_opinions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_report_id uuid REFERENCES reports(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ai_model_id uuid REFERENCES ai_models(id),
  title text NOT NULL,
  status text NOT NULL CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  input jsonb NOT NULL,
  output jsonb,
  error_message text,
  tokens_used integer,
  processing_time_ms integer,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_second_opinions_report ON second_opinions(original_report_id);
CREATE INDEX IF NOT EXISTS idx_second_opinions_user ON second_opinions(user_id, created_at DESC);

ALTER TABLE second_opinions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own second opinions"
  ON second_opinions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own second opinions"
  ON second_opinions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update second opinions"
  ON second_opinions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- OPINION COMPARISONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS opinion_comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_report_id uuid REFERENCES reports(id) ON DELETE CASCADE,
  second_opinion_id uuid REFERENCES second_opinions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  agreements jsonb DEFAULT '[]',
  disagreements jsonb DEFAULT '[]',
  key_differences jsonb DEFAULT '[]',
  confidence_original numeric(5,2),
  confidence_second numeric(5,2),
  user_preferred text CHECK (user_preferred IN ('original', 'second', 'both', 'neither')),
  user_notes text,
  helpful_rating integer CHECK (helpful_rating >= 1 AND helpful_rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comparisons_report ON opinion_comparisons(original_report_id);
CREATE INDEX IF NOT EXISTS idx_comparisons_user ON opinion_comparisons(user_id, created_at DESC);

ALTER TABLE opinion_comparisons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own comparisons"
  ON opinion_comparisons FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- EXTEND REPORTS TABLE
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reports' AND column_name = 'has_second_opinion'
  ) THEN
    ALTER TABLE reports ADD COLUMN has_second_opinion boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reports' AND column_name = 'ai_model_id'
  ) THEN
    ALTER TABLE reports ADD COLUMN ai_model_id uuid REFERENCES ai_models(id);
  END IF;
END $$;

-- =====================================================
-- EXTEND REPORT TEMPLATES
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'report_templates' AND column_name = 'supports_second_opinion'
  ) THEN
    ALTER TABLE report_templates ADD COLUMN supports_second_opinion boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'report_templates' AND column_name = 'recommended_model_pairs'
  ) THEN
    ALTER TABLE report_templates ADD COLUMN recommended_model_pairs jsonb DEFAULT '[]';
  END IF;
END $$;

-- =====================================================
-- INSERT DEFAULT AI MODELS
-- =====================================================
INSERT INTO ai_models (
  code,
  name_en,
  name_ru,
  description_en,
  description_ru,
  reasoning_style,
  provider,
  model_name,
  temperature,
  system_prompt,
  characteristics,
  sort_order
) VALUES
(
  'evidence-primary',
  'Opinion A: Evidence-Based',
  'Мнение A: На основе доказательств',
  'Strict evidence-based reasoning focused on peer-reviewed research and clinical guidelines',
  'Строгая логика на основе рецензируемых исследований и клинических руководств',
  'evidence_based',
  'openai',
  'gpt-4o',
  0.3,
  'You are a highly analytical AI health advisor. Your reasoning MUST be strictly evidence-based, citing peer-reviewed research, clinical studies, and established medical guidelines. Be precise, objective, and conservative. Avoid speculation. Focus on measurable data and statistical relevance. Provide confidence intervals where applicable. This is OPINION A - the evidence-focused perspective.',
  '{"approach": "objective", "focus": "research", "tone": "clinical", "bias": "conservative"}',
  1
),
(
  'contextual-secondary',
  'Opinion B: Contextual & Adaptive',
  'Мнение B: Контекстное и адаптивное',
  'Empathetic, context-aware reasoning that considers lifestyle, behavior patterns, and individual circumstances',
  'Эмпатическая, контекстно-зависимая логика с учетом образа жизни и индивидуальных обстоятельств',
  'contextual',
  'anthropic',
  'claude-3-5-sonnet-20241022',
  0.7,
  'You are an empathetic AI health advisor. Your reasoning should be contextual, considering the whole person - their lifestyle, stress levels, sleep patterns, behavioral context, and psychological factors. Be adaptive and holistic. While respecting evidence, prioritize practical, personalized insights that fit real-world human behavior. This is OPINION B - the contextual, human-centered perspective.',
  '{"approach": "holistic", "focus": "lifestyle", "tone": "empathetic", "bias": "progressive"}',
  2
)
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_report_second_opinion_flag()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    UPDATE reports
    SET has_second_opinion = true
    WHERE id = NEW.original_report_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_second_opinion_flag
  AFTER INSERT OR UPDATE ON second_opinions
  FOR EACH ROW
  EXECUTE FUNCTION update_report_second_opinion_flag();

CREATE TRIGGER update_ai_models_updated_at BEFORE UPDATE ON ai_models
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opinion_comparisons_updated_at BEFORE UPDATE ON opinion_comparisons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
