# Incident Response Runbook

## Incident Severity Levels

### P0 - Critical
- **Impact**: Complete service outage or data loss
- **Response**: Immediate, 24/7
- **Examples**: Database down, payment processing broken, security breach

### P1 - High
- **Impact**: Major feature broken, significant user impact
- **Response**: Within 1 hour, business hours
- **Examples**: Authentication failing, reports not generating, AI services down

### P2 - Medium
- **Impact**: Minor feature degraded, limited user impact
- **Response**: Within 4 hours, business hours
- **Examples**: Slow page load, minor UI bugs, notification delays

### P3 - Low
- **Impact**: Cosmetic issues, no functional impact
- **Response**: Next sprint
- **Examples**: Typos, minor styling issues, non-critical improvements

## Incident Response Flow

```
Detection → Triage → Response → Resolution → Postmortem
```

## Detection

### Automated Monitoring

- Health check failures: `/api/health`
- Dependency check failures: `/api/deps`
- Error rate alerts (>5%)
- Response time alerts (>1000ms)
- Stripe webhook failures
- Failed database queries

### Manual Detection

- User reports via support
- Team member observations
- Social media mentions
- Status page checks

## Triage (< 5 minutes)

### Assessment Questions

1. **What is broken?**
   - Specific feature or entire service?
   - User-facing or backend?

2. **How many users affected?**
   - All users or subset?
   - Specific plan/region?

3. **Is data at risk?**
   - Data loss occurring?
   - Security implications?

4. **What changed recently?**
   - Recent deployment?
   - Configuration change?
   - External service issue?

### Severity Assignment

Use decision matrix:

```
          │ Data Risk │ No Data Risk
──────────┼───────────┼─────────────
All Users │    P0     │     P1
Some Users│    P1     │     P2
```

## Initial Response (< 10 minutes)

### P0 Response

1. **Declare incident**
   ```bash
   # Create incident channel
   # Notify on-call team
   # Start incident log
   ```

2. **Assess rollback**
   - Can we rollback safely?
   - Is database migration involved?
   - See [rollback.md](./rollback.md)

3. **Communication**
   - Update status page
   - Send user notification
   - Notify stakeholders

### P1 Response

1. **Create incident ticket**
2. **Assign incident commander**
3. **Gather initial data**
4. **Plan response**

## Investigation

### Data Collection

```bash
# Check recent deployments
vercel ls --prod | head -5

# View recent logs
vercel logs [deployment-url] --limit 100

# Check database status
psql -h [supabase-host] -c "SELECT NOW();"

# Test external services
curl https://api.stripe.com/v1/charges -u $STRIPE_SECRET_KEY:
curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_KEY"
```

### Common Issues Checklist

- [ ] Recent deployment introduced bug
- [ ] Configuration change caused issue
- [ ] External service (Stripe/OpenAI/Supabase) degraded
- [ ] Database connection pool exhausted
- [ ] Rate limit hit
- [ ] Certificate expired
- [ ] DNS propagation delay

## Mitigation Strategies

### Quick Wins (< 5 minutes)

1. **Feature flag toggle**
   ```sql
   UPDATE feature_flags SET enabled = false WHERE flag_key = 'problematic.feature';
   ```

2. **Kill switch activation**
   ```sql
   UPDATE feature_flags SET enabled = true WHERE flag_key LIKE 'killswitch.%';
   ```

3. **Vercel rollback**
   ```bash
   vercel rollback [previous-deployment]
   ```

### Temporary Workarounds

1. **Redirect to maintenance page**
2. **Disable non-critical features**
3. **Increase resource limits**
4. **Manual processing of stuck jobs**

## Communication Templates

### P0 Initial Alert

```
🚨 INCIDENT: Service Outage

Severity: P0
Status: Investigating
Started: [timestamp]

Impact:
- [Brief description]
- Affected users: [estimate]

Actions:
- Incident commander: [name]
- Investigating: [team]

Updates: Every 15 minutes
Next update: [time]
```

