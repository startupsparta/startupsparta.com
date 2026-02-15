# Waitlist Landing Page

## Overview
The waitlist landing page is the primary entry point for all visitors to startupsparta.com. It collects emails from interested users before the full platform launches.

## Features

### 1. Middleware Protection (`middleware.ts`)
- **Domain Redirect**: Redirects `startupsparta.com` to `https://www.startupsparta.com/waitlist`
- **Root Redirect**: Redirects `/` to `/waitlist`
- **Route Protection**: Blocks all routes except `/waitlist` and `/api/*`
- **Permanent Redirects**: Uses 308 status code for SEO-friendly permanent redirects

### 2. Landing Page (`app/waitlist/page.tsx`)
- **Stunning Design**: Dark theme with animated gradient backgrounds
- **Spartan Colors**: Uses `--spartan-red` (#ff5252) and `--spartan-gold` (#f0cb4c)
- **Email Form**: Single input field with validation
- **Loading States**: Shows spinner during submission
- **Success Animation**: Displays celebration message after signup
- **Mobile Responsive**: Optimized for all screen sizes
- **Feature Cards**: Showcases key platform benefits

### 3. API Endpoint (`app/api/waitlist/route.ts`)
- **POST /api/waitlist**: Accepts email submissions
- **Email Validation**: Server-side regex validation
- **Duplicate Handling**: Gracefully handles duplicate emails
- **Error Responses**: Appropriate HTTP status codes
- **GET /api/waitlist**: Health check endpoint

### 4. Database Schema
Location: `supabase/migrations/20260215200140_create_waitlist_table.sql`

```sql
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);
```

## Setup

### Prerequisites
- Supabase project with proper credentials
- Environment variables configured

### Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Database Migration
Run the migration in your Supabase SQL editor:
```bash
supabase/migrations/20260215200140_create_waitlist_table.sql
```

## Testing

### Test Redirects
```bash
# Root path -> /waitlist
curl -I http://localhost:3000/

# Other routes -> /waitlist
curl -I http://localhost:3000/create
curl -I http://localhost:3000/token/xyz

# Waitlist page loads
curl -I http://localhost:3000/waitlist

# API accessible
curl -I http://localhost:3000/api/waitlist
```

### Test API Validation
```bash
# Valid email (requires Supabase)
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# Invalid email
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid"}'

# Missing email
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Design Decisions

### Why 308 Permanent Redirect?
- SEO-friendly: Search engines update their index
- Better than 301: Preserves HTTP method (POST stays POST)
- Production-ready: Indicates this is a long-term redirect

### Why Block Other Routes?
- Focus users on waitlist signup
- Prevent premature access to incomplete features
- Clear communication that platform is launching soon

### Why Minimal CORS?
- Security: Only allow necessary methods (GET, POST)
- No `*` origin: Better security posture
- Only necessary headers: Content-Type

## Customization

### Update Social Proof Count
The hardcoded "1000+" count should be made dynamic:

```typescript
// Fetch actual count from database
const { count } = await supabase
  .from('waitlist')
  .select('*', { count: 'exact', head: true })
```

### Customize Colors
Colors are defined in `tailwind.config.js`:
```javascript
spartan: {
  red: "#ff5252",
  gold: "#f0cb4c",
}
```

### Modify Success Message
Edit `app/api/waitlist/route.ts`:
```typescript
message: "🎉 You're on the list! We'll notify you when StartupSparta launches."
```

## Security

### Code Review ✅
- Removed redundant hostname check
- Fixed redirect status codes
- Removed overly permissive CORS headers
- Added TODO for dynamic social proof

### CodeQL Security Scan ✅
- No security vulnerabilities found
- No SQL injection risks (parameterized queries via Supabase)
- No XSS risks (React escapes by default)
- No sensitive data exposure

## Deployment

### Vercel Configuration
The `vercel.json` includes:
- Redirect rules for route protection
- CORS headers for API endpoints
- Build and install commands

### Production Checklist
- [ ] Set up Supabase production database
- [ ] Configure environment variables in Vercel
- [ ] Run database migration
- [ ] Test domain redirect (startupsparta.com → www.startupsparta.com)
- [ ] Verify email signup works end-to-end
- [ ] Test on mobile devices
- [ ] Set up email notification system
- [ ] Monitor analytics

## Future Enhancements
1. Add analytics tracking (page views, form submissions)
2. Implement email notification system
3. Add referral system for waitlist
4. Display dynamic signup count
5. Add admin dashboard to view signups
6. Implement A/B testing for copy/design
7. Add social sharing functionality
8. Create email drip campaign for waitlist users

## Support
For issues or questions, contact the development team or create an issue in the repository.
