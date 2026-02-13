import { PrivyClient } from '@privy-io/server-auth'

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