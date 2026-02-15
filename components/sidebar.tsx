'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useOptionalPrivy } from '@/lib/privy-client'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Home, PlusCircle, TrendingUp, User, LogOut, Rocket } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  const { login, logout, authenticated, user } = useOptionalPrivy()
  const { publicKey } = useWallet()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Create Token', href: '/create', icon: PlusCircle },
    { name: 'Trending', href: '/dashboard?filter=trending', icon: TrendingUp },
    { name: 'Waitlist', href: '/waitlist', icon: Rocket },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <Link href="/" className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <Image
            src="/spartan-icon-clear.png"
            alt="StartupSparta"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <div>
            <h1 className="text-xl font-bold text-white">StartupSparta</h1>
            <p className="text-xs text-spartan-gold">Launch. Trade. Graduate.</p>
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-spartan-red text-white'
                  : 'text-muted-foreground hover:bg-muted hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}

        {/* Create Token CTA */}
        <Link
          href="/create"
          className="block mt-6 pump-button text-center"
        >
          <PlusCircle className="h-5 w-5 inline mr-2" />
          Create Company Ticker
        </Link>
      </nav>

      {/* Wallet / Auth */}
      <div className="p-4 border-t border-border space-y-3">
        {!authenticated ? (
          <button
            onClick={login}
            className="w-full bg-spartan-gold text-black font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all"
          >
            Connect Wallet
          </button>
        ) : (
          <>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Connected</p>
              <p className="text-sm font-mono truncate text-white">
                {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
              </p>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 bg-card text-muted-foreground font-medium py-2 px-4 rounded-lg hover:bg-muted transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Disconnect
            </button>
          </>
        )}
      </div>

      {/* Network indicator */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className={`h-2 w-2 rounded-full ${
            process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet-beta' 
              ? 'bg-spartan-red' 
              : 'bg-spartan-gold'
          }`} />
          <span className="font-mono">
            {process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet-beta' ? 'Mainnet' : 'Devnet'}
          </span>
        </div>
      </div>
    </div>
  )
}
