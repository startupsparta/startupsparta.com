'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase, type Database } from '@/lib/supabase'
import { Sidebar } from '@/components/sidebar'
import { TokenCard } from '@/components/token-card'
import { Loader2, Search, ChevronLeft, ChevronRight, X, TrendingUp, Sparkles, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { useOptionalPrivy } from '@/lib/privy-client'
import { CookieConsent } from '@/components/cookie-consent'
import { HowItWorksModal } from '@/components/how-it-works-modal'
import { UserProfileSetupModal } from '@/components/user-profile-setup-modal'
import { motion, AnimatePresence } from 'framer-motion'

type Token = Database['public']['Tables']['tokens']['Row']

// ─── Category data ────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    name: 'Y-Combinator',
    logo: 'Y',
    bg: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    textColor: '#fff',
    font: 'Georgia, serif',
    weight: '900',
    accent: '#f97316',
    count: '4,200+ companies',
  },
  {
    name: 'Accel',
    logo: 'Accel',
    bg: 'linear-gradient(135deg, #e8f4fd 0%, #dbeafe 100%)',
    textColor: '#1e3a5f',
    font: 'Georgia, serif',
    weight: '700',
    accent: '#3b82f6',
    count: '300+ portfolio',
  },
  {
    name: 'Sequoia Capital',
    logo: 'SEQUOIA',
    bg: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
    textColor: '#fefce8',
    font: 'inherit',
    weight: '800',
    accent: '#22c55e',
    count: '$85B+ managed',
  },
  {
    name: 'A16z',
    logo: 'A16Z',
    bg: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
    textColor: '#fff',
    font: 'inherit',
    weight: '900',
    accent: '#ef4444',
    count: '$35B+ AUM',
  },
  {
    name: 'Founders Fund',
    logo: 'FF',
    bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
    textColor: '#e0e7ff',
    font: 'inherit',
    weight: '900',
    accent: '#818cf8',
    count: '$11B+ raised',
  },
]

// ─── Filter tab config ─────────────────────────────────────────────────────────
const FILTERS = [
  { id: 'trending',  label: 'Trending',  icon: TrendingUp  },
  { id: 'new',       label: 'New',       icon: Sparkles    },
  { id: 'graduated', label: 'Graduated', icon: GraduationCap },
] as const

// ─── Fade/slide variants ───────────────────────────────────────────────────────
const fadeIn = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
  }),
}

