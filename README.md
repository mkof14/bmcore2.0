# BioMath Core Platform

Advanced Health Analytics Platform powered by dual AI models and comprehensive health data integration.

## Overview

BioMath Core is a comprehensive health analytics platform that combines cutting-edge AI technology with medical expertise to provide personalized health insights. The platform features:

- 🤖 **Dual AI Opinion System** - Get insights from multiple AI models (Gemini, Claude, GPT)
- 📊 **Comprehensive Health Reports** - Detailed analysis and actionable recommendations
- ⌚ **Device Integration** - Connect with Withings, Apple Health, Fitbit, and more
- 💳 **Subscription Management** - Flexible pricing tiers with Stripe integration
- 🔐 **Enterprise Security** - HIPAA-compliant data handling and RLS policies
- 📱 **Progressive Web App** - Install as mobile/desktop app with offline support

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL with RLS)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **AI**: OpenAI, Anthropic Claude, Google Gemini
- **Analytics**: Google Analytics 4, Sentry
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js v20.11.1 or higher (see `.nvmrc`)
- npm or pnpm
- Supabase account
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd biomathcore-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Fill in your environment variables in `.env`. See `.env.example` for all available options.

4. **Run database migrations**
   ```bash
   # Migrations are automatically applied when you start the dev server
   # Or manually run migrations in Supabase Studio
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code with ESLint
- `npm run typecheck` - Type check with TypeScript
- `npm test` - Run tests with Vitest
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Generate coverage report

## Project Structure

```
biomathcore-platform/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── admin/       # Admin panel components
│   │   └── ...
│   ├── config/          # Configuration files
│   ├── contexts/        # React contexts
│   ├── data/            # Static data
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   ├── pages/           # Page components
│   │   ├── admin/       # Admin pages
│   │   ├── legal/       # Legal pages
│   │   └── member/      # Member zone pages
│   ├── test/            # Test utilities
│   └── types/           # TypeScript types
├── supabase/
│   ├── functions/       # Edge functions
│   └── migrations/      # Database migrations
└── scripts/             # Build and utility scripts
```

## Configuration

### Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the browser. See `.env.example` for a complete list.

**Required variables:**
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key

**Optional but recommended:**
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `VITE_GEMINI_API_KEY` - Google Gemini API key
- `VITE_ANTHROPIC_API_KEY` - Anthropic Claude API key
- `VITE_OPENAI_API_KEY` - OpenAI API key
- `VITE_GA_MEASUREMENT_ID` - Google Analytics 4 ID

### Admin Panel

The admin panel is available at `/admin-panel` and provides:
- Config System (Vault UI) - Manage environment variables
- API Keys Management - Manage secrets securely
- User Management - Manage users and roles
- Stripe Configuration - Set up payment keys
- Content Management - Blog, News, Careers
- Email Templates - Customize email communications
- Analytics Dashboard - Monitor platform usage

Access is restricted to users with admin role in the database.

## Security

### Key Vault

Production-grade encrypted key management:
- **AES-256-GCM encryption** for all secrets
- **Master key** stored in `BMC_KMS_KEY` environment variable
- **Version control** for key rotation
- **Health checks** for API connectivity
- **Masked display** in admin UI (shows only last 4 characters)
- **Audit logging** for all key operations

Generate master key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Manage keys via Admin Panel → API Keys Management:
- Add/update keys with automatic validation
- Test connectivity with external services
- Rotate keys without service interruption
- View "Applied" status and health indicators

### Data Governance

GDPR and HIPAA-compliant data handling:
- **Row Level Security (RLS)** on all user data tables
- **Audit log** for admin operations
- **Data export** functionality for user requests
- **Soft delete** with scheduled purging
- **PII sanitization** in logs and error messages
- **Retention policies** for temporary data

### Feature Flags & Kill Switches

Runtime feature management:
- Enable/disable features without deployment
- Emergency kill switches for external services
- Per-user feature rollouts
- A/B testing support

Available flags:
- `ai.second_opinion` - Dual AI opinions
- `ai.health_assistant` - AI chat assistant
- `killswitch.openai` - Emergency OpenAI disable
- `killswitch.anthropic` - Emergency Claude disable
- `killswitch.stripe` - Emergency Stripe disable

### Rate Limiting

Built-in rate limiting protects against abuse:
- API calls: 100 requests/minute
- Authentication: 5 attempts/15 minutes
- Form submissions: 10/5 minutes
- Email sending: 3/hour

### Security Headers

Automatically applied security headers:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- Content Security Policy (CSP) for XSS protection

## Database

### Migrations

Database migrations are located in `supabase/migrations/`. They are automatically applied by Supabase.

Key features:
- Row Level Security (RLS) on all tables
- User profiles and subscriptions
- Health data and reports
- Device integrations
- Email templates and campaigns
- Analytics and error tracking

### Seeding Data

To seed the database with initial data:
1. Create an admin user in Supabase Auth
2. Run the admin promotion script: `psql < scripts/promote-admin.sql`
3. Access Admin Panel to configure the system

## Deployment

### Vercel Deployment

1. **Connect your repository to Vercel**
   ```bash
   vercel link
   ```

2. **Set environment variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add all required variables from `.env.example`
   - Set `VERCEL_TOKEN`, `VERCEL_PROJECT_ID` for Secrets Bridge

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Supabase Setup

1. Create a new Supabase project
2. Copy the project URL and anon key
3. Run migrations from the Supabase dashboard
4. Enable email confirmations and configure email templates

### Stripe Setup

1. Create products and prices in Stripe Dashboard
2. Copy price IDs to environment variables
3. Set up webhook endpoint at `<your-domain>/api/stripe/webhook`
4. Copy webhook secret to environment variables

## Migration from Bolt to VS Code

### Export from Bolt

1. Ensure all environment variables are set in Bolt
2. Run final build: `npm run build`
3. Export project files

### Import to VS Code

1. Open the exported folder in VS Code
2. Install Node.js v20.11.1 (or use nvm: `nvm use`)
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env` and fill in values
5. Start dev server: `npm run dev`

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Set environment variables in Vercel dashboard
5. Configure custom domain if needed

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Writing Tests

