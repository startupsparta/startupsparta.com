'use client'

import { useState, useEffect } from 'react'
import { BondingCurve } from '@/lib/bonding-curve'
import { Loader2, X } from 'lucide-react'
import Image from 'next/image'

interface InitialBuyModalProps {
  isOpen: boolean
  tokenName: string
  tokenSymbol: string
  logoUrl: string | null // Can be blob URL or uploaded URL
  onBuy: (solAmount: number) => Promise<void>
  onSkip: () => void
}

export function InitialBuyModal({
  isOpen,
  tokenName,
  tokenSymbol,
  logoUrl,
  onBuy,
  onSkip,
}: InitialBuyModalProps) {
  const [solAmount, setSolAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [calculation, setCalculation] = useState<{
    tokensOut: number
    avgPrice: number
    priceImpact: number
    platformFee: number
  } | null>(null)

  useEffect(() => {
    if (isOpen && solAmount && parseFloat(solAmount) > 0) {
      const amount = parseFloat(solAmount)
      if (!isNaN(amount) && amount > 0) {
        const calc = BondingCurve.calculateBuyAmount(0, amount)
        setCalculation(calc)
      } else {
        setCalculation(null)
      }
    } else {
      setCalculation(null)
    }
  }, [solAmount, isOpen])

  if (!isOpen) return null

  const handleBuy = async () => {
    const amount = parseFloat(solAmount)
    if (isNaN(amount) || amount <= 0) {
      return
    }

    setLoading(true)
    try {
      await onBuy(amount)
    } catch (error) {
      console.error('Error buying tokens:', error)
      // Error handling is done in parent component
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    setSolAmount('')
    setCalculation(null)
    onSkip()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full mx-4 animate-slide-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Initial Token Purchase</h2>
          <button
            onClick={handleSkip}
            className="text-muted-foreground hover:text-white transition-colors"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            {logoUrl && (
              <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-background border border-border">
                <Image src={logoUrl} alt={tokenName} fill className="object-cover" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-white">{tokenName}</h3>
              <p className="text-muted-foreground">{tokenSymbol}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">
            SOL Amount (Optional)
          </label>
          <div className="relative">
            <input
              type="number"
              value={solAmount}
              onChange={(e) => setSolAmount(e.target.value)}
              placeholder="0.0"
              step="0.01"
              min="0"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red"
              disabled={loading}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              SOL
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            You can buy tokens immediately after creation
          </p>
        </div>

        {calculation && parseFloat(solAmount) > 0 && (
          <div className="mb-6 p-4 bg-background border border-border rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tokens you&apos;ll receive:</span>
              <span className="text-white font-medium">
                {calculation.tokensOut.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Average price:</span>
              <span className="text-white font-medium">
                {calculation.avgPrice.toExponential(4)} SOL
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Platform fee (1%):</span>
              <span className="text-white font-medium">
                {calculation.platformFee.toFixed(6)} SOL
              </span>
            </div>
            {calculation.priceImpact > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price impact:</span>
                <span className="text-white font-medium">
                  {calculation.priceImpact.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSkip}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-white hover:bg-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Skip - Launch for Free
          </button>
          <button
            type="button"
            onClick={handleBuy}
            disabled={loading || !solAmount || parseFloat(solAmount) <= 0}
            className="flex-1 pump-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                Processing...
              </>
            ) : (
              `Buy ${tokenSymbol}`
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

