'use client'

import { useEffect, useRef } from 'react'
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts'
import { type Database } from '@/lib/supabase'

type Token = Database['public']['Tables']['tokens']['Row']

interface TokenChartProps {
  token: Token
}

export function TokenChart({ token }: TokenChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: '#000000' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#1f2937' },
        horzLines: { color: '#1f2937' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#1f2937',
      },
      timeScale: {
        borderColor: '#1f2937',
        timeVisible: true,
        secondsVisible: false,
      },
    })

    chartRef.current = chart

    // Create area series
    const series = chart.addAreaSeries({
      lineColor: '#ff5252',
      topColor: 'rgba(255, 82, 82, 0.4)',
      bottomColor: 'rgba(255, 82, 82, 0.0)',
      lineWidth: 2,
    })

    seriesRef.current = series

    // Mock data - in production, fetch from transactions table
    const mockData = generateMockChartData()
    series.setData(mockData)

    chart.timeScale().fitContent()

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [token])

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-lg font-bold text-white mb-4">Price Chart</h3>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  )
}

// Generate mock chart data - replace with real data from transactions
function generateMockChartData() {
  const data = []
  const now = Math.floor(Date.now() / 1000)
  const basePrice = 0.00000001

  for (let i = 0; i < 100; i++) {
    const time = now - (100 - i) * 3600 // 1 hour intervals
    const price = basePrice * (1 + i * 0.01 + Math.random() * 0.02)
    data.push({
      time,
      value: price * 1_000_000, // Display in micro-SOL for readability
    })
  }

  return data
}
