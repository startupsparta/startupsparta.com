# Waitlist Configuration Guide

## Setting Up Supabase for the Waitlist

The waitlist functionality requires Supabase to be configured. Follow these steps:

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Wait for the project to finish setting up

### 2. Run the Database Schema

1. In your Supabase project, go to the SQL Editor
2. Copy the contents of `supabase/schema.sql`
3. Run the SQL to create the `waitlist` table and other necessary tables

### 3. Get Your API Credentials

1. In Supabase, go to Settings > API
2. Copy your:
   - Project URL (e.g., `https://abcdefgh.supabase.co`)
   - Anon/Public API Key (starts with `eyJ...`)

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory with:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**For Production (Vercel):**
Add these environment variables in your Vercel project settings.

### 5. Test the Waitlist

1. Start the dev server: `npm run dev`
2. Navigate to `http://localhost:3000/waitlist`
3. Fill out the form and submit
4. Check your Supabase project's Table Editor to see the new entry in the `waitlist` table

## Site Lock

The site is currently locked to show only the waitlist page. All routes redirect to `/waitlist` via middleware. To unlock:

1. Delete or comment out `middleware.ts`
2. Restart the dev server

## Troubleshooting

- **"Failed to join waitlist"**: Check that your Supabase credentials are correct in `.env.local`
- **Duplicate email error**: The email already exists in the waitlist table
- **Network errors**: Ensure your Supabase project is active and the URL is correct