### Status Update

```
📊 INCIDENT UPDATE

Time: [timestamp]
Status: [Investigating/Mitigating/Resolved]

Progress:
- [What we've learned]
- [Actions taken]
- [Current status]

Next steps:
- [Planned actions]

ETA: [estimate or "unknown"]
Next update: [time]
```

### Resolution Notice

```
✅ INCIDENT RESOLVED

Incident: [brief description]
Duration: [start time] - [end time]
Total: [duration]

Root cause:
[Brief explanation]

Resolution:
[What fixed it]

Prevention:
- [Actions to prevent recurrence]

Postmortem: [date/link]

Thank you for your patience.
```

## Resolution

### Verification Steps

1. **Health checks pass**
   ```bash
   curl https://biomathcore.com/api/health
   curl https://biomathcore.com/api/deps
   ```

2. **Key flows working**
   - User authentication
   - Payment processing (test mode)
   - AI features responding
   - Report generation

3. **Monitoring stable**
   - Error rate < 1%
   - Response time normal
   - No new alerts

4. **User confirmation**
   - Test with affected users
   - Check support tickets
   - Monitor social media

### Incident Close

```bash
# Mark incident as resolved
# Schedule postmortem
# Update status page
# Thank the team
```

## Postmortem (Within 48 hours)

### Postmortem Template

```markdown
# Incident Postmortem: [Brief Title]

**Date**: [date]
**Severity**: P0/P1/P2
**Duration**: [X hours Y minutes]
**Impact**: [X users affected, Y transactions failed]

## Timeline

- [time]: Issue detected
- [time]: Incident declared
- [time]: Root cause identified
- [time]: Fix deployed
- [time]: Incident resolved

## Root Cause

[Detailed technical explanation]

## Contributing Factors

1. [Factor 1]
2. [Factor 2]

## What Went Well

- [Positive aspect 1]
- [Positive aspect 2]

## What Could Be Improved

- [Area for improvement 1]
- [Area for improvement 2]

## Action Items

- [ ] [Action 1] - Owner: [name], Due: [date]
- [ ] [Action 2] - Owner: [name], Due: [date]

## Lessons Learned

[Key takeaways]
```

## RACI Matrix

| Role | Incident Commander | On-Call Engineer | Team Lead | Users |
|------|-------------------|------------------|-----------|-------|
| Declare incident | R | C | I | - |
| Technical investigation | A | R | C | - |
| Communication | R | C | I | I |
| Decision to rollback | A | C | I | - |
| Postmortem | A | C | I | - |

**R** = Responsible, **A** = Accountable, **C** = Consulted, **I** = Informed

## Contacts & Escalation

### On-Call Rotation

- Primary: [Engineer 1] - [contact]
- Secondary: [Engineer 2] - [contact]
- Escalation: [Tech Lead] - [contact]

### External Support

- Vercel Support: support@vercel.com
- Supabase Support: support@supabase.io
- Stripe Support: https://support.stripe.com

### Communication Channels

- Incident Channel: #incidents
- Status Updates: https://status.biomathcore.com
- User Notifications: Email + In-app banner

## Tools & Resources

- **Monitoring**: Vercel Analytics, Supabase Dashboard
- **Logs**: Vercel Logs, Supabase Logs
- **Status Page**: [URL if exists]
- **Runbooks**: `/docs/ops/`

## Practice & Drills

Quarterly incident drill:
1. Simulate P1 incident
2. Practice response procedures
3. Test communication
4. Review and improve

## Key Metrics

Track for each incident:
- Time to detect (TTD)
- Time to acknowledge (TTA)
- Time to mitigate (TTM)
- Time to resolve (TTR)

**Target**: TTR < 1 hour for P1

## Continuous Improvement

After each incident:
1. Update this runbook
2. Add new monitoring
3. Improve automation
4. Enhance testing
5. Train team
