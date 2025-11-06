# Vercel Deployment Guide

## Prerequisites
- Vercel account (free): https://vercel.com/signup
- GitHub/GitLab account
- Your Stripe keys (Test Mode recommended for first deploy)
- Your Supabase credentials (already configured)

## Step 1: Prepare Git Repository

### Option A: Using GitHub
1. Go to https://github.com/new
2. Create a **PRIVATE** repository (recommended for security)
3. Name it: `biomathcore-platform`
4. Do NOT initialize with README (we already have files)

### Option B: Using GitLab
1. Go to https://gitlab.com/projects/new
2. Create a **PRIVATE** repository
3. Name it: `biomathcore-platform`

## Step 2: Download Project from Bolt.new

1. In Bolt.new, click the **Download** button (top right)
2. Save the ZIP file to your computer
3. Extract the ZIP file to a folder

## Step 3: Push to Git Repository

Open terminal in the extracted folder and run:

```bash
# Initialize Git (if not already)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - BioMath Core Platform"

# Add your remote repository (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/biomathcore-platform.git

# Push to repository
git push -u origin main
```

**Note:** If you get an error about branch name, try:
```bash
git branch -M main
git push -u origin main
```

## Step 4: Deploy to Vercel

### 4.1 Import Project
1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your `biomathcore-platform` repository
4. Click **"Import"**

### 4.2 Configure Project
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 4.3 Add Environment Variables

Click **"Environment Variables"** and add these variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://txnwvaqzmtlhefcxilfu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4bnd2YXF6bXRsaGVmY3hpbGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTUxNDEsImV4cCI6MjA3NjM5MTE0MX0.nvfoPz57lwSgiVJDwbZgwvlTJhsnHtk4nM1M-q2_snA

# THIS IS CRITICAL - Will be set after first deploy
# VITE_PUBLIC_URL=https://your-app.vercel.app

# Stripe Configuration - TEST MODE (recommended for testing)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_TEST_KEY_HERE

# Stripe Price IDs - Monthly
VITE_STRIPE_PRICE_DAILY_MONTHLY=price_1Ry1DrFeT62z7zOTWTEuqnQF
VITE_STRIPE_PRICE_CORE_MONTHLY=price_1Ry1B0FeT62z7zOTfpYzRVgK
VITE_STRIPE_PRICE_MAX_MONTHLY=price_1Ry1FRFeT62z7zOTRXDSDvmh

# Stripe Price IDs - Yearly
VITE_STRIPE_PRICE_DAILY_YEARLY=price_1Ry1ERFeT62z7zOTzqGU2Mb7
VITE_STRIPE_PRICE_CORE_YEARLY=price_1Ry1CeFeT62z7zOTtNyV6TRq
VITE_STRIPE_PRICE_MAX_YEARLY=price_1Ry1FyFeT62z7zOT2XxWrJPA

# Stripe Price IDs - Default
VITE_STRIPE_PRICE_DAILY=price_1Ry1DrFeT62z7zOTWTEuqnQF
VITE_STRIPE_PRICE_CORE=price_1Ry1B0FeT62z7zOTfpYzRVgK
VITE_STRIPE_PRICE_MAX=price_1Ry1FRFeT62z7zOTRXDSDvmh

# Stripe Configuration
VITE_STRIPE_CURRENCY=usd

# Email Configuration (mock for testing)
VITE_EMAIL_PROVIDER=mock
VITE_EMAIL_FROM=BioMath Core <no-reply@biomathcore.com>
VITE_EMAIL_REPLY_TO=support@biomathcore.com
```

**IMPORTANT:**
- Use Stripe **TEST keys** (start with `pk_test_`) for testing
- You'll add `VITE_PUBLIC_URL` in Step 5 after getting your Vercel URL

### 4.4 Deploy
Click **"Deploy"** and wait 2-3 minutes.

## Step 5: Configure Public URL

After deployment completes:

1. Vercel will show your URL, something like: `https://biomathcore-platform.vercel.app`
2. Go to **Settings → Environment Variables**
3. Add a NEW variable:
   ```
   VITE_PUBLIC_URL=https://biomathcore-platform.vercel.app
   ```
   (Replace with your actual Vercel URL)
4. Click **"Save"**
5. Go to **Deployments** tab
6. Click **"Redeploy"** on the latest deployment

## Step 6: Configure Supabase Edge Functions

Your Edge Functions need to know about the Vercel URL:

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Edge Functions**
4. For each function (`create-checkout-session`, `create-portal-session`, `stripe-webhook`):
   - No changes needed - they read URLs from request body

## Step 7: Test Stripe Integration

1. Open your Vercel URL: `https://your-app.vercel.app`
2. Sign in with your account
3. Go to **Pricing** page
4. Click **"Get Started"** on any plan
5. You'll be redirected to Stripe Checkout
6. Use Stripe test card: `4242 4242 4242 4242`
7. Complete the payment
8. You should be redirected back to Member Zone!

**Test Cards (Stripe Test Mode):**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0027 6000 3184`

## Step 8: Monitor and Debug

### View Logs
**Vercel Logs:**
- Dashboard → Your Project → Logs

**Supabase Edge Function Logs:**
- Dashboard → Edge Functions → Function Name → Logs

**Stripe Logs:**
- Dashboard → Developers → Logs

### Common Issues

**Issue: Redirect doesn't work after payment**
- Check that `VITE_PUBLIC_URL` is set correctly in Vercel
- Verify the URL matches your Vercel deployment URL exactly

**Issue: "Invalid API Key" in Stripe**
- Make sure you're using the correct Stripe keys (test vs live)
- Verify keys are saved in Vercel environment variables

**Issue: Database errors**
- Supabase credentials should be the same as in Bolt.new
- Check Supabase RLS policies are enabled

## Step 9: Going Live (When Ready)

When you're ready for production:

1. **Switch to Stripe Live Mode:**
   - Update `VITE_STRIPE_PUBLISHABLE_KEY` to `pk_live_...`
   - Update all price IDs to live price IDs

2. **Update Domain (optional):**
   - In Vercel: Settings → Domains
   - Add your custom domain (e.g., biomathcore.com)
   - Update `VITE_PUBLIC_URL` to your custom domain

3. **Enable Email Provider:**
   - Update `VITE_EMAIL_PROVIDER` to `resend`, `sendgrid`, or `ses`
   - Add provider API keys

## Future Updates

After initial deployment, to update your live site:

```bash
# Make changes in Bolt.new
# Download updated code
# Extract and navigate to folder

git add .
git commit -m "Description of changes"
git push

# Vercel will automatically deploy!
```

## Security Checklist

- [ ] Repository is PRIVATE
- [ ] `.env` file is in `.gitignore`
- [ ] Using Stripe TEST mode for testing
- [ ] All secrets are in Vercel Dashboard, not in code
- [ ] `VITE_PUBLIC_URL` is set correctly
- [ ] Edge Functions are deployed in Supabase
- [ ] RLS policies are enabled in database

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Supabase Edge Function logs
3. Check Stripe Dashboard logs
4. Check browser console for errors

---

**Ready to deploy? Follow the steps above!** 🚀

The entire process takes about 10-15 minutes.
