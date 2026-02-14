-- Create waitlist table for storing user waitlist submissions
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist(created_at DESC);

-- Add comment to table
COMMENT ON TABLE public.waitlist IS 'Stores waitlist submissions from users interested in the platform';

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (for form submissions)
CREATE POLICY "Allow public insert" ON public.waitlist
    FOR INSERT
    WITH CHECK (true);

-- Create policy to allow public read access
CREATE POLICY "Allow public read" ON public.waitlist
    FOR SELECT
    USING (true);
