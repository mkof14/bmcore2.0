# Disaster Recovery & Restore Procedures

## Database Restore

### Supabase Point-in-Time Recovery

Supabase provides automatic backups with point-in-time recovery (PITR) for the last 7 days.

**Steps:**

1. **Access Supabase Dashboard**
   ```
   https://app.supabase.com/project/[project-id]/database/backups
   ```

2. **Select Restore Point**
   - Choose the timestamp to restore from
   - Review affected tables and data

3. **Create Restore Job**
   ```sql
   -- Supabase will create a new database with restored data
   -- Connect to the restored instance for verification
   ```

4. **Verify Data Integrity**
   ```sql
   -- Check critical tables
   SELECT COUNT(*) FROM profiles;
   SELECT COUNT(*) FROM user_subscriptions WHERE status = 'active';
   SELECT COUNT(*) FROM health_data WHERE created_at > NOW() - INTERVAL '24 hours';
   ```

5. **Update Connection Strings**
   - Update `VITE_SUPABASE_URL` in Vercel environment variables
   - Redeploy application

### Manual Backup Restore

If using pg_dump backups:

```bash
# Restore from dump
pg_restore -h db.supabase.co -p 5432 -U postgres -d postgres backup.dump

# Or from SQL file
psql -h db.supabase.co -p 5432 -U postgres -d postgres -f backup.sql
```

## Key Vault Restore

### Backup Key Vault

**Before any major changes:**

```bash
# Export encrypted keys (requires admin access)
curl -X GET https://biomathcore.com/api/vault/export \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -o vault_backup_$(date +%Y%m%d).json
```

### Restore Keys

```bash
# Import keys from backup
curl -X POST https://biomathcore.com/api/vault/import \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @vault_backup_20251102.json
```

### Manual Key Re-entry

If backup is unavailable:

1. Access Admin Panel → API Keys Management
2. Re-enter each key:
   - Stripe Secret Key
   - Stripe Webhook Secret
   - OpenAI API Key
   - Anthropic API Key
   - Gemini API Key
3. Test each key after entry
4. Verify "Applied" status

## Environment Variables Restore

### Pull from Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull .env.production
```

### Critical Variables Checklist

- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY`
- [ ] `BMC_KMS_KEY` (encryption key)
- [ ] `VERCEL_TOKEN` (for secrets bridge)

## Feature Flags Restore

Feature flags are stored in database and automatically restored with database.

**Verify after restore:**

```sql
SELECT flag_key, enabled FROM feature_flags;
```

If missing, re-run migration:

```bash
npx supabase db reset --linked
```

## File Storage Restore

Supabase Storage is automatically backed up. For manual restore:

```bash
# List buckets
supabase storage list

# Download all files from a bucket
supabase storage download --bucket profile-pictures --all
```

## Verification Checklist

After restore, verify:

- [ ] Database connection works
- [ ] User authentication works
- [ ] Stripe webhooks receive events
- [ ] AI services respond (test mode)
- [ ] Key vault keys are accessible
- [ ] Feature flags are correct
- [ ] Admin panel accessible
- [ ] Health check passes: `/api/health`
- [ ] Dependencies check passes: `/api/deps`

## Rollback to Previous Version

### Vercel Rollback

```bash
# List recent deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

Or via Vercel Dashboard:
1. Go to Deployments
2. Find stable deployment
3. Click "Promote to Production"

### Database Schema Rollback

```bash
# Revert last migration
npx supabase migration revert

# Or apply specific migration
npx supabase migration apply [timestamp]
```

## Recovery Time Objectives (RTO)

- **Database PITR**: 15-30 minutes
- **Full system restore**: 1-2 hours
- **Key vault restore**: 10-15 minutes
- **Vercel rollback**: 2-5 minutes

## Emergency Contacts

- **Database Issues**: Supabase Support (support@supabase.io)
- **Hosting Issues**: Vercel Support (support@vercel.com)
- **On-call Engineer**: [Your contact info]

## Post-Restore Actions

1. Notify users of any service interruption
2. Review audit logs for anomalies
3. Document incident in `/docs/ops/incidents/`
4. Update runbook with lessons learned
5. Test all critical flows
6. Monitor error rates for 24 hours

## Regular Backup Schedule

- **Database**: Automatic daily (Supabase)
- **Key Vault**: Weekly manual export
- **Environment Config**: Monthly verification
- **Code Repository**: Continuous (GitHub)

## Testing Restores

**Quarterly restore drill:**

1. Schedule maintenance window
2. Create staging restore
3. Verify all functionality
4. Document any issues
5. Update procedures as needed
