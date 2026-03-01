import { NextRequest, NextResponse } from 'next/server'
import { verifyPrivyAuth } from '@/lib/privy-auth'

/**
 * JWT standard claims that may be present in Privy tokens
 */
interface JWTClaims {
  sub?: string
  iat?: number
  exp?: number
  [key: string]: unknown
}

/**
 * API route to verify Privy access tokens
 * POST /api/auth/verify
 * 
 * Headers:
 *   Authorization: Bearer <privy_access_token>
 * 
 * Returns:
 *   - 200: Token is valid, includes user claims
 *   - 401: Token is invalid or missing
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyPrivyAuth(request)

    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication failed' },
        { status: 401 }
      )
    }

    // Type assertion for JWT standard claims that exist at runtime
    const claims = authResult.claims as JWTClaims | null
    
    return NextResponse.json({
      authenticated: true,
      walletAddress: authResult.walletAddress,
      claims: {
        // Only return safe claims, not sensitive data
        sub: claims?.sub,
        iat: claims?.iat,
        exp: claims?.exp,
      },
    })
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint for health check
 */
export async function GET() {
  return NextResponse.json({
    message: 'Privy token verification endpoint',
    jwksEndpoint: `https://auth.privy.io/api/v1/apps/${process.env.NEXT_PUBLIC_PRIVY_APP_ID}/jwks.json`,
  })
}

