import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StartupSparta - Join the Waitlist',
  description: 'The future of startup tokens. Join the revolution. Be first to launch on StartupSparta.',
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
        {children}
      </body>
    </html>
  )
}
