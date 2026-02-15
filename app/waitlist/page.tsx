import { Sidebar } from '@/components/sidebar'
import { WaitlistForm } from '@/components/waitlist-form'
import { Rocket } from 'lucide-react'

export default function WaitlistPage() {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-2xl mx-auto pt-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-spartan-gold/10 rounded-full mb-6">
              <Rocket className="h-8 w-8 text-spartan-gold" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Get Early Access
            </h1>
            <p className="text-xl text-muted-foreground">
              Join the waitlist to be the first to access new features and exclusive opportunities on StartupSparta.
            </p>
          </div>

          {/* Waitlist Form */}
          <WaitlistForm />

          {/* Benefits */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-2xl mb-2">🚀</div>
              <h3 className="text-lg font-semibold text-white mb-2">Early Access</h3>
              <p className="text-sm text-muted-foreground">
                Be among the first to try new features before they&apos;re publicly available.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-2xl mb-2">💎</div>
              <h3 className="text-lg font-semibold text-white mb-2">Exclusive Deals</h3>
              <p className="text-sm text-muted-foreground">
                Get special access to high-potential token launches and reduced fees.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-2xl mb-2">📢</div>
              <h3 className="text-lg font-semibold text-white mb-2">Priority Support</h3>
              <p className="text-sm text-muted-foreground">
                Receive priority customer support and direct access to the team.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
