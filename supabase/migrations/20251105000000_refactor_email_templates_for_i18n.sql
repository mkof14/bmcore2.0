-- Step 1: Create the new translations table
CREATE TABLE public.email_template_translations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id uuid NOT NULL REFERENCES public.email_templates(id) ON DELETE CASCADE,
    language_code text NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,
    UNIQUE(template_id, language_code)
);

-- Add comments for clarity
COMMENT ON TABLE public.email_template_translations IS 'Stores translations for email templates, allowing for multi-language support.';
COMMENT ON COLUMN public.email_template_translations.language_code IS 'ISO 639-1 language code (e.g., ''en'', ''ru'').';

-- Step 2: Set up Row Level Security for the new table
ALTER TABLE public.email_template_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to translations"
ON public.email_template_translations
FOR SELECT
USING (true);

CREATE POLICY "Allow admins to manage translations"
ON public.email_template_translations
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- Step 3: Migrate existing data from email_templates to email_template_translations
-- Migrate English content
INSERT INTO public.email_template_translations (template_id, language_code, subject, body)
SELECT id, 'en', subject_en, body_en
FROM public.email_templates
WHERE subject_en IS NOT NULL AND body_en IS NOT NULL;

-- Migrate Russian content
INSERT INTO public.email_template_translations (template_id, language_code, subject, body)
SELECT id, 'ru', subject_ru, body_ru
FROM public.email_templates
WHERE subject_ru IS NOT NULL AND body_ru IS NOT NULL;


-- Step 4: Remove the old language-specific columns from the email_templates table
ALTER TABLE public.email_templates
DROP COLUMN subject_en,
DROP COLUMN subject_ru,
DROP COLUMN body_en,
DROP COLUMN body_ru;
