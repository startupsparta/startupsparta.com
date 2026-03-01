import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware that gates the home page behind the waitlist when
 * NEXT_PUBLIC_LAUNCH_MODE=waitlist.
 *
 * Visitors who have previously visited /api/dev-access?token=<DEV_BYPASS_TOKEN>
 * will have a `dev_bypass` HttpOnly cookie that allows them to bypass the gate
 * and see the full dashboard.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only the home page is gated.
  if (pathname !== '/') {
    return NextResponse.next()
  }

  const launchMode = process.env.NEXT_PUBLIC_LAUNCH_MODE
  if (launchMode !== 'waitlist') {
    return NextResponse.next()
  }

  const devBypassCookie = request.cookies.get('dev_bypass')
  if (devBypassCookie?.value === '1') {
    return NextResponse.next()
  }

  // Rewrite the request to the waitlist page transparently (URL stays as /).
  return NextResponse.rewrite(new URL('/waitlist', request.url))
}

export const config = {
  matcher: '/',
}
