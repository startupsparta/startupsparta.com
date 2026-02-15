'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Rocket, TrendingUp, Users, Shield, ArrowRight, Sparkles, ChevronRight } from 'lucide-react'
import { useOptionalPrivy } from '@/lib/privy-client'

export default function LandingPage() {
  const { login, authenticated } = useOptionalPrivy()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const categories = [
    {
      name: 'Y-Combinator',
      bgColor: 'bg-orange-500',
      logo: 'Y',
      logoColor: 'text-white',
    },
    {
      name: 'B2B SAAS',
      bgColor: 'bg-black',
      logo: 'B2B',
      logoColor: 'text-white',
    },
    {
      name: 'Sequoia Capital',
      bgColor: 'bg-white',
      borderColor: 'border-lime-400',
      logo: 'SEQUOIA',
      logoColor: 'text-gray-700',
    },
    {
      name: 'A16z',
      bgColor: 'bg-red-900',
      logo: 'A16Z',
      logoColor: 'text-white',
    },
  ]

  const features = [
    {
      icon: Rocket,
      title: 'Fair Launch',
      description: 'No presales, no team allocation. Everyone starts equal.',
    },
    {
      icon: TrendingUp,
      title: 'Bonding Curve',
      description: 'Transparent pricing that rewards early supporters.',
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Build your community before going to market.',
    },
    {
      icon: Shield,
      title: 'Graduate to Raydium',
      description: 'Successful tokens automatically list on Raydium DEX.',
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
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
            </Link>
            
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/waitlist"
                className="text-muted-foreground hover:text-white transition-colors"
              >
                Waitlist
              </Link>
              {authenticated ? (
                <Link
                  href="/dashboard"
                  className="bg-spartan-gold hover:bg-spartan-gold/90 text-black font-bold px-6 py-2 rounded-lg transition-all"
                >
                  Launch App
                </Link>
              ) : (
                <button
                  onClick={login}
                  className="bg-spartan-gold hover:bg-spartan-gold/90 text-black font-bold px-6 py-2 rounded-lg transition-all"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-spartan-gold/10 border border-spartan-gold/20 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-spartan-gold" />
              <span className="text-sm text-spartan-gold font-medium">The Bonding Curve Platform for Startups</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-spartan-gold to-spartan-red bg-clip-text text-transparent">
              Launch Your Startup Token
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Create fair-launch tokens, build your community, and graduate to Raydium DEX. 
              No presales. No tricks. Just pure startup power.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="bg-spartan-gold hover:bg-spartan-gold/90 text-black font-bold px-8 py-4 rounded-lg transition-all flex items-center gap-2 text-lg"
              >
                Launch Your Token
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/waitlist"
                className="bg-card hover:bg-muted text-white font-bold px-8 py-4 rounded-lg border border-border transition-all text-lg"
              >
                Join Waitlist
              </Link>
            </div>
          </div>

          {/* Categories Showcase */}
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Top Categories</h2>
              <Link 
                href="/dashboard"
                className="text-spartan-gold hover:text-spartan-gold/80 flex items-center gap-2 transition-colors"
              >
                Explore All
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
                >
                  <div
                    className={`w-full aspect-square rounded-xl flex items-center justify-center text-3xl font-bold mb-3 ${
                      category.bgColor
                    } ${category.logoColor} ${
                      category.borderColor ? `border-4 ${category.borderColor}` : ''
                    } shadow-2xl group-hover:shadow-spartan-gold/50`}
                  >
                    {category.logo}
                  </div>
                  <p className="text-white text-sm font-medium text-center">{category.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-black to-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why StartupSparta?</h2>
            <p className="text-xl text-muted-foreground">
              The most powerful way to launch and grow your startup token
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 hover:border-spartan-gold/50 transition-all"
                >
                  <div className="bg-spartan-gold/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-spartan-gold" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-spartan-red/20 to-spartan-gold/20 border border-spartan-gold/30 rounded-2xl p-12">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div>
                <div className="text-5xl font-bold text-spartan-gold mb-2">1000+</div>
                <div className="text-muted-foreground">Tokens Launched</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-spartan-gold mb-2">$50M+</div>
                <div className="text-muted-foreground">Trading Volume</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-spartan-gold mb-2">10K+</div>
                <div className="text-muted-foreground">Active Traders</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Ready to Launch?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join the revolution. Create your startup token in minutes.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-spartan-gold hover:bg-spartan-gold/90 text-black font-bold px-12 py-5 rounded-lg transition-all text-lg"
          >
            Get Started Now
            <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/spartan-icon-clear.png"
                  alt="StartupSparta"
                  width={32}
                  height={32}
                  className="rounded"
                />
                <span className="font-bold text-lg">StartupSparta</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The bonding curve platform for startups.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-3">Product</h3>
              <div className="space-y-2">
                <Link href="/dashboard" className="block text-sm text-muted-foreground hover:text-white">
                  Dashboard
                </Link>
                <Link href="/create" className="block text-sm text-muted-foreground hover:text-white">
                  Create Token
                </Link>
                <Link href="/waitlist" className="block text-sm text-muted-foreground hover:text-white">
                  Waitlist
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-3">Resources</h3>
              <div className="space-y-2">
                <Link href="/docs/fees" className="block text-sm text-muted-foreground hover:text-white">
                  Fees
                </Link>
                <Link href="/docs/terms-and-conditions" className="block text-sm text-muted-foreground hover:text-white">
                  Terms
                </Link>
                <Link href="/docs/privacy-policy" className="block text-sm text-muted-foreground hover:text-white">
                  Privacy
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-3">Network</h3>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-2 mb-2">
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
          </div>
          
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 StartupSparta. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
