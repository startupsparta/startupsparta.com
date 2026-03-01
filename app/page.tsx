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
  { name: 'Y-Combinator',      imgUrl: 'https://logo.clearbit.com/ycombinator.com',    bg: '#FF6600', accent: '#f97316' },
  { name: 'Techstars',         imgUrl: 'https://logo.clearbit.com/techstars.com',       bg: '#1a1a1a', accent: '#ffffff' },
  { name: 'Antler',            imgUrl: 'https://logo.clearbit.com/antler.co',           bg: '#CC2936', accent: '#ef4444' },
  { name: '500 Global',        imgUrl: 'https://logo.clearbit.com/500.co',              bg: '#0d2137', accent: '#3b82f6' },
  { name: 'Pear VC',           imgUrl: 'https://logo.clearbit.com/pear.vc',             bg: '#C8D749', accent: '#22c55e' },
  { name: 'AngelPad',          imgUrl: 'https://logo.clearbit.com/angelpad.com',        bg: '#CC2936', accent: '#ef4444' },
  { name: 'First Round',       imgUrl: 'https://logo.clearbit.com/firstround.com',      bg: '#f5f5f5', accent: '#1a1a1a' },
  { name: 'A16z',              imgUrl: 'https://logo.clearbit.com/a16z.com',            bg: '#f26522', accent: '#f97316' },
  { name: 'Sequoia Capital',   imgUrl: 'https://logo.clearbit.com/sequoiacap.com',      bg: '#2d7a4f', accent: '#22c55e' },
  { name: 'NfX',               imgUrl: 'https://logo.clearbit.com/nfx.com',             bg: '#1a3d8f', accent: '#3b82f6' },
  { name: 'Initialized Capital',imgUrl:'https://logo.clearbit.com/initialized.com',    bg: '#111111', accent: '#ffffff' },
  { name: 'Floodgate',         imgUrl: 'https://logo.clearbit.com/floodgate.com',       bg: '#1e3a8a', accent: '#60a5fa' },
  { name: 'Benchmark',         imgUrl: 'https://logo.clearbit.com/benchmark.com',       bg: '#1e3a8a', accent: '#60a5fa' },
  { name: 'Founders Fund',     imgUrl: 'https://logo.clearbit.com/foundersfund.com',    bg: '#f5f5f5', accent: '#1a1a1a' },
  { name: 'Lightspeed',        imgUrl: 'https://logo.clearbit.com/lsvp.com',            bg: '#f26522', accent: '#f97316' },
  { name: 'Accel',             imgUrl: 'https://logo.clearbit.com/accel.com',           bg: '#CC2936', accent: '#ef4444' },
  { name: 'Index Ventures',    imgUrl: 'https://logo.clearbit.com/indexventures.com',   bg: '#CC2936', accent: '#ef4444' },
  { name: 'Bessemer',          imgUrl: 'https://logo.clearbit.com/bvp.com',             bg: '#1e3a8a', accent: '#60a5fa' },
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const searchRef                           = useRef<HTMLInputElement>(null)
  
  // Fixed bubble positions to avoid hydration issues
  const bubbles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: 20 + (i * 7) % 40,
    left: (i * 23) % 100,
    top: (i * 31) % 100,
    delay: (i * 0.3) % 2,
    duration: 3 + (i * 0.4) % 4,
  }))

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
  }, [filter, selectedCategories, selectedIndustries])

  const loadTokens = async () => {
    try {
      let query = supabase.from('tokens').select('*')
      if (selectedCategories.length > 0) {
        query = query.in('category', selectedCategories)
      }

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

  const filteredTokens = tokens.filter(t => {
    // Search filter
    if (searchQuery && !t.name?.toLowerCase().includes(searchQuery.toLowerCase()) && !t.symbol?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    // Industry filter (if industry field exists)
    if (selectedIndustries.length > 0) {
      // Assuming tokens have an industry field - adjust based on your schema
      // For now, this will pass if no industry field exists
      if (t.industry && !selectedIndustries.includes(t.industry)) {
        return false
      }
    }
    return true
  })


// ─── Industry Categories ────────────────────────────────────────────────────────
const INDUSTRIES = [
  'B2B',
  'Analytics',
  'Engineering, Product and Design',
  'Finance and Accounting',
  'Human Resources',
  'Infrastructure',
  'Legal',
  'Marketing',
  'Office Management',
  'Operations',
  'Productivity',
  'Recruiting and Talent',
  'Retail',
  'Sales',
  'Security',
  'Supply Chain and Logistics',
  'Fintech',
  'Asset Management',
  'Banking and Exchange',
  'Consumer Finance',
  'Credit and Lending',
  'Insurance',
  'Payments',
  'Consumer',
  'Apparel and Cosmetics',
  'Consumer Electronics',
  'Content',
  'Food and Beverage',
  'Gaming',
  'Home and Personal',
  'Job and Career Services',
  'Social',
  'Transportation Services',
  'Travel, Leisure and Tourism',
  'Virtual and Augmented Reality',
  'Healthcare',
  'Education',
  'Industrials',
  'Real Estate and Construction',
  'Construction',
  'Housing and Real Estate',
  'Government',
  'Unspecified',
]

  return (
    <div className="flex min-h-screen" style={{ background: '#080808', fontFamily: "'DM Sans', sans-serif" }}>
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
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Top Categories</h2>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Filter by investor backing</p>
            </div>

            {/* Standard grid layout */}
            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {CATEGORIES.map((cat, i) => {
                const active = selectedCategories.includes(cat.name)
                return (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02, duration: 0.2 }}
                    className="flex flex-col items-center"
                  >
                    <motion.button
                      onClick={() => {
                        if (active) {
                          setSelectedCategories(selectedCategories.filter(c => c !== cat.name))
                        } else {
                          setSelectedCategories([...selectedCategories, cat.name])
                        }
                      }}
                      className="relative flex flex-col items-center justify-center rounded-xl overflow-hidden transition-all duration-200 shadow-lg w-full aspect-square"
                      style={{
                        background: cat.bg,
                        border: active ? `2px solid ${cat.accent}` : '1px solid rgba(255,255,255,0.1)',
                        boxShadow: active 
                          ? `0 4px 16px ${cat.accent}30` 
                          : '0 2px 8px rgba(0,0,0,0.2)',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Logo/Image with fallback */}
                      <img
                        src={cat.imgUrl}
                        alt={cat.name}
                        className="w-16 h-16 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement
                          if (fallback) fallback.classList.remove('hidden')
                        }}
                      />
                      <span className="hidden text-white font-bold text-xl">{cat.name.slice(0,2).toUpperCase()}</span>
                    </motion.button>
                    
                    {/* Category name below */}
                    <div className="mt-2 text-center w-full">
                      <div 
                        className="text-sm font-semibold"
                        style={{ 
                          color: active ? cat.accent : 'rgba(255,255,255,0.8)',
                          transition: 'color 0.2s',
                        }}
                      >
                        {cat.name}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Active filter pills */}
            {(selectedCategories.length > 0 || selectedIndustries.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex flex-wrap items-center gap-2 mt-4"
              >
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Filtering by:</span>
                {selectedCategories.map((cat) => (
                  <div key={cat} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)', color: '#ef4444' }}>
                    {cat}
                    <button onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== cat))} className="ml-1 hover:text-white transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {selectedIndustries.map((ind) => (
                  <div key={ind} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: 'rgba(245,200,66,0.12)', border: '1px solid rgba(245,200,66,0.25)', color: '#F5C842' }}>
                    {ind}
                    <button onClick={() => setSelectedIndustries(selectedIndustries.filter(i => i !== ind))} className="ml-1 hover:text-white transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {(selectedCategories.length > 0 || selectedIndustries.length > 0) && (
                  <button 
                    onClick={() => { setSelectedCategories([]); setSelectedIndustries([]); }}
                    className="text-xs px-3 py-1 rounded-full font-semibold transition-colors"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    Clear all
                  </button>
                )}
              </motion.div>
            )}
          </section>

          {/* ── INDUSTRY CATEGORIES BAR ── */}
          <section className="mb-12">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white">Industries</h2>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Filter by industry</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((industry) => {
                const active = selectedIndustries.includes(industry)
                return (
                  <motion.button
                    key={industry}
                    onClick={() => {
                      if (active) {
                        setSelectedIndustries(selectedIndustries.filter(i => i !== industry))
                      } else {
                        setSelectedIndustries([...selectedIndustries, industry])
                      }
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                    style={{
                      background: active ? 'rgba(245,200,66,0.15)' : 'rgba(255,255,255,0.05)',
                      border: active ? '1px solid rgba(245,200,66,0.4)' : '1px solid rgba(255,255,255,0.1)',
                      color: active ? '#F5C842' : 'rgba(255,255,255,0.7)',
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {industry}
                  </motion.button>
                )
              })}
            </div>
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
                {selectedCategories.length > 0 && ` • ${selectedCategories.length} VC${selectedCategories.length > 1 ? 's' : ''}`}
                {selectedIndustries.length > 0 && ` • ${selectedIndustries.length} Industr${selectedIndustries.length > 1 ? 'ies' : 'y'}`}
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
                key={`${filter}-${selectedCategories.join(',')}-${selectedIndustries.join(',')}`}
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