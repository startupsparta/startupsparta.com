-- ============================================================================
-- WAITLIST TABLE
-- ============================================================================
-- Copy and paste this into your Supabase SQL Editor

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
-- Note: You might want to restrict this further based on your auth setup
create policy "Allow authenticated update on waitlist"
  on public.waitlist for update
  using (auth.role() = 'authenticated');

-- Comment for documentation
comment on table public.waitlist is 'Stores email addresses of users who want to join the waitlist';
comment on column public.waitlist.email is 'User email address (unique)';
comment on column public.waitlist.status is 'Status: pending, approved, or rejected';
