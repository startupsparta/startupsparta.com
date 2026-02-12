'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createToken } from '@/lib/solana/create-token'
import { useWallet } from '@solana/wallet-adapter-react'
import { Loader2, X, Plus, Upload, AlertCircle } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'

interface Founder {
  name: string
  socialUrl: string
}

export function CreateTokenForm({ walletAddress }: { walletAddress: string }) {
  const router = useRouter()
  const wallet = useWallet()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form fields
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [description, setDescription] = useState('')
  
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
  const [banner, setBanner] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [productVideo, setProductVideo] = useState<File | null>(null)
  const [founderVideo, setFounderVideo] = useState<File | null>(null)
  
  // Initial buy amount
  const [initialBuySol, setInitialBuySol] = useState('')
  const [showBuyModal, setShowBuyModal] = useState(false)

  // Logo dropzone
  const logoDropzone = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
    },
    maxSize: 15 * 1024 * 1024, // 15MB
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) {
        setLogo(file)
        setLogoPreview(URL.createObjectURL(file))
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
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) {
        setBanner(file)
        setBannerPreview(URL.createObjectURL(file))
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
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) setProductVideo(file)
    },
  })

  // Founder video dropzone
  const founderVideoDropzone = useDropzone({
    accept: {
      'video/mp4': ['.mp4'],
    },
    maxSize: 30 * 1024 * 1024, // 30MB
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) setFounderVideo(file)
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
    
    // Validate at least one founder with name
    const validFounders = founders.filter(f => f.name.trim())
    if (validFounders.length === 0) {
      setError('At least one founder is required')
      return false
    }

    setError(null)
    return true
  }

  const uploadFile = async (file: File, bucket: string): Promise<string> => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

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

      // Show initial buy modal or redirect
      if (initialBuySol && parseFloat(initialBuySol) > 0) {
        setShowBuyModal(true)
        // Handle initial buy in modal
      } else {
        router.push(`/token/${tokenData.mintAddress}`)
      }
    } catch (err) {
      console.error('Error creating token:', err)
      setError(err instanceof Error ? err.message : 'Failed to create token')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8">
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
        />
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
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-white mb-2">
                    Social URL
                  </label>
                  <input
                    type="url"
                    value={founder.socialUrl}
                    onChange={(e) => updateFounder(index, 'socialUrl', e.target.value)}
                    placeholder="LinkedIn, Twitter, etc."
                    className="w-full bg-card border border-border rounded-lg px-4 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red"
                  />
                </div>
                {founders.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFounder(index)}
                    className="mt-7 p-2 text-muted-foreground hover:text-destructive"
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
          }`}
        >
          <input {...productVideoDropzone.getInputProps()} />
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          {productVideo ? (
            <p className="text-sm text-white">{productVideo.name}</p>
          ) : (
            <>
              <p className="text-sm text-white mb-1">
                Drag and drop your video, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Video - max 30mb. '.mp4' recommended
                <br />
                Video - 16:9 or 9:16, 1080p+ recommended
              </p>
            </>
          )}
        </div>
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
          }`}
        >
          <input {...founderVideoDropzone.getInputProps()} />
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          {founderVideo ? (
            <p className="text-sm text-white">{founderVideo.name}</p>
          ) : (
            <>
              <p className="text-sm text-white mb-1">
                Drag and drop your video, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Video - max 30mb. '.mp4' recommended
                <br />
                Video - 16:9 or 9:16, 1080p+ recommended
              </p>
            </>
          )}
        </div>
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
          }`}
        >
          <input {...logoDropzone.getInputProps()} />
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
                Image - max 15mb. '.jpg', '.gif' or '.png' recommended
                <br />
                Image - min. 1000x1000px, 1:1 square recommended
              </p>
            </>
          )}
        </div>
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
          }`}
        >
          <input {...bannerDropzone.getInputProps()} />
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
                Image - max 4.3mb. '.jpg', '.gif' or '.png' recommended
                <br />
                3:1 aspect ratio, 1500x500px recommended
              </p>
            </>
          )}
        </div>
      </div>

      {/* Warning */}
      <div className="mb-6 p-4 bg-spartan-gold/10 border border-spartan-gold rounded-lg">
        <p className="text-sm text-spartan-gold font-medium">
          ⚠️ Company data (social links, banner, etc) can only be added now, and can't be changed or edited after creation
        </p>
      </div>

      {/* Optional Initial Buy */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white mb-2">
          Initial Buy Amount (Optional)
        </label>
        <div className="relative">
          <input
            type="number"
            value={initialBuySol}
            onChange={(e) => setInitialBuySol(e.target.value)}
            placeholder="0.0"
            step="0.01"
            min="0"
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            SOL
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          You can buy your token immediately upon creation
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full pump-button disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
            Creating Token...
          </>
        ) : (
          'Launch Company Token for Free!'
        )}
      </button>
    </form>
  )
}
