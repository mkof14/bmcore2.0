-- Promote a user to admin
-- Usage: Replace 'your-email@example.com' with the actual email address

-- Check current status
SELECT id, email, is_admin, created_at
FROM public.profiles
WHERE email = 'your-email@example.com';

-- Promote to admin
UPDATE public.profiles
SET is_admin = true, updated_at = now()
WHERE email = 'your-email@example.com';

-- Verify the change
SELECT id, email, is_admin, updated_at
FROM public.profiles
WHERE email = 'your-email@example.com';

-- List all admins
SELECT id, email, is_admin, created_at, updated_at
FROM public.profiles
WHERE is_admin = true
ORDER BY created_at DESC;
