'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { useWallet } from '@solana/wallet-adapter-react'
import { Sidebar } from '@/components/sidebar'
import { CreateTokenForm } from '@/components/create-token-form'
import { Shield } from 'lucide-react'

export default function CreatePage() {
  const router = useRouter()
  const { login, authenticated } = usePrivy()
  const { publicKey } = useWallet()

  if (!authenticated || !publicKey) {
    return (
      <div className="flex min-h-screen bg-black">
        <Sidebar />
        
        <main className="flex-1 ml-64 flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-card border border-border rounded-lg p-8 text-center">
            <Shield className="h-16 w-16 text-spartan-red mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">
              Connect Your Wallet
            </h1>
            <p className="text-muted-foreground mb-6">
              You need to connect your wallet to create a startup token
            </p>
            <button
              onClick={login}
              className="pump-button w-full"
            >
              Login to Launch Company
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Create Company Ticker
            </h1>
            <p className="text-muted-foreground">
              Launch your startup token on the bonding curve. All data is permanent and cannot be edited after creation.
            </p>
          </div>

          <CreateTokenForm walletAddress={publicKey.toBase58()} />
        </div>
      </main>
    </div>
  )
}
