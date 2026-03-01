import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware that serves the landing page at / by default.
 *
 * Visitors who have previously visited /api/dev-access?token=<DEV_BYPASS_TOKEN>
 * will have a `dev_bypass` HttpOnly cookie that transparently serves the full
 * platform dashboard (at /app) while keeping the URL as /.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only the home page is handled here.
  if (pathname !== '/') {
    return NextResponse.next()
  }

  const devBypassCookie = request.cookies.get('dev_bypass')
  if (devBypassCookie?.value === '1') {
    // Rewrite transparently to the dashboard (URL stays as /).
    return NextResponse.rewrite(new URL('/app', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
