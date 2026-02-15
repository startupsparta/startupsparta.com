import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl
  const host = request.headers.get('host') || ''

  // Allow all API routes for waitlist
  if (pathname.startsWith('/api/waitlist')) {
    return NextResponse.next()
  }

  // Allow static files and Next.js internal routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml')
  ) {
    return NextResponse.next()
  }

  // Redirect non-www to www
  // Using 308 (permanent) since domain should always use www
  if (host === 'startupsparta.com') {
    const url = new URL(request.url)
    url.host = 'www.startupsparta.com'
    url.pathname = '/waitlist'
    return NextResponse.redirect(url, 308)
  }

  // Allow access to /waitlist
  if (pathname === '/waitlist') {
    return NextResponse.next()
  }

  // Redirect root to /waitlist
  // Using 307 (temporary) since this is a temporary landing page during waitlist phase
  if (pathname === '/') {
    const url = new URL('/waitlist', origin)
    return NextResponse.redirect(url, 307)
  }

  // Block all other routes - redirect to waitlist
  // Using 307 (temporary) since access will be restored after launch
  const url = new URL('/waitlist', origin)
  return NextResponse.redirect(url, 307)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/waitlist (waitlist API)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
