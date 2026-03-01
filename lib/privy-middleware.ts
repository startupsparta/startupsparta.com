import { NextRequest, NextResponse } from 'next/server'
import { verifyPrivyAuth } from './privy-auth'

/**
 * Middleware wrapper for protected API routes
 * Use this to easily protect any API route handler
 * 
 * Example:
 *   export async function GET(request: NextRequest) {
 *     return withPrivyAuth(request, async (walletAddress, claims) => {
 *       // Your protected logic here
 *       return NextResponse.json({ walletAddress })
 *     })
 *   }
 */
export async function withPrivyAuth(
  request: NextRequest,
  handler: (walletAddress: string, claims: any) => Promise<NextResponse> | NextResponse
): Promise<NextResponse> {
  const authResult = await verifyPrivyAuth(request)

  if (!authResult.authenticated) {
    return NextResponse.json(
      { error: authResult.error || 'Unauthorized' },
      { status: 401 }
    )
  }

  const walletAddress = authResult.walletAddress

  if (!walletAddress) {
    return NextResponse.json(
      { error: 'Wallet address not found in token' },
      { status: 400 }
    )
  }

  try {
    return await handler(walletAddress, authResult.claims)
  } catch (error) {
    console.error('Protected route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Type-safe wrapper for protected routes with request body parsing
 */
export async function withPrivyAuthAndBody<T = any>(
  request: NextRequest,
  handler: (walletAddress: string, body: T, claims: any) => Promise<NextResponse> | NextResponse
): Promise<NextResponse> {
  return withPrivyAuth(request, async (walletAddress, claims) => {
    let body: T
    try {
      body = await request.json()
    } catch {
      body = {} as T
    }
    return handler(walletAddress, body, claims)
  })
}

