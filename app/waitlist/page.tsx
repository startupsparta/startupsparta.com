'use client'

import { useState, FormEvent } from 'react'
import { Loader2 } from 'lucide-react'

export default function WaitlistPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      setSuccessMessage(data.message)
      setSuccess(true)
      setName('')
      setEmail('')
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-spartan-red/20 via-black to-spartan-gold/20 animate-pulse" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-spartan-red/10 rounded-full blur-3xl animate-pulse" 
             style={{ animationDelay: '0s', animationDuration: '4s' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-spartan-gold/10 rounded-full blur-3xl animate-pulse" 
             style={{ animationDelay: '2s', animationDuration: '4s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl w-full">
        {!success ? (
          <div className="animate-slide-in">
            {/* Hero Section */}
            <div className="text-center mb-12">
              {/* Logo/Brand */}
              <div className="mb-8">
                <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-spartan-red via-spartan-gold to-spartan-red bg-clip-text text-transparent animate-pulse">
                  SPARTA
                </h1>
                <div className="h-1 w-32 bg-gradient-to-r from-spartan-red to-spartan-gold mx-auto" />
              </div>

              {/* Headline */}
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Join the Startup
                <span className="block text-transparent bg-gradient-to-r from-spartan-red to-spartan-gold bg-clip-text">
                  Revolution
                </span>
              </h2>

              <p className="text-xl text-gray-300 mb-4">
                The ultimate platform for launching and trading startup tokens
              </p>
              
              {/* Social Proof */}
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-spartan-red/10 border border-spartan-red/30 rounded-full">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-spartan-red to-spartan-gold flex items-center justify-center text-xs font-bold">
                    🚀
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-spartan-gold to-spartan-red flex items-center justify-center text-xs font-bold">
                    💎
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-spartan-red to-spartan-gold flex items-center justify-center text-xs font-bold">
                    ⚡
                  </div>
                </div>
                <span className="text-spartan-gold font-semibold">Join the early adopters</span>
              </div>
            </div>

            {/* Signup Form */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 md:p-10 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-4 bg-black border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-spartan-red focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="you@example.com"
                    className="w-full px-4 py-4 bg-black border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-spartan-red focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-spartan-red to-spartan-gold hover:from-spartan-red/90 hover:to-spartan-gold/90 text-white font-bold text-lg rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    'Join the Waitlist'
                  )}
                </button>
              </form>

              {/* Additional Info */}
              <p className="text-center text-sm text-gray-500 mt-6">
                We&apos;ll notify you as soon as we launch. No spam, ever.
              </p>
            </div>
          </div>
        ) : (
          /* Success State */
          <div className="animate-slide-in text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-spartan-red to-spartan-gold rounded-full flex items-center justify-center mb-6 animate-pulse">
                <span className="text-5xl">🎉</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                You&apos;re In!
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                {successMessage}
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 md:p-10">
              <h3 className="text-2xl font-bold text-white mb-4">What&apos;s Next?</h3>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Check Your Email</h4>
                    <p className="text-gray-400 text-sm">We&apos;ll send you updates about our launch</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🚀</span>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Early Access</h4>
                    <p className="text-gray-400 text-sm">Get exclusive early access when we launch</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💎</span>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Special Perks</h4>
                    <p className="text-gray-400 text-sm">Enjoy special benefits as an early adopter</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSuccess(false)}
                className="mt-8 w-full py-3 px-6 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200"
              >
                Sign Up Another Person
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-gray-600 text-sm">
          © 2026 StartupSparta. All rights reserved.
        </p>
      </div>
    </div>
  )
}
