# Company Verification System - Environment Variables

This document describes the environment variables needed for the hybrid company verification system.

## Email Service (Required for Email Verification)

The system uses [Resend](https://resend.com) for sending verification emails.

### Setup Steps:

1. Sign up for a Resend account at https://resend.com
2. Create an API key from your dashboard
3. Verify your sending domain (or use the default resend.dev for testing)

### Environment Variables:

```bash
# Resend API Key (Required)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# From Email Address (Optional - defaults to verify@startupsparta.com)
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

## Supabase Configuration (Already Required)

The verification system uses the existing Supabase configuration:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Rate Limiting (Optional)

Rate limiting is built into the system and uses database-level tracking. No additional configuration needed, but you can adjust limits in the API routes if needed:

- Default: 5 attempts per hour per domain
- Configured in: `app/api/verification/email/send/route.ts`

## DNS Verification

DNS verification uses Node.js built-in `dns` module. No additional configuration needed.

## Testing

### Email Verification Testing

1. Set up a Resend account and add the API key
2. Use a company email address (not gmail, yahoo, etc.)
3. Check your email for the 6-digit code
4. Code expires in 5 minutes

### DNS Verification Testing

1. Have access to your domain's DNS settings
2. Generate a verification token in the modal
3. Add the TXT record to your DNS
4. Wait 5-10 minutes for propagation
5. Click "Verify DNS"

**Example TXT Record:**
```
Type: TXT
Name: @ (or leave blank)
Value: startupsparta-verify=abc123def456...
TTL: 3600 (or default)
```

## Database Migration

Before using the verification system, run the database migration:

1. Open your Supabase SQL Editor
2. Run the SQL script from `supabase/verification_schema.sql`
3. This creates the `company_verifications` table and updates the `tokens` table

## Security Notes

- Verification codes are 6 digits and expire after 5 minutes
- Rate limiting prevents brute force attacks (5 attempts per hour)
- Free email providers (gmail, yahoo, etc.) are blocked for company verification
- DNS tokens are cryptographically secure (64-character hex)
- All verification data is stored in Supabase with RLS policies

## Support

For issues or questions:
- Check Resend dashboard for email delivery status
- Use browser developer tools to check API responses
- Verify DNS propagation with online DNS lookup tools
- Check Supabase logs for database errors
