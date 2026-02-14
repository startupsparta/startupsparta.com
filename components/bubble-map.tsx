'use client'

import { useMemo } from 'react'

interface Holder {
  wallet_address: string
  percentage: number
}

interface BubbleMapProps {
  holders: Holder[]
}

export function BubbleMap({ holders }: BubbleMapProps) {
  const bubbles = useMemo(() => {
    // Create bubble data with calculated sizes
    return holders.map((holder, index) => {
      const size = Math.sqrt(holder.percentage) * 20 // Scale size based on percentage
      const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-red-500',
        'bg-orange-500',
      ]
      
      return {
        address: holder.wallet_address,
        percentage: holder.percentage,
        size,
        color: colors[index % colors.length]
      }
    })
  }, [holders])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <div className="relative h-96 bg-black/50 rounded-lg overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 800 400">
        {bubbles.map((bubble, index) => {
          // Simple circle packing algorithm
          const x = 100 + (index % 7) * 100
          const y = 100 + Math.floor(index / 7) * 120
          
          return (
            <g key={bubble.address}>
              <circle
                cx={x}
                cy={y}
                r={bubble.size}
                className={`${bubble.color} opacity-70 hover:opacity-100 transition-opacity cursor-pointer`}
                fill="currentColor"
              />
              <text
                x={x}
                y={y - 5}
                textAnchor="middle"
                className="text-xs fill-white font-bold"
                style={{ fontSize: '10px' }}
              >
                {bubble.percentage.toFixed(1)}%
              </text>
              <text
                x={x}
                y={y + 8}
                textAnchor="middle"
                className="text-xs fill-white/70"
                style={{ fontSize: '8px' }}
              >
                {formatAddress(bubble.address)}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
