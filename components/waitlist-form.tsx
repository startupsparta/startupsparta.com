'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, AlertCircle, CheckCircle, Mail, User } from 'lucide-react'

export function WaitlistForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setError('Name is required')
      return false
    }
    if (!email.trim()) {
      setError('Email is required')
      return false
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return false
    }
    setError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError(null)

    try {
      const { error: insertError } = await supabase
        .from('waitlist')
        .insert({
          name: name.trim(),
          email: email.trim().toLowerCase(),
        })

      if (insertError) {
        // Handle unique constraint violation (duplicate email)
        if (insertError.code === '23505') {
          setError('This email is already on the waitlist!')
        } else {
          throw insertError
        }
        return
      }

      // Success!
      setSuccess(true)
      setName('')
      setEmail('')
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    } catch (err) {
      console.error('Error submitting to waitlist:', err)
      // Provide user-friendly error message while logging details for debugging
      const errorMessage = err instanceof Error && err.message.includes('fetch')
        ? 'Unable to connect. Please check your internet connection and try again.'
        : 'Something went wrong. Please try again or contact support if the problem persists.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Join the Waitlist</h2>
        <p className="text-muted-foreground">
          Be the first to know when we launch new features and startups.
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-spartan-gold/10 border border-spartan-gold rounded-lg flex items-start gap-3 animate-slide-in">
          <CheckCircle className="h-5 w-5 text-spartan-gold flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-spartan-gold">
              You&apos;re on the list!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              We&apos;ll notify you about updates and new features.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full pl-10 bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-10 bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red"
              required
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full pump-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
              Joining...
            </>
          ) : (
            'Join Waitlist'
          )}
        </button>
      </form>
    </div>
  )
}
