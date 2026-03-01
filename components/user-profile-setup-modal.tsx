'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { X, Loader2, AlertCircle } from 'lucide-react'

interface UserProfileSetupModalProps {
  isOpen: boolean
  walletAddress: string
  onComplete: () => void
  onCancel?: () => void
}

export function UserProfileSetupModal({
  isOpen,
  walletAddress,
  onComplete,
  onCancel,
}: UserProfileSetupModalProps) {
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [website, setWebsite] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const validateForm = (): boolean => {
    if (!username.trim()) {
      setError('Username is required')
      return false
    }
    if (username.length > 50) {
      setError('Username must be 50 characters or less')
      return false
    }
    if (bio.length > 500) {
      setError('Bio must be 500 characters or less')
      return false
    }
    if (website && !isValidUrl(website)) {
      setError('Please enter a valid website URL')
      return false
    }
    setError(null)
    return true
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError(null)

    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single()

      if (existingUser) {
        // Update existing user
        const { error: updateError } = await supabase
          .from('users')
          .update({
            username: username.trim(),
            bio: bio.trim() || null,
            website: website.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq('wallet_address', walletAddress)

        if (updateError) throw updateError
      } else {
        // Create new user
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            wallet_address: walletAddress,
            username: username.trim(),
            bio: bio.trim() || null,
            website: website.trim() || null,
          })

        if (insertError) throw insertError
      }

      onComplete()
    } catch (err) {
      console.error('Error saving user profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full mx-4 animate-slide-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Complete Your Profile</h2>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-muted-foreground hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Username *
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              maxLength={50}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red"
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              1-50 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Bio (Optional)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              maxLength={500}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red resize-none"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {bio.length}/500 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Personal Website/Portfolio (Optional)
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red"
              disabled={loading}
            />
          </div>

          <div className="flex gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-white hover:bg-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 pump-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                  Saving...
                </>
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}





