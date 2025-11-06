/*
  # Create Invitation System for Marketing

  1. New Tables
    - `invitations`
      - `id` (uuid, primary key)
      - `email` (text, not null) - Email приглашенного
      - `code` (text, unique) - Уникальный код приглашения
      - `invited_by` (uuid, references profiles) - Кто пригласил
      - `status` (text) - pending, accepted, expired, revoked
      - `plan_type` (text) - core, daily, max - какой план дается бесплатно
      - `duration_months` (integer) - Сколько месяцев бесплатно (0 = навсегда)
      - `expires_at` (timestamptz) - Когда истекает приглашение
      - `accepted_at` (timestamptz) - Когда принято
      - `accepted_by` (uuid, references profiles) - Кто принял (user_id)
      - `notes` (text) - Заметки админа
      - `metadata` (jsonb) - Дополнительные данные
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `invitation_usage`
      - `id` (uuid, primary key)
      - `invitation_id` (uuid, references invitations)
      - `user_id` (uuid, references profiles)
      - `started_at` (timestamptz) - Когда начали пользоваться
      - `ends_at` (timestamptz) - Когда заканчивается бесплатный период
      - `is_active` (boolean) - Активно ли сейчас
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Admins can manage all invitations
    - Users can view their own accepted invitations
    - Public can check invitation validity by code

  3. Indexes
    - invitations.code for quick lookup
    - invitations.email for duplicate checks
    - invitations.status for filtering
*/

-- Create invitations table
CREATE TABLE IF NOT EXISTS public.invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code text UNIQUE NOT NULL,
  invited_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  plan_type text NOT NULL DEFAULT 'core' CHECK (plan_type IN ('core', 'daily', 'max')),
  duration_months integer NOT NULL DEFAULT 1 CHECK (duration_months >= 0),
  expires_at timestamptz,
  accepted_at timestamptz,
  accepted_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create invitation usage tracking table
CREATE TABLE IF NOT EXISTS public.invitation_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id uuid NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  ends_at timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(invitation_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_invitations_code ON public.invitations(code);
CREATE INDEX IF NOT EXISTS idx_invitations_email ON public.invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON public.invitations(status);
CREATE INDEX IF NOT EXISTS idx_invitations_invited_by ON public.invitations(invited_by);
CREATE INDEX IF NOT EXISTS idx_invitation_usage_user ON public.invitation_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_invitation_usage_active ON public.invitation_usage(is_active);

-- Enable RLS
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invitations

-- Admins can do everything
CREATE POLICY "Admins can manage all invitations"
  ON public.invitations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Users can view their own accepted invitations
CREATE POLICY "Users can view their accepted invitations"
  ON public.invitations
  FOR SELECT
  TO authenticated
  USING (
    accepted_by = auth.uid()
    OR email IN (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );

-- Public can check invitation by code (for redemption page)
CREATE POLICY "Public can check invitation validity"
  ON public.invitations
  FOR SELECT
  TO anon
  USING (status = 'pending' AND (expires_at IS NULL OR expires_at > now()));

-- RLS Policies for invitation_usage

-- Admins can view all usage
CREATE POLICY "Admins can view all invitation usage"
  ON public.invitation_usage
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Users can view their own usage
CREATE POLICY "Users can view own invitation usage"
  ON public.invitation_usage
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- System can insert usage records
CREATE POLICY "System can create invitation usage"
  ON public.invitation_usage
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create function to generate unique invitation code
CREATE OR REPLACE FUNCTION generate_invitation_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM public.invitations WHERE invitations.code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$;

-- Create function to accept invitation
CREATE OR REPLACE FUNCTION accept_invitation(invitation_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  inv_record record;
  usage_record record;
  result jsonb;
BEGIN
  SELECT * INTO inv_record
  FROM public.invitations
  WHERE code = invitation_code
  AND status = 'pending'
  AND (expires_at IS NULL OR expires_at > now())
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid or expired invitation code'
    );
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.invitation_usage
    WHERE invitation_id = inv_record.id
    AND user_id = auth.uid()
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'You have already used this invitation'
    );
  END IF;

  UPDATE public.invitations
  SET 
    status = 'accepted',
    accepted_at = now(),
    accepted_by = auth.uid(),
    updated_at = now()
  WHERE id = inv_record.id;

  INSERT INTO public.invitation_usage (
    invitation_id,
    user_id,
    started_at,
    ends_at,
    is_active
  ) VALUES (
    inv_record.id,
    auth.uid(),
    now(),
    CASE 
      WHEN inv_record.duration_months = 0 THEN 'infinity'::timestamptz
      ELSE now() + (inv_record.duration_months || ' months')::interval
    END,
    true
  ) RETURNING * INTO usage_record;

  INSERT INTO public.user_subscriptions (
    user_id,
    plan_type,
    status,
    start_date,
    end_date,
    is_trial,
    stripe_subscription_id
  ) VALUES (
    auth.uid(),
    inv_record.plan_type,
    'active',
    now(),
    usage_record.ends_at,
    true,
    'invitation_' || inv_record.code
  )
  ON CONFLICT (user_id) DO UPDATE SET
    plan_type = EXCLUDED.plan_type,
    status = EXCLUDED.status,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = now();

  RETURN jsonb_build_object(
    'success', true,
    'plan_type', inv_record.plan_type,
    'duration_months', inv_record.duration_months,
    'ends_at', usage_record.ends_at
  );
END;
$$;

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_invitations_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER invitations_updated_at
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_invitations_updated_at();
