'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createToken, buyTokens } from '@/lib/solana/create-token'
import { BondingCurve } from '@/lib/bonding-curve'
import { useWallet } from '@solana/wallet-adapter-react'
import { useOptionalPrivy } from '@/lib/privy-client'
import { Loader2, X, Plus, Upload, AlertCircle } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { UserProfileSetupModal } from '@/components/user-profile-setup-modal'
import { InitialBuyModal } from '@/components/initial-buy-modal'

interface Founder {
  name: string
  socialUrl: string
}

type Step = 'form' | 'auth' | 'profile' | 'initial-buy' | 'creating' | 'complete'

export function CreateTokenForm() {
  const router = useRouter()
  const wallet = useWallet()
  const { login, authenticated } = useOptionalPrivy()
  
  const [step, setStep] = useState<Step>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  // Form fields
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [description, setDescription] = useState('')
  const [industry, setIndustry] = useState<string>('Unspecified')
  
  // Social links
  const [website, setWebsite] = useState('')
  const [telegram, setTelegram] = useState('')
  const [twitter, setTwitter] = useState('')
  const [linkedin, setLinkedin] = useState('')
  
  // Founders
  const [founders, setFounders] = useState<Founder[]>([{ name: '', socialUrl: '' }])
  
  // Files
  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoError, setLogoError] = useState<string | null>(null)
  const [banner, setBanner] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [bannerError, setBannerError] = useState<string | null>(null)
  const [productVideo, setProductVideo] = useState<File | null>(null)
  const [productVideoError, setProductVideoError] = useState<string | null>(null)
  const [founderVideo, setFounderVideo] = useState<File | null>(null)
  const [founderVideoError, setFounderVideoError] = useState<string | null>(null)

  // Store initial buy amount from modal
  const [initialBuyAmount, setInitialBuyAmount] = useState<number>(0)

  // Track wallet address when authenticated
  useEffect(() => {
    if (authenticated && wallet.publicKey) {
      setWalletAddress(wallet.publicKey.toBase58())
    } else {
      setWalletAddress(null)
    }
  }, [authenticated, wallet.publicKey])

  // Validate image dimensions
  const validateImageDimensions = (file: File, minWidth: number, minHeight: number, aspectRatio?: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new window.Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(url)
        const valid = img.width >= minWidth && img.height >= minHeight && 
                     (!aspectRatio || Math.abs(img.width / img.height - aspectRatio) < 0.1)
        resolve(valid)
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(false)
      }
      img.src = url
    })
  }

  // Validate video dimensions
  const validateVideoDimensions = (file: File, aspectRatios: number[]): Promise<boolean> => {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      const url = URL.createObjectURL(file)
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(url)
        const aspectRatio = video.videoWidth / video.videoHeight
        const valid = aspectRatios.some(ar => Math.abs(aspectRatio - ar) < 0.1)
        resolve(valid)
      }
      video.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(false)
      }
      video.src = url
    })
  }

  // Logo dropzone
  const logoDropzone = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
    },
    maxSize: 15 * 1024 * 1024, // 15MB
    maxFiles: 1,
    onDrop: async (acceptedFiles, rejectedFiles) => {
      setLogoError(null)
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]
        if (rejection.errors.some(e => e.code === 'file-too-large')) {
          setLogoError('File size must be less than 15MB')
        } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
          setLogoError('File must be .jpg, .gif, or .png')
        } else {
          setLogoError('Invalid file')
        }
        return
      }
      const file = acceptedFiles[0]
      if (file) {
        const isValid = await validateImageDimensions(file, 1000, 1000, 1)
        if (!isValid) {
          setLogoError('Image must be at least 1000x1000px with 1:1 aspect ratio')
          return
        }
        setLogo(file)
        setLogoPreview(URL.createObjectURL(file))
        setLogoError(null)
      }
    },
  })

  // Banner dropzone
  const bannerDropzone = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
    },
    maxSize: 4.3 * 1024 * 1024, // 4.3MB
    maxFiles: 1,
    onDrop: async (acceptedFiles, rejectedFiles) => {
      setBannerError(null)
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]
        if (rejection.errors.some(e => e.code === 'file-too-large')) {
          setBannerError('File size must be less than 4.3MB')
        } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
          setBannerError('File must be .jpg, .gif, or .png')
        } else {
          setBannerError('Invalid file')
        }
        return
      }
      const file = acceptedFiles[0]
      if (file) {
        const isValid = await validateImageDimensions(file, 1500, 500, 3)
        if (!isValid) {
          setBannerError('Image must be at least 1500x500px with 3:1 aspect ratio')
          return
        }
        setBanner(file)
        setBannerPreview(URL.createObjectURL(file))
        setBannerError(null)
      }
    },
  })

  // Product video dropzone
  const productVideoDropzone = useDropzone({
    accept: {
      'video/mp4': ['.mp4'],
    },
    maxSize: 30 * 1024 * 1024, // 30MB
    maxFiles: 1,
    onDrop: async (acceptedFiles, rejectedFiles) => {
      setProductVideoError(null)
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]
        if (rejection.errors.some(e => e.code === 'file-too-large')) {
          setProductVideoError('File size must be less than 30MB')
        } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
          setProductVideoError('File must be .mp4')
        } else {
          setProductVideoError('Invalid file')
        }
        return
      }
      const file = acceptedFiles[0]
      if (file) {
        const isValid = await validateVideoDimensions(file, [16/9, 9/16])
        if (!isValid) {
          setProductVideoError('Video must be 16:9 or 9:16 aspect ratio, 1080p+ recommended')
          return
        }
        setProductVideo(file)
        setProductVideoError(null)
      }
    },
  })

  // Founder video dropzone
  const founderVideoDropzone = useDropzone({
    accept: {
      'video/mp4': ['.mp4'],
    },
    maxSize: 30 * 1024 * 1024, // 30MB
    maxFiles: 1,
    onDrop: async (acceptedFiles, rejectedFiles) => {
      setFounderVideoError(null)
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]
        if (rejection.errors.some(e => e.code === 'file-too-large')) {
          setFounderVideoError('File size must be less than 30MB')
        } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
          setFounderVideoError('File must be .mp4')
        } else {
          setFounderVideoError('Invalid file')
        }
        return
      }
      const file = acceptedFiles[0]
      if (file) {
        const isValid = await validateVideoDimensions(file, [16/9, 9/16])
        if (!isValid) {
          setFounderVideoError('Video must be 16:9 or 9:16 aspect ratio, 1080p+ recommended')
          return
        }
        setFounderVideo(file)
        setFounderVideoError(null)
      }
    },
  })

  const addFounder = () => {
    setFounders([...founders, { name: '', socialUrl: '' }])
  }

  const removeFounder = (index: number) => {
    setFounders(founders.filter((_, i) => i !== index))
  }

  const updateFounder = (index: number, field: 'name' | 'socialUrl', value: string) => {
    const updated = [...founders]
    updated[index][field] = value
    setFounders(updated)
  }

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setError('Company name is required')
      return false
    }
    if (!symbol.trim()) {
      setError('Ticker symbol is required')
      return false
    }
    if (symbol.length > 10) {
      setError('Ticker symbol must be 10 characters or less')
      return false
    }
    if (!description.trim()) {
      setError('Description is required')
      return false
    }
    if (!logo) {
      setError('Company logo is required')
      return false
    }
    if (logoError) {
      setError(logoError)
      return false
    }
    if (bannerError) {
      setError(bannerError)
      return false
    }
    if (productVideoError) {
      setError(productVideoError)
      return false
    }
    if (founderVideoError) {
      setError(founderVideoError)
      return false
    }
    
    // Validate at least one founder with name
    const validFounders = founders.filter(f => f.name.trim())
    if (validFounders.length === 0) {
      setError('At least one founder is required')
      return false
    }

    // Validate that each founder with a name has a non-empty socialUrl
    for (const founder of validFounders) {
      if (!founder.socialUrl || !founder.socialUrl.trim()) {
        setError('Each founder must provide a social URL')
        return false
      }
    }

    setError(null)
    return true
  }

  const checkUserProfile = async (): Promise<boolean> => {
    if (!walletAddress) return false
    
    const { data, error } = await supabase
      .from('users')
      .select('username')
      .eq('wallet_address', walletAddress)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking user profile:', error)
      return false
    }

    return data?.username ? true : false
  }

  const uploadFile = async (file: File, bucket: string): Promise<string> => {
    if (!walletAddress) throw new Error('Wallet address required for file upload')
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `${walletAddress}/${fileName}`

    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return publicUrl
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    // If not authenticated, trigger login
    if (!authenticated || !wallet.publicKey) {
      setStep('auth')
      login()
      return
    }

    // Check if user profile exists
    const hasProfile = await checkUserProfile()
    if (!hasProfile) {
      setStep('profile')
      return
    }

    // Proceed to initial buy modal
    setStep('initial-buy')
  }

  const handleProfileComplete = async () => {
    setStep('initial-buy')
  }

  const handleInitialBuyConfirm = async (solAmount: number) => {
    setInitialBuyAmount(solAmount)
    await createTokenAndLaunch()
  }

  const handleSkipBuy = async () => {
    setInitialBuyAmount(0)
    await createTokenAndLaunch()
  }

  const createTokenAndLaunch = async () => {
    if (!walletAddress || !wallet.publicKey) {
      setError('Wallet not connected')
      return
    }

    setStep('creating')
    setLoading(true)
    setError(null)

    try {
      // Upload files to Supabase Storage
      const logoUrl = await uploadFile(logo!, 'logos')
      const bannerUrl = banner ? await uploadFile(banner, 'banners') : null
      const productVideoUrl = productVideo ? await uploadFile(productVideo, 'videos') : null
      const founderVideoUrl = founderVideo ? await uploadFile(founderVideo, 'videos') : null

      // Create token on Solana
      const tokenData = await createToken(wallet, {
        name,
        symbol,
        description,
        imageUrl: logoUrl,
      })

      // Save to database
      const { data: tokenRecord, error: dbError } = await supabase
        .from('tokens')
        .insert({
          mint_address: tokenData.mintAddress,
          name,
          symbol,
          description,
          image_url: logoUrl,
          banner_url: bannerUrl,
          website: website || null,
          telegram: telegram || null,
          twitter: twitter || null,
          linkedin: linkedin || null,
          product_video_url: productVideoUrl,
          founder_video_url: founderVideoUrl,
          creator_wallet: walletAddress,
          bonding_curve_address: tokenData.bondingCurveAddress,
          total_supply: 1_000_000_000,
          current_supply: 0,
          sol_reserves: 0,
          market_cap: 0,
          graduated: false,
          industry: industry,
        })
        .select()
        .single()

      if (dbError) throw dbError

      // Save founders
      const validFounders = founders.filter(f => f.name.trim())
      if (validFounders.length > 0) {
        const founderRecords = validFounders.map((founder, index) => ({
          token_id: tokenRecord.id,
          name: founder.name,
          social_url: founder.socialUrl || '',
          order: index,
        }))

        const { error: foundersError } = await supabase
          .from('founders')
          .insert(founderRecords)

        if (foundersError) throw foundersError
      }

      // Execute initial buy if amount > 0
      if (initialBuyAmount > 0) {
        try {
          // Calculate tokens received using bonding curve math with pre-buy supply (0)
          const preBuySupply = 0
          const buyResult = await buyTokens(
            wallet,
            tokenData.mintAddress,
            tokenData.bondingCurveAddress,
            initialBuyAmount,
            preBuySupply
          )

          // Calculate updated token state
          const newSupply = preBuySupply + buyResult.tokenAmount
          const newSolReserves = BondingCurve.getTotalSolReserves(newSupply)
          const currentPrice = BondingCurve.getCurrentPrice(newSupply)
          const newMarketCap = BondingCurve.getMarketCap(newSupply, currentPrice)

          // Record transaction with calculated values
          const { error: txError } = await supabase
            .from('transactions')
            .insert({
              token_id: tokenRecord.id,
              wallet_address: walletAddress,
              type: 'buy',
              sol_amount: initialBuyAmount,
              token_amount: Math.floor(buyResult.tokenAmount),
              price_per_token: buyResult.pricePerToken,
              signature: buyResult.signature,
            })

          if (txError) {
            console.error('Error recording transaction:', txError)
            // Don't throw - token was created successfully
          }

          // Update token state
          const { error: updateError } = await supabase
            .from('tokens')
            .update({
              current_supply: Math.floor(newSupply),
              sol_reserves: newSolReserves,
              market_cap: newMarketCap,
            })
            .eq('id', tokenRecord.id)

          if (updateError) {
            console.error('Error updating token state:', updateError)
            // Don't throw - transaction was recorded
          }

          // Insert or update holder record for creator
          // The database trigger will also update the holder, but we need to set avg_buy_price and total_bought_sol
          // Using upsert to handle both insert and update cases
          const { error: holderError } = await supabase
            .from('holders')
            .upsert({
              token_id: tokenRecord.id,
              wallet_address: walletAddress,
              balance: Math.floor(buyResult.tokenAmount),
              avg_buy_price: buyResult.pricePerToken,
              total_bought_sol: initialBuyAmount,
              total_sold_sol: 0,
              first_purchase_at: new Date().toISOString(),
              last_purchase_at: new Date().toISOString(),
            }, {
              onConflict: 'token_id,wallet_address',
            })

          if (holderError) {
            console.error('Error updating holder record:', holderError)
            // Don't throw - transaction was recorded
          }
        } catch (buyError) {
          console.error('Error executing initial buy:', buyError)
          // Token was created successfully, just show error for buy
          setError(`Token created successfully, but initial buy failed: ${buyError instanceof Error ? buyError.message : 'Unknown error'}`)
        }
      }

      // Redirect to token page
      router.push(`/token/${tokenData.mintAddress}`)
    } catch (err) {
      console.error('Error creating token:', err)
      setError(err instanceof Error ? err.message : 'Failed to create token')
      setStep('form')
    } finally {
      setLoading(false)
    }
  }

  // Handle authentication state changes
  useEffect(() => {
    if (step === 'auth' && authenticated && wallet.publicKey) {
      // After successful auth, check profile
      checkUserProfile().then((hasProfile) => {
        if (hasProfile) {
          setStep('initial-buy')
        } else {
          setStep('profile')
        }
      })
    }
  }, [step, authenticated, wallet.publicKey])

  return (
    <>
      <form onSubmit={handleFormSubmit} className="bg-card border border-border rounded-lg p-8">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Company Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">
            Company Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., ScaleHouse Systems"
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red"
            required
            disabled={loading || step === 'creating'}
          />
        </div>

        {/* Ticker Symbol */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">
            Ticker Symbol *
          </label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="e.g., SCALE"
            maxLength={10}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red font-mono"
            required
            disabled={loading || step === 'creating'}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Max 10 characters
          </p>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your startup..."
            rows={4}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red resize-none"
            required
            disabled={loading || step === 'creating'}
          />
        </div>

        {/* Industry */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">
            Industry *
          </label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-spartan-red"
            required
            disabled={loading || step === 'creating'}
          >
            <option value="Unspecified">Select Industry</option>
            <option value="B2B">B2B</option>
            <option value="Consumer">Consumer</option>
            <option value="Fintech">Fintech</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Industrials">Industrials</option>
            <option value="Real Estate and Construction">Real Estate and Construction</option>
            <option value="Government">Government</option>
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            Choose the industry that best describes your company
          </p>
        </div>

        {/* Social Links */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourcompany.com"
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red"
                disabled={loading || step === 'creating'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Twitter</label>
              <input
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://twitter.com/yourcompany"
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red"
                disabled={loading || step === 'creating'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Telegram</label>
              <input
                type="url"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="https://t.me/yourcompany"
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red"
                disabled={loading || step === 'creating'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">LinkedIn</label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/company/yourcompany"
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red"
                disabled={loading || step === 'creating'}
              />
            </div>
          </div>
        </div>

        {/* Founders */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Founders *</h3>
            <button
              type="button"
              onClick={addFounder}
              className="text-sm text-spartan-gold hover:text-spartan-red flex items-center gap-1"
              disabled={loading || step === 'creating'}
            >
              <Plus className="h-4 w-4" />
              Add Founder
            </button>
          </div>
          <div className="space-y-4">
            {founders.map((founder, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-background border border-border rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Founder Name {index === 0 && '*'}
                  </label>
                  <input
                    type="text"
                    value={founder.name}
                    onChange={(e) => updateFounder(index, 'name', e.target.value)}
                    placeholder="Full name"
                    className="w-full bg-card border border-border rounded-lg px-4 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red"
                    required={index === 0}
                    disabled={loading || step === 'creating'}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-white mb-2">
                      Social URL {index === 0 && '*'}
                    </label>
                    <input
                      type="url"
                      value={founder.socialUrl}
                      onChange={(e) => updateFounder(index, 'socialUrl', e.target.value)}
                      placeholder="LinkedIn, Twitter, etc."
                      className="w-full bg-card border border-border rounded-lg px-4 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red"
                      required={index === 0}
                      disabled={loading || step === 'creating'}
                    />
                  </div>
                  {founders.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFounder(index)}
                      className="mt-7 p-2 text-muted-foreground hover:text-destructive"
                      disabled={loading || step === 'creating'}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Pitch Video */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">
            Product Pitch Video (Optional)
          </label>
          <div
            {...productVideoDropzone.getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              productVideoDropzone.isDragActive
                ? 'border-spartan-red bg-spartan-red/10'
                : 'border-border hover:border-spartan-gold'
            } ${loading || step === 'creating' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...productVideoDropzone.getInputProps()} disabled={loading || step === 'creating'} />
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            {productVideo ? (
              <p className="text-sm text-white">{productVideo.name}</p>
            ) : (
              <>
                <p className="text-sm text-white mb-1">
                  Drag and drop your video, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Video - max 30MB. '.mp4' recommended
                  <br />
                  Video - 16:9 or 9:16, 1080p+ recommended
                </p>
              </>
            )}
          </div>
          {productVideoError && (
            <p className="text-xs text-destructive mt-1">{productVideoError}</p>
          )}
        </div>

        {/* Founder Video */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">
            Founder Video (Optional)
          </label>
          <div
            {...founderVideoDropzone.getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              founderVideoDropzone.isDragActive
                ? 'border-spartan-red bg-spartan-red/10'
                : 'border-border hover:border-spartan-gold'
            } ${loading || step === 'creating' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...founderVideoDropzone.getInputProps()} disabled={loading || step === 'creating'} />
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            {founderVideo ? (
              <p className="text-sm text-white">{founderVideo.name}</p>
            ) : (
              <>
                <p className="text-sm text-white mb-1">
                  Drag and drop your video, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Video - max 30MB. '.mp4' recommended
                  <br />
                  Video - 16:9 or 9:16, 1080p+ recommended
                </p>
              </>
            )}
          </div>
          {founderVideoError && (
            <p className="text-xs text-destructive mt-1">{founderVideoError}</p>
          )}
        </div>

        {/* Company Logo */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">
            Company Logo *
          </label>
          <div
            {...logoDropzone.getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              logoDropzone.isDragActive
                ? 'border-spartan-red bg-spartan-red/10'
                : 'border-border hover:border-spartan-gold'
            } ${loading || step === 'creating' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...logoDropzone.getInputProps()} disabled={loading || step === 'creating'} />
            {logoPreview ? (
              <div className="flex flex-col items-center gap-2">
                <div className="relative h-24 w-24 rounded-lg overflow-hidden">
                  <Image src={logoPreview} alt="Logo preview" fill className="object-cover" />
                </div>
                <p className="text-sm text-white">{logo?.name}</p>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-white mb-1">
                  Drag and drop your logo, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Image - max 15MB. '.jpg', '.gif' or '.png' recommended
                  <br />
                  Image - min. 1000x1000px, 1:1 square recommended
                </p>
              </>
            )}
          </div>
          {logoError && (
            <p className="text-xs text-destructive mt-1">{logoError}</p>
          )}
        </div>

        {/* Banner */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">
            Upload Banner (Optional)
          </label>
          <p className="text-xs text-muted-foreground mb-3">
            This will be shown on the coin page in addition to the coin image. You can only do this when creating the coin, and it cannot be changed later.
          </p>
          <div
            {...bannerDropzone.getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              bannerDropzone.isDragActive
                ? 'border-spartan-red bg-spartan-red/10'
                : 'border-border hover:border-spartan-gold'
            } ${loading || step === 'creating' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...bannerDropzone.getInputProps()} disabled={loading || step === 'creating'} />
            {bannerPreview ? (
              <div className="flex flex-col items-center gap-2">
                <div className="relative h-24 w-72 rounded-lg overflow-hidden">
                  <Image src={bannerPreview} alt="Banner preview" fill className="object-cover" />
                </div>
                <p className="text-sm text-white">{banner?.name}</p>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-white mb-1">
                  Drag and drop your banner, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Image - max 4.3MB. '.jpg', '.gif' or '.png' recommended
                  <br />
                  3:1 aspect ratio, 1500x500px recommended
                </p>
              </>
            )}
          </div>
          {bannerError && (
            <p className="text-xs text-destructive mt-1">{bannerError}</p>
          )}
        </div>

        {/* Enhanced Immutability Warning */}
        <div className="mb-6 p-4 bg-spartan-gold/10 border border-spartan-gold rounded-lg">
          <p className="text-sm text-spartan-gold font-medium">
            ⚠️ Warning: All company data is permanent and cannot be changed after creation. This includes:
          </p>
          <ul className="text-xs text-spartan-gold/90 mt-2 ml-4 list-disc space-y-1">
            <li>Social links (website, Twitter, Telegram, LinkedIn)</li>
            <li>Banner image</li>
            <li>Product and founder videos</li>
            <li>Founder information</li>
          </ul>
          <p className="text-xs text-spartan-gold/90 mt-2">
            Please review all information carefully before submitting.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || step === 'creating'}
          className="w-full pump-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading || step === 'creating' ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
              {step === 'creating' ? 'Creating Token...' : 'Processing...'}
            </>
          ) : authenticated && wallet.publicKey ? (
            'Launch Company Token for Free!'
          ) : (
            'Login to Launch Company'
          )}
        </button>
      </form>

      {/* User Profile Setup Modal */}
      {step === 'profile' && walletAddress && (
        <UserProfileSetupModal
          isOpen={true}
          walletAddress={walletAddress}
          onComplete={handleProfileComplete}
        />
      )}

      {/* Initial Buy Modal */}
      {step === 'initial-buy' && (
        <InitialBuyModal
          isOpen={true}
          tokenName={name}
          tokenSymbol={symbol}
          logoUrl={logoPreview}
          onBuy={handleInitialBuyConfirm}
          onSkip={handleSkipBuy}
        />
      )}
    </>
  )
}
