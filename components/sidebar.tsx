'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useOptionalPrivy } from '@/lib/privy-client'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Home, PlusCircle, TrendingUp, User, LogOut, Info } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  const { login, logout, authenticated, user } = useOptionalPrivy()
  const { publicKey } = useWallet()

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Create Token', href: '/create', icon: PlusCircle },
    { name: 'Trending', href: '/?filter=trending', icon: TrendingUp },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const footerLinks = [
    { name: 'Privacy Policy', href: '/docs/privacy-policy' },
    { name: 'Terms of Service', href: '/docs/terms-and-conditions' },
    { name: 'Fees', href: '/docs/fees' },
  ]

  const DiscordIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.295-.444.697-.608 1.112a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.112.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  )

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
              className="w-full flex items-center justify-center gap-2 bg-muted text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all"
            >
              <LogOut className="h-4 w-4" />
              Disconnect
            </button>
          </>
        )}
      </div>

      {/* About Us Section - Footer Links */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            About Us
          </h3>
        </div>
        <div className="space-y-1">
          {footerLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block text-xs text-muted-foreground hover:text-spartan-gold transition-colors py-1"
            >
              {link.name}
            </Link>
          ))}
          <a
            href="https://discord.gg/frCfp4N7vr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-spartan-gold transition-colors py-1"
          >
            <DiscordIcon />
            <span>Discord</span>
          </a>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          © StartupSparta 2026
        </p>
      </div>
    </div>
  )
}