'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setEmail('')
      } else {
        setError(data.error || 'Failed to join waitlist')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-spartan-red/20 via-black to-spartan-gold/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-spartan-red/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-spartan-gold/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Logo/Brand */}
        <div className="mb-8 text-center">
          <h1 className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-spartan-red via-spartan-gold to-spartan-red bg-clip-text text-transparent animate-slide-in">
            STARTUPSPARTA
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-spartan-gold to-transparent mx-auto"></div>
        </div>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12 animate-slide-in">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Join the <span className="text-spartan-red">Startup</span>{' '}
            <span className="text-spartan-gold">Revolution</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            The bonding curve platform for startups is launching soon.
          </p>
          <p className="text-lg md:text-xl text-gray-400">
            Launch tokens. Build community. Graduate to Raydium.
          </p>
        </div>

        {/* Email Signup Form */}
        <div className="w-full max-w-md mx-auto mb-12">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={loading}
                  className="w-full px-6 py-4 bg-black/50 border-2 border-spartan-gold/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-spartan-red transition-all duration-300 text-lg group-hover:border-spartan-red/70 disabled:opacity-50"
                  required
                />
                <div className="absolute inset-0 bg-gradient-to-r from-spartan-red/20 to-spartan-gold/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded-lg animate-slide-in">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-spartan-red to-spartan-gold hover:from-spartan-gold hover:to-spartan-red text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg shadow-lg hover:shadow-spartan-red/50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Joining...
                  </span>
                ) : (
                  'Join the Waitlist'
                )}
              </button>
            </form>
          ) : (
            <div className="bg-gradient-to-r from-spartan-red/20 to-spartan-gold/20 border-2 border-spartan-gold rounded-lg p-8 text-center animate-slide-in">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold mb-2 text-spartan-gold">
                You're on the list!
              </h3>
              <p className="text-gray-300">
                We'll notify you when StartupSparta launches.
              </p>
            </div>
          )}
        </div>

        {/* Social Proof */}
        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm">
            Join <span className="text-spartan-gold font-bold">1000+</span> founders ready to launch
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12 px-4">
          <div className="bg-black/50 border border-spartan-red/30 rounded-lg p-6 hover:border-spartan-red transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="text-xl font-bold mb-2 text-spartan-red">Launch Fast</h3>
            <p className="text-gray-400 text-sm">
              Launch your startup token in minutes with our bonding curve platform
            </p>
          </div>

          <div className="bg-black/50 border border-spartan-gold/30 rounded-lg p-6 hover:border-spartan-gold transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-3">🏛️</div>
            <h3 className="text-xl font-bold mb-2 text-spartan-gold">Build Community</h3>
            <p className="text-gray-400 text-sm">
              Engage with your supporters and grow your community organically
            </p>
          </div>

          <div className="bg-black/50 border border-spartan-red/30 rounded-lg p-6 hover:border-spartan-red transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-3">📈</div>
            <h3 className="text-xl font-bold mb-2 text-spartan-red">Graduate</h3>
            <p className="text-gray-400 text-sm">
              Automatically graduate to Raydium when you hit the bonding curve cap
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2026 StartupSparta. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
