import Link from 'next/link'
import { DocsFooter } from '@/components/docs-footer'

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link 
          href="/" 
          className="text-spartan-gold hover:text-spartan-red transition-colors mb-8 inline-block"
        >
          ← Back to Home
        </Link>
        
        {children}
        
        <DocsFooter />
      </div>
    </div>
  )
}

