'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase, type Database } from '@/lib/supabase'
import { BondingCurve } from '@/lib/bonding-curve'
import { Sidebar } from '@/components/sidebar'
import { TokenChart } from '@/components/token-chart'
import { TradingInterface } from '@/components/trading-interface'
import { HoldersList } from '@/components/holders-list'
import { Comments } from '@/components/comments'
import { Loader2, ExternalLink, Globe, Send } from 'lucide-react'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'

type Token = Database['public']['Tables']['tokens']['Row']
type Founder = Database['public']['Tables']['founders']['Row']

export default function TokenPage() {
  const params = useParams()
  const mintAddress = params.address as string

  const [token, setToken] = useState<Token | null>(null)
  const [founders, setFounders] = useState<Founder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadToken()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`token-${mintAddress}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tokens',
          filter: `mint_address=eq.${mintAddress}`,
        },
        () => {
          loadToken()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [mintAddress])

  const loadToken = async () => {
    try {
      const { data: tokenData, error: tokenError } = await supabase
        .from('tokens')
        .select('*')
        .eq('mint_address', mintAddress)
        .single()

      if (tokenError) throw tokenError
      setToken(tokenData)

      // Load founders
      const { data: foundersData } = await supabase
        .from('founders')
        .select('*')
        .eq('token_id', tokenData.id)
        .order('order')

      setFounders(foundersData || [])
    } catch (error) {
      console.error('Error loading token:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-black">
        <Sidebar />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-spartan-red" />
        </main>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="flex min-h-screen bg-black">
        <Sidebar />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Token Not Found</h1>
            <p className="text-muted-foreground">This token does not exist</p>
          </div>
        </main>
      </div>
    )
  }

  const currentPrice = BondingCurve.getCurrentPrice(token.current_supply)
  const graduationProgress = BondingCurve.getGraduationProgress(token.sol_reserves)

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            {/* Banner */}
            {token.banner_url && (
              <div className="relative h-48 rounded-lg overflow-hidden mb-6">
                <Image
                  src={token.banner_url}
                  alt={token.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Token Info */}
            <div className="flex items-start gap-6">
              <div className="relative h-24 w-24 rounded-lg overflow-hidden flex-shrink-0 border-2 border-border">
                <Image
                  src={token.image_url}
                  alt={token.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{token.name}</h1>
                    <p className="text-xl text-spartan-gold font-mono">${token.symbol}</p>
                  </div>

                  {token.graduated && (
                    <div className="bg-spartan-gold text-black px-4 py-2 rounded-lg font-bold">
                      GRADUATED TO RAYDIUM
                    </div>
                  )}
                </div>

                <p className="text-muted-foreground mt-4">{token.description}</p>

                {/* Social Links */}
                <div className="flex items-center gap-4 mt-4">
                  {token.website && (
                    <a
                      href={token.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-spartan-gold hover:text-spartan-red transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  )}
                  {token.twitter && (
                    <a
                      href={token.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-spartan-gold hover:text-spartan-red transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Twitter
                    </a>
                  )}
                  {token.telegram && (
                    <a
                      href={token.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-spartan-gold hover:text-spartan-red transition-colors"
                    >
                      <Send className="h-4 w-4" />
                      Telegram
                    </a>
                  )}
                  {token.linkedin && (
                    <a
                      href={token.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-spartan-gold hover:text-spartan-red transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                </div>

                {/* Founders */}
                {founders.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Founders:</p>
                    <div className="flex flex-wrap gap-2">
                      {founders.map((founder) => (
                        <a
                          key={founder.id}
                          href={founder.social_url || undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-card border border-border px-3 py-1 rounded-lg text-sm text-white hover:border-spartan-red transition-colors"
                        >
                          {founder.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Market Cap</p>
              <p className="text-2xl font-bold text-white">{token.market_cap.toFixed(2)} SOL</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Price</p>
              <p className="text-2xl font-bold text-white">
                {(currentPrice * 1_000_000).toFixed(6)} SOL
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Liquidity</p>
              <p className="text-2xl font-bold text-white">{token.sol_reserves.toFixed(2)} SOL</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Created</p>
              <p className="text-sm font-bold text-white">
                {formatDistanceToNow(new Date(token.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          {/* Progress to Graduation */}
          {!token.graduated && (
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-white font-medium">Progress to Raydium Graduation</span>
                <span className="text-spartan-gold font-bold">{graduationProgress.toFixed(1)}%</span>
              </div>
              <div className="h-4 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-spartan-red to-spartan-gold transition-all duration-300"
                  style={{ width: `${Math.min(graduationProgress, 100)}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {token.sol_reserves.toFixed(2)} / 170 SOL in bonding curve
              </p>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Chart and Videos */}
            <div className="lg:col-span-2 space-y-6">
              <TokenChart token={token} />

              {/* Videos */}
              {(token.product_video_url || token.founder_video_url) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {token.product_video_url && (
                    <div className="bg-card border border-border rounded-lg p-4">
                      <h3 className="text-sm font-medium text-white mb-2">Product Pitch</h3>
                      <video
                        src={token.product_video_url}
                        controls
                        className="w-full rounded-lg"
                      />
                    </div>
                  )}
                  {token.founder_video_url && (
                    <div className="bg-card border border-border rounded-lg p-4">
                      <h3 className="text-sm font-medium text-white mb-2">Founder Video</h3>
                      <video
                        src={token.founder_video_url}
                        controls
                        className="w-full rounded-lg"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Comments */}
              <Comments tokenId={token.id} />
            </div>

            {/* Right Column - Trading and Holders */}
            <div className="space-y-6">
              <TradingInterface token={token} />
              <HoldersList tokenId={token.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
