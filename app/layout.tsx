import './globals.css'
import type { Metadata } from 'next'
import { Providers } from '@/components/providers'
import { CookieConsent } from '@/components/cookie-consent'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'StartupSparta - Join the Waitlist',
  description: 'Revolutionary bonding curve platform for startups. Be among the first to tokenize equity, build community, and graduate to major exchanges on Solana.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans">
        <Providers>
          <CookieConsent />
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
