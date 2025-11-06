/*
  # MODULE 06 — Goals, Habits & Daily Snapshot System (Clean Recreation)

  1. Drop existing tables if any
  2. Create new tables with correct structure
  3. Add RLS policies
  4. Add indexes and triggers
*/

-- Drop existing tables if any (cascade to remove dependencies)
DROP TABLE IF EXISTS smart_nudges CASCADE;
DROP TABLE IF EXISTS habit_completions CASCADE;
DROP TABLE IF EXISTS habits CASCADE;
DROP TABLE IF EXISTS daily_snapshots CASCADE;
DROP TABLE IF EXISTS user_goals CASCADE;

-- user_goals table
CREATE TABLE user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  source text NOT NULL CHECK (source IN ('report', 'chat', 'manual')),
  source_id uuid,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  target_date date,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz
);

ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals"
  ON user_goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own goals"
  ON user_goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON user_goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON user_goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX idx_user_goals_status ON user_goals(status);
CREATE INDEX idx_user_goals_start_date ON user_goals(start_date);

-- habits table
CREATE TABLE habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid REFERENCES user_goals(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  frequency text NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'custom')),
  time_anchor text NOT NULL DEFAULT 'morning' CHECK (time_anchor IN ('morning', 'afternoon', 'evening', 'after_meal', 'before_sleep', 'custom')),
  specific_time time,
  duration_minutes integer DEFAULT 5,
  difficulty_level integer DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own habits"
  ON habits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own habits"
  ON habits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON habits FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON habits FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habits_goal_id ON habits(goal_id);
CREATE INDEX idx_habits_status ON habits(status);

-- habit_completions table
CREATE TABLE habit_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  completion_date date NOT NULL DEFAULT CURRENT_DATE,
  completed boolean DEFAULT false NOT NULL,
  note text,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(habit_id, completion_date)
);

ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own completions"
  ON habit_completions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own completions"
  ON habit_completions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own completions"
  ON habit_completions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own completions"
  ON habit_completions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_habit_completions_user_id ON habit_completions(user_id);
CREATE INDEX idx_habit_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX idx_habit_completions_date ON habit_completions(completion_date);

-- daily_snapshots table
CREATE TABLE daily_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  snapshot_date date NOT NULL DEFAULT CURRENT_DATE,
  state_summary text NOT NULL,
  state_reason text,
  suggestion_of_day jsonb,
  energy_level text CHECK (energy_level IN ('low', 'moderate', 'good', 'excellent')),
  recovery_status text CHECK (recovery_status IN ('recovering', 'stable', 'stressed', 'excellent')),
  device_data_snapshot jsonb,
  second_opinion_a text,
  second_opinion_b text,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, snapshot_date)
);

ALTER TABLE daily_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own snapshots"
  ON daily_snapshots FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own snapshots"
  ON daily_snapshots FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own snapshots"
  ON daily_snapshots FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own snapshots"
  ON daily_snapshots FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_daily_snapshots_user_id ON daily_snapshots(user_id);
CREATE INDEX idx_daily_snapshots_date ON daily_snapshots(snapshot_date);

-- smart_nudges table
CREATE TABLE smart_nudges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nudge_type text NOT NULL CHECK (nudge_type IN ('habit_reminder', 'state_alert', 'progress_celebration', 'suggestion')),
  title text NOT NULL,
  message text NOT NULL,
  action_text text,
  action_target text,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  trigger_condition jsonb,
  scheduled_for timestamptz NOT NULL,
  delivered_at timestamptz,
  dismissed_at timestamptz,
  actioned_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE smart_nudges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own nudges"
  ON smart_nudges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own nudges"
  ON smart_nudges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nudges"
  ON smart_nudges FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own nudges"
  ON smart_nudges FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_smart_nudges_user_id ON smart_nudges(user_id);
CREATE INDEX idx_smart_nudges_scheduled ON smart_nudges(scheduled_for);
CREATE INDEX idx_smart_nudges_delivered ON smart_nudges(delivered_at);

-- Trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_goals_updated_at
  BEFORE UPDATE ON user_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_habits_updated_at
  BEFORE UPDATE ON habits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
