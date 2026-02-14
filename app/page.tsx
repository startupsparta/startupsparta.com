'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Rocket, TrendingUp, Users, Shield, CheckCircle, Zap, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist')
      }

      setSuccess(true)
      setEmail('')
      setName('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-spartan-red">StartupSparta</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/explore" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Explore
              </Link>
              <Link
                href="/create"
                className="bg-spartan-gold hover:bg-spartan-gold/90 text-black font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Launch Token
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-spartan-red/20 via-black to-spartan-gold/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              The <span className="text-spartan-red">Pump.fun</span>
              <br />
              for <span className="text-spartan-gold">Startups</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Launch your startup token on Solana. Trade on bonding curves. Graduate to Raydium at 170 SOL market cap.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/explore"
                className="w-full sm:w-auto bg-spartan-red hover:bg-spartan-red/90 text-white font-bold px-8 py-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Explore Startups
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#waitlist"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-lg border border-white/20 transition-all backdrop-blur-sm"
              >
                Join Waitlist
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Why <span className="text-spartan-gold">StartupSparta</span>?
            </h2>
            <p className="text-xl text-gray-300">
              The revolutionary way to launch and trade startup tokens
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-spartan-red transition-all">
              <div className="bg-spartan-red/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Rocket className="h-6 w-6 text-spartan-red" />
              </div>
              <h3 className="text-xl font-bold mb-2">Free Token Launch</h3>
              <p className="text-gray-300">
                Create startup tokens for free with complete company data, videos, and social links.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-spartan-gold transition-all">
              <div className="bg-spartan-gold/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-spartan-gold" />
              </div>
              <h3 className="text-xl font-bold mb-2">Bonding Curve Trading</h3>
              <p className="text-gray-300">
                Linear bonding curve with automatic price discovery and fair market dynamics.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-spartan-red transition-all">
              <div className="bg-spartan-red/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-spartan-red" />
              </div>
              <h3 className="text-xl font-bold mb-2">Auto-Graduate to Raydium</h3>
              <p className="text-gray-300">
                Automatically graduate to Raydium DEX at 170 SOL threshold with instant liquidity.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-spartan-gold transition-all">
              <div className="bg-spartan-gold/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-spartan-gold" />
              </div>
              <h3 className="text-xl font-bold mb-2">Community Driven</h3>
              <p className="text-gray-300">
                Real-time comments, live trading, and active community engagement on every token.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-spartan-red transition-all">
              <div className="bg-spartan-red/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-spartan-red" />
              </div>
              <h3 className="text-xl font-bold mb-2">Built on Solana</h3>
              <p className="text-gray-300">
                Fast, cheap transactions on the most performant blockchain with Phantom wallet support.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-spartan-gold transition-all">
              <div className="bg-spartan-gold/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-spartan-gold" />
              </div>
              <h3 className="text-xl font-bold mb-2">1% Trading Fee</h3>
              <p className="text-gray-300">
                Low 1% fee on all trades keeps the platform running and continuously improving.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              How It <span className="text-spartan-red">Works</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-spartan-red w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Launch Your Token</h3>
              <p className="text-gray-300">
                Create a free token with your startup data, logo, videos, and social links.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-spartan-gold text-black w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Build Community</h3>
              <p className="text-gray-300">
                Trade on the bonding curve. Every buy increases price, every sell decreases it.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-spartan-red w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Graduate to DEX</h3>
              <p className="text-gray-300">
                Hit 170 SOL market cap and automatically graduate to Raydium with burned LP tokens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-spartan-red/10 to-spartan-gold/10 border border-gray-700 rounded-2xl p-8 sm:p-12 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                Join the <span className="text-spartan-gold">Waitlist</span>
              </h2>
              <p className="text-xl text-gray-300">
                Be the first to know when we launch new features and opportunities
              </p>
            </div>

            {success ? (
              <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-500 mb-2">You&apos;re on the list!</h3>
                <p className="text-gray-300">
                  We&apos;ll notify you when new features and opportunities become available.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-spartan-gold"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-spartan-gold"
                  />
                </div>
                
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-spartan-gold hover:bg-spartan-gold/90 text-black font-bold px-8 py-4 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? 'Joining...' : 'Join Waitlist'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-spartan-red">StartupSparta</h2>
              <p className="text-gray-400 mt-1">Pump.fun for Startups</p>
            </div>
            <div className="flex items-center gap-8">
              <Link href="/docs" className="text-gray-400 hover:text-white transition-colors">
                Docs
              </Link>
              <Link href="/explore" className="text-gray-400 hover:text-white transition-colors">
                Explore
              </Link>
              <Link href="/create" className="text-gray-400 hover:text-white transition-colors">
                Launch
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2026 StartupSparta. Built on Solana.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
