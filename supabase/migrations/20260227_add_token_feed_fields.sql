-- Add fields needed for the trending feed display
ALTER TABLE public.tokens
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS volume bigint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS price_change_24h numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS price_sol numeric;

-- Index for category filtering used on the homepage
CREATE INDEX IF NOT EXISTS tokens_category_idx ON public.tokens(category) WHERE category IS NOT NULL AND deleted_at IS NULL;
