'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'
import { BubbleMap } from './bubble-map'

interface Holder {
  id: string
  wallet_address: string
  balance: number
  percentage: number
}

interface TopHoldersProps {
  tokenId: string
  totalSupply: number
  bondingCurveAddress?: string
}

export function TopHolders({ tokenId, totalSupply, bondingCurveAddress }: TopHoldersProps) {
  const [holders, setHolders] = useState<Holder[]>([])
  const [loading, setLoading] = useState(true)
  const [showBubbleMap, setShowBubbleMap] = useState(false)

  useEffect(() => {
    loadHolders()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`holders-${tokenId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'holders', filter: `token_id=eq.${tokenId}` },
        () => {
          loadHolders()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenId])

  const loadHolders = async () => {
    try {
      const { data, error } = await supabase
        .from('holders')
        .select('*')
        .eq('token_id', tokenId)
        .order('balance', { ascending: false })
        .limit(20)

      if (error) throw error

      // Calculate percentages
      const holdersWithPercentage = data.map(holder => ({
        ...holder,
        percentage: (holder.balance / totalSupply) * 100
      }))

      setHolders(holdersWithPercentage)
    } catch (error) {
      console.error('Error loading holders:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const isLiquidityPool = (address: string) => {
    return bondingCurveAddress && address === bondingCurveAddress
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-spartan-gold" />
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Top Holders</h3>
        <button
          onClick={() => setShowBubbleMap(!showBubbleMap)}
          className="text-sm text-spartan-gold hover:text-spartan-red transition-colors"
        >
          {showBubbleMap ? 'Hide' : 'Generate'} bubble map
        </button>
      </div>

      {/* Holder List */}
      <div className="space-y-3">
        {holders.map((holder, index) => (
          <div
            key={holder.id}
            className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-sm font-mono">
                {isLiquidityPool(holder.wallet_address) ? (
                  <span aria-label="Liquidity pool">Liquidity pool 💧</span>
                ) : (
                  formatAddress(holder.wallet_address)
                )}
              </span>
            </div>
            <span className="text-white font-bold">
              {holder.percentage.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      {/* Bubble Map Visualization */}
      {showBubbleMap && (
        <div className="mt-6 p-4 bg-background rounded-lg">
          <BubbleMap holders={holders} />
        </div>
      )}
    </div>
  )
}
