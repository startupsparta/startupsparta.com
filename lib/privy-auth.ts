import { PrivyClient } from '@privy-io/server-auth'
import { NextRequest } from 'next/server'

let privyClient: PrivyClient | null = null

export function getPrivyClient(): PrivyClient {
  if (!privyClient) {
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID
    const appSecret = process.env.PRIVY_APP_SECRET

    // ✅ CHANGED: Don't throw during build, return null instead
    if (!appId || !appSecret) {
      console.warn('Privy credentials not configured')
      return null as any // Allow build to continue
    }

    privyClient = new PrivyClient(appId, appSecret)
  }

  return privyClient
}

/**
 * Verify Privy authentication token from request headers
 */
export async function verifyPrivyAuth(request: NextRequest): Promise<{
  authenticated: boolean
  walletAddress?: string | null
  claims?: any
  error?: string
}> {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        authenticated: false,
        error: 'Missing or invalid authorization header'
      }
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    const client = getPrivyClient()
    if (!client) {
      return {
        authenticated: false,
        error: 'Privy client not configured'
      }
    }

    // Verify the token with Privy
    const claims = await client.verifyAuthToken(token)
    
    // Extract wallet address from claims
    const walletAddress = claims.appId || claims.userId || null

    return {
      authenticated: true,
      walletAddress,
      claims
    }
  } catch (error) {
    console.error('Token verification failed:', error)
    return {
      authenticated: false,
      error: 'Invalid or expired token'
    }
  }
}