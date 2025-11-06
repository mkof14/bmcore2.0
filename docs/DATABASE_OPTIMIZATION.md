# Database Optimization Guide

## Indexes Already Applied

The following indexes have been applied through Supabase migrations:

### Core Tables

**profiles**
- Primary key: `id` (uuid)
- Indexed: `email` (unique)
- Foreign key indexes automatically created by PostgreSQL

**user_subscriptions**
- Primary key: `id` (uuid)
- Indexed: `user_id`, `stripe_subscription_id`, `status`
- Composite index: `(user_id, status)` for fast active subscription lookups

**health_data**
- Primary key: `id` (uuid)
- Indexed: `user_id`, `created_at`
- Composite index: `(user_id, created_at DESC)` for timeline queries

**reports**
- Primary key: `id` (uuid)
- Indexed: `user_id`, `created_at`, `status`
- Composite index: `(user_id, status, created_at DESC)`

**ai_conversations**
- Primary key: `id` (uuid)
- Indexed: `user_id`, `created_at`

**device_connections**
- Primary key: `id` (uuid)
- Indexed: `user_id`, `device_type`, `status`

## Query Optimization Best Practices

### 1. Use Selective Queries

```typescript
const { data } = await supabase
  .from('profiles')
  .select('id, email, full_name')
  .eq('id', userId)
  .maybeSingle();
```

### 2. Avoid N+1 Queries

```typescript
const { data: subscriptions } = await supabase
  .from('user_subscriptions')
  .select(`
    *,
    profiles (
      id,
      email,
      full_name
    )
  `)
  .eq('status', 'active');
```

### 3. Use Pagination

```typescript
const { data, error, count } = await supabase
  .from('reports')
  .select('*', { count: 'exact' })
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .range(start, end);
```

### 4. Filter Before Join

```typescript
const { data } = await supabase
  .from('health_data')
  .select(`
    *,
    reports!inner (
      id,
      status
    )
  `)
  .eq('reports.status', 'completed')
  .eq('user_id', userId);
```

## Performance Monitoring

### Check Query Performance

```sql
EXPLAIN ANALYZE
SELECT *
FROM health_data
WHERE user_id = 'uuid-here'
AND created_at > NOW() - INTERVAL '30 days'
ORDER BY created_at DESC
LIMIT 20;
```

### Monitor Slow Queries

```sql
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC
LIMIT 10;
```

## Recommended Additional Indexes

If query performance degrades, consider these indexes:

```sql
CREATE INDEX CONCURRENTLY idx_reports_user_type_created
ON reports (user_id, report_type, created_at DESC)
WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY idx_analytics_events_created
ON analytics_events (created_at DESC)
WHERE created_at > NOW() - INTERVAL '90 days';

CREATE INDEX CONCURRENTLY idx_email_logs_status_created
ON email_logs (status, created_at DESC);
```

## RLS Performance

Row Level Security policies are optimized with:
1. Simple user_id checks
2. Index usage on filtered columns
3. No complex joins in policies
4. Cached policy evaluation

## Connection Pooling

Supabase automatically handles connection pooling. For high-load scenarios:

- Use Supabase's connection pooler (port 6543)
- Set appropriate timeout values
- Monitor active connections in Supabase dashboard

## Cache Strategy

### Client-Side
- Use React Query with stale-while-revalidate
- Cache user profile and subscription data
- Invalidate on mutations

### Server-Side
- Use Supabase's built-in caching
- Set appropriate `cache` options in fetch calls
- Consider Redis for hot data (future enhancement)

## Maintenance

### Vacuum and Analyze

Supabase handles automatic vacuum. For manual optimization:

```sql
VACUUM ANALYZE profiles;
VACUUM ANALYZE user_subscriptions;
VACUUM ANALYZE health_data;
```

### Index Maintenance

```sql
-- Reindex if fragmented
REINDEX TABLE reports;

-- Check index bloat
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Performance Targets

- **List queries**: < 200ms
- **Single record**: < 50ms
- **Complex joins**: < 500ms
- **Aggregations**: < 1000ms

Monitor these targets and optimize queries that exceed thresholds.
