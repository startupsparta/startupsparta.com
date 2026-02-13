'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMemo } from 'react'

require('@solana/wallet-adapter-react-ui/styles.css')

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID
  const privyEnabled = Boolean(privyAppId)

  // Determine network from environment
  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork) || WalletAdapterNetwork.Devnet
  
  // Use Helius RPC if available, otherwise fallback to public RPC
  const endpoint = useMemo(() => {
    return process.env.NEXT_PUBLIC_HELIUS_RPC_URL || clusterApiUrl(network)
  }, [network])

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
    ],
    [network]
  )

  const appProviders = (
    <>
      <QueryClientProvider client={queryClient}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              {children}
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </QueryClientProvider>
    </>
  )

  if (!privyEnabled) {
    return appProviders
  }

  return (
    <PrivyProvider
      appId={privyAppId as string}
      config={{
        loginMethods: ['wallet', 'google'],
        appearance: {
          theme: 'dark',
          accentColor: '#ff5252',
          logo: '/spartan-icon-clear.png',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {appProviders}
    </PrivyProvider>
  )
}
