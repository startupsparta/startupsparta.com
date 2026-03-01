'use client'

import Image from 'next/image'
import { WaitlistForm } from '@/components/waitlist-form'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion'
import { Shield, Zap, TrendingUp, ArrowUpRight, ChevronRight, Lock, Globe, Users } from 'lucide-react'

// ─── Mock platform data ────────────────────────────────────────────────────
const MOCK_TOKENS = [
  { name: 'NeuralPay', ticker: 'NRPL', price: 0.0412, change: +18.4, raised: 34200, investors: 142, category: 'Fintech' },
  { name: 'QuantumSeed', ticker: 'QSED', price: 0.0089, change: +52.1, raised: 12800, investors: 89, category: 'DeepTech' },
  { name: 'MediChain', ticker: 'MDCH', price: 0.0271, change: -4.2, raised: 67500, investors: 310, category: 'HealthTech' },
  { name: 'UrbanDAO', ticker: 'URBD', price: 0.0033, change: +7.8, raised: 5400, investors: 44, category: 'PropTech' },
  { name: 'SolarLink', ticker: 'SLNK', price: 0.0158, change: +31.0, raised: 28900, investors: 201, category: 'CleanTech' },
]

const MOCK_ACTIVITY = [
    { user: '0x3f...a1', action: 'bought', token: 'NRPL', amount: '$420' },
  { user: '0x9b...cc', action: 'bought', token: 'QSED', amount: '$1,200' },
  { user: '0x7e...44', action: 'sold', token: 'MDCH', amount: '$88' },
  { user: '0x2a...f9', action: 'bought', token: 'SLNK', amount: '$340' },
]

// ─── Animation variants ────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

// ─── Animated Counter ──────────────────────────────────────────────────────
function Counter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / 2000, 1)
      const e = 1 - Math.pow(1 - p, 4)
      setCount(Math.floor(e * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, target])
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

