'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useWallet } from '@solana/wallet-adapter-react'
import { useOptionalPrivy } from '@/lib/privy-client'
import { Star, Loader2 } from 'lucide-react'

interface WatchlistButtonProps {
  tokenId: string
}

export function WatchlistButton({ tokenId }: WatchlistButtonProps) {
  const wallet = useWallet()
  const { authenticated, login } = useOptionalPrivy()
  const [isWatchlisted, setIsWatchlisted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (authenticated && wallet.publicKey) {
      checkWatchlistStatus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, wallet.publicKey, tokenId])

  const checkWatchlistStatus = async () => {
    if (!wallet.publicKey) return

    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('id')
        .eq('user_wallet', wallet.publicKey.toBase58())
        .eq('token_id', tokenId)
        .single()

      if (error) {
        // PGRST116 is the error code for "no rows returned" - this is expected
        if (error.code === 'PGRST116') {
          setIsWatchlisted(false)
        } else {
          // Unexpected error - log it
          console.error('Error checking watchlist status:', error)
          setIsWatchlisted(false)
        }
        return
      }

      setIsWatchlisted(!!data)
    } catch (error) {
      console.error('Unexpected error checking watchlist:', error)
      setIsWatchlisted(false)
    }
  }

  const toggleWatchlist = async () => {
    if (!authenticated || !wallet.publicKey) {
      login()
      return
    }

    setLoading(true)

    try {
      if (isWatchlisted) {
        // Remove from watchlist
        const { error } = await supabase
          .from('watchlist')
          .delete()
          .eq('user_wallet', wallet.publicKey.toBase58())
          .eq('token_id', tokenId)

        if (error) throw error
        setIsWatchlisted(false)
      } else {
        // Add to watchlist
        const { error } = await supabase
          .from('watchlist')
          .insert({
            user_wallet: wallet.publicKey.toBase58(),
            token_id: tokenId,
          })

        if (error) throw error
        setIsWatchlisted(true)
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggleWatchlist}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        isWatchlisted
          ? 'bg-spartan-gold text-black hover:bg-spartan-gold/90'
          : 'bg-card border border-border text-white hover:border-spartan-gold'
      }`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Star className={`h-4 w-4 ${isWatchlisted ? 'fill-current' : ''}`} />
      )}
      {isWatchlisted ? 'Watchlisted' : 'Add to Watchlist'}
    </button>
  )
}
