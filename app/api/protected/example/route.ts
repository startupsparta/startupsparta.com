import { NextRequest, NextResponse } from 'next/server'
import { verifyPrivyAuth } from '@/lib/privy-auth'

/**
 * Example protected API route
 * This demonstrates how to use Privy token verification in your API routes
 * 
 * Usage:
 *   fetch('/api/protected/example', {
 *     headers: {
 *       'Authorization': `Bearer ${accessToken}`
 *     }
 *   })
 */
export async function GET(request: NextRequest) {
  // Verify the token
  const authResult = await verifyPrivyAuth(request)

  if (!authResult.authenticated) {
    return NextResponse.json(
      { error: authResult.error || 'Unauthorized' },
      { status: 401 }
    )
  }

  // At this point, the token is verified and you can trust the wallet address
  const walletAddress = authResult.walletAddress

  if (!walletAddress) {
    return NextResponse.json(
      { error: 'Wallet address not found in token' },
      { status: 400 }
    )
  }

  // Your protected logic here
  // For example, fetch user data from database, perform authorized actions, etc.

  return NextResponse.json({
    message: 'Successfully accessed protected endpoint',
    walletAddress,
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: NextRequest) {
  // Verify the token
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

  // Parse request body if needed
  let body
  try {
    body = await request.json()
  } catch {
    body = {}
  }

  // Your protected POST logic here
  // For example, create records, update data, etc.

  return NextResponse.json({
    message: 'Successfully processed protected request',
    walletAddress,
    data: body,
    timestamp: new Date().toISOString(),
  })
}



