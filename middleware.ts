import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl

  // 1. Redirect non-www to www (production only)
  if (
    hostname === 'startupsparta.com' &&
    !hostname.startsWith('www.') &&
    process.env.NODE_ENV === 'production'
  ) {
    const url = request.nextUrl.clone()
    url.hostname = 'www.startupsparta.com'
    url.pathname = '/waitlist'
    return NextResponse.redirect(url, 301)
  }

  // 2. Allow API routes (especially /api/waitlist)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // 3. Allow static files and Next.js internal routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // files with extensions (images, fonts, etc.)
  ) {
    return NextResponse.next()
  }

  // 4. Allow access to /waitlist route
  if (pathname === '/waitlist') {
    return NextResponse.next()
  }

  // 5. Redirect root path to /waitlist
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/waitlist'
    return NextResponse.redirect(url, 307)
  }

  // 6. Block all other routes - redirect to /waitlist
  // This blocks /create, /token/*, /docs, etc.
  const url = request.nextUrl.clone()
  url.pathname = '/waitlist'
  return NextResponse.redirect(url, 307)
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
}
