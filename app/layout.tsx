import './globals.css'
import type { Metadata } from 'next'
import { Providers } from '@/components/providers'
import { HowItWorksModal } from '@/components/how-it-works-modal'
import { CookieConsent } from '@/components/cookie-consent'

export const metadata: Metadata = {
  title: 'StartupSparta - Launch Your Startup Token',
  description: 'The bonding curve platform for startups. Launch tokens, build community, graduate to Raydium.',
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
      <body className="font-sans antialiased">
        <Providers>
          <HowItWorksModal />
          <CookieConsent />
          {children}
        </Providers>
      </body>
    </html>
  )
}
