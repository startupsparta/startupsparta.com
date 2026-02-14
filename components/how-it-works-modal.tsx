'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export function HowItWorksModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if user has seen the modal before
    const hasSeenModal = localStorage.getItem('hasSeenHowItWorks')
    if (!hasSeenModal) {
      setIsOpen(true)
    }
  }, [])

  const handleReady = () => {
    localStorage.setItem('hasSeenHowItWorks', 'true')
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred background overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={handleReady}
      />
      
      {/* Modal content */}
      <div className="relative bg-card border border-border rounded-2xl p-8 max-w-2xl w-full mx-auto shadow-2xl animate-slide-in">
        {/* Title */}
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          How it works
        </h2>

        {/* Explanation */}
        <p className="text-foreground text-center mb-8 text-lg leading-relaxed">
          StartupSparta allows <span className="text-spartan-gold font-semibold">anyone</span> to create startup tokens. All tokens created on StartupSparta are <span className="text-spartan-gold font-semibold">fair-launch</span>, meaning everyone has equal access to buy and sell when the token is first created.
        </p>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-4">
            <span className="text-spartan-gold font-bold text-xl flex-shrink-0">Step 1:</span>
            <p className="text-foreground text-lg">Pick a startup token that you like</p>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-spartan-gold font-bold text-xl flex-shrink-0">Step 2:</span>
            <p className="text-foreground text-lg">Buy the token on the bonding curve</p>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-spartan-gold font-bold text-xl flex-shrink-0">Step 3:</span>
            <p className="text-foreground text-lg">Sell at any time to lock in your profits or losses</p>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-muted-foreground text-sm text-center mb-6">
          By clicking this button, you agree to the terms and conditions and certify that you are over 18 years old
        </p>

        {/* CTA Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleReady}
            className="bg-spartan-gold hover:bg-spartan-gold/90 text-black font-bold py-4 px-12 rounded-lg transition-all duration-200 transform hover:scale-105 border-2 border-spartan-red"
          >
            I&apos;m ready to launch
          </button>
        </div>

        {/* Legal Links */}
        <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
          <Link 
            href="/docs/privacy-policy" 
            className="hover:text-spartan-gold underline transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Privacy policy
          </Link>
          <span>|</span>
          <Link 
            href="/docs/terms-and-conditions" 
            className="hover:text-spartan-gold underline transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Terms of service
          </Link>
          <span>|</span>
          <Link 
            href="/docs/fees" 
            className="hover:text-spartan-gold underline transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Fees
          </Link>
        </div>
      </div>
    </div>
  )
}

