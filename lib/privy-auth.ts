import { PrivyClient } from '@privy-io/server-auth'

// Initialize Privy client for server-side token verification
// This uses the JWKS endpoint automatically to verify tokens
let privyClient: PrivyClient | null = null

export function getPrivyClient(): PrivyClient {
  if (!privyClient) {
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID
    const appSecret = process.env.PRIVY_APP_SECRET

    if (!appId) {
      throw new Error('NEXT_PUBLIC_PRIVY_APP_ID is not set')
    }

    if (!appSecret) {
      throw new Error('PRIVY_APP_SECRET is not set')
    }

    privyClient = new PrivyClient(appId, appSecret)
  }

  return privyClient
}

/**
 * Verify a Privy access token from the Authorization header
 * @param authHeader - The Authorization header value (e.g., "Bearer <token>")
 * @returns The verified user claims or null if invalid
 */
export async function verifyPrivyToken(authHeader: string | null | undefined) {
  if (!authHeader) {
    return null
  }

  // Extract token from "Bearer <token>" format
  const token = authHeader.replace(/^Bearer\s+/i, '').trim()
  
  if (!token) {
    return null
  }

  try {
    const client = getPrivyClient()
    // The Privy client automatically uses JWKS to verify the token
    const claims = await client.verifyAuthToken(token)
    return claims
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

/**
 * Get the wallet address from a verified Privy token
 * @param claims - The verified token claims from verifyPrivyToken
 * @returns The Solana wallet address or null
 */
export function getWalletAddressFromClaims(claims: any): string | null {
  if (!claims) {
    return null
  }

  // Privy token claims structure may vary, check common fields
  // The wallet address is typically in the subject (sub) or in linked accounts
  if (claims.sub) {
    // If sub is a wallet address format, return it
    if (claims.sub.match(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)) {
      return claims.sub
    }
  }

  // Check for linked accounts
  if (claims.linked_accounts) {
    const solanaAccount = claims.linked_accounts.find(
      (account: any) => account.type === 'wallet' && account.wallet_client_type === 'privy'
    )
    if (solanaAccount?.address) {
      return solanaAccount.address
    }
  }

  // Check for wallet in user object
  if (claims.wallet?.address) {
    return claims.wallet.address
  }

  return null
}

/**
 * Middleware helper to verify token and extract user info
 * Use this in API routes to protect endpoints
 */
export async function verifyPrivyAuth(request: Request) {
  const authHeader = request.headers.get('authorization')
  const claims = await verifyPrivyToken(authHeader)
  
  if (!claims) {
    return {
      authenticated: false,
      error: 'Invalid or missing token',
      claims: null,
      walletAddress: null,
    }
  }

  const walletAddress = getWalletAddressFromClaims(claims)

  return {
    authenticated: true,
    claims,
    walletAddress,
    error: null,
  }
}

