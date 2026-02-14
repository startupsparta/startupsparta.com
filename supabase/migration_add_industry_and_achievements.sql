-- Migration: Add industry category and achievements system
-- Run this migration after the main schema.sql

-- ============================================================================
-- STEP 1: Add industry column to tokens table
-- ============================================================================
ALTER TABLE public.tokens 
ADD COLUMN IF NOT EXISTS industry TEXT 
CHECK (industry IN (
  'B2B', 
  'Consumer', 
  'Fintech', 
  'Healthcare', 
  'Education', 
  'Industrials', 
  'Real Estate and Construction', 
  'Government',
  'Unspecified'
)) 
DEFAULT 'Unspecified';

-- Create index for fast filtering
CREATE INDEX IF NOT EXISTS idx_tokens_industry ON public.tokens(industry) WHERE deleted_at IS NULL;

-- ============================================================================
-- STEP 2: Create token_achievements table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.token_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token_id UUID REFERENCES public.tokens(id) ON DELETE CASCADE NOT NULL,
  achievement_type TEXT CHECK (achievement_type IN ('funding', 'partnership', 'milestone')) NOT NULL,
  category TEXT, -- 'Y-Combinator', 'Sequoia Capital', 'A16z', 'B2B SAAS', etc.
  title TEXT NOT NULL,
  description TEXT,
  amount TEXT, -- e.g., "$5M Series A"
  verified BOOLEAN DEFAULT false,
  verification_method TEXT, -- 'dns', 'email', 'manual_review'
  proof_url TEXT, -- Link to announcement, press release, etc.
  verified_by TEXT, -- Admin wallet or email
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT achievements_title_length CHECK (char_length(title) >= 1 AND char_length(title) <= 200),
  CONSTRAINT achievements_description_length CHECK (description IS NULL OR char_length(description) <= 1000)
);

-- ============================================================================
-- STEP 3: Create indexes for token_achievements
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_achievements_token_id ON public.token_achievements(token_id);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON public.token_achievements(category) WHERE verified = true;
CREATE INDEX IF NOT EXISTS idx_achievements_verified ON public.token_achievements(verified);
CREATE INDEX IF NOT EXISTS idx_achievements_type ON public.token_achievements(achievement_type);
CREATE INDEX IF NOT EXISTS idx_achievements_token_verified ON public.token_achievements(token_id, verified) WHERE verified = true;

-- ============================================================================
-- STEP 4: Enable RLS on token_achievements table
-- ============================================================================
ALTER TABLE public.token_achievements ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 5: Create RLS policies for token_achievements
-- ============================================================================

-- Allow public read access to verified achievements
CREATE POLICY "Allow public read access on verified achievements"
  ON public.token_achievements FOR SELECT
  USING (verified = true);

-- Allow token creators to read their own unverified achievements
CREATE POLICY "Allow token creators to read their own achievements"
  ON public.token_achievements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tokens
      WHERE tokens.id = token_achievements.token_id
      AND tokens.creator_wallet = (auth.jwt() ->> 'wallet_address')::text
    )
  );

-- Allow token creators to insert achievements for their tokens
CREATE POLICY "Allow token creators to insert achievements"
  ON public.token_achievements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tokens
      WHERE tokens.id = token_achievements.token_id
      AND tokens.creator_wallet = (auth.jwt() ->> 'wallet_address')::text
    )
  );

-- Note: Update and delete policies would be admin-only and should be 
-- implemented separately with admin role checks
