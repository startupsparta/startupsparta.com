-- Add percentage column to holders table (if not exists)
ALTER TABLE holders ADD COLUMN IF NOT EXISTS percentage NUMERIC(5, 2);

-- Create watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_wallet TEXT NOT NULL,
  token_id UUID REFERENCES tokens(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint: one user can only watchlist a token once
  UNIQUE(user_wallet, token_id),
  
  -- Wallet address format validation
  CONSTRAINT watchlist_user_wallet_format CHECK (user_wallet ~ '^[1-9A-HJ-NP-Za-km-z]{32,44}$')
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_watchlist_user ON watchlist(user_wallet);
CREATE INDEX IF NOT EXISTS idx_watchlist_token ON watchlist(token_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_created ON watchlist(created_at DESC);

-- Enable RLS
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read access on watchlist"
  ON watchlist FOR SELECT
  USING (true);

CREATE POLICY "Allow users to insert their own watchlist items"
  ON watchlist FOR INSERT
  WITH CHECK (user_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Allow users to delete their own watchlist items"
  ON watchlist FOR DELETE
  USING (user_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');
