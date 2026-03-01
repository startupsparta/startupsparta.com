'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, PlusCircle, TrendingUp, FileText, User, Search, ChevronLeft, ChevronRight, Wallet, TrendingDown, ArrowUpRight } from 'lucide-react'

// ─── Real company seed data ────────────────────────────────────────────────
const COMPANIES = [
  {
    name: 'ScaleHouse Systems',
    slug: 'scalehouse',
    ticker: 'SCALE',
    logo: '',
    price: 0.0381,
    change: +24.7,
    mktCap: '$38.1K',
    raised: 42000,
    investors: 187,
    category: 'ComplianceTech',
    age: '3h',
    description: 'AI-powered OSHA & HIPAA compliance automation for dental practices.',
    bondingPct: 25,
  },
  {
    name: 'Pegasus',
    slug: 'pegasus',
    ticker: 'PEGX',
    logo: '',
    price: 0.0512,
    change: +41.2,
    mktCap: '$51.2K',
    raised: 68000,
    investors: 312,
    category: 'Logistics',
    age: '1d',
    description: 'Next-gen freight intelligence platform for last-mile delivery.',
    bondingPct: 40,
  },
  {
    name: 'StartupSparta',
    slug: 'sparta',
    ticker: 'SPTA',
    logo: '/spartan-icon-clear.png',
    price: 0.0999,
    change: +88.0,
    mktCap: '$99.9K',
    raised: 120000,
    investors: 544,
    category: 'FinTech',
    age: '5h',
    description: 'The first verified startup equity launchpad on Solana.',
    bondingPct: 71,
  },
  {
    name: 'Polymath',
    slug: 'polymath',
    ticker: 'PLYM',
    logo: '',
    price: 0.0274,
    change: -3.1,
    mktCap: '$27.4K',
    raised: 29000,
    investors: 98,
    category: 'EdTech',
    age: '2d',
    description: 'Adaptive learning OS that builds cross-domain expertise at scale.',
    bondingPct: 17,
  },
  {
    name: 'Chasi',
    slug: 'chasi',
    ticker: 'CHSI',
    logo: '',
    price: 0.0143,
    change: +12.9,
    mktCap: '$14.3K',
    raised: 18500,
    investors: 76,
    category: 'HealthTech',
    age: '6h',
    description: 'Real-time patient flow optimization for urgent care clinics.',
    bondingPct: 11,
  },
  {
    name: 'Reframe',
    slug: 'reframe',
    ticker: 'RFRM',
    logo: '',
    price: 0.0067,
    change: +7.4,
    mktCap: '$6.7K',
    raised: 8200,
    investors: 41,
    category: 'MentalHealth',
    age: '9h',
    description: 'AI therapist co-pilot reducing session documentation by 80%.',
    bondingPct: 5,
  },
]

const CATEGORIES = [
  { name: 'Y-Combinator',  short: 'Y',       bg: '#E8650A', textColor: 'white',   font: 'serif' },
  { name: 'Accel',         short: 'Accel',   bg: '#E8F0F8', textColor: '#1a1a1a', font: 'serif' },
  { name: 'Sequoia',       short: 'SEQUOIA', bg: '#2EAD6B', textColor: 'white',   font: 'sans'  },
  { name: 'A16z',          short: 'A16Z',    bg: '#5C0A14', textColor: 'white',   font: 'sans'  },
  { name: 'Founders Fund', short: 'FF',      bg: '#1a1a2e', textColor: 'white',   font: 'sans'  },
]

const NAV_ITEMS = [
  { label: 'Home',          icon: Home,      active: true  },
  { label: 'Create Token',  icon: PlusCircle, active: false },
  { label: 'Trending',      icon: TrendingUp, active: false },
  { label: 'Documentation', icon: FileText,   active: false },
  { label: 'Profile',       icon: User,       active: false },
]

// ─── Bonding bar ──────────────────────────────────────────────────────────
function BondingBar({ pct }: { pct: number }) {
  return (
    <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: 'linear-gradient(90deg, #dc2626, #f97316)' }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}

