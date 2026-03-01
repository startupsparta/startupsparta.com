'use client'

import Image from 'next/image'
import Link from 'next/link'
import { type Database } from '@/lib/supabase'
import { BondingCurve } from '@/lib/bonding-curve'
import { TrendingUp, Users } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

type Token = Database['public']['Tables']['tokens']['Row']

interface TokenCardProps {
  token: Token
}

export function TokenCard({ token }: TokenCardProps) {
  const currentPrice = BondingCurve.getCurrentPrice(token.current_supply)
  const graduationProgress = BondingCurve.getGraduationProgress(token.sol_reserves)

  return (
    <Link href={`/token/${token.mint_address}`}>
      <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-spartan-red transition-all cursor-pointer group">
        {/* Banner or placeholder */}
        <div className="relative h-32 bg-gradient-to-br from-spartan-red to-spartan-gold">
          {token.banner_url ? (
            <Image
              src={token.banner_url}
              alt={token.name}
              fill
              className="object-cover"
            />
          ) : null}
          
          {/* Graduated badge */}
          {token.graduated && (
            <div className="absolute top-2 right-2 bg-spartan-gold text-black px-3 py-1 rounded-full text-xs font-bold">
              GRADUATED
            </div>
          )}
        </div>

        {/* Token info */}
        <div className="p-4">
          <div className="flex items-start gap-3 mb-3">
            {/* Logo */}
            <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 border-2 border-border">
              <Image
                src={token.image_url}
                alt={token.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Name and symbol */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white truncate group-hover:text-spartan-red transition-colors">
                {token.name}
              </h3>
              <p className="text-sm text-spartan-gold font-mono">${token.symbol}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {token.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <p className="text-xs text-muted-foreground">Market Cap</p>
              <p className="text-sm font-bold text-white">
                {token.market_cap.toFixed(2)} SOL
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="text-sm font-bold text-white">
                {(currentPrice * 1_000_000).toFixed(6)} SOL
              </p>
            </div>
          </div>

          {/* Progress bar to graduation */}
          {!token.graduated && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress to Raydium</span>
                <span>{graduationProgress.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-spartan-red to-spartan-gold transition-all duration-300"
                  style={{ width: `${Math.min(graduationProgress, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Created {formatDistanceToNow(new Date(token.created_at), { addSuffix: true })}
            </span>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
