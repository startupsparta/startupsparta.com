# Waitlist Setup Guide

This guide explains how to set up the waitlist functionality for StartupSparta.

## Database Setup

The waitlist feature requires a `waitlist` table in your Supabase database.

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/20260214_create_waitlist_table.sql`
4. Click "Run" to execute the migration

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase migration up
```

## Table Structure

The `waitlist` table includes:
- `id` (UUID): Primary key
- `email` (TEXT): User's email address (unique)
- `created_at` (TIMESTAMPTZ): When the user joined
- `metadata` (JSONB): Optional additional data

## Security

Row Level Security (RLS) is enabled with the following policies:
- Anonymous users can INSERT (join the waitlist)
- Authenticated users can SELECT (view waitlist entries)

## Testing

To test the waitlist functionality:

1. Visit http://localhost:3000
2. Enter an email address in the waitlist form
3. Click "Join Waitlist"
4. Check your Supabase dashboard to verify the entry was created

## Viewing Waitlist Entries

You can view all waitlist entries in the Supabase dashboard:

1. Go to Table Editor
2. Select the `waitlist` table
3. View all email addresses and signup dates

Or query via SQL:

```sql
SELECT email, created_at 
FROM waitlist 
ORDER BY created_at DESC;
```

## Exporting Waitlist

To export the waitlist for email campaigns:

```sql
COPY (
  SELECT email, created_at 
  FROM waitlist 
  ORDER BY created_at DESC
) TO '/tmp/waitlist.csv' WITH CSV HEADER;
```

Or use the Supabase dashboard export feature.
