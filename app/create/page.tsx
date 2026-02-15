'use client'

import { Sidebar } from '@/components/sidebar'
import { CreateTokenForm } from '@/components/create-token-form'

// Force dynamic rendering to avoid build-time errors
export const dynamic = 'force-dynamic'

export default function CreatePage() {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Create Company Ticker
            </h1>
            <p className="text-muted-foreground">
              Launch your startup token on the bonding curve. All data is permanent and cannot be edited after creation.
            </p>
          </div>

          <CreateTokenForm />
        </div>
      </main>
    </div>
  )
}
