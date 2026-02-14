'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      // Store email in a waitlist table
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email }])

      if (error) {
        if (error.code === '23505') {
          // Duplicate email
          setMessage("You're already on the waitlist!")
          setStatus('success')
        } else {
          throw error
        }
      } else {
        setMessage('Successfully joined the waitlist!')
        setStatus('success')
        setEmail('')
      }
    } catch (error) {
      console.error('Error joining waitlist:', error)
      setMessage('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={status === 'loading' || status === 'success'}
          className="flex-1 px-6 py-4 bg-black/50 border-2 border-spartan-gold/30 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-spartan-gold transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="px-8 py-4 bg-spartan-gold hover:bg-spartan-gold/90 text-black font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === 'loading' ? 'Joining...' : status === 'success' ? 'Joined!' : 'Join Waitlist'}
        </button>
      </div>
      {message && (
        <p className={`mt-3 text-center text-sm ${
          status === 'success' ? 'text-spartan-gold' : 'text-red-400'
        }`}>
          {message}
        </p>
      )}
    </form>
  )
}
