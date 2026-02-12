'use client'

import { useEffect, useState } from 'react'
import { supabase, type Database } from '@/lib/supabase'
import { Trophy } from 'lucide-react'

type Holder = Database['public']['Tables']['holders']['Row']

interface HoldersListProps {
  tokenId: string
}

export function HoldersList({ tokenId }: HoldersListProps) {
  const [holders, setHolders] = useState<Holder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHolders()

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
  }, [tokenId])

  const loadHolders = async () => {
    try {
      const { data, error } = await supabase
        .from('holders')
        .select('*')
        .eq('token_id', tokenId)
        .order('balance', { ascending: false })
        .limit(10)

      if (error) throw error
      setHolders(data || [])
    } catch (error) {
      console.error('Error loading holders:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-bold text-white mb-4">Top Holders</h3>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : holders.length === 0 ? (
        <p className="text-sm text-muted-foreground">No holders yet</p>
      ) : (
        <div className="space-y-3">
          {holders.map((holder, index) => (
            <div
              key={holder.id}
              className="flex items-center justify-between p-3 bg-background rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {index < 3 ? (
                    <Trophy
                      className={`h-5 w-5 ${
                        index === 0
                          ? 'text-spartan-gold'
                          : index === 1
                          ? 'text-gray-400'
                          : 'text-orange-600'
                      }`}
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">#{index + 1}</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-mono text-white truncate max-w-[120px]">
                    {holder.wallet_address.slice(0, 4)}...{holder.wallet_address.slice(-4)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">
                  {holder.balance.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {((holder.balance / 1_000_000_000) * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
