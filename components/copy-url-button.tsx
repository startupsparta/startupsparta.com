'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function CopyUrlButton() {
  const [copied, setCopied] = useState(false)

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copyUrl}
      className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:border-spartan-gold transition-colors"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-white">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4 text-white" />
          <span className="text-white">Copy URL</span>
        </>
      )}
    </button>
  )
}
