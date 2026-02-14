'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface TokenStatsProps {
  tokenId: string
  currentPrice: number
}

interface Stats {
  vol24h: number
  price: number
  change5m: number
  change1h: number
  change6h: number
  change24h: number
}

export function TokenStats({ tokenId, currentPrice }: TokenStatsProps) {
  const [stats, setStats] = useState<Stats>({
    vol24h: 0,
    price: currentPrice,
    change5m: 0,
    change1h: 0,
    change6h: 0,
    change24h: 0,
  })

  useEffect(() => {
    calculateStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenId])

  const calculateStats = async () => {
    try {
      // Get 24h transactions
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('sol_amount, price_per_token, timestamp')
        .eq('token_id', tokenId)
        .gte('timestamp', twentyFourHoursAgo)
        .order('timestamp', { ascending: true })

      if (error) throw error

      // Calculate 24h volume
      const vol24h = transactions.reduce((sum, tx) => sum + tx.sol_amount, 0)

      // Calculate price changes for different time periods
      const now = Date.now()
      const fiveMinAgo = now - 5 * 60 * 1000
      const oneHourAgo = now - 60 * 60 * 1000
      const sixHoursAgo = now - 6 * 60 * 60 * 1000

      const price5mAgo = transactions.find(tx => 
        new Date(tx.timestamp).getTime() >= fiveMinAgo
      )?.price_per_token || currentPrice

      const price1hAgo = transactions.find(tx => 
        new Date(tx.timestamp).getTime() >= oneHourAgo
      )?.price_per_token || currentPrice

      const price6hAgo = transactions.find(tx => 
        new Date(tx.timestamp).getTime() >= sixHoursAgo
      )?.price_per_token || currentPrice

      const price24hAgo = transactions[0]?.price_per_token || currentPrice

      setStats({
        vol24h,
        price: currentPrice,
        change5m: ((currentPrice - price5mAgo) / price5mAgo) * 100,
        change1h: ((currentPrice - price1hAgo) / price1hAgo) * 100,
        change6h: ((currentPrice - price6hAgo) / price6hAgo) * 100,
        change24h: ((currentPrice - price24hAgo) / price24hAgo) * 100,
      })
    } catch (error) {
      console.error('Error calculating stats:', error)
    }
  }

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : ''
    const color = change >= 0 ? 'text-green-500' : 'text-red-500'
    return (
      <span className={color}>
        {sign}{change.toFixed(2)}%
      </span>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-card border border-border rounded-lg p-6">
      <div>
        <p className="text-sm text-muted-foreground mb-1">Vol 24h</p>
        <p className="text-xl font-bold text-white">
          {stats.vol24h.toLocaleString(undefined, { maximumFractionDigits: 1 })} SOL
        </p>
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground mb-1">Price</p>
        <p className="text-xl font-bold text-white">
          ${stats.price.toFixed(8)}
        </p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-1">5m</p>
        <p className="text-xl font-bold">
          {formatChange(stats.change5m)}
        </p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-1">1h</p>
        <p className="text-xl font-bold">
          {formatChange(stats.change1h)}
        </p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-1">6h</p>
        <p className="text-xl font-bold">
          {formatChange(stats.change6h)}
        </p>
      </div>
    </div>
  )
}
