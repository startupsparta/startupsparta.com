'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, ArrowRight, Check } from 'lucide-react'

export function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: dbError } = await supabase
        .from('waitlist')
        .insert({
          email,
          name,
          source: 'landing_page',
          invited: false,
          invited_at: null,
        })

      if (dbError) {
        // Check for duplicate email
        if (dbError.code === '23505' || dbError.message.includes('unique')) {
          throw new Error('This email is already on the waitlist.')
        }
        throw dbError
      }

      setSubmitted(true)
    } catch (err) {
      console.error('Waitlist error:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3 px-6 py-4 bg-green-500/20 border border-green-500 rounded-lg">
        <Check className="h-6 w-6 text-green-500" />
        <p className="text-white font-medium">
          You&apos;re on the list! We&apos;ll email you when we launch.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-6 py-4 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-spartan-gold"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-6 py-4 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-spartan-gold"
        />
        <button
          type="submit"
          disabled={loading}
          className="pump-button whitespace-nowrap disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            'Joining...'
          ) : (
            <>
              Join Waitlist
              <ArrowRight className="h-5 w-5 ml-2" />
            </>
          )}
        </button>
      </div>
      
      <p className="text-sm text-gray-400 mt-4">
        🚀 Early access coming soon. Be first to launch your startup token.
      </p>
    </form>
  )
}
