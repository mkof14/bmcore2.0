/*
  # AI Health Assistant - Database Schema

  ## Overview
  Adds support for multi-persona AI health assistant with chat history,
  voice interactions, and Second Opinion capability within conversations.

  ## New Tables
  - `chat_sessions` - User conversation sessions
  - `chat_messages` - Individual messages in conversations
  - `assistant_personas` - Different doctor/coach personalities
  - `voice_interactions` - Voice message metadata

  ## Features
  - Multi-turn conversations with context
  - Persona switching (doctor/nurse/neutral)
  - Second Opinion in chat
  - Voice message support
  - Follow-up question tracking

  ## Security
  - RLS enabled on all tables
  - Users can only access their own chats
  - Privacy-first design
*/

-- =====================================================
-- ASSISTANT PERSONAS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS assistant_personas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name_en text NOT NULL,
  name_ru text NOT NULL,
  description_en text,
  description_ru text,
  role_type text NOT NULL CHECK (role_type IN ('doctor', 'nurse', 'coach', 'neutral', 'specialist')),
  tone text NOT NULL CHECK (tone IN ('professional', 'friendly', 'empathetic', 'clinical', 'casual')),
  system_prompt text NOT NULL,
  avatar_url text,
  voice_id text,
  characteristics jsonb DEFAULT '{}',
  active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE assistant_personas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active personas"
  ON assistant_personas FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Only admins can manage personas"
  ON assistant_personas FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND role = 'admin' AND active = true
    )
  );

-- =====================================================
-- CHAT SESSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text,
  persona_id uuid REFERENCES assistant_personas(id),
  context jsonb DEFAULT '{}',
  status text DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  last_message_at timestamptz DEFAULT now(),
  message_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions(user_id, last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own chat sessions"
  ON chat_sessions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- CHAT MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  persona_id uuid REFERENCES assistant_personas(id),
  ai_model_id uuid REFERENCES ai_models(id),
  is_second_opinion boolean DEFAULT false,
  parent_message_id uuid REFERENCES chat_messages(id),
  metadata jsonb DEFAULT '{}',
  tokens_used integer,
  processing_time_ms integer,
  has_voice boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_parent ON chat_messages(parent_message_id);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own chat messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own chat messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update chat messages"
  ON chat_messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- VOICE INTERACTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS voice_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES chat_messages(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  interaction_type text NOT NULL CHECK (interaction_type IN ('speech_to_text', 'text_to_speech')),
  storage_path text,
  duration_ms integer,
  language text DEFAULT 'en',
  transcript text,
  confidence_score numeric(5,2),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_voice_interactions_message ON voice_interactions(message_id);
CREATE INDEX IF NOT EXISTS idx_voice_interactions_user ON voice_interactions(user_id, created_at DESC);

ALTER TABLE voice_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own voice interactions"
  ON voice_interactions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- INSERT DEFAULT PERSONAS
-- =====================================================
INSERT INTO assistant_personas (
  code,
  name_en,
  name_ru,
  description_en,
  description_ru,
  role_type,
  tone,
  system_prompt,
  characteristics,
  sort_order
) VALUES
(
  'dr-evidence',
  'Dr. Evidence',
  'Доктор Эвиденс',
  'Clinical professional focused on evidence-based medicine',
  'Клинический специалист, ориентированный на доказательную медицину',
  'doctor',
  'professional',
  'You are Dr. Evidence, a highly knowledgeable AI health advisor with a clinical background. Your responses are evidence-based, citing research and medical guidelines. You speak professionally but clearly, avoiding unnecessary jargon. Always explain medical terms when you use them. Remember: you provide wellness intelligence, not medical diagnosis. Encourage users to consult healthcare professionals for medical concerns.',
  '{"expertise": "clinical", "communication": "clear", "approach": "scientific"}',
  1
),
(
  'nurse-care',
  'Nurse Care',
  'Медсестра Кэр',
  'Empathetic health advisor focused on practical wellness support',
  'Эмпатичный консультант по здоровью, ориентированный на практическую поддержку',
  'nurse',
  'empathetic',
  'You are Nurse Care, a warm and empathetic AI health advisor. Your focus is on practical, day-to-day health management and emotional support. You ask caring follow-up questions to understand the full picture. You explain things in simple, relatable terms. You celebrate small wins and encourage healthy habits. Remember to be supportive while staying within wellness guidance boundaries.',
  '{"expertise": "practical", "communication": "warm", "approach": "supportive"}',
  2
),
(
  'coach-wellness',
  'Coach Wellness',
  'Тренер Велнес',
  'Motivational health coach focused on behavior change and goals',
  'Мотивационный тренер по здоровью, ориентированный на изменение поведения',
  'coach',
  'friendly',
  'You are Coach Wellness, an energetic and motivational AI health coach. Your specialty is behavior change, goal-setting, and sustainable habits. You use positive reinforcement and actionable strategies. You help break down big health goals into small, achievable steps. You''re encouraging but also realistic. Focus on what the user can control and implement today.',
  '{"expertise": "behavioral", "communication": "motivational", "approach": "practical"}',
  3
),
(
  'neutral-advisor',
  'Health Advisor',
  'Консультант',
  'Balanced health assistant providing objective information',
  'Сбалансированный консультант, предоставляющий объективную информацию',
  'neutral',
  'professional',
  'You are a balanced AI Health Advisor providing objective health information. Your tone is neutral and informative. You present facts clearly without being overly clinical or overly casual. You''re helpful and thorough. When there are multiple perspectives, you present them fairly. You focus on wellness intelligence and preventive health.',
  '{"expertise": "general", "communication": "balanced", "approach": "informative"}',
  4
)
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_session_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_sessions
  SET 
    last_message_at = NEW.created_at,
    message_count = message_count + 1,
    updated_at = now()
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_session_last_message
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_session_last_message();

CREATE TRIGGER update_assistant_personas_updated_at BEFORE UPDATE ON assistant_personas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
