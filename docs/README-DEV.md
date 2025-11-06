# Developer Onboarding Guide

Welcome to BioMath Core! This guide will get you up and running in less than 15 minutes.

## Prerequisites

- Node.js v20.11.1 (use `nvm use` to auto-switch)
- npm or pnpm
- Git
- Supabase account
- Stripe account (test mode)

## Quick Start (10 Steps)

### 1. Clone Repository

```bash
git clone <repository-url>
cd biomathcore-platform
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

**Time: ~2 minutes**

### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```bash
# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...

# Stripe (test mode)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Key Vault Master Key (generate new)
BMC_KMS_KEY=<generate using command below>
```

Generate KMS key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Time: ~3 minutes**

### 4. Set Up Database

Migrations are in `supabase/migrations/`. Apply them:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to SQL Editor
4. Run migrations in order (or use Supabase CLI)

**Time: ~2 minutes**

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

**Time: ~30 seconds**

### 6. Create Admin User

1. Sign up via UI: `http://localhost:5173/sign-up`
2. Promote to admin:

```sql
UPDATE profiles SET is_admin = true WHERE email = 'your@email.com';
```

**Time: ~1 minute**

### 7. Verify Setup

Check these URLs:
- Homepage: `http://localhost:5173/`
- Health: `http://localhost:5173/api/health.json`
- Admin: `http://localhost:5173/admin`

**Time: ~1 minute**

### 8. Run Tests

```bash
npm test
```

**Time: ~1 minute**

### 9. Build for Production

```bash
npm run build
```

**Time: ~15 seconds**

### 10. Read Architecture

- `/docs/DATABASE_OPTIMIZATION.md` - Database patterns
- `/docs/ops/` - Operations runbooks
- `README.md` - Full documentation

**Time: ~5 minutes (optional)**

## Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build

# Quality
npm run lint             # Lint code
npm run typecheck        # Type checking
npm test                 # Run tests
npm run test:coverage    # Coverage report

# Database
npm run db:gen           # Generate Prisma types (if using Prisma)

# Validation
npm run check            # Lint + typecheck + build
```

## Project Structure

```
biomathcore-platform/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── admin/       # Admin components
│   │   └── ...
│   ├── lib/             # Core utilities
│   │   ├── supabase.ts          # DB client
│   │   ├── stripe.ts            # Payments
│   │   ├── kms.ts               # Encryption
│   │   ├── featureFlags.ts      # Feature toggles
│   │   ├── queue.ts             # Background jobs
│   │   ├── costTracking.ts      # Cost monitoring
│   │   └── ...
│   ├── pages/           # Page components
│   │   ├── admin/       # Admin pages
│   │   ├── legal/       # Legal pages
│   │   └── member/      # Member zone
│   └── hooks/           # Custom React hooks
├── supabase/migrations/ # Database migrations
├── tests/               # Test files
└── docs/                # Documentation
    └── ops/             # Operations docs
```

## Key Concepts

### 1. Authentication

Uses Supabase Auth with email/password:

```typescript
import { supabase } from "@/lib/supabase";

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

### 2. Database Access

All queries use Supabase client with RLS:

```typescript
// Read (respects RLS)
const { data, error } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", userId)
  .maybeSingle();

// Write (respects RLS)
const { error } = await supabase
  .from("health_data")
  .insert({ user_id: userId, data_type: "weight", value: 70 });
```

### 3. Feature Flags

Control features without deployment:

```typescript
import { isFeatureEnabled } from "@/lib/featureFlags";

if (await isFeatureEnabled("ai.second_opinion")) {
  // Show AI feature
}
```

### 4. Background Jobs

Async tasks via queue system:

```typescript
import { enqueueJob } from "@/lib/queue";

await enqueueJob("aggregate_reports", { userId }, { priority: 5 });
```

### 5. Cost Tracking

Track API usage and costs:

```typescript
import { trackAIUsage } from "@/lib/costTracking";

await trackAIUsage("openai", "gpt-4", tokensUsed);
```

## Common Tasks

### Adding a New Page

1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add to sitemap if public

### Adding a New API Endpoint

Create Supabase Edge Function:

```bash
# See supabase/functions/ for examples
```

### Adding a Database Table

1. Create migration in `supabase/migrations/`
2. Follow naming: `YYYYMMDDHHMMSS_description.sql`
3. Include RLS policies
4. Apply via Supabase dashboard

### Adding a Feature Flag

```sql
INSERT INTO feature_flags (flag_key, enabled, description)
VALUES ('new.feature', false, 'Description of new feature');
```

## Debugging

### Database Issues

```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- View slow queries
SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;
```

### Application Logs

Logs follow format: `[BMC] level=info msg="..." ctx={...}`

Search for errors:
```bash
grep "level=error" logs.txt
```

### Performance Issues

Use built-in performance tracking:

```typescript
import { logger } from "@/lib/logger";

logger.performance("operation_name", duration, { userId });
```

## Testing

### Unit Tests

```bash
npm test
```

### Load Testing

```bash
k6 run tests/load.k6.js
```

### Chaos Testing

```bash
npm test tests/chaos.test.ts
```

## Deployment

### Preview Deployment

Push to any branch → automatic Vercel preview

### Production Deployment

```bash
git checkout main
git merge dev
git push origin main
```

Vercel auto-deploys `main` branch to production.

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key |
| `BMC_KMS_KEY` | Yes | Master encryption key (32 bytes base64) |
| `VITE_GA_MEASUREMENT_ID` | No | Google Analytics ID |
| `VITE_FB_PIXEL_ID` | No | Facebook Pixel ID |

## Getting Help

1. Check `/docs` directory
2. Read operations runbooks in `/docs/ops`
3. Search existing issues
4. Ask in team chat
5. Create detailed issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Logs (sanitized)
   - Environment details

## Best Practices

1. **Never commit secrets** - Use `.env` for local, Vercel for production
2. **Follow RLS** - All user data queries respect Row Level Security
3. **Use feature flags** - Deploy features off, enable gradually
4. **Write tests** - Cover critical paths
5. **Monitor costs** - Track API usage via admin dashboard
6. **Log structured** - Use logger with context
7. **Handle errors** - Always provide user-friendly messages

## Next Steps

- [ ] Complete "Quick Start" steps
- [ ] Read architecture docs
- [ ] Run all tests
- [ ] Review open issues
- [ ] Make first small contribution
- [ ] Join team sync meeting

Welcome to the team! 🚀
