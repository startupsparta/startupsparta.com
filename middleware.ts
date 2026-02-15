import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, host } = request.nextUrl

  // Allow static assets
  if (
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/spartan-icon') ||
    pathname === '/apple-touch-icon.png' ||
    pathname.startsWith('/android-chrome') ||
    pathname === '/favicon-16x16.png' ||
    pathname === '/favicon-32x32.png' ||
    pathname === '/site.webmanifest'
  ) {
    return NextResponse.next()
  }

  // Allow waitlist page and API
  if (pathname === '/waitlist' || pathname === '/api/waitlist') {
    return NextResponse.next()
  }

  // Redirect non-www to www for startupsparta.com domain
  if (host === 'startupsparta.com') {
    return NextResponse.redirect(`https://www.${host}/waitlist`, 308)
  }

  // BLOCK EVERYTHING ELSE - redirect to waitlist
  return NextResponse.redirect(new URL('/waitlist', request.url))
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     */
    '/((?!_next/static|_next/image).*)',
  ],
}
