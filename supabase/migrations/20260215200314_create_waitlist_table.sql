-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Constraints
  CONSTRAINT waitlist_name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
  CONSTRAINT waitlist_email_format CHECK (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$')
);

-- Add indexes for lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_name ON waitlist(name);

-- Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow public read access (if needed for admin dashboards later)
CREATE POLICY "Allow public insert on waitlist"
  ON waitlist FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read on waitlist"
  ON waitlist FOR SELECT
  USING (true);