export default function HomePage() {
  const [tokens, setTokens]                 = useState<Token[]>([])
  const [loading, setLoading]               = useState(true)
  const [filter, setFilter]                 = useState<'trending' | 'new' | 'graduated'>('trending')
  const [searchQuery, setSearchQuery]       = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [catOffset, setCatOffset]           = useState(0)
  const searchRef                           = useRef<HTMLInputElement>(null)

  const { login, authenticated } = useOptionalPrivy()

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    loadTokens()
    const subscription = supabase
      .channel('tokens')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tokens' }, loadTokens)
      .subscribe()
    return () => { subscription.unsubscribe() }
  }, [filter, selectedCategory])

  const loadTokens = async () => {
    try {
      let query = supabase.from('tokens').select('*')
      if (selectedCategory) query = query.eq('category', selectedCategory)

      if (filter === 'trending') {
        query = query.order('market_cap', { ascending: false }).limit(50)
      } else if (filter === 'new') {
        query = query.order('created_at', { ascending: false }).limit(50)
      } else {
        query = query.eq('graduated', true).order('created_at', { ascending: false }).limit(50)
      }

      const { data, error } = await query
      if (error) throw error
      setTokens(data || [])
    } catch (err) {
      console.error('Error loading tokens:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredTokens = tokens.filter(t =>
    !searchQuery ||
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.ticker?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const visibleCats = CATEGORIES.slice(catOffset, catOffset + 4)

  return (
    <div className="flex min-h-screen" style={{ background: '#080808', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
        .mono { font-family: 'DM Mono', monospace; }
        .cat-card:hover .cat-shine { opacity: 1; }
        .cat-shine { opacity: 0; transition: opacity 0.3s; background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%); position: absolute; inset: 0; border-radius: inherit; pointer-events: none; }
      `}</style>

      <Sidebar />

      <main className="flex-1 ml-64 min-h-screen">

        {/* ── TOP BAR ── */}
        <div
          className="sticky top-0 z-30 flex items-center gap-4 px-8 py-4 border-b"
          style={{ background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.06)' }}
        >
          {/* Search */}
          <div className="relative flex-1 max-w-sm group">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
              style={{ color: 'rgba(255,255,255,0.25)' }}
            />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search startups..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 rounded-xl text-sm text-white placeholder:text-white/25 outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(220,38,38,0.4)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
              onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="mono text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}>⌘</kbd>
                <kbd className="mono text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}>K</kbd>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Link
              href="/create"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95"
              style={{ background: '#F5C842', color: '#1a1a1a' }}
            >
              Create coin
            </Link>
            {!authenticated && (
              <button
                onClick={login}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:bg-white/8 active:scale-95"
                style={{ border: '1px solid rgba(255,255,255,0.12)' }}
              >
                Log in
              </button>
            )}
          </div>
        </div>

        <div className="px-8 py-8 max-w-7xl mx-auto">

          {/* ── TOP CATEGORIES ── */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-white">Top Categories</h2>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Filter by investor backing</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCatOffset(Math.max(0, catOffset - 1))}
                  disabled={catOffset === 0}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
                  style={{
                    background: catOffset === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.07)',
                    color: catOffset === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCatOffset(Math.min(CATEGORIES.length - 4, catOffset + 1))}
                  disabled={catOffset >= CATEGORIES.length - 4}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
                  style={{
                    background: catOffset >= CATEGORIES.length - 4 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.07)',
                    color: catOffset >= CATEGORIES.length - 4 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {visibleCats.map((cat, i) => {
                  const active = selectedCategory === cat.name
                  return (
                    <motion.button
                      key={cat.name}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ delay: i * 0.05, duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
                      onClick={() => setSelectedCategory(active ? null : cat.name)}
                      className="cat-card group relative flex flex-col rounded-2xl overflow-hidden text-left transition-all duration-200"
                      style={{
                        border: active ? `1px solid ${cat.accent}` : '1px solid rgba(255,255,255,0.07)',
                        boxShadow: active ? `0 0 20px ${cat.accent}30, 0 4px 20px rgba(0,0,0,0.4)` : '0 2px 12px rgba(0,0,0,0.3)',
                        transform: active ? 'scale(1.02)' : undefined,
                      }}
                      whileHover={{ scale: active ? 1.02 : 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Color swatch */}
                      <div
                        className="relative flex items-center justify-center"
                        style={{ background: cat.bg, height: '100px' }}
                      >
                        <div className="cat-shine" />
                        <span style={{
                          color: cat.textColor,
                          fontFamily: cat.font,
                          fontWeight: cat.weight,
                          fontSize: cat.logo.length > 3 ? '1.1rem' : cat.logo.length === 1 ? '2.5rem' : '1.4rem',
                          letterSpacing: '-0.02em',
                          textShadow: '0 1px 8px rgba(0,0,0,0.2)',
                        }}>
                          {cat.logo}
                        </span>

                        {/* Active indicator */}
                        {active && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: cat.accent }}
                          >
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </motion.div>
                        )}
                      </div>

                      {/* Label */}
                      <div className="px-3 py-2.5" style={{ background: '#111' }}>
                        <div className="text-xs font-semibold text-white truncate">{cat.name}</div>
                        <div className="text-xs mt-0.5 mono truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>{cat.count}</div>
                      </div>
                    </motion.button>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Active filter pill */}
            <AnimatePresence>
              {selectedCategory && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2 mt-4"
                >
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Filtering by:</span>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)', color: '#ef4444' }}>
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory(null)} className="ml-1 hover:text-white transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* ── FILTER TABS + HEADING ── */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <AnimatePresence mode="wait">
                <motion.h1
                  key={filter}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-2xl font-bold text-white"
                >
                  {filter === 'trending' && 'Trending Startups'}
                  {filter === 'new'      && 'New Launches'}
                  {filter === 'graduated'&& 'Graduated to Raydium'}
                </motion.h1>
              </AnimatePresence>
              <p className="text-xs mt-0.5 mono" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {filteredTokens.length} result{filteredTokens.length !== 1 ? 's' : ''}
                {selectedCategory ? ` in ${selectedCategory}` : ''}
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {FILTERS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setFilter(id)}
                  className="relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{ color: filter === id ? 'white' : 'rgba(255,255,255,0.4)' }}
                >
                  {filter === id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: '#dc2626' }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── TOKEN GRID ── */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-32 gap-4"
              >
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#dc2626' }} />
                <span className="text-sm mono" style={{ color: 'rgba(255,255,255,0.3)' }}>Loading startups...</span>
              </motion.div>
            ) : filteredTokens.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-32 gap-3"
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2"
                  style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.15)' }}>
                  <span className="text-2xl">⚔</span>
                </div>
                <p className="text-white font-semibold text-lg">No startups found</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {searchQuery ? `No results for "${searchQuery}"` : 'Be the first to launch a startup token!'}
                </p>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')}
                    className="mt-2 text-sm px-4 py-2 rounded-lg transition-colors"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>
                    Clear search
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={`${filter}-${selectedCategory}`}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {filteredTokens.map((token, i) => (
                  <motion.div
                    key={token.id}
                    custom={i}
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                  >
                    <TokenCard token={token} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <HowItWorksModal />
      </main>

      <CookieConsent />
    </div>
  )
}
