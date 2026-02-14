'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { X, Upload, Loader2 } from 'lucide-react'

interface AddAchievementModalProps {
  isOpen: boolean
  tokenId: string
  tokenName: string
  onClose: () => void
  onSuccess: () => void
}

export function AddAchievementModal({ isOpen, tokenId, tokenName, onClose, onSuccess }: AddAchievementModalProps) {
  const [loading, setLoading] = useState(false)
  const [achievementType, setAchievementType] = useState<'funding' | 'partnership' | 'milestone'>('funding')
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [proofUrl, setProofUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  const fundingCategories = [
    'Y-Combinator',
    'Sequoia Capital',
    'A16z',
    'Tiger Global',
    'Andreessen Horowitz',
    'Accel',
    'Greylock',
    'Lightspeed',
    'Other'
  ]

  const partnershipCategories = [
    'B2B SAAS',
    'Enterprise Partnership',
    'Strategic Alliance',
    'Technology Partner',
    'Other'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: insertError } = await supabase
        .from('token_achievements')
        .insert({
          token_id: tokenId,
          achievement_type: achievementType,
          category: category || null,
          title,
          description: description || null,
          amount: amount || null,
          proof_url: proofUrl || null,
          verified: false, // Requires admin verification
          verification_method: null,
          verified_by: null,
          verified_at: null,
        })

      if (insertError) throw insertError

      onSuccess()
      onClose()
      
      // Reset form
      setAchievementType('funding')
      setCategory('')
      setTitle('')
      setDescription('')
      setAmount('')
      setProofUrl('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit achievement')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Add Achievement</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Submit an achievement for {tokenName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Achievement Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Achievement Type *
            </label>
            <select
              value={achievementType}
              onChange={(e) => {
                setAchievementType(e.target.value as 'funding' | 'partnership' | 'milestone')
                setCategory('') // Reset category when type changes
              }}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-spartan-red"
              required
              disabled={loading}
            >
              <option value="funding">Funding</option>
              <option value="partnership">Partnership</option>
              <option value="milestone">Milestone</option>
            </select>
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Category {achievementType === 'funding' || achievementType === 'partnership' ? '*' : ''}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-spartan-red"
              required={achievementType === 'funding' || achievementType === 'partnership'}
              disabled={loading}
            >
              <option value="">Select Category</option>
              {achievementType === 'funding' && fundingCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              {achievementType === 'partnership' && partnershipCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              {achievementType === 'milestone' && (
                <>
                  <option value="Product Launch">Product Launch</option>
                  <option value="Revenue Milestone">Revenue Milestone</option>
                  <option value="User Milestone">User Milestone</option>
                  <option value="Other">Other</option>
                </>
              )}
            </select>
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                achievementType === 'funding' 
                  ? 'e.g., Series A Funding' 
                  : achievementType === 'partnership'
                  ? 'e.g., Partnership with Fortune 500 Company'
                  : 'e.g., Reached 100K Users'
              }
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red"
              maxLength={200}
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {title.length}/200 characters
            </p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide additional details about this achievement..."
              rows={4}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red resize-none"
              maxLength={1000}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {description.length}/1000 characters
            </p>
          </div>

          {/* Amount (for funding) */}
          {achievementType === 'funding' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">
                Amount
              </label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., $5M Series A"
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red"
                disabled={loading}
              />
            </div>
          )}

          {/* Proof URL */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Proof URL *
            </label>
            <input
              type="url"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="https://techcrunch.com/..."
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red"
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Link to announcement, press release, or other verification source
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Info Message */}
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
            <p className="text-sm text-blue-400">
              Your achievement will be reviewed by our team before being displayed publicly. 
              This typically takes 24-48 hours.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-card border border-border text-white rounded-lg font-medium hover:bg-muted transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-spartan-gold text-black rounded-lg font-medium hover:bg-spartan-gold/90 transition-colors flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit Achievement
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
