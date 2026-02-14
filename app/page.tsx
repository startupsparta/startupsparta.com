'use client'

import { useEffect, useState } from 'react'
import { supabase, type Database } from '@/lib/supabase'
import { Sidebar } from '@/components/sidebar'
import { TokenCard } from '@/components/token-card'
import { WaitlistForm } from '@/components/waitlist-form'
import { Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useOptionalPrivy } from '@/lib/privy-client'

type Token = Database['public']['Tables']['tokens']['Row']

export default function HomePage() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'trending' | 'new' | 'graduated'>('trending')
  const [searchQuery, setSearchQuery] = useState('')
  const { login, authenticated } = useOptionalPrivy()

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

  const categories = [
    {
      name: 'Y-Combinator',
      bgColor: 'bg-orange-500',
      logo: 'Y',
      logoColor: 'text-white',
    },
    {
      name: 'B2B SAAS',
      bgColor: 'bg-black',
      logo: 'B2B',
      logoColor: 'text-white',
    },
    {
      name: 'Sequoia Capital',
      bgColor: 'bg-white',
      borderColor: 'border-lime-400',
      logo: 'SEQUOIA',
      logoColor: 'text-gray-700',
    },
    {
      name: 'A16z',
      bgColor: 'bg-red-900',
      logo: 'A16Z',
      logoColor: 'text-white',
    },
  ]

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Search and Buttons */}
          <div className="flex items-center justify-between mb-8 gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Q Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-20 py-3 bg-card border border-border rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground">
                <kbd className="px-2 py-1 bg-muted rounded">⌘</kbd>
                <kbd className="px-2 py-1 bg-muted rounded">K</kbd>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/create"
                className="bg-spartan-gold hover:bg-spartan-gold/90 text-black font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Create coin
              </Link>
              {!authenticated && (
                <button
                  onClick={login}
                  className="bg-card hover:bg-muted text-white font-medium px-6 py-3 rounded-lg border border-border transition-colors"
                >
                  Log in
                </button>
              )}
            </div>
          </div>

          {/* Top Categories Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">Top Categories</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                </button>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-full aspect-square rounded-lg flex items-center justify-center text-2xl font-bold mb-3 ${
                      category.bgColor
                    } ${category.logoColor} ${
                      category.borderColor ? `border-4 ${category.borderColor}` : ''
                    }`}
                  >
                    {category.logo}
                  </div>
                  <p className="text-white text-sm font-medium">{category.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Waitlist Section */}
          <div className="mb-12">
            <WaitlistForm />
          </div>

          {/* Filter Buttons */}
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
