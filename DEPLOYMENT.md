# 🚀 DEPLOYMENT INSTRUCTIONS - WAITLIST SITE

## Overview
The site is now **locked to waitlist mode**. All routes redirect to `/waitlist` only.

---

## 🔐 What's Locked

### ✅ Redirected to Waitlist:
- `startupsparta.com/` → `/waitlist`
- `startupsparta.com/create` → `/waitlist`
- `startupsparta.com/token/*` → `/waitlist`
- `startupsparta.com/profile` → `/waitlist`
- **ALL other routes** → `/waitlist`

### ✅ Still Accessible:
- `startupsparta.com/waitlist` - The waitlist page
- `startupsparta.com/api/waitlist` - Form submission API
- Static assets (images, fonts, etc.)

---

## ⚙️ Required: Supabase Setup

### Step 1: Create Supabase Project
1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in project details and wait for setup to complete

### Step 2: Create Waitlist Table
1. In your Supabase project, go to **SQL Editor**
2. Copy and paste the contents of `supabase/schema.sql`
3. Click **Run** to execute the SQL
4. Verify the `waitlist` table was created in **Table Editor**

### Step 3: Get API Credentials
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **Anon public** key (starts with `eyJ...`)

### Step 4: Configure Vercel Environment Variables
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these two variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. Make sure they're available for **Production**, **Preview**, and **Development**
5. **Redeploy** your app for changes to take effect

---

## ✅ Testing After Deployment

### Test 1: Verify Site Lock
- Visit `https://startupsparta.com/` 
- Should redirect to `/waitlist` ✅
- Try `/create`, `/token/test` - all should redirect ✅

### Test 2: Verify Form Works
1. Visit `https://startupsparta.com/waitlist`
2. Fill in the form with your email
3. Click "Join Waitlist"
4. Should see success message with green checkmark ✅

### Test 3: Verify Supabase Connection
1. Go to Supabase **Table Editor**
2. Open the `waitlist` table
3. You should see your test entry ✅

---

## 🔓 How to Unlock the Site Later

When you're ready to open the full site:

### Option 1: Delete Middleware (Full Unlock)
```bash
git rm middleware.ts
git commit -m "Unlock site - remove waitlist lock"
git push
```

### Option 2: Modify Middleware (Partial Unlock)
Edit `middleware.ts` to allow specific routes:
```typescript
// Allow these routes
if (
  pathname === '/waitlist' ||
  pathname === '/' ||           // ADD THIS
  pathname === '/create' ||     // ADD THIS
  pathname.startsWith('/api/')
) {
  return NextResponse.next()
}
```

---

## 🎨 Current Waitlist Design

- **Hero**: "The Future of Startup Tokens"
- **Tagline**: "Join the revolution. Be first to launch on StartupSparta."
- **Form fields**:
  - Email (required) ✅
  - Name (optional)
  - Company (optional)
  - Role (optional)
  - Message (optional)

---

## 📊 Monitoring Signups

### View Signups in Supabase
1. Go to **Table Editor**
2. Select `waitlist` table
3. See all signups with timestamps

### Export Data
1. In Table Editor, click the export button
2. Download as CSV

### API to View Count
You can create a simple API route to show signup count:
```typescript
// app/api/waitlist/count/route.ts
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { count } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true })
  
  return Response.json({ count })
}
```

---

## ❓ Troubleshooting

### "Failed to join waitlist" error
- ✅ Check environment variables are set in Vercel
- ✅ Verify Supabase URL and key are correct
- ✅ Ensure waitlist table exists in Supabase
- ✅ Check Supabase project is not paused

### Duplicate email error
- This is expected behavior (emails are unique)
- User sees: "This email is already on the waitlist"

### Site not redirecting
- ✅ Check `middleware.ts` exists in root
- ✅ Redeploy after making changes

---

## 📞 Support

If you need help:
1. Check the logs in Vercel dashboard
2. Check Supabase logs in your project
3. Review `WAITLIST_SETUP.md` for detailed setup instructions

---

## 🎉 You're All Set!

The waitlist is now live and collecting signups. All data is being saved to Supabase.

When ready to launch the full platform, just remove or modify the middleware!