// ─── Sparkline ────────────────────────────────────────────────────────────
function Sparkline({ positive }: { positive: boolean }) {
  const pts = positive
    ? [18, 16, 20, 14, 12, 9, 7, 5, 3, 2]
    : [3, 5, 4, 7, 9, 8, 11, 13, 12, 15]
  const max = Math.max(...pts), min = Math.min(...pts), range = max - min || 1
  const w = 56, h = 22
  const coords = pts.map((p, i) => `${(i / (pts.length - 1)) * w},${h - ((p - min) / range) * h}`).join(' ')
  return (
    <svg width={w} height={h}>
      <polyline points={coords} fill="none"
        stroke={positive ? '#34d399' : '#f87171'}
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Buy/Sell Modal ───────────────────────────────────────────────────────
function TradeModal({ company, mode, onClose }: {
  company: typeof COMPANIES[0]
  mode: 'buy' | 'sell'
  onClose: () => void
}) {
  const [amount, setAmount] = useState('100')
  const sol = (parseFloat(amount || '0') * company.price).toFixed(4)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 16 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="w-72 rounded-2xl p-5 border"
        style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center shrink-0">
              <Image src={company.logo} alt={company.name} width={36} height={36} className="object-contain" onError={() => {}} />
            </div>
            <div>
              <div className="text-white font-bold text-sm">{company.name}</div>
              <div className="text-white/40 text-xs font-mono">${company.ticker}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white text-lg leading-none cursor-default">✕</button>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-1 mb-4 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {(['buy', 'sell'] as const).map(m => (
            <div key={m} className="flex-1 text-center py-2 rounded-lg text-xs font-bold cursor-default transition-all"
              style={{
                background: mode === m ? (m === 'buy' ? '#16a34a' : '#dc2626') : 'transparent',
                color: mode === m ? 'white' : 'rgba(255,255,255,0.3)',
              }}>
              {m.toUpperCase()}
            </div>
          ))}
        </div>

        {/* Amount input */}
        <div className="mb-3">
          <label className="text-xs text-white/30 font-mono tracking-widest mb-1.5 block">AMOUNT (USD)</label>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="text-white/30 text-sm">$</span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="flex-1 bg-transparent text-white text-sm outline-none"
              style={{ fontFamily: "'DM Mono', monospace" }}
            />
          </div>
        </div>

        {/* Quick amounts */}
        <div className="flex gap-1.5 mb-4">
          {['50', '100', '500', '1000'].map(v => (
            <button key={v} onClick={() => setAmount(v)}
              className="flex-1 py-1.5 rounded-lg text-xs font-mono cursor-default transition-all"
              style={{
                background: amount === v ? 'rgba(220,38,38,0.2)' : 'rgba(255,255,255,0.04)',
                color: amount === v ? '#ef4444' : 'rgba(255,255,255,0.3)',
                border: `1px solid ${amount === v ? 'rgba(220,38,38,0.3)' : 'rgba(255,255,255,0.06)'}`,
              }}>
              ${v}
            </button>
          ))}
        </div>

        {/* Summary */}
        <div className="rounded-xl p-3 mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-white/30">Token price</span>
            <span className="text-white font-mono">${company.price.toFixed(4)}</span>
          </div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-white/30">You receive</span>
            <span className="text-white font-mono">{(parseFloat(amount || '0') / company.price).toFixed(0)} ${company.ticker}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-white/30">Network fee</span>
            <span className="text-white/50 font-mono">~$0.001</span>
          </div>
        </div>

        {/* CTA */}
        <button
          className="w-full py-3 rounded-xl font-bold text-sm cursor-default transition-all"
          style={{
            background: mode === 'buy' ? '#16a34a' : '#dc2626',
            color: 'white',
          }}
        >
          {mode === 'buy' ? `Buy $${company.ticker}` : `Sell $${company.ticker}`}
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── Company Logo with fallback ────────────────────────────────────────────
function CompanyLogo({ company, size = 40 }: { company: typeof COMPANIES[0]; size?: number }) {
  const [err, setErr] = useState(!company.logo)
  if (err) {
    return (
      <div className="rounded-xl flex items-center justify-center font-black text-sm shrink-0"
        style={{ width: size, height: size, background: 'rgba(220,38,38,0.15)', color: '#ef4444', border: '1px solid rgba(220,38,38,0.2)', fontFamily: 'inherit' }}>
        {company.ticker.slice(0, 2)}
      </div>
    )
  }
  return (
    <div className="rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
      style={{ width: size, height: size, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <Image src={company.logo} alt={company.name} width={size} height={size} className="object-contain p-1" onError={() => setErr(true)} />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────
export function PlatformPreview() {
  const [activeTab, setActiveTab] = useState<'Trending' | 'New' | 'Graduated'>('Trending')
  const [catOffset, setCatOffset] = useState(0)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [tradeModal, setTradeModal] = useState<{ company: typeof COMPANIES[0]; mode: 'buy' | 'sell' } | null>(null)

  const visibleCats = CATEGORIES.slice(catOffset, catOffset + 4)

  return (
    <div
      className="w-full rounded-2xl overflow-hidden relative"
      style={{
        background: '#0d0d0d',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.8), 0 0 60px rgba(220,38,38,0.05)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ── Trade Modal ── */}
      <AnimatePresence>
        {tradeModal && (
          <TradeModal
            company={tradeModal.company}
            mode={tradeModal.mode}
            onClose={() => setTradeModal(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Browser Chrome ── */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5" style={{ background: '#0a0a0a' }}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
        </div>
        <div className="ml-3 flex-1 rounded-md px-3 py-1 text-xs font-mono text-white/25 select-none"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          startupsparta.com
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#34d399' }}>
          <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: '#34d399' }}
            animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
          LIVE
        </div>
      </div>

      {/* ── App Layout ── */}
      <div className="flex" style={{ height: '580px' }}>

        {/* ── SIDEBAR ── */}
        <div className="flex flex-col border-r border-white/5 shrink-0" style={{ width: '210px', background: '#0a0a0a' }}>
          {/* Logo */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#dc2626' }}>
              <span className="text-white text-lg select-none">⚔</span>
            </div>
            <div className="text-white/30 text-xs">Launch. Trade. Graduate.</div>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-0.5 p-3 flex-1">
            {NAV_ITEMS.map(item => (
              <div key={item.label}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-default"
                style={{
                  background: item.active ? '#dc2626' : 'transparent',
                  color: item.active ? 'white' : 'rgba(255,255,255,0.35)',
                }}>
                <item.icon size={15} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </nav>

          {/* CTAs */}
          <div className="p-3 flex flex-col gap-2 border-t border-white/5">
            <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl cursor-default font-bold text-xs"
              style={{ background: '#dc2626', color: 'white' }}>
              <PlusCircle size={13} /> Create Company Ticker
            </div>
            <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl cursor-default font-bold text-xs"
              style={{ background: '#F5C842', color: '#1a1a1a' }}>
              <Wallet size={13} /> Connect Wallet
            </div>
          </div>

          {/* Footer links */}
          <div className="px-4 py-3 border-t border-white/5">
            <div className="text-xs text-white/20 mb-2 font-mono tracking-widest">ABOUT US</div>
            {['Privacy Policy', 'Terms of Service', 'Fees'].map(l => (
              <div key={l} className="text-xs text-white/20 py-0.5 cursor-default">{l}</div>
            ))}
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 shrink-0" style={{ background: '#0d0d0d' }}>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 max-w-sm"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Search size={13} className="text-white/25" />
              <span className="text-xs text-white/20 flex-1 select-none">Search startups...</span>
              <div className="flex items-center gap-1">
                {['⌘', 'K'].map(k => (
                  <span key={k} className="text-xs text-white/20 px-1.5 py-0.5 rounded select-none"
                    style={{ background: 'rgba(255,255,255,0.06)' }}>{k}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <div className="px-4 py-2 rounded-xl text-xs font-bold cursor-default select-none"
                style={{ background: '#F5C842', color: '#1a1a1a' }}>
                Create coin
              </div>
              <div className="px-4 py-2 rounded-xl text-xs font-semibold cursor-default select-none"
                style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                Log in
              </div>
            </div>
          </div>

          {/* Scrollable area */}
          <div className="flex-1 overflow-y-auto p-5"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

            {/* ── Categories ── */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-bold text-base">Top Categories</h2>
                <div className="flex items-center gap-1">
                  {[
                    { dir: 'left',  fn: () => setCatOffset(Math.max(0, catOffset - 1)),                        dis: catOffset === 0 },
                    { dir: 'right', fn: () => setCatOffset(Math.min(CATEGORIES.length - 4, catOffset + 1)),    dis: catOffset >= CATEGORIES.length - 4 },
                  ].map(btn => (
                    <button key={btn.dir} onClick={btn.fn}
                      className="w-6 h-6 rounded-lg flex items-center justify-center cursor-default"
                      style={{ background: 'rgba(255,255,255,0.05)', color: btn.dis ? 'rgba(255,255,255,0.15)' : 'white' }}>
                      {btn.dir === 'left' ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                <AnimatePresence mode="popLayout">
                  {visibleCats.map((cat, i) => (
                    <motion.div key={cat.name}
                      initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }} transition={{ delay: i * 0.04 }}
                      className="rounded-xl overflow-hidden cursor-default flex flex-col"
                      style={{ border: '1px solid rgba(255,255,255,0.06)', aspectRatio: '1 / 1' }}
                      whileHover={{ scale: 1.04, transition: { duration: 0.15 } }}>
                      <div className="flex-1 flex flex-col items-center justify-center gap-1.5" style={{ background: cat.bg }}>
                        <span className="font-black text-base leading-none select-none"
                          style={{ color: cat.textColor, fontFamily: cat.font === 'serif' ? 'Georgia, serif' : 'inherit' }}>
                          {cat.short}
                        </span>
                        <div className="text-xs text-center px-1 truncate w-full text-center select-none"
                          style={{ color: cat.textColor, opacity: 0.7, fontSize: '9px' }}>
                          {cat.name}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Trending Startups ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-bold text-base">Trending Startups</h2>
                <div className="flex items-center gap-1.5">
                  {(['Trending', 'New', 'Graduated'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-default transition-all"
                      style={{
                        background: activeTab === tab ? '#dc2626' : 'rgba(255,255,255,0.04)',
                        color: activeTab === tab ? 'white' : 'rgba(255,255,255,0.35)',
                        border: `1px solid ${activeTab === tab ? 'rgba(220,38,38,0.4)' : 'rgba(255,255,255,0.06)'}`,
                      }}>
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table header */}
              <div className="grid mb-1 px-2"
                style={{ gridTemplateColumns: '2.2fr 0.9fr 0.9fr 0.9fr 1fr 120px' }}>
                {['Token', 'Price', 'Change', 'Mkt Cap', 'Chart', ''].map(h => (
                  <div key={h} className="text-xs font-mono tracking-widest select-none"
                    style={{ color: 'rgba(255,255,255,0.18)' }}>
                    {h}
                  </div>
                ))}
              </div>

              {/* Rows */}
              <div className="flex flex-col gap-1">
                {COMPANIES.map((co, i) => (
                  <motion.div key={co.ticker}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    onMouseEnter={() => setHoveredRow(i)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className="grid rounded-xl px-2 py-2 cursor-default transition-all"
                    style={{
                      gridTemplateColumns: '2.2fr 0.9fr 0.9fr 0.9fr 1fr 120px',
                      background: hoveredRow === i ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.015)',
                      border: `1px solid ${hoveredRow === i ? 'rgba(220,38,38,0.18)' : 'rgba(255,255,255,0.04)'}`,
                    }}>

                    {/* Token info */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CompanyLogo company={co} size={34} />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white truncate leading-tight">{co.name}</div>
                        <div className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
                          ${co.ticker} · {co.age}
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center">
                      <span className="text-xs font-mono text-white">${co.price.toFixed(4)}</span>
                    </div>

                    {/* Change */}
                    <div className="flex items-center gap-1">
                      {co.change > 0
                        ? <TrendingUp size={10} style={{ color: '#34d399' }} />
                        : <TrendingDown size={10} style={{ color: '#f87171' }} />}
                      <span className="text-xs font-mono font-bold"
                        style={{ color: co.change > 0 ? '#34d399' : '#f87171' }}>
                        {co.change > 0 ? '+' : ''}{co.change}%
                      </span>
                    </div>

                    {/* Market cap */}
                    <div className="flex items-center">
                      <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.55)' }}>{co.mktCap}</span>
                    </div>

                    {/* Sparkline (replaces bonding bar) */}
                    <div className="flex items-center pr-3">
                      <Sparkline positive={co.change > 0} />
                    </div>

                    {/* Buy / Sell */}
                    <div className="flex items-center gap-1.5 justify-end">
                      <motion.button
                        whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setTradeModal({ company: co, mode: 'buy' })}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-default"
                        style={{ background: 'rgba(22,163,74,0.15)', color: '#4ade80', border: '1px solid rgba(22,163,74,0.25)' }}>
                        Buy
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setTradeModal({ company: co, mode: 'sell' })}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-default"
                        style={{ background: 'rgba(220,38,38,0.1)', color: '#f87171', border: '1px solid rgba(220,38,38,0.2)' }}>
                        Sell
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
