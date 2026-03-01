'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useOptionalPrivy } from '@/lib/privy-client'
import { type Database } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
import { BondingCurve } from '@/lib/bonding-curve'
import { buyTokens, sellTokens } from '@/lib/solana/create-token'
import { Loader2, ArrowDownUp } from 'lucide-react'

type Token = Database['public']['Tables']['tokens']['Row']

interface TradingInterfaceProps {
  token: Token
}

export function TradingInterface({ token }: TradingInterfaceProps) {
  const { publicKey } = useWallet()
  const wallet = useWallet()
  const { login, authenticated } = useOptionalPrivy()

  const [mode, setMode] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const solAmount = parseFloat(amount) || 0

  // Calculate quote
  const quote = mode === 'buy'
    ? BondingCurve.calculateBuyAmount(token.current_supply, solAmount)
    : BondingCurve.calculateSellAmount(token.current_supply, solAmount)

  const handleTrade = async () => {
    if (!authenticated || !publicKey) {
      login()
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Enter a valid amount')
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (mode === 'buy') {
        const buyResult = await buyTokens(
          wallet,
          token.mint_address,
          token.bonding_curve_address,
          solAmount,
          token.current_supply
        )

        // Record transaction with calculated values
        const { error: txError } = await supabase
          .from('transactions')
          .insert({
            token_id: token.id,
            wallet_address: publicKey.toBase58(),
            type: 'buy',
            sol_amount: solAmount,
            token_amount: Math.floor(buyResult.tokenAmount),
            price_per_token: buyResult.pricePerToken,
            signature: buyResult.signature,
          })

        if (txError) {
          console.error('Error recording transaction:', txError)
        }

        // Calculate and update token state
        const newSupply = token.current_supply + buyResult.tokenAmount
        const newSolReserves = BondingCurve.getTotalSolReserves(newSupply)
        const currentPrice = BondingCurve.getCurrentPrice(newSupply)
        const newMarketCap = BondingCurve.getMarketCap(newSupply, currentPrice)

        const { error: updateError } = await supabase
          .from('tokens')
          .update({
            current_supply: Math.floor(newSupply),
            sol_reserves: newSolReserves,
            market_cap: newMarketCap,
          })
          .eq('id', token.id)

        if (updateError) {
          console.error('Error updating token state:', updateError)
        }
      } else {
        await sellTokens(
          wallet,
          token.mint_address,
          token.bonding_curve_address,
          solAmount
        )
      }

      setAmount('')
      // Refresh token data and user balance
      window.location.reload() // Simple refresh for now
    } catch (err) {
      console.error('Trade error:', err)
      setError(err instanceof Error ? err.message : 'Transaction failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Trade</h3>
        <button
          onClick={() => setMode(mode === 'buy' ? 'sell' : 'buy')}
          className="p-2 rounded-lg bg-background hover:bg-muted transition-colors"
        >
          <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('buy')}
          className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
            mode === 'buy'
              ? 'bg-spartan-red text-white'
              : 'bg-background text-muted-foreground hover:text-white'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setMode('sell')}
          className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
            mode === 'sell'
              ? 'bg-spartan-red text-white'
              : 'bg-background text-muted-foreground hover:text-white'
          }`}
        >
          Sell
        </button>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          {mode === 'buy' ? 'You pay' : 'You sell'}
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            step="0.01"
            min="0"
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white font-medium">
            {mode === 'buy' ? 'SOL' : token.symbol}
          </span>
        </div>
      </div>

      {/* Quote */}
      {amount && parseFloat(amount) > 0 && (
        <div className="mb-6 p-4 bg-background rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">You receive</span>
            <span className="text-white font-medium">
              {'tokensOut' in quote
                ? `${quote.tokensOut.toLocaleString()} ${token.symbol}`
                : `${quote.solOut.toFixed(4)} SOL`}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Avg price</span>
            <span className="text-white">
              {(quote.avgPrice * 1_000_000).toFixed(6)} SOL
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Price impact</span>
            <span className={quote.priceImpact > 5 ? 'text-spartan-red' : 'text-spartan-gold'}>
              {quote.priceImpact.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Platform fee (1%)</span>
            <span className="text-muted-foreground">
              {quote.platformFee.toFixed(4)} SOL
            </span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Trade Button */}
      {!authenticated ? (
        <button onClick={login} className="w-full pump-button">
          Connect Wallet to Trade
        </button>
      ) : token.graduated ? (
        <a
          href={`https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${token.mint_address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full pump-button text-center"
        >
          Trade on Raydium
        </a>
      ) : (
        <button
          onClick={handleTrade}
          disabled={loading || !amount || parseFloat(amount) <= 0}
          className="w-full pump-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
              Processing...
            </>
          ) : (
            `${mode === 'buy' ? 'Buy' : 'Sell'} ${token.symbol}`
          )}
        </button>
      )}
    </div>
  )
}
