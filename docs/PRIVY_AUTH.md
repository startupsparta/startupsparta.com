# Privy Token Verification Guide

This guide explains how to implement Privy token verification using JWKS in your StartupSparta application.

## Overview

Privy uses JSON Web Key Set (JWKS) to verify access tokens. The JWKS endpoint for your app is:
```
https://auth.privy.io/api/v1/apps/{APP_ID}/jwks.json
```

The implementation automatically uses this endpoint to verify tokens issued by Privy.

## Setup

### 1. Environment Variables

Make sure you have these environment variables set in your `.env.local`:

```env
NEXT_PUBLIC_PRIVY_APP_ID=cmljz4q2200610bjii9ae1h4g
PRIVY_APP_SECRET=your_privy_app_secret
```

You can find your app secret in the [Privy Dashboard](https://dashboard.privy.io).

### 2. How It Works

The `@privy-io/server-auth` package automatically:
- Fetches the JWKS from Privy's endpoint
- Verifies token signatures using the public keys
- Validates token expiration and claims
- Returns verified user claims

## Usage

### Client-Side: Getting the Access Token

In your React components, use the `usePrivyToken` hook:

```tsx
'use client'

import { usePrivyToken } from '@/lib/privy-client'

export function MyComponent() {
  const { getAccessToken, authenticated } = usePrivyToken()

  const handleApiCall = async () => {
    if (!authenticated) {
      // User needs to login first
      return
    }

    const token = await getAccessToken()
    if (!token) {
      console.error('Failed to get token')
      return
    }

    const response = await fetch('/api/protected/example', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    console.log(data)
  }

  return (
    <button onClick={handleApiCall}>
      Call Protected API
    </button>
  )
}
```

Or use the `authenticatedFetch` helper:

```tsx
import { authenticatedFetch, usePrivyToken } from '@/lib/privy-client'

const { getAccessToken } = usePrivyToken()

const response = await authenticatedFetch(
  '/api/protected/example',
  { method: 'GET' },
  getAccessToken
)
```

### Server-Side: Verifying Tokens in API Routes

#### Option 1: Using the Middleware Helper (Recommended)

```tsx
// app/api/my-protected-route/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { withPrivyAuth } from '@/lib/privy-middleware'

export async function GET(request: NextRequest) {
  return withPrivyAuth(request, async (walletAddress, claims) => {
    // Your protected logic here
    // walletAddress is guaranteed to be valid
    
    return NextResponse.json({
      message: 'Success',
      walletAddress,
    })
  })
}

export async function POST(request: NextRequest) {
  return withPrivyAuthAndBody(request, async (walletAddress, body, claims) => {
    // body is automatically parsed from request
    // walletAddress is guaranteed to be valid
    
    return NextResponse.json({
      message: 'Success',
      walletAddress,
      data: body,
    })
  })
}
```

#### Option 2: Manual Verification

```tsx
// app/api/my-protected-route/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyPrivyAuth } from '@/lib/privy-auth'

export async function GET(request: NextRequest) {
  const authResult = await verifyPrivyAuth(request)

  if (!authResult.authenticated) {
    return NextResponse.json(
      { error: authResult.error },
      { status: 401 }
    )
  }

  const walletAddress = authResult.walletAddress
  if (!walletAddress) {
    return NextResponse.json(
      { error: 'Wallet address not found' },
      { status: 400 }
    )
  }

  // Your protected logic here
  return NextResponse.json({
    walletAddress,
    claims: authResult.claims,
  })
}
```

## API Endpoints

### Verify Token

**POST** `/api/auth/verify`

Verifies a Privy access token and returns user information.

**Headers:**
```
Authorization: Bearer <privy_access_token>
```

**Response (200):**
```json
{
  "authenticated": true,
  "walletAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "claims": {
    "sub": "...",
    "iat": 1234567890,
    "exp": 1234567890
  }
}
```

**Response (401):**
```json
{
  "error": "Invalid or missing token"
}
```

### Example Protected Route

**GET/POST** `/api/protected/example`

Example of a protected API route. Use this as a template for your own protected routes.

## Token Verification Flow

1. **Client** gets access token from Privy using `getAccessToken()`
2. **Client** sends token in `Authorization: Bearer <token>` header
3. **Server** extracts token from header
4. **Server** uses Privy SDK to verify token:
   - SDK fetches JWKS from Privy endpoint
   - Verifies token signature using public keys
   - Validates expiration and claims
5. **Server** returns verified user information or error

## Security Notes

- Tokens are automatically verified using JWKS (no manual key management needed)
- Tokens expire after a set time (default is usually 1 hour)
- Always verify tokens on the server side, never trust client-side validation
- Store `PRIVY_APP_SECRET` securely and never expose it to the client
- The JWKS endpoint is public and can be accessed by anyone (this is by design)

## Troubleshooting

### "NEXT_PUBLIC_PRIVY_APP_ID is not set"
- Make sure your `.env.local` file has `NEXT_PUBLIC_PRIVY_APP_ID` set
- Restart your dev server after adding environment variables

### "PRIVY_APP_SECRET is not set"
- Get your app secret from the Privy Dashboard
- Add it to `.env.local` as `PRIVY_APP_SECRET`
- Never commit this to version control

### "Invalid or missing token"
- Make sure the client is authenticated (user has logged in)
- Check that the token is being sent in the `Authorization` header
- Verify the token hasn't expired

### "Wallet address not found in token"
- The token structure may vary depending on login method
- Check the `claims` object to see what's available
- You may need to adjust `getWalletAddressFromClaims` based on your use case

## References

- [Privy Server Auth Documentation](https://docs.privy.io/guide/server/quickstart)
- [JWKS Specification](https://tools.ietf.org/html/rfc7517)
- [Privy Dashboard](https://dashboard.privy.io)


