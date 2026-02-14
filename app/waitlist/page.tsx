'use client'

import { motion } from 'framer-motion'
import { Lock, Rocket, Users, TrendingUp, Zap, Shield, DollarSign, LineChart } from 'lucide-react'
import { WaitlistForm } from '@/components/waitlist-form'
import { AnimatedBackground } from '@/components/animated-background'

export default function WaitlistPage() {
  const steps = [
    {
      number: "01",
      title: "Create Your Token",
      description: "Launch in minutes. No coding required. Just fill out the form, upload your logo, and hit launch.",
      icon: Rocket,
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: "02", 
      title: "Build Your Community",
      description: "Bonding curve trading starts immediately. Early supporters buy tokens at lower prices as momentum builds.",
      icon: Users,
      color: "from-spartan-gold to-yellow-500"
    },
    {
      number: "03",
      title: "Graduate to Raydium",
      description: "Hit 170 SOL market cap and automatically graduate to Raydium DEX with permanent liquidity.",
      icon: TrendingUp,
      color: "from-spartan-red to-red-500"
    }
  ]

  const features = [
    {
      icon: Zap,
      title: "Launch in Minutes",
      description: "No coding, no complexity. Create your token in under 5 minutes."
    },
    {
      icon: Shield,
      title: "Immutable & Secure",
      description: "All data is permanent and stored on Solana blockchain."
    },
    {
      icon: DollarSign,
      title: "Fair Launch",
      description: "Bonding curve ensures early supporters benefit as you grow."
    },
    {
      icon: LineChart,
      title: "Auto-Graduate",
      description: "Hit 170 SOL and automatically list on Raydium DEX."
    },
    {
      icon: Users,
      title: "Build Community",
      description: "Real-time trading creates engaged token holders."
    },
    {
      icon: Lock,
      title: "No Rugs",
      description: "LP tokens burned, liquidity locked forever."
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-black via-spartan-red/10 to-black overflow-hidden">
        {/* Animated Background */}
        <AnimatedBackground />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          {/* Invite Only Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-spartan-gold/20 border border-spartan-gold rounded-full mb-8"
          >
            <Lock className="h-5 w-5 text-spartan-gold" />
            <span className="text-spartan-gold font-bold">INVITE ONLY</span>
          </motion.div>
          
          {/* Main Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold text-white mb-6"
          >
            Launch Your
            <br />
            <span className="text-spartan-gold">Startup Token</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-300 mb-12 max-w-2xl"
          >
            The bonding curve platform for startups. Build community, raise capital, 
            and graduate to Raydium DEX—all without writing a single line of code.
          </motion.p>
          
          {/* Waitlist Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <WaitlistForm />
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white text-center mb-16"
          >
            How It Works
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {/* Animated gradient border */}
                <div className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-20 blur-xl`} />
                
                <div className="relative bg-card border border-border rounded-xl p-8 hover:border-spartan-gold transition-all duration-300">
                  {/* Step number */}
                  <div className="text-6xl font-bold text-spartan-gold/20 mb-4">
                    {step.number}
                  </div>
                  
                  {/* Icon with animation */}
                  <div className="mb-6">
                    <step.icon className="h-12 w-12 text-spartan-gold animate-pulse" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-400">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why StartupSparta Section */}
      <section className="py-20 bg-gradient-to-b from-black to-spartan-red/5">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white text-center mb-16"
          >
            Why StartupSparta?
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 hover:border-spartan-gold transition-all"
              >
                <feature.icon className="h-10 w-10 text-spartan-gold mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-6"
          >
            Ready to Launch Your Token?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 mb-12"
          >
            Join the waitlist and be among the first to access StartupSparta.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <WaitlistForm />
          </motion.div>
        </div>
      </section>
    </div>
  )
}
