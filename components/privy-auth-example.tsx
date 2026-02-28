'use client'

import { useState } from 'react'
import { useOptionalPrivy, usePrivyToken } from '@/lib/privy-client'

/**
 * Example component showing how to use Privy token verification
 * with protected API routes
 */
export function PrivyAuthExample() {
  const { getAccessToken, authenticated } = usePrivyToken()
  const { login } = useOptionalPrivy()
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const verifyToken = async () => {
    if (!authenticated) {
      setError('Please login first')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const token = await getAccessToken()
      if (!token) {
        throw new Error('Failed to get access token')
      }

      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const callProtectedEndpoint = async () => {
    if (!authenticated) {
      setError('Please login first')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const token = await getAccessToken()
      if (!token) {
        throw new Error('Failed to get access token')
      }

      const response = await fetch('/api/protected/example', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Request failed')
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (!authenticated) {
    return (
      <div className="p-6 bg-card border border-border rounded-lg">
        <h2 className="text-xl font-bold text-white mb-4">
          Privy Token Verification Example
        </h2>
        <p className="text-muted-foreground mb-4">
          Please login to test token verification
        </p>
        <button
          onClick={login}
          className="px-4 py-2 bg-spartan-red text-white rounded-lg hover:opacity-90"
        >
          Login
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 bg-card border border-border rounded-lg space-y-4">
      <h2 className="text-xl font-bold text-white">
        Privy Token Verification Example
      </h2>

      <div className="flex gap-4">
        <button
          onClick={verifyToken}
          disabled={loading}
          className="px-4 py-2 bg-spartan-red text-white rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Verify Token'}
        </button>

        <button
          onClick={callProtectedEndpoint}
          disabled={loading}
          className="px-4 py-2 bg-spartan-gold text-black rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Call Protected API'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="p-4 bg-background border border-border rounded-lg">
          <h3 className="text-white font-semibold mb-2">Result:</h3>
          <pre className="text-xs text-muted-foreground overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}





