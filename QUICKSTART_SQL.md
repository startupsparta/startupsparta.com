# 🚀 QUICK START - Supabase SQL for Waitlist

## Step 1: Copy This SQL

Open your Supabase project:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" in the left sidebar
4. Click "New Query"
5. **Copy and paste the entire code below:**

---

```sql
-- ============================================================================
-- WAITLIST TABLE - Copy everything from here to the end
-- ============================================================================

-- Create waitlist table
create table public.waitlist (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Constraints
  constraint waitlist_email_format check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  constraint waitlist_email_length check (char_length(email) >= 5 and char_length(email) <= 255)
);

-- Index for faster email lookups
create index waitlist_email_idx on public.waitlist(email);
create index waitlist_status_idx on public.waitlist(status);
create index waitlist_created_at_idx on public.waitlist(created_at desc);

-- Updated_at trigger
create trigger handle_waitlist_updated_at
  before update on public.waitlist
  for each row
  execute function public.handle_updated_at();

-- Enable RLS
alter table public.waitlist enable row level security;

-- RLS Policies
-- Allow anyone to insert (join waitlist)
create policy "Allow public insert on waitlist"
  on public.waitlist for insert
  with check (true);

-- Allow public read access (to check if email already exists)
create policy "Allow public read access on waitlist"
  on public.waitlist for select
  using (true);

-- Only allow admin updates (for status changes)
create policy "Allow authenticated update on waitlist"
  on public.waitlist for update
  using (auth.role() = 'authenticated');
```

---

## Step 2: Run It

Click the **"Run"** button (or press Ctrl+Enter / Cmd+Enter)

You should see: `Success. No rows returned`

---

## Step 3: Verify

Run this query to check it worked:

```sql
SELECT * FROM waitlist;
```

Should return an empty table with columns: `id`, `email`, `status`, `created_at`, `updated_at`

---

## Step 4: Test

Now try adding a test email via the API or directly:

```sql
INSERT INTO waitlist (email, status) 
VALUES ('test@example.com', 'pending');
```

Then check:

```sql
SELECT * FROM waitlist;
```

---

## 🎉 Done!

Your waitlist is ready. Users can now:
1. Visit your site at `/waitlist`
2. Enter their email
3. Join the waitlist

---

## Quick Management Queries

### View all entries:
```sql
SELECT email, status, created_at 
FROM waitlist 
ORDER BY created_at DESC;
```

### Count by status:
```sql
SELECT status, COUNT(*) 
FROM waitlist 
GROUP BY status;
```

### Approve an email:
```sql
UPDATE waitlist 
SET status = 'approved' 
WHERE email = 'user@example.com';
```

### Export approved emails:
```sql
SELECT email 
FROM waitlist 
WHERE status = 'approved'
ORDER BY created_at ASC;
```

---

## Troubleshooting

**Error: "relation already exists"**
- Table already created, you're good!

**Error: "function handle_updated_at does not exist"**
- Run the main schema.sql first (creates the function)
- Or add this before creating the table:
```sql
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;
```

---

## What's Next?

The waitlist feature is now live at: **`/waitlist`**

Test it: `http://localhost:3000/waitlist` (or your production URL)
