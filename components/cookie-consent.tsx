'use client'

import { useEffect, useState } from 'react'

export function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent')
    if (!cookieConsent) {
      setIsOpen(true)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    localStorage.setItem('cookiePreferences', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
    }))
    setIsOpen(false)
  }

  const handleRejectAll = () => {
    localStorage.setItem('cookieConsent', 'rejected')
    localStorage.setItem('cookiePreferences', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
    }))
    setIsOpen(false)
  }

  const handleCustomize = () => {
    setShowCustomize(true)
  }

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', 'customized')
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences))
    setIsOpen(false)
  }

  if (!isOpen) return null

  if (showCustomize) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-6 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-4">Cookie Preferences</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <h4 className="font-semibold text-white mb-1">Necessary Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  Required for the site to function properly. Cannot be disabled.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.necessary}
                disabled
                className="w-5 h-5 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <h4 className="font-semibold text-white mb-1">Analytics Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  Help us understand how visitors interact with our website.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                className="w-5 h-5 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <h4 className="font-semibold text-white mb-1">Marketing Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  Used to deliver personalized ads and track campaign performance.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                className="w-5 h-5 rounded"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowCustomize(false)}
              className="flex-1 bg-muted hover:bg-muted/80 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSavePreferences}
              className="flex-1 bg-spartan-red hover:bg-spartan-red/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-3">
          We value your privacy
        </h2>
        
        <p className="text-muted-foreground mb-6">
          This site uses cookies to improve your browsing experience, analyze site traffic, and show personalized content.
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleRejectAll}
            className="flex-1 bg-muted hover:bg-muted/80 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Reject all
          </button>
          <button
            onClick={handleCustomize}
            className="flex-1 bg-spartan-red hover:bg-spartan-red/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Customize
          </button>
          <button
            onClick={handleAcceptAll}
            className="flex-1 bg-spartan-gold hover:bg-spartan-gold/90 text-black font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  )
}

