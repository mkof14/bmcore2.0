# Phase 6 - Quick Start Guide
**Migration to VS Code + Vercel**

---

## ✅ PRE-FLIGHT CHECKLIST

Before you export from Bolt:

- [x] Phase 5 validation passed
- [x] Security fixes applied (CSP, Service Worker)
- [x] Auth system working
- [x] Admin gates in place
- [x] Build passing (13.94s)
- [x] All tests green

---

## 📦 STEP 1 - EXPORT FROM BOLT

1. In Bolt → Export/Download ZIP
2. Unzip to local folder: `~/bmcore-app`
3. Open in VS Code

---

## 🔐 STEP 2 - ENVIRONMENT VARIABLES

Create `.env` file with:

```bash
# Core (Required)
VITE_SUPABASE_URL=https://pyemkpnyjnoijzsazofw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Auth (Optional)
VITE_REQUIRE_EMAIL_VERIFICATION=0

# QA Mode (Optional)
VITE_QA_MODE=1

# Stripe (Client-side only)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

**IMPORTANT:** Do NOT add STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET to .env
These are managed in Admin Panel → API Keys

---

## 🚀 STEP 3 - DEPLOY TO VERCEL

```bash
# Initialize git
git init
git add -A
git commit -m "Initial commit from Bolt"

# Create GitHub repo
gh repo create your-username/bmcore-vite --private --source=. --remote=origin
git push -u origin main

# Or manually:
# 1. Create empty repo on GitHub
# 2. git remote add origin https://github.com/your-username/bmcore-vite.git
# 3. git push -u origin main
```

**Vercel Setup:**
1. Go to vercel.com → New Project
2. Import from GitHub: `your-username/bmcore-vite`
3. Framework: Vite
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Deploy

---

## 🔧 STEP 4 - CONFIGURE VERCEL ENV VARS

In Vercel → Settings → Environment Variables:

**Add these for BOTH Preview and Production:**

```
VITE_SUPABASE_URL=https://pyemkpnyjnoijzsazofw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_REQUIRE_EMAIL_VERIFICATION=0
VITE_QA_MODE=1
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

Then: Redeploy

---

## 👤 STEP 5 - CREATE FIRST ADMIN

**Option A: Sign Up via UI**
1. Go to your Vercel preview URL
2. Navigate to Sign Up
3. Create account
4. Run SQL in Supabase:
   ```sql
   UPDATE profiles
   SET is_admin = true
   WHERE email = 'your-email@example.com';
   ```

**Option B: Use promote-admin.sql**
1. Edit `/scripts/promote-admin.sql`
2. Replace email address
3. Run in Supabase SQL Editor

---

## 💳 STEP 6 - CONFIGURE STRIPE (Optional)

**In Stripe Dashboard:**
1. Get Publishable Key (pk_test_xxx) → Already in Vercel env vars
2. Get Secret Key (sk_test_xxx) → Add to Admin Panel
3. Get Webhook Secret (whsec_xxx) → Add to Admin Panel

**In BioMath Admin Panel:**
1. Sign in as admin
2. Go to Admin Panel → API Keys
3. Add `stripe_secret`: `sk_test_xxx`
4. Add `stripe_webhook_secret`: `whsec_xxx`

**In Stripe Dashboard → Webhooks:**
1. Add endpoint: `https://your-app.vercel.app/supabase/functions/v1/stripe-webhook`
2. Select events:
   - checkout.session.completed
   - customer.subscription.updated
   - customer.subscription.deleted
3. Copy webhook secret → Already added to Admin Panel

---

## ✅ STEP 7 - SMOKE TEST ON VERCEL

**Authentication:**
- [ ] Sign Up new user → Success
- [ ] Check Supabase → Profile created
- [ ] Sign Out → Success
- [ ] Sign In → Success
- [ ] Reload page → Still authenticated

**Authorization:**
- [ ] Try /admin-panel without login → Blocked
- [ ] Try /admin-panel as regular user → Access Denied
- [ ] Try /admin-panel as admin → Access Granted
- [ ] Try /command-center as admin → Access Granted

**Security:**
- [ ] Check Network → CSP header present
- [ ] No 'unsafe-inline' in script-src
- [ ] Service Worker not registered

**Payments (if configured):**
- [ ] Pricing page shows correct state
- [ ] Click Buy → Stripe checkout opens
- [ ] Use test card 4242 4242 4242 4242
- [ ] Check webhook logs → 200 OK

---

## 🔴 TROUBLESHOOTING

**Problem: "Missing Supabase URL"**
- Check Vercel env vars are set
- Redeploy after adding vars

**Problem: "Access Denied" as admin**
- Verify `is_admin = true` in profiles table
- Sign out and sign in again (refresh JWT)
- Check RLS policies are active

**Problem: "Stripe not configured"**
- Check `VITE_STRIPE_PUBLISHABLE_KEY` in Vercel env
- Check Stripe keys in Admin Panel → API Keys

**Problem: "Session doesn't persist"**
- Clear browser cache/cookies
- Check Supabase client config has `persistSession: true`
- Verify no Service Worker caching issues

**Problem: "Build fails on Vercel"**
- Check Node version (18.x recommended)
- Run `npm install` locally first
- Check for TypeScript errors

---

## 🎯 SUCCESS CRITERIA

You're ready for production when:

- [x] Authentication working (sign up/in/out)
- [x] Sessions persist across reloads
- [x] Admin panel accessible only to admins
- [x] RLS blocking non-admin database access
- [x] Stripe configuration (if using payments)
- [x] CSP headers present and strict
- [x] No console errors
- [x] Mobile responsive

---

## 🚨 ROLLBACK PLAN

If something goes wrong in production:

**Vercel:**
1. Go to Deployments
2. Find last working deployment
3. Click "Promote to Production"

**Emergency:**
- Use Bolt ZIP as reference
- Re-deploy from known good commit

---

## 📞 SUPPORT RESOURCES

**Supabase:**
- Dashboard: https://app.supabase.com
- Docs: https://supabase.com/docs

**Vercel:**
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs

**Stripe:**
- Dashboard: https://dashboard.stripe.com
- Docs: https://stripe.com/docs

---

## 🎉 CONGRATULATIONS!

You've successfully migrated BioMath Core to production infrastructure.

**Next Steps:**
1. Monitor error logs (Vercel → Logs)
2. Set up alerts (Vercel → Settings → Notifications)
3. Add custom domain when ready
4. Consider adding monitoring (Sentry, LogRocket)

---

*End of Quick Start Guide*
