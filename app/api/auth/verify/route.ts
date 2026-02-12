import { NextRequest, NextResponse } from 'next/server'
import { verifyPrivyAuth } from '@/lib/privy-auth'

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

    return NextResponse.json({
      authenticated: true,
      walletAddress: authResult.walletAddress,
      claims: {
        // Only return safe claims, not sensitive data
        sub: authResult.claims?.sub,
        iat: authResult.claims?.iat,
        exp: authResult.claims?.exp,
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

