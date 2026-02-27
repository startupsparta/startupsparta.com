import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const COOKIE_NAME = 'dev_bypass'
// Cookie lasts 7 days
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

/**
 * Constant-time string comparison to prevent timing attacks.
 */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still run a dummy compare so execution time is consistent.
    crypto.timingSafeEqual(Buffer.from(a), Buffer.from(a))
    return false
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

/**
 * GET /api/dev-access?token=<DEV_BYPASS_TOKEN>
 *
 * Validates the supplied token against the DEV_BYPASS_TOKEN environment
 * variable.  On success a HttpOnly `dev_bypass` cookie is set and the
 * visitor is redirected to the home page so they can see the full dashboard
 * even when NEXT_PUBLIC_LAUNCH_MODE=waitlist.
 *
 * Set DEV_BYPASS_TOKEN in your Vercel project environment variables
 * (Preview + Production scopes) and share the URL with your dev team:
 *   https://<your-vercel-url>/api/dev-access?token=<DEV_BYPASS_TOKEN>
 * A secure HttpOnly cookie is set and you are redirected to the full dashboard.
 */
export async function GET(request: NextRequest) {
  const devBypassToken = process.env.DEV_BYPASS_TOKEN

  // If no token is configured, dev access is disabled.
  if (!devBypassToken) {
    return NextResponse.json(
      { error: 'Dev access is not configured on this deployment.' },
      { status: 403 }
    )
  }

  const { searchParams } = new URL(request.url)
  const suppliedToken = searchParams.get('token') ?? ''

  if (!safeCompare(suppliedToken, devBypassToken)) {
    return NextResponse.json(
      { error: 'Invalid or missing token.' },
      { status: 401 }
    )
  }

  // Token is valid – set the bypass cookie and redirect home.
  const redirectUrl = new URL('/', request.url)
  const response = NextResponse.redirect(redirectUrl)

  response.cookies.set(COOKIE_NAME, '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  })

  return response
}
