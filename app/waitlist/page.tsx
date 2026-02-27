import { WaitlistForm } from '@/components/waitlist-form'
import { CookieConsent } from '@/components/cookie-consent'

/**
 * /waitlist — shown to visitors when NEXT_PUBLIC_LAUNCH_MODE=waitlist and
 * they have not yet unlocked dev bypass via /api/dev-access.
 *
 * Middleware rewrites / → /waitlist, so the URL in the browser stays as /.
 */
export default function WaitlistPage() {
  return (
    <div className="flex min-h-screen bg-black items-center justify-center px-4">
      <div className="text-center max-w-lg w-full">
        <h1 className="text-5xl font-bold text-white mb-4">StartupSparta</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Revolutionary bonding-curve platform for startups. Be among the first to tokenize
          equity, build community, and graduate to major exchanges on Solana.
        </p>
        <WaitlistForm />
      </div>
      <CookieConsent />
    </div>
  )
}
