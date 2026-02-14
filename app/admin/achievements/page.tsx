'use client'

import { useEffect, useState } from 'react'
import { supabase, type Database } from '@/lib/supabase'
import { Sidebar } from '@/components/sidebar'
import { Loader2, Check, X, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { useOptionalPrivy } from '@/lib/privy-client'
import { useWallet } from '@solana/wallet-adapter-react'

type Achievement = Database['public']['Tables']['token_achievements']['Row']
type Token = Database['public']['Tables']['tokens']['Row']

interface AchievementWithToken extends Achievement {
  token?: Token
}

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementWithToken[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'verified'>('pending')
  const { authenticated } = useOptionalPrivy()
  const wallet = useWallet()

  // TODO: Add proper admin check - for now, any authenticated user can access
  // In production, add a list of admin wallet addresses
  const isAdmin = authenticated && wallet.publicKey

  useEffect(() => {
    if (isAdmin) {
      loadAchievements()
    }
  }, [filter, isAdmin])

  const loadAchievements = async () => {
    try {
      setLoading(true)
      
      const { data: achievementsData, error } = await supabase
        .from('token_achievements')
        .select('*')
        .eq('verified', filter === 'verified')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Load token data for each achievement
      const achievementsWithTokens = await Promise.all(
        (achievementsData || []).map(async (achievement) => {
          const { data: tokenData } = await supabase
            .from('tokens')
            .select('*')
            .eq('id', achievement.token_id)
            .single()

          return {
            ...achievement,
            token: tokenData || undefined,
          }
        })
      )

      setAchievements(achievementsWithTokens)
    } catch (error) {
      console.error('Error loading achievements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (achievementId: string) => {
    if (!wallet.publicKey) return

    try {
      const { error } = await supabase
        .from('token_achievements')
        .update({
          verified: true,
          verified_at: new Date().toISOString(),
          verified_by: wallet.publicKey.toBase58(),
          verification_method: 'manual_review',
        })
        .eq('id', achievementId)

      if (error) throw error

      // Reload achievements
      loadAchievements()
    } catch (error) {
      console.error('Error verifying achievement:', error)
      alert('Failed to verify achievement')
    }
  }

  const handleReject = async (achievementId: string) => {
    if (!confirm('Are you sure you want to reject this achievement? This will delete it permanently.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('token_achievements')
        .delete()
        .eq('id', achievementId)

      if (error) throw error

      // Reload achievements
      loadAchievements()
    } catch (error) {
      console.error('Error rejecting achievement:', error)
      alert('Failed to reject achievement')
    }
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen bg-black">
        <Sidebar />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
            <p className="text-muted-foreground">You must be logged in as an admin to access this page</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Achievement Verification</h1>
            <p className="text-muted-foreground">Review and verify achievement submissions</p>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-spartan-red text-white'
                  : 'bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('verified')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'verified'
                  ? 'bg-spartan-red text-white'
                  : 'bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              Verified
            </button>
          </div>

          {/* Achievements List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-spartan-red" />
            </div>
          ) : achievements.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No {filter} achievements found
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-card border border-border rounded-lg p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Token Info */}
                      {achievement.token && (
                        <Link
                          href={`/token/${achievement.token.mint_address}`}
                          className="text-spartan-gold hover:text-spartan-red transition-colors text-sm font-medium mb-2 inline-block"
                        >
                          {achievement.token.name} ({achievement.token.symbol})
                        </Link>
                      )}

                      {/* Achievement Details */}
                      <h3 className="text-xl font-bold text-white mb-2">{achievement.title}</h3>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-muted rounded-lg text-sm text-white">
                          {achievement.achievement_type}
                        </span>
                        {achievement.category && (
                          <span className="px-3 py-1 bg-muted rounded-lg text-sm text-white">
                            {achievement.category}
                          </span>
                        )}
                        {achievement.amount && (
                          <span className="px-3 py-1 bg-spartan-gold/20 border border-spartan-gold rounded-lg text-sm text-spartan-gold">
                            {achievement.amount}
                          </span>
                        )}
                      </div>

                      {achievement.description && (
                        <p className="text-muted-foreground mb-3">{achievement.description}</p>
                      )}

                      {achievement.proof_url && (
                        <a
                          href={achievement.proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-spartan-gold hover:text-spartan-red transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Proof
                        </a>
                      )}

                      <p className="text-xs text-muted-foreground mt-3">
                        Submitted {formatDistanceToNow(new Date(achievement.created_at))} ago
                      </p>

                      {achievement.verified && achievement.verified_at && (
                        <p className="text-xs text-green-500 mt-1">
                          Verified {formatDistanceToNow(new Date(achievement.verified_at))} ago
                        </p>
                      )}
                    </div>

                    {/* Action Buttons (only for pending) */}
                    {!achievement.verified && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleVerify(achievement.id)}
                          className="p-2 bg-green-500/20 border border-green-500 rounded-lg hover:bg-green-500/30 transition-colors"
                          title="Verify"
                        >
                          <Check className="h-5 w-5 text-green-500" />
                        </button>
                        <button
                          onClick={() => handleReject(achievement.id)}
                          className="p-2 bg-red-500/20 border border-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
                          title="Reject"
                        >
                          <X className="h-5 w-5 text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