// ─── Ticker Tape ──────────────────────────────────────────────────────────
function TickerTape() {
  const items = [...MOCK_TOKENS, ...MOCK_TOKENS, ...MOCK_TOKENS]
  return (
    <div className="w-full overflow-hidden border-y border-white/5 py-2.5" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-2 text-xs font-mono shrink-0">
            <span className="text-white/30">◆</span>
            <span className="text-white/50 tracking-widest">{t.ticker}</span>
            <span className="text-white/80">${t.price.toFixed(4)}</span>
            <span className={t.change > 0 ? 'text-emerald-400' : 'text-red-400'}>
              {t.change > 0 ? '▲' : '▼'}{Math.abs(t.change)}%
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ─── Platform Preview ─────────────────────────────────────────────────────
import { PlatformPreview } from '@/components/PlatformPreview'
// ─── Main Page ────────────────────────────────────────────────────────────
export default function HomePage() {
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const heroY = useTransform(scrollY, [0, 400], [0, -60])

  return (
    <div className="min-h-screen text-white" style={{
      background: '#050505',
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Bebas+Neue&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        body { overflow-x: hidden; }
        .bebas { font-family: 'Bebas Neue', cursive; }
        .mono { font-family: 'DM Mono', monospace; }
      `}</style>

      {/* ── NAV ── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="flex items-center gap-3">
          <Image src="/spartan-icon-clear.png" alt="StartupSparta" width={32} height={32} className="rounded-lg" />
          <span className="font-bold tracking-tight text-white">StartupSparta</span>
        </div>
        <div className="flex items-center gap-6">
          {['How it works', 'Features', 'Docs'].map(item => (
            <span key={item} className="text-sm text-white/40 hover:text-white/80 cursor-pointer transition-colors">{item}</span>
          ))}
          <div
            className="text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-all"
            style={{ background: '#dc2626', color: 'white' }}
          >
            Join Waitlist
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <motion.section
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 overflow-hidden"
      >
        {/* Background grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Red glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(220,38,38,0.12) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            custom={0} variants={fadeUp} initial="hidden" animate="visible"
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-red-600/20 bg-red-600/5"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-red-400 mono tracking-widest">WAITLIST NOW OPEN</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="bebas mb-4 leading-none tracking-wide"
            style={{ fontSize: 'clamp(72px, 12vw, 160px)', color: 'white' }}
          >
            STARTUP
            <span style={{ color: '#dc2626' }}> SPARTA</span>
          </motion.h1>

          <motion.p
            custom={2} variants={fadeUp} initial="hidden" animate="visible"
            className="text-xl md:text-2xl text-white/40 mb-4 font-light max-w-2xl mx-auto"
          >
            The first verified startup equity launchpad on Solana.
          </motion.p>

          <motion.p
            custom={3} variants={fadeUp} initial="hidden" animate="visible"
            className="text-base text-white/25 mb-12 max-w-xl mx-auto leading-relaxed"
          >
            Real founders. Verified companies. Bonding curve price discovery.
            The pump.fun mechanic — built for real businesses.
          </motion.p>

          {/* CTA */}
          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="mb-6">
            <WaitlistForm />
          </motion.div>

          <motion.p
            custom={5} variants={fadeUp} initial="hidden" animate="visible"
            className="text-xs text-white/20 mono"
          >
            506(b) compliant · Privy wallet auth · Solana native
          </motion.p>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/20 mono tracking-widest">SCROLL</span>
          <motion.div
            animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent"
          />
        </motion.div>
      </motion.section>

      {/* ── TICKER ── */}
      <TickerTape />

      {/* ── STATS ── */}
      <section className="py-20 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Waitlist Members', value: 300, suffix: '+' },
            { label: 'Target Raise Cap', value: 5, prefix: '$', suffix: 'M' },
            { label: 'Avg Days to Close', value: 14, suffix: ' days' },
            { label: 'Built on Solana TPS', value: 65000, suffix: '+' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i} variants={fadeUp} initial="hidden"
              whileInView="visible" viewport={{ once: true }}
              className="text-center"
            >
              <div className="bebas text-5xl md:text-6xl text-white mb-2">
                <Counter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-white/30 mono tracking-widest">{stat.label.toUpperCase()}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PLATFORM PREVIEW ── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(220,38,38,0.05) 0%, transparent 70%)' }} />

        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-white/10 bg-white/3">
              <Lock className="w-3 h-3 text-white/40" />
              <span className="text-xs text-white/40 mono tracking-widest">PLATFORM PREVIEW</span>
            </div>
            <h2 className="bebas text-5xl md:text-7xl text-white mb-4">
              INSIDE THE <span style={{ color: '#dc2626' }}>ARENA</span>
            </h2>
            <p className="text-white/40 max-w-lg mx-auto">
              A live look at what's waiting behind the gates. Real verified startups. Real price discovery.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            <PlatformPreview />
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="bebas text-5xl md:text-7xl text-white mb-4">
              THREE <span style={{ color: '#dc2626' }}>MOVES.</span>
            </h2>
            <p className="text-white/40 text-lg max-w-md">From idea to liquid market in days, not years.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Verify & Launch',
                desc: 'Domain DNS check, company email, founder identity. Your token goes live in 48 hours. No gatekeepers.',
                icon: Shield,
              },
              {
                step: '02',
                title: 'Build & Trade',
                desc: 'Bonding curve price discovery. Your community invests directly. Price moves with conviction.',
                icon: TrendingUp,
              },
              {
                step: '03',
                title: 'Graduate',
                desc: 'Hit the 170 SOL threshold and automatically graduate to Raydium. Instant DEX liquidity.',
                icon: Zap,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="group relative p-8 rounded-2xl border border-white/6 transition-all duration-300 cursor-default"
                style={{ background: 'rgba(255,255,255,0.02)' }}
                whileHover={{ borderColor: 'rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.03)' }}
              >
                <div className="bebas text-8xl text-white/4 absolute top-4 right-6 leading-none group-hover:text-red-600/10 transition-colors">
                  {item.step}
                </div>
                <item.icon className="w-8 h-8 text-red-500 mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-xs text-red-400/60 group-hover:text-red-400 transition-colors">
                  <span className="mono">LEARN MORE</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="bebas text-5xl md:text-7xl text-white mb-4">
              BUILT <span style={{ color: '#dc2626' }}>DIFFERENT.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: 'Verified Companies', desc: 'DNS + email + founder identity. No anonymous rugs. Every listing is a real business.' },
              { icon: Globe, title: '506(b) Compliant', desc: 'Self-certification accreditation. Gated with wallet auth. No KYC paperwork.' },
              { icon: TrendingUp, title: 'Bonding Curve', desc: 'Fair price discovery from day one. Price rises with every buy. Transparent mechanics.' },
              { icon: Zap, title: 'Solana Native', desc: '$0.00025 per transaction. Sub-second finality. 65,000 TPS capacity.' },
              { icon: Users, title: 'Community Rounds', desc: 'Founders bring their existing audience. Investors become brand advocates.' },
              { icon: ArrowUpRight, title: 'Auto Graduation', desc: 'Hit the threshold and automatically deploy to Raydium. No manual steps.' },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="p-6 rounded-xl border border-white/5 transition-all duration-300 cursor-default group"
                style={{ background: 'rgba(255,255,255,0.015)' }}
                whileHover={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}
              >
                <feat.icon className="w-6 h-6 text-red-500/70 mb-4 group-hover:text-red-500 transition-colors" />
                <h3 className="font-bold text-white mb-2 text-sm">{feat.title}</h3>
                <p className="text-white/30 text-xs leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 px-6 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(220,38,38,0.1) 0%, transparent 60%)' }} />

        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <h2 className="bebas mb-6 leading-none" style={{ fontSize: 'clamp(56px, 10vw, 120px)', color: 'white' }}>
            READY TO <span style={{ color: '#dc2626' }}>FIGHT</span>?
          </h2>
          <p className="text-white/40 text-lg mb-12 max-w-lg mx-auto">
            Join the waitlist. Be first through the gates when we launch.
          </p>
          <WaitlistForm />
          <p className="text-xs text-white/15 mono mt-6">
            LAUNCH · TRADE · GRADUATE
          </p>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-8 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/spartan-icon-clear.png" alt="StartupSparta" width={24} height={24} className="rounded-md opacity-60" />
            <span className="text-sm text-white/30">StartupSparta</span>
          </div>
          <div className="text-xs text-white/15 mono">
            © {new Date().getFullYear()} · Built on Solana
          </div>
          <div className="flex gap-6">
            {['Terms', 'Privacy', 'Docs'].map(item => (
              <span key={item} className="text-xs text-white/20 hover:text-white/50 cursor-pointer transition-colors mono">{item}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
