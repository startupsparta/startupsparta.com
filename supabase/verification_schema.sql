-- Company Verification System Schema
-- Add this to your Supabase SQL editor

-- ============================================================================
-- COMPANY VERIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.company_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain TEXT NOT NULL UNIQUE,
  verification_type TEXT CHECK (verification_type IN ('email', 'dns')) NOT NULL,
  verification_status TEXT CHECK (verification_status IN ('pending', 'email_verified', 'dns_verified')) DEFAULT 'pending',
  verification_code TEXT, -- 6-digit code for email verification
  verification_token TEXT, -- Random token for DNS TXT record
  code_expires_at TIMESTAMP WITH TIME ZONE, -- When the 6-digit code expires
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by TEXT, -- Email address or user identifier
  attempt_count INTEGER DEFAULT 0, -- Track failed attempts for rate limiting
  last_attempt_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT company_verifications_domain_format CHECK (domain ~ '^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.([a-zA-Z]{2,}\.)*[a-zA-Z]{2,}$'),
  CONSTRAINT company_verifications_code_length CHECK (verification_code IS NULL OR char_length(verification_code) = 6),
  CONSTRAINT company_verifications_attempt_count_non_negative CHECK (attempt_count >= 0)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_company_verifications_domain ON public.company_verifications(domain);
CREATE INDEX IF NOT EXISTS idx_company_verifications_status ON public.company_verifications(verification_status);
CREATE INDEX IF NOT EXISTS idx_company_verifications_token ON public.company_verifications(verification_token) WHERE verification_token IS NOT NULL;

-- ============================================================================
-- ALTER TOKENS TABLE - Add verification fields
-- ============================================================================
ALTER TABLE public.tokens 
  ADD COLUMN IF NOT EXISTS company_domain TEXT,
  ADD COLUMN IF NOT EXISTS verification_type TEXT CHECK (verification_type IN ('none', 'email', 'dns')) DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS verification_status TEXT CHECK (verification_status IN ('unverified', 'email_verified', 'dns_verified')) DEFAULT 'unverified';

-- Index for verification status on tokens
CREATE INDEX IF NOT EXISTS idx_tokens_verification_status ON public.tokens(verification_status) WHERE verification_status != 'unverified';
CREATE INDEX IF NOT EXISTS idx_tokens_company_domain ON public.tokens(company_domain) WHERE company_domain IS NOT NULL;

-- ============================================================================
-- TRIGGER FOR UPDATED_AT
-- ============================================================================
CREATE TRIGGER handle_company_verifications_updated_at
  BEFORE UPDATE ON public.company_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE public.company_verifications ENABLE ROW LEVEL SECURITY;

-- Allow public read access for verified domains
CREATE POLICY "Allow public read access on verified domains"
  ON public.company_verifications FOR SELECT
  USING (verification_status IN ('email_verified', 'dns_verified'));

-- Allow authenticated insert for new verifications
CREATE POLICY "Allow authenticated insert on company_verifications"
  ON public.company_verifications FOR INSERT
  WITH CHECK (true);

-- Allow update only for the verification process (server-side)
CREATE POLICY "Allow update on company_verifications"
  ON public.company_verifications FOR UPDATE
  USING (true);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to clean up expired verification codes
CREATE OR REPLACE FUNCTION public.cleanup_expired_verification_codes()
RETURNS void AS $$
BEGIN
  UPDATE public.company_verifications
  SET verification_code = NULL,
      code_expires_at = NULL
  WHERE verification_code IS NOT NULL
    AND code_expires_at < NOW()
    AND verification_status = 'pending';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check rate limiting
CREATE OR REPLACE FUNCTION public.check_verification_rate_limit(
  p_domain TEXT,
  p_limit INTEGER DEFAULT 5,
  p_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN AS $$
DECLARE
  v_attempt_count INTEGER;
  v_last_attempt TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT attempt_count, last_attempt_at
  INTO v_attempt_count, v_last_attempt
  FROM public.company_verifications
  WHERE domain = p_domain;
  
  -- If no record exists, allow
  IF NOT FOUND THEN
    RETURN TRUE;
  END IF;
  
  -- If last attempt was more than window_minutes ago, reset and allow
  IF v_last_attempt IS NULL OR v_last_attempt < NOW() - (p_window_minutes || ' minutes')::INTERVAL THEN
    UPDATE public.company_verifications
    SET attempt_count = 0
    WHERE domain = p_domain;
    RETURN TRUE;
  END IF;
  
  -- Check if under limit
  RETURN v_attempt_count < p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
