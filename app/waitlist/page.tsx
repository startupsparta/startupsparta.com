'use client'

import { Sidebar } from '@/components/sidebar'
import { WaitlistForm } from '@/components/waitlist-form'
import { Rocket, TrendingUp, Users, Zap } from 'lucide-react'
import Link from 'next/link'

export default function WaitlistPage() {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 pt-8">
            <div className="inline-flex items-center gap-2 bg-spartan-red/10 border border-spartan-red/20 rounded-full px-4 py-2 mb-6">
              <Rocket className="h-4 w-4 text-spartan-red" />
              <span className="text-sm font-medium text-spartan-red">Coming Soon</span>
            </div>
            
            <h1 className="text-6xl font-bold text-white mb-6">
              Join the <span className="text-spartan-gold">Startup Revolution</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Be among the first to discover and invest in the next generation of startups 
              on the Solana blockchain. Get early access to exclusive launches and features.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="bg-spartan-red/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-spartan-red" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Early Access</h3>
              <p className="text-muted-foreground text-sm">
                Get exclusive early access to new startup launches before they go public.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="bg-spartan-gold/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-spartan-gold" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Community Perks</h3>
              <p className="text-muted-foreground text-sm">
                Join a thriving community of investors and founders building the future.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="bg-spartan-red/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-spartan-red" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Updates</h3>
              <p className="text-muted-foreground text-sm">
                Be the first to know about new features, launches, and platform updates.
              </p>
            </div>
          </div>

          {/* Waitlist Form Section */}
          <div className="max-w-2xl mx-auto mb-16">
            <WaitlistForm />
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link 
              href="/"
              className="text-spartan-gold hover:text-spartan-gold/80 font-medium inline-flex items-center gap-2 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
