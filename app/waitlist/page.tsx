'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Check, Loader2, Sparkles } from 'lucide-react'

export default function WaitlistPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    company: '',
    role: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [scrollIndicatorOpacity, setScrollIndicatorOpacity] = useState(1)

  const formRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  const isFormInView = useInView(formRef, { once: true })
  const isFeaturesInView = useInView(featuresRef, { once: true })

  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      setScrollIndicatorOpacity(latest > 0.1 ? 0 : 1)
    })
  }, [scrollYProgress])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist')
      }

      setSubmitStatus('success')
      setFormData({
        email: '',
        name: '',
        company: '',
        role: '',
        message: '',
      })
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const features = [
    {
      title: 'Early Access',
      description: 'Be among the first to experience our platform when we launch',
    },
    {
      title: 'Exclusive Benefits',
      description: 'Get special perks and benefits reserved for early supporters',
    },
    {
      title: 'Community Updates',
      description: 'Receive regular updates about our progress and upcoming features',
    },
    {
      title: 'Priority Support',
      description: 'Get dedicated support as we grow and improve the platform',
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background gradient effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-spartan-red/5 via-black to-spartan-gold/5 pointer-events-none" />
      
      {/* Animated background orbs */}
      <motion.div
        className="fixed top-20 right-20 w-96 h-96 bg-spartan-red/10 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="fixed bottom-20 left-20 w-96 h-96 bg-spartan-gold/10 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-spartan-gold transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Sparkles className="h-5 w-5 text-spartan-gold" />
            <span className="text-sm font-medium">StartupSparta</span>
          </motion.div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="relative pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            ref={heroRef}
            style={{ opacity, scale }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-spartan-gold to-spartan-red bg-clip-text text-transparent">
                Join the Waitlist
              </h1>
            </motion.div>
            
            <motion.p
              className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Be part of the revolution in startup funding. Get early access to the platform that connects innovative startups with forward-thinking investors.
            </motion.p>

            <motion.div
              className="flex items-center justify-center gap-6 text-sm text-gray-500"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Limited spots available</span>
              </div>
              <div className="w-1 h-1 bg-gray-600 rounded-full" />
              <span>No commitment required</span>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Form Section */}
            <motion.div
              ref={formRef}
              initial={{ opacity: 0, x: -50 }}
              animate={isFormInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="order-2 md:order-1"
            >
              <div className="bg-card border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                {submitStatus === 'success' ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6"
                    >
                      <Check className="h-10 w-10 text-green-500" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-3">You're on the list!</h3>
                    <p className="text-gray-400 mb-6">
                      Thank you for joining our waitlist. We'll be in touch soon with updates and exclusive access.
                    </p>
                    <button
                      onClick={() => setSubmitStatus('idle')}
                      className="text-spartan-gold hover:text-spartan-gold/80 transition-colors"
                    >
                      Submit another entry
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email Address <span className="text-spartan-red">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-spartan-red focus:border-transparent transition-all"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-spartan-red focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-sm font-medium mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-spartan-red focus:border-transparent transition-all"
                        placeholder="Your Company"
                      />
                    </div>

                    <div>
                      <label htmlFor="role" className="block text-sm font-medium mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-spartan-red focus:border-transparent transition-all"
                        placeholder="Founder, Investor, etc."
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message (Optional)
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-spartan-red focus:border-transparent transition-all resize-none"
                        placeholder="Tell us about your interest..."
                      />
                    </div>

                    {submitStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
                      >
                        {errorMessage}
                      </motion.div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-spartan-red hover:bg-spartan-red/90 text-white font-medium py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Joining...</span>
                        </>
                      ) : (
                        <span>Join Waitlist</span>
                      )}
                    </motion.button>

                    <p className="text-xs text-gray-500 text-center">
                      By joining, you agree to receive updates about StartupSparta. You can unsubscribe at any time.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Features Section */}
            <motion.div
              ref={featuresRef}
              initial={{ opacity: 0, x: 50 }}
              animate={isFeaturesInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="space-y-6 order-1 md:order-2"
            >
              <h2 className="text-3xl font-bold mb-8">What You'll Get</h2>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:border-spartan-gold/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-br from-spartan-red/20 to-spartan-gold/20 border border-spartan-gold/30 rounded-xl p-6 backdrop-blur-sm"
              >
                <h3 className="text-xl font-semibold mb-2 text-spartan-gold">Limited Time Offer</h3>
                <p className="text-gray-300">
                  Early waitlist members will receive exclusive launch bonuses and special access to premium features.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Scroll indicator */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: scrollIndicatorOpacity }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-600 text-sm"
        >
          Scroll to explore
        </motion.div>
      </motion.div>
    </div>
  )
}
