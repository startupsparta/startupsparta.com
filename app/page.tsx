'use client'

import { useEffect, useState } from 'react'
import { supabase, type Database } from '@/lib/supabase'
import { Sidebar } from '@/components/sidebar'
import { TokenCard } from '@/components/token-card'
import { Loader2 } from 'lucide-react'

type Token = Database['public']['Tables']['tokens']['Row']

export default function HomePage() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'trending' | 'new' | 'graduated'>('trending')

  useEffect(() => {
    loadTokens()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('tokens')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tokens' }, () => {
        loadTokens()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [filter])

  const loadTokens = async () => {
    try {
      let query = supabase.from('tokens').select('*')

      if (filter === 'trending') {
        query = query.order('market_cap', { ascending: false }).limit(50)
      } else if (filter === 'new') {
        query = query.order('created_at', { ascending: false }).limit(50)
      } else if (filter === 'graduated') {
        query = query.eq('graduated', true).order('created_at', { ascending: false }).limit(50)
      }

      const { data, error } = await query

      if (error) throw error
      setTokens(data || [])
    } catch (error) {
      console.error('Error loading tokens:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-white">
              {filter === 'trending' && 'Trending Startups'}
              {filter === 'new' && 'New Launches'}
              {filter === 'graduated' && 'Graduated to Raydium'}
            </h1>

            <div className="flex gap-2">
              <button
                onClick={() => setFilter('trending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'trending'
                    ? 'bg-spartan-red text-white'
                    : 'bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                Trending
              </button>
              <button
                onClick={() => setFilter('new')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'new'
                    ? 'bg-spartan-red text-white'
                    : 'bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                New
              </button>
              <button
                onClick={() => setFilter('graduated')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'graduated'
                    ? 'bg-spartan-red text-white'
                    : 'bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                Graduated
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-spartan-red" />
            </div>
          ) : tokens.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No tokens found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Be the first to launch a startup token!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tokens.map((token) => (
                <TokenCard key={token.id} token={token} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
