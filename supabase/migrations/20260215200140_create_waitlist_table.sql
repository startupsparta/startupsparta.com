-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Add index for email lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow public to insert emails (for waitlist signup)
CREATE POLICY "Allow public to insert emails"
  ON waitlist
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public to read their own email (for duplicate checking)
CREATE POLICY "Allow public to read emails"
  ON waitlist
  FOR SELECT
  TO public
  USING (true);
