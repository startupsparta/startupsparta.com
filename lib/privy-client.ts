'use client'

import { usePrivy } from '@privy-io/react-auth'

type SafePrivy = {
  enabled: boolean
  authenticated: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  getAccessToken: () => Promise<string | null>
  user: unknown
}

export function useOptionalPrivy(): SafePrivy {
  try {
    const privy = usePrivy()
    return {
      enabled: true,
      authenticated: privy.authenticated,
      login: async () => {
        await privy.login()
      },
      logout: async () => {
        await privy.logout()
      },
      getAccessToken: async () => {
        return await privy.getAccessToken()
      },
      user: privy.user ?? null,
    }
  } catch {
    return {
      enabled: false,
      authenticated: false,
      login: async () => {},
      logout: async () => {},
      getAccessToken: async () => null,
      user: null,
    }
  }
}

/**
 * Client-side hook to get Privy access token
 * Use this in your React components to get the token for API calls
 * 
 * Example:
 *   const { getAccessToken } = usePrivyToken()
 *   const token = await getAccessToken()
 *   fetch('/api/protected/example', {
 *     headers: { 'Authorization': `Bearer ${token}` }
 *   })
 */
export function usePrivyToken() {
  const { getAccessToken, authenticated } = useOptionalPrivy()

  const getToken = async (): Promise<string | null> => {
    if (!authenticated) {
      return null
    }

    try {
      const token = await getAccessToken()
      return token
    } catch (error) {
      console.error('Failed to get access token:', error)
      return null
    }
  }

  return {
    getAccessToken: getToken,
    authenticated,
  }
}

/**
 * Helper function to make authenticated API calls
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
  getAccessToken: () => Promise<string | null>
): Promise<Response> {
  const token = await getAccessToken()
  
  if (!token) {
    throw new Error('Not authenticated')
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
}


