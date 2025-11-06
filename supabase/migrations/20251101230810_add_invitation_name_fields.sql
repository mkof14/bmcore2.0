/*
  # Add Name Fields to Invitations

  1. Changes
    - Add `first_name` column to invitations table
    - Add `last_name` column to invitations table
    
  2. Purpose
    - Allow personalized invitations with recipient names
    - Enable better tracking and communication with invitees
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invitations' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE public.invitations ADD COLUMN first_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invitations' AND column_name = 'last_name'
  ) THEN
    ALTER TABLE public.invitations ADD COLUMN last_name text;
  END IF;
END $$;