'use client'

import { useState, FormEvent } from 'react'
import Image from 'next/image'

export default function WaitlistPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
        body: JSON.stringify({ name, email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setSuccessMessage(data.message)
        setName('')
        setEmail('')
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full overflow-hidden relative flex items-center justify-center bg-black">
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-yellow-900/20 animate-gradient"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,82,82,0.1),transparent_50%)]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl px-6 py-12 animate-fadeIn">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32">
            <Image
              src="/spartan-icon-clear.png"
              alt="StartupSparta"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#ff5252] via-[#ffd740] to-[#ff5252] bg-clip-text text-transparent animate-pulse-slow">
            The Future of Startup Tokens
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            Join the revolution. Be first to launch on StartupSparta.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 p-6 bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/50 rounded-lg text-center animate-fadeIn">
            <p className="text-green-200 text-lg">{successMessage}</p>
          </div>
        )}

        {/* Signup Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                maxLength={100}
                disabled={loading}
                className="w-full px-6 py-4 text-lg bg-gray-900/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#ff5252] focus:outline-none focus:ring-2 focus:ring-[#ff5252]/50 transition-all duration-300 hover:border-gray-600 disabled:opacity-50"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-6 py-4 text-lg bg-gray-900/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#ffd740] focus:outline-none focus:ring-2 focus:ring-[#ffd740]/50 transition-all duration-300 hover:border-gray-600 disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-center">
                <p className="text-red-200">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-5 text-xl font-bold bg-gradient-to-r from-[#ff5252] to-[#ffd740] text-black rounded-lg hover:shadow-lg hover:shadow-[#ff5252]/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-6 w-6 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Joining...
                </span>
              ) : (
                '🚀 Join the Waitlist'
              )}
            </button>
          </form>
        )}

        {/* Social Proof (Optional) */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Join 1,000+ founders waiting to launch
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseSlow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientShift 15s ease infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }

        .animate-pulse-slow {
          animation: pulseSlow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
