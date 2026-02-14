'use client'

import Image from 'next/image'
import { WaitlistForm } from '@/components/waitlist-form'
import { Rocket, TrendingUp, Users, Shield, Zap, Globe } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-spartan-red/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-spartan-gold/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/spartan-icon-clear.png"
              alt="StartupSparta"
              width={100}
              height={100}
              className="rounded-2xl"
            />
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-spartan-gold via-white to-spartan-red bg-clip-text text-transparent leading-tight">
            StartupSparta
          </h1>
          
          <p className="text-xl md:text-3xl text-gray-300 mb-4 font-light">
            The Future of Startup Funding
          </p>
          
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Revolutionary bonding curve platform where startups tokenize equity, 
            build community, and graduate to major exchanges.
          </p>

          {/* Waitlist Form */}
          <div className="mb-8">
            <WaitlistForm />
          </div>

          <p className="text-sm text-gray-500">
            Join <span className="text-spartan-gold font-semibold">1000+</span> innovators on the waitlist
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="text-spartan-gold">Works</span>
            </h2>
            <p className="text-xl text-gray-400">
              Three simple steps to launch your startup token
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-800 hover:border-spartan-gold/50 transition-all hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-spartan-red rounded-xl flex items-center justify-center mb-6">
                <Rocket className="w-8 h-8" />
              </div>
              <div className="text-spartan-gold font-bold text-sm mb-2">STEP 01</div>
              <h3 className="text-2xl font-bold mb-4">Launch Token</h3>
              <p className="text-gray-400">
                Create your startup token with complete company information, 
                including founders, pitch, and vision.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-800 hover:border-spartan-gold/50 transition-all hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-spartan-gold rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-black" />
              </div>
              <div className="text-spartan-gold font-bold text-sm mb-2">STEP 02</div>
              <h3 className="text-2xl font-bold mb-4">Build Community</h3>
              <p className="text-gray-400">
                Trade on our bonding curve as your community grows. 
                Fair price discovery with transparent mechanics.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-800 hover:border-spartan-gold/50 transition-all hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-spartan-red rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <div className="text-spartan-gold font-bold text-sm mb-2">STEP 03</div>
              <h3 className="text-2xl font-bold mb-4">Graduate</h3>
              <p className="text-gray-400">
                Automatically graduate to Raydium at 170 SOL threshold. 
                Instant liquidity on major DEX.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built for <span className="text-spartan-gold">Innovators</span>
            </h2>
            <p className="text-xl text-gray-400">
              Powerful features for the next generation of startups
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-black/50 rounded-xl p-6 border border-gray-800">
              <Shield className="w-12 h-12 text-spartan-gold mb-4" />
              <h3 className="text-xl font-bold mb-2">Secure & Transparent</h3>
              <p className="text-gray-400">
                Built on Solana with audited smart contracts and transparent mechanics.
              </p>
            </div>

            <div className="bg-black/50 rounded-xl p-6 border border-gray-800">
              <Users className="w-12 h-12 text-spartan-gold mb-4" />
              <h3 className="text-xl font-bold mb-2">Community First</h3>
              <p className="text-gray-400">
                Real-time comments, engagement, and community-driven growth.
              </p>
            </div>

            <div className="bg-black/50 rounded-xl p-6 border border-gray-800">
              <Globe className="w-12 h-12 text-spartan-gold mb-4" />
              <h3 className="text-xl font-bold mb-2">Global Access</h3>
              <p className="text-gray-400">
                Accessible to founders and investors worldwide, 24/7.
              </p>
            </div>

            <div className="bg-black/50 rounded-xl p-6 border border-gray-800">
              <TrendingUp className="w-12 h-12 text-spartan-gold mb-4" />
              <h3 className="text-xl font-bold mb-2">Fair Launch</h3>
              <p className="text-gray-400">
                Linear bonding curve ensures fair price discovery for everyone.
              </p>
            </div>

            <div className="bg-black/50 rounded-xl p-6 border border-gray-800">
              <Rocket className="w-12 h-12 text-spartan-gold mb-4" />
              <h3 className="text-xl font-bold mb-2">Fast & Efficient</h3>
              <p className="text-gray-400">
                Lightning-fast transactions on Solana with minimal fees.
              </p>
            </div>

            <div className="bg-black/50 rounded-xl p-6 border border-gray-800">
              <Zap className="w-12 h-12 text-spartan-gold mb-4" />
              <h3 className="text-xl font-bold mb-2">Auto Graduation</h3>
              <p className="text-gray-400">
                Automatic liquidity deployment to Raydium when threshold is hit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-spartan-red/10 to-spartan-gold/10" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Launch Your <span className="text-spartan-gold">Startup?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Be among the first to revolutionize startup funding on Solana
          </p>
          
          <WaitlistForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Image
              src="/spartan-icon-clear.png"
              alt="StartupSparta"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-xl font-bold">StartupSparta</span>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} StartupSparta. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Launch. Trade. Graduate. 🏛️
          </p>
        </div>
      </footer>
    </div>
  )
}
