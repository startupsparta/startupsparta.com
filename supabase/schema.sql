-- StartupSparta Database Schema (Refined)
-- Run this in your Supabase SQL editor
-- This is a refined version with improved constraints, indexes, RLS policies, and additional features

-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- For text search

-- ============================================================================
-- TOKENS TABLE
-- ============================================================================
create table public.tokens (
  id uuid default uuid_generate_v4() primary key,
  mint_address text unique not null,
  name text not null,
  symbol text not null,
  description text not null,
  image_url text not null,
  banner_url text,
  website text,
  telegram text,
  twitter text,
  linkedin text,
  product_video_url text,
  founder_video_url text,
  creator_wallet text not null,
  bonding_curve_address text not null,
  total_supply bigint not null default 1000000000,
  current_supply bigint not null default 0,
  sol_reserves numeric(20, 9) not null default 0,
  market_cap numeric(20, 9) not null default 0,
  transaction_count integer not null default 0,
  holder_count integer not null default 0,
  status text not null default 'active' check (status in ('active', 'paused', 'graduated', 'delisted')),
  verified boolean not null default false,
  featured boolean not null default false,
  graduated boolean not null default false,
  raydium_pool_address text,
  graduation_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  deleted_at timestamp with time zone,
  
  -- Constraints
  constraint tokens_name_length check (char_length(name) >= 1 and char_length(name) <= 100),
  constraint tokens_symbol_length check (char_length(symbol) >= 1 and char_length(symbol) <= 10),
  constraint tokens_description_length check (char_length(description) >= 10 and char_length(description) <= 5000),
  constraint tokens_total_supply_positive check (total_supply > 0),
  constraint tokens_current_supply_non_negative check (current_supply >= 0),
  constraint tokens_current_supply_lte_total check (current_supply <= total_supply),
  constraint tokens_sol_reserves_non_negative check (sol_reserves >= 0),
  constraint tokens_market_cap_non_negative check (market_cap >= 0),
  constraint tokens_transaction_count_non_negative check (transaction_count >= 0),
  constraint tokens_holder_count_non_negative check (holder_count >= 0),
  constraint tokens_mint_address_format check (mint_address ~ '^[1-9A-HJ-NP-Za-km-z]{32,44}$'),
  constraint tokens_creator_wallet_format check (creator_wallet ~ '^[1-9A-HJ-NP-Za-km-z]{32,44}$'),
  constraint tokens_bonding_curve_address_format check (bonding_curve_address ~ '^[1-9A-HJ-NP-Za-km-z]{32,44}$')
);

-- ============================================================================
-- FOUNDERS TABLE
-- ============================================================================
create table public.founders (
  id uuid default uuid_generate_v4() primary key,
  token_id uuid references public.tokens(id) on delete cascade not null,
  name text not null,
  social_url text,
  "order" integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Constraints
  constraint founders_name_length check (char_length(name) >= 1 and char_length(name) <= 200),
  constraint founders_order_non_negative check ("order" >= 0),
  constraint founders_unique_token_order unique(token_id, "order")
);

-- ============================================================================
-- TRANSACTIONS TABLE
-- ============================================================================
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  token_id uuid references public.tokens(id) on delete cascade not null,
  wallet_address text not null,
  type text not null check (type in ('buy', 'sell')),
  sol_amount numeric(20, 9) not null,
  token_amount bigint not null,
  price_per_token numeric(20, 9) not null,
  signature text unique not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Constraints
  constraint transactions_sol_amount_positive check (sol_amount > 0),
  constraint transactions_token_amount_positive check (token_amount > 0),
  constraint transactions_price_per_token_positive check (price_per_token > 0),
  constraint transactions_wallet_address_format check (wallet_address ~ '^[1-9A-HJ-NP-Za-km-z]{32,44}$'),
  constraint transactions_signature_format check (signature ~ '^[1-9A-HJ-NP-Za-km-z]{64,88}$')
);

-- ============================================================================
-- HOLDERS TABLE
-- ============================================================================
create table public.holders (
  id uuid default uuid_generate_v4() primary key,
  token_id uuid references public.tokens(id) on delete cascade not null,
  wallet_address text not null,
  balance bigint not null default 0,
  avg_buy_price numeric(20, 9) not null default 0,
  total_bought_sol numeric(20, 9) not null default 0,
  total_sold_sol numeric(20, 9) not null default 0,
  first_purchase_at timestamp with time zone,
  last_purchase_at timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  unique(token_id, wallet_address),
  
  -- Constraints
  constraint holders_balance_non_negative check (balance >= 0),
  constraint holders_avg_buy_price_non_negative check (avg_buy_price >= 0),
  constraint holders_total_bought_sol_non_negative check (total_bought_sol >= 0),
  constraint holders_total_sold_sol_non_negative check (total_sold_sol >= 0),
  constraint holders_wallet_address_format check (wallet_address ~ '^[1-9A-HJ-NP-Za-km-z]{32,44}$')
);

