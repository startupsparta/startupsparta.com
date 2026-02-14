/**
 * Company Verification Modal
 * Provides email and DNS verification options for company domains
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Mail, Globe, Copy, Check, Loader2, ArrowRight, AlertCircle } from 'lucide-react'
import { VerificationBadge, VerificationStatus } from './verification-badge'

interface CompanyVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onVerified: (data: VerificationData) => void
  initialEmail?: string
  initialDomain?: string
}

export interface VerificationData {
  domain: string
  verificationType: 'email' | 'dns'
  verificationStatus: 'email_verified' | 'dns_verified'
}

type Tab = 'email' | 'dns'

export function CompanyVerificationModal({
  isOpen,
  onClose,
  onVerified,
  initialEmail = '',
  initialDomain = '',
}: CompanyVerificationModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Email verification state
  const [email, setEmail] = useState(initialEmail)
  const [emailSent, setEmailSent] = useState(false)
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)

  // DNS verification state
  const [domain, setDomain] = useState(initialDomain)
  const [txtRecord, setTxtRecord] = useState('')
  const [verificationToken, setVerificationToken] = useState('')
  const [copied, setCopied] = useState(false)
  const [checking, setChecking] = useState(false)

  // Refs for code inputs
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer for email code
  useEffect(() => {
    if (emailSent && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
    if (countdown === 0) {
      setCanResend(true)
    }
  }, [emailSent, countdown])

  // Reset modal state
  const resetModal = () => {
    setActiveTab('email')
    setEmail(initialEmail)
    setEmailSent(false)
    setVerificationCode(['', '', '', '', '', ''])
    setCountdown(300)
    setCanResend(false)
    setDomain(initialDomain)
    setTxtRecord('')
    setVerificationToken('')
    setCopied(false)
    setLoading(false)
    setError(null)
    setSuccess(false)
    setChecking(false)
  }

  // Handle email send
  const handleSendEmail = async () => {
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/verification/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to send verification code')
        setLoading(false)
        return
      }

      setEmailSent(true)
      setCountdown(data.expiresIn || 300)
      setCanResend(false)
      
      // Focus first input
      setTimeout(() => codeInputRefs.current[0]?.focus(), 100)
    } catch (err) {
      setError('Failed to send verification code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle code input change
  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // Only allow digits

    const newCode = [...verificationCode]
    newCode[index] = value.slice(-1) // Take only the last character
    setVerificationCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus()
    }

    // Auto-verify when all digits entered
    if (index === 5 && value && newCode.every(digit => digit !== '')) {
      handleVerifyCode(newCode.join(''))
    }
  }

  // Handle code verification
  const handleVerifyCode = async (code?: string) => {
    const codeToVerify = code || verificationCode.join('')
    
    if (codeToVerify.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    setError(null)
    setLoading(true)

    try {
      const extractedDomain = email.split('@')[1]
      const response = await fetch('/api/verification/email/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: codeToVerify, domain: extractedDomain }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.message || 'Invalid verification code')
        setLoading(false)
        return
      }

      // Success!
      setSuccess(true)
      setTimeout(() => {
        onVerified({
          domain: data.domain,
          verificationType: 'email',
          verificationStatus: 'email_verified',
        })
        onClose()
        resetModal()
      }, 1500)
    } catch (err) {
      setError('Failed to verify code. Please try again.')
      setLoading(false)
    }
  }

  // Handle DNS generation
  const handleGenerateDNS = async () => {
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/verification/dns/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to generate DNS token')
        setLoading(false)
        return
      }

      setTxtRecord(data.txtRecord)
      setVerificationToken(data.token)
    } catch (err) {
      setError('Failed to generate DNS token. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle DNS verification
  const handleVerifyDNS = async () => {
    setError(null)
    setChecking(true)

    try {
      const response = await fetch('/api/verification/dns/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, token: verificationToken }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.message || 'DNS verification failed')
        setChecking(false)
        return
      }

      if (!data.verified) {
        setError(data.message || 'DNS TXT record not found. Please wait for DNS propagation.')
        setChecking(false)
        return
      }

      // Success!
      setSuccess(true)
      setTimeout(() => {
        onVerified({
          domain: data.domain,
          verificationType: 'dns',
          verificationStatus: 'dns_verified',
        })
        onClose()
        resetModal()
      }, 1500)
    } catch (err) {
      setError('Failed to verify DNS. Please try again.')
      setChecking(false)
    }
  }

  // Handle copy TXT record
  const handleCopy = async () => {
    await navigator.clipboard.writeText(txtRecord)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Handle backspace in code inputs
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Verify Company Domain</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Choose your preferred verification method
            </p>
          </div>
          <button
            onClick={() => {
              onClose()
              resetModal()
            }}
            className="text-muted-foreground hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex">
            <button
              onClick={() => setActiveTab('email')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'email'
                  ? 'border-spartan-red text-white'
                  : 'border-transparent text-muted-foreground hover:text-white'
              }`}
            >
              <Mail className="h-5 w-5 inline-block mr-2" />
              Email Verification
            </button>
            <button
              onClick={() => setActiveTab('dns')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'dns'
                  ? 'border-spartan-red text-white'
                  : 'border-transparent text-muted-foreground hover:text-white'
              }`}
            >
              <Globe className="h-5 w-5 inline-block mr-2" />
              DNS Verification
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Verification Successful!</h3>
              <p className="text-muted-foreground">
                {activeTab === 'email' ? 'Your email has been verified' : 'Your domain has been verified'}
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Email Tab */}
              {activeTab === 'email' && (
                <div className="space-y-6">
                  {!emailSent ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Company Email *
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john@company.com"
                          className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red"
                          disabled={loading}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Use your official company email address (free email providers not allowed)
                        </p>
                      </div>

                      <button
                        onClick={handleSendEmail}
                        disabled={!email || loading}
                        className="w-full pump-button disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Mail className="h-5 w-5 inline mr-2" />
                            Send Verification Code
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="bg-background/50 border border-border rounded-lg p-4">
                        <p className="text-sm text-white mb-2">
                          We've sent a 6-digit code to <strong>{email}</strong>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Code expires in {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-4 text-center">
                          Enter Verification Code
                        </label>
                        <div className="flex gap-2 justify-center mb-4">
                          {verificationCode.map((digit, index) => (
                            <input
                              key={index}
                              ref={(el) => { codeInputRefs.current[index] = el }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleCodeChange(index, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(index, e)}
                              className="w-12 h-14 text-center text-2xl font-bold bg-background border-2 border-border rounded-lg text-white focus:outline-none focus:border-spartan-red transition-colors"
                              disabled={loading}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleVerifyCode()}
                          disabled={verificationCode.join('').length !== 6 || loading}
                          className="flex-1 pump-button disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <Check className="h-5 w-5 inline mr-2" />
                              Verify Code
                            </>
                          )}
                        </button>
                        {canResend && (
                          <button
                            onClick={() => {
                              setEmailSent(false)
                              setVerificationCode(['', '', '', '', '', ''])
                              setCountdown(300)
                              setCanResend(false)
                              handleSendEmail()
                            }}
                            className="px-4 py-3 bg-background hover:bg-background/80 border border-border rounded-lg text-sm font-medium text-white transition-colors"
                          >
                            Resend Code
                          </button>
                        )}
                      </div>
                    </>
                  )}

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-400 mb-2">Email Verification</h4>
                    <ul className="text-xs text-blue-300/80 space-y-1">
                      <li>• Quick and easy verification (under 2 minutes)</li>
                      <li>• Verifies you have access to company email</li>
                      <li>• Shows "Email Verified" badge on your token</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* DNS Tab */}
              {activeTab === 'dns' && (
                <div className="space-y-6">
                  {!txtRecord ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Company Domain *
                        </label>
                        <input
                          type="text"
                          value={domain}
                          onChange={(e) => setDomain(e.target.value)}
                          placeholder="company.com"
                          className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red"
                          disabled={loading}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Enter your company's domain name (without www or https://)
                        </p>
                      </div>

                      <button
                        onClick={handleGenerateDNS}
                        disabled={!domain || loading}
                        className="w-full pump-button disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Globe className="h-5 w-5 inline mr-2" />
                            Generate TXT Record
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="bg-background/50 border border-border rounded-lg p-4">
                        <p className="text-sm text-white mb-3">
                          Add this TXT record to your DNS settings:
                        </p>
                        <div className="flex items-center gap-2 bg-black/50 border border-border rounded px-3 py-2">
                          <code className="flex-1 text-sm text-spartan-gold font-mono break-all">
                            {txtRecord}
                          </code>
                          <button
                            onClick={handleCopy}
                            className="p-2 hover:bg-white/5 rounded transition-colors"
                            title="Copy to clipboard"
                          >
                            {copied ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="bg-background/50 border border-border rounded-lg p-4">
                        <h4 className="text-sm font-medium text-white mb-3">Instructions:</h4>
                        <ol className="text-sm text-muted-foreground space-y-2">
                          <li>1. Log in to your DNS provider (GoDaddy, Cloudflare, etc.)</li>
                          <li>2. Navigate to DNS settings</li>
                          <li>3. Add a new TXT record:
                            <ul className="ml-4 mt-1 space-y-1 text-xs">
                              <li>• Type: <strong>TXT</strong></li>
                              <li>• Name: <strong>@</strong> or leave blank</li>
                              <li>• Value: <strong>{txtRecord}</strong></li>
                            </ul>
                          </li>
                          <li>4. Save and wait 5-10 minutes for propagation</li>
                          <li>5. Click "Verify DNS" below</li>
                        </ol>
                      </div>

                      <button
                        onClick={handleVerifyDNS}
                        disabled={checking}
                        className="w-full pump-button disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {checking ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                            Checking DNS...
                          </>
                        ) : (
                          <>
                            <Check className="h-5 w-5 inline mr-2" />
                            Verify DNS
                          </>
                        )}
                      </button>
                    </>
                  )}

                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-green-400 mb-2">DNS Verification</h4>
                    <ul className="text-xs text-green-300/80 space-y-1">
                      <li>• Industry-standard domain ownership proof</li>
                      <li>• Highest level of verification</li>
                      <li>• Shows "DNS Verified" badge with checkmark</li>
                      <li>• Builds more trust with investors</li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