Tests are located in `src/**/__tests__/` directories using Vitest and React Testing Library.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Code Quality

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run typecheck
```

### Formatting

Code is formatted with Prettier. Configuration in `.prettierrc`.

## Troubleshooting

### Build Errors

- Ensure Node.js version matches `.nvmrc`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist .vite`

### Database Connection Issues

- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Check Supabase project status
- Verify RLS policies are set correctly

### Stripe Integration Issues

- Verify webhook endpoint is configured
- Check webhook secret matches environment variable
- Test with Stripe test mode first

## Operations

### Health Monitoring

Monitor system health:
- **Health check**: `GET /api/health` - Basic uptime and version info
- **Dependencies check**: `GET /api/deps` - Status of Supabase, Stripe, and other services

### Backups & Recovery

- **Database backups**: Automatic daily backups via Supabase (7-day PITR)
- **Key Vault backups**: Manual export via Admin Panel
- **Configuration backups**: `vercel env pull` for environment variables

See detailed recovery procedures in `/docs/ops/restore.md`

### Incident Response

Three-tier incident severity:
- **P0 (Critical)**: Complete outage, immediate response
- **P1 (High)**: Major feature broken, 1-hour response
- **P2 (Medium)**: Minor issue, 4-hour response

Complete runbooks in `/docs/ops/`:
- `incident.md` - Incident response procedures
- `rollback.md` - Deployment rollback guide
- `restore.md` - Disaster recovery procedures

### Rollout Strategy

Safe deployment practices:
1. **Staging environment**: Test on preview deployments
2. **Feature flags**: Gradual feature rollouts
3. **Monitoring**: 15-minute observation period
4. **Rollback**: < 15-minute recovery time target

## Support

For support, please:
1. Check the documentation in `/docs`
2. Review operations runbooks in `/docs/ops`
3. Search existing issues
4. Create a new issue with detailed description
5. Contact support@biomathcore.com

## License

UNLICENSED - Proprietary software

## Acknowledgments

- Supabase team for the backend infrastructure
- Vercel for hosting and deployment
- OpenAI, Anthropic, and Google for AI capabilities
- All open-source contributors

---

**BioMath Core** - Advanced Health Analytics Platform
Version 1.0.0