-- ============================================================================
-- COMMENTS TABLE
-- ============================================================================
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  token_id uuid references public.tokens(id) on delete cascade not null,
  wallet_address text not null,
  username text,
  content text not null,
  parent_id uuid references public.comments(id) on delete cascade,
  likes_count integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  deleted_at timestamp with time zone,
  
  -- Constraints
  constraint comments_content_length check (char_length(content) >= 1 and char_length(content) <= 5000),
  constraint comments_likes_count_non_negative check (likes_count >= 0),
  constraint comments_wallet_address_format check (wallet_address ~ '^[1-9A-HJ-NP-Za-km-z]{32,44}$')
);

-- ============================================================================
-- COMMENT LIKES TABLE (New)
-- ============================================================================
create table public.comment_likes (
  id uuid default uuid_generate_v4() primary key,
  comment_id uuid references public.comments(id) on delete cascade not null,
  wallet_address text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  unique(comment_id, wallet_address),
  
  -- Constraints
  constraint comment_likes_wallet_address_format check (wallet_address ~ '^[1-9A-HJ-NP-Za-km-z]{32,44}$')
);

-- ============================================================================
-- USERS TABLE
-- ============================================================================
create table public.users (
  id uuid default uuid_generate_v4() primary key,
  wallet_address text unique not null,
  username text,
  bio text,
  website text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Constraints
  constraint users_username_length check (username is null or (char_length(username) >= 1 and char_length(username) <= 50)),
  constraint users_bio_length check (bio is null or char_length(bio) <= 500),
  constraint users_wallet_address_format check (wallet_address ~ '^[1-9A-HJ-NP-Za-km-z]{32,44}$')
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Tokens indexes
create index tokens_mint_address_idx on public.tokens(mint_address);
create index tokens_creator_wallet_idx on public.tokens(creator_wallet);
create index tokens_created_at_idx on public.tokens(created_at desc);
create index tokens_market_cap_idx on public.tokens(market_cap desc) where deleted_at is null;
create index tokens_graduated_idx on public.tokens(graduated) where graduated = true;
create index tokens_status_idx on public.tokens(status) where deleted_at is null;
create index tokens_verified_idx on public.tokens(verified) where verified = true and deleted_at is null;
create index tokens_featured_idx on public.tokens(featured) where featured = true and deleted_at is null;
create index tokens_active_idx on public.tokens(created_at desc, market_cap desc) where status = 'active' and deleted_at is null;
-- Text search index (using trigram for fuzzy search)
create index tokens_name_trgm_idx on public.tokens using gin(name gin_trgm_ops) where deleted_at is null;
create index tokens_symbol_trgm_idx on public.tokens using gin(symbol gin_trgm_ops) where deleted_at is null;

-- Founders indexes
create index founders_token_id_idx on public.founders(token_id);
create index founders_token_order_idx on public.founders(token_id, "order");

-- Transactions indexes
create index transactions_token_id_idx on public.transactions(token_id);
create index transactions_wallet_address_idx on public.transactions(wallet_address);
create index transactions_timestamp_idx on public.transactions(timestamp desc);
create index transactions_token_timestamp_idx on public.transactions(token_id, timestamp desc);
create index transactions_type_idx on public.transactions(type, timestamp desc);
create index transactions_signature_idx on public.transactions(signature);

-- Holders indexes
create index holders_token_id_idx on public.holders(token_id);
create index holders_wallet_address_idx on public.holders(wallet_address);
create index holders_balance_idx on public.holders(balance desc);
create index holders_token_balance_idx on public.holders(token_id, balance desc);
create index holders_wallet_tokens_idx on public.holders(wallet_address, balance desc) where balance > 0;

-- Comments indexes
create index comments_token_id_idx on public.comments(token_id);
create index comments_parent_id_idx on public.comments(parent_id);
create index comments_wallet_address_idx on public.comments(wallet_address);
create index comments_token_created_idx on public.comments(token_id, created_at desc) where deleted_at is null;
create index comments_likes_idx on public.comments(likes_count desc) where deleted_at is null;

-- Comment likes indexes
create index comment_likes_comment_id_idx on public.comment_likes(comment_id);
create index comment_likes_wallet_address_idx on public.comment_likes(wallet_address);

-- Users indexes
create index users_wallet_address_idx on public.users(wallet_address);
create index users_username_idx on public.users(username) where username is not null;

-- ============================================================================
-- TRIGGER FUNCTIONS
-- ============================================================================

-- Updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Function to update token statistics
create or replace function public.update_token_stats()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    -- Update transaction count
    update public.tokens
    set transaction_count = transaction_count + 1
    where id = new.token_id;
    
    -- Update holder count if new holder
    insert into public.holders (token_id, wallet_address, balance, first_purchase_at, last_purchase_at)
    values (new.token_id, new.wallet_address, 
            case when new.type = 'buy' then new.token_amount else -new.token_amount end,
            case when new.type = 'buy' then new.timestamp else null end,
            case when new.type = 'buy' then new.timestamp else null end)
    on conflict (token_id, wallet_address) 
    do update set
      balance = holders.balance + case when new.type = 'buy' then new.token_amount else -new.token_amount end,
      last_purchase_at = case when new.type = 'buy' then new.timestamp else holders.last_purchase_at end,
      updated_at = now();
    
    -- Update holder count
    update public.tokens
    set holder_count = (
      select count(distinct wallet_address)
      from public.holders
      where token_id = new.token_id and balance > 0
    )
    where id = new.token_id;
    
  elsif tg_op = 'UPDATE' then
    -- Handle updates if needed
    null;
  end if;
  
  return new;
end;
$$ language plpgsql security definer;

-- Function to update comment likes count
create or replace function public.update_comment_likes_count()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    update public.comments
    set likes_count = likes_count + 1
    where id = new.comment_id;
  elsif tg_op = 'DELETE' then
    update public.comments
    set likes_count = likes_count - 1
    where id = old.comment_id;
  end if;
  
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Updated_at triggers
create trigger handle_tokens_updated_at
  before update on public.tokens
  for each row
  execute function public.handle_updated_at();

create trigger handle_holders_updated_at
  before update on public.holders
  for each row
  execute function public.handle_updated_at();

create trigger handle_comments_updated_at
  before update on public.comments
  for each row
  execute function public.handle_updated_at();

create trigger handle_users_updated_at
  before update on public.users
  for each row
  execute function public.handle_updated_at();

-- Transaction statistics triggers
create trigger update_token_stats_on_transaction
  after insert on public.transactions
  for each row
  execute function public.update_token_stats();

-- Comment likes triggers
create trigger update_comment_likes_on_insert
  after insert on public.comment_likes
  for each row
  execute function public.update_comment_likes_count();

create trigger update_comment_likes_on_delete
  after delete on public.comment_likes
  for each row
  execute function public.update_comment_likes_count();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Token statistics view
create or replace view public.token_stats as
select 
  t.id,
  t.mint_address,
  t.name,
  t.symbol,
  t.market_cap,
  t.sol_reserves,
  t.current_supply,
  t.total_supply,
  t.transaction_count,
  t.holder_count,
  t.graduated,
  t.verified,
  t.featured,
  t.status,
  t.created_at,
  coalesce((
    select sum(sol_amount)
    from public.transactions
    where token_id = t.id and type = 'buy'
  ), 0) as total_volume_sol,
  coalesce((
    select avg(price_per_token)
    from public.transactions
    where token_id = t.id
    and timestamp > now() - interval '24 hours'
  ), 0) as avg_price_24h,
  coalesce((
    select count(*)
    from public.transactions
    where token_id = t.id
    and timestamp > now() - interval '24 hours'
  ), 0) as transactions_24h
from public.tokens t
where t.deleted_at is null;

-- Popular tokens view (by market cap and activity)
create or replace view public.popular_tokens as
select *
from public.token_stats
where status = 'active'
order by market_cap desc, transaction_count desc
limit 100;

-- User portfolio view
create or replace view public.user_portfolio as
select 
  h.wallet_address,
  h.token_id,
  t.mint_address,
  t.name,
  t.symbol,
  t.image_url,
  h.balance,
  h.avg_buy_price,
  h.total_bought_sol,
  h.total_sold_sol,
  t.market_cap,
  t.current_supply,
  case 
    when t.current_supply > 0 
    then (h.balance::numeric / t.current_supply::numeric) * t.market_cap
    else 0
  end as estimated_value_sol,
  h.first_purchase_at,
  h.last_purchase_at
from public.holders h
join public.tokens t on h.token_id = t.id
where h.balance > 0
  and t.deleted_at is null;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

alter table public.tokens enable row level security;
alter table public.founders enable row level security;
alter table public.transactions enable row level security;
alter table public.holders enable row level security;
alter table public.comments enable row level security;
alter table public.comment_likes enable row level security;
alter table public.users enable row level security;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Tokens policies
create policy "Allow public read access on active tokens"
  on public.tokens for select
  using (deleted_at is null);

create policy "Allow authenticated insert on tokens"
  on public.tokens for insert
  with check (true);

create policy "Allow token creator to update their tokens"
  on public.tokens for update
  using (auth.jwt() ->> 'wallet_address' = creator_wallet::text);

-- Founders policies
create policy "Allow public read access on founders"
  on public.founders for select
  using (true);

create policy "Allow authenticated insert on founders"
  on public.founders for insert
  with check (true);

create policy "Allow token creator to update founders"
  on public.founders for update
  using (
    exists (
      select 1 from public.tokens
      where tokens.id = founders.token_id
      and tokens.creator_wallet = (auth.jwt() ->> 'wallet_address')::text
    )
  );

-- Transactions policies
create policy "Allow public read access on transactions"
  on public.transactions for select
  using (true);

create policy "Allow authenticated insert on transactions"
  on public.transactions for insert
  with check (true);

-- Holders policies
create policy "Allow public read access on holders"
  on public.holders for select
  using (true);

create policy "Allow authenticated insert/update on holders"
  on public.holders for all
  using (true);

-- Comments policies
create policy "Allow public read access on active comments"
  on public.comments for select
  using (deleted_at is null);

create policy "Allow authenticated insert on comments"
  on public.comments for insert
  with check (true);

create policy "Allow comment author to update their comments"
  on public.comments for update
  using (auth.jwt() ->> 'wallet_address' = wallet_address::text);

create policy "Allow comment author to delete their comments"
  on public.comments for update
  using (auth.jwt() ->> 'wallet_address' = wallet_address::text);

-- Comment likes policies
create policy "Allow public read access on comment likes"
  on public.comment_likes for select
  using (true);

create policy "Allow authenticated insert on comment likes"
  on public.comment_likes for insert
  with check (true);

create policy "Allow users to delete their own comment likes"
  on public.comment_likes for delete
  using (auth.jwt() ->> 'wallet_address' = wallet_address::text);

-- Users policies
create policy "Allow public read access on users"
  on public.users for select
  using (true);

create policy "Allow authenticated insert on users"
  on public.users for insert
  with check (true);

create policy "Allow users to update their own profile"
  on public.users for update
  using (auth.jwt() ->> 'wallet_address' = wallet_address::text);

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

-- Create storage buckets (with error handling)
do $$
begin
  insert into storage.buckets (id, name, public)
  values 
    ('logos', 'logos', true),
    ('banners', 'banners', true),
    ('videos', 'videos', true),
    ('avatars', 'avatars', true)
  on conflict (id) do nothing;
end $$;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Logos policies
create policy "Allow public read access to logos"
  on storage.objects for select
  using (bucket_id = 'logos');

create policy "Allow authenticated uploads to logos"
  on storage.objects for insert
  with check (bucket_id = 'logos');

-- Banners policies
create policy "Allow public read access to banners"
  on storage.objects for select
  using (bucket_id = 'banners');

create policy "Allow authenticated uploads to banners"
  on storage.objects for insert
  with check (bucket_id = 'banners');

-- Videos policies
create policy "Allow public read access to videos"
  on storage.objects for select
  using (bucket_id = 'videos');

create policy "Allow authenticated uploads to videos"
  on storage.objects for insert
  with check (bucket_id = 'videos');

-- Avatars policies
create policy "Allow public read access to avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Allow authenticated uploads to avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars');

create policy "Allow users to update their own avatars"
  on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.jwt() ->> 'wallet_address');

create policy "Allow users to delete their own avatars"
  on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.jwt() ->> 'wallet_address');

-- ============================================================================
-- WAITLIST TABLE
-- ============================================================================
create table public.waitlist (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint waitlist_email_format check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Waitlist indexes
create index waitlist_email_idx on public.waitlist(email);
create index waitlist_created_at_idx on public.waitlist(created_at desc);

-- Waitlist RLS
alter table public.waitlist enable row level security;

-- Allow anyone to insert to waitlist (for public signup)
create policy "Allow public insert on waitlist"
  on public.waitlist for insert
  with check (true);

-- Note: Admin access to read waitlist data should be implemented separately
-- through a secure backend service with proper authentication, not through RLS.
-- For now, all read access is blocked to protect user privacy.
