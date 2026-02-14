'use client'

import { useEffect, useState } from 'react'
import { supabase, type Database } from '@/lib/supabase'
import { Loader2, Mail, User, Calendar, Check, X } from 'lucide-react'
import Link from 'next/link'

type WaitlistEntry = Database['public']['Tables']['waitlist']['Row']

export default function AdminWaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'invited'>('all')

  const loadEntries = async () => {
    try {
      let query = supabase.from('waitlist').select('*').order('created_at', { ascending: false })

      if (filter === 'pending') {
        query = query.eq('invited', false)
      } else if (filter === 'invited') {
        query = query.eq('invited', true)
      }

      const { data, error } = await query

      if (error) throw error
      setEntries(data || [])
    } catch (error) {
      console.error('Error loading waitlist:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEntries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const handleInvite = async (id: string) => {
    try {
      const { error } = await supabase
        .from('waitlist')
        .update({
          invited: true,
          invited_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error
      
      loadEntries()
    } catch (error) {
      console.error('Error inviting user:', error)
      alert('Failed to invite user')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-spartan-gold hover:text-spartan-gold/80 text-sm mb-2 block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-white">Waitlist Management</h1>
            <p className="text-gray-400 mt-2">
              {entries.length} total entries
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-spartan-red text-white'
                  : 'bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-spartan-red text-white'
                  : 'bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('invited')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'invited'
                  ? 'bg-spartan-red text-white'
                  : 'bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              Invited
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-spartan-red" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No waitlist entries found</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Source</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-white">{entry.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">{entry.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400">{entry.source}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300">
                          {formatDate(entry.created_at)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {entry.invited ? (
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-green-500 text-sm">Invited</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <X className="h-4 w-4 text-yellow-500" />
                          <span className="text-yellow-500 text-sm">Pending</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {!entry.invited && (
                        <button
                          onClick={() => handleInvite(entry.id)}
                          className="px-4 py-2 bg-spartan-gold hover:bg-spartan-gold/90 text-black font-medium rounded-lg text-sm transition-colors"
                        >
                          Send Invite
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
