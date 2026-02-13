import Link from 'next/link'

export function DocsFooter() {
  return (
    <footer className="border-t border-border mt-16 pt-8 pb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} StartupSparta. All rights reserved.</p>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <Link 
            href="/docs/privacy-policy" 
            className="text-muted-foreground hover:text-spartan-gold transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-muted-foreground">|</span>
          <Link 
            href="/docs/terms-and-conditions" 
            className="text-muted-foreground hover:text-spartan-gold transition-colors"
          >
            Terms of Service
          </Link>
          <span className="text-muted-foreground">|</span>
          <Link 
            href="/docs/fees" 
            className="text-muted-foreground hover:text-spartan-gold transition-colors"
          >
            Fees
          </Link>
        </div>
      </div>
    </footer>
  )
}

