const requiredPublicEnv = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];

const shouldSkipValidation = process.env.VITE_MOCK_MODE === '1';

if (shouldSkipValidation) {
  console.log('[env-check] VITE_MOCK_MODE=1, skipping required env validation');
  process.exit(0);
}

const missing = requiredPublicEnv.filter((key) => {
  const value = process.env[key];
  return !value || value.trim() === '';
});

if (missing.length > 0) {
  console.error('[env-check] Missing required public environment variables:');
  missing.forEach((key) => console.error(`  - ${key}`));
  console.error(
    '[env-check] Set them in Vercel Project Settings -> Environment Variables and redeploy.'
  );
  process.exit(1);
}

console.log('[env-check] Required public environment variables are present.');
