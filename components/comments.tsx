'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { usePrivy } from '@privy-io/react-auth'
import { supabase, type Database } from '@/lib/supabase'
import { Send, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

type Comment = Database['public']['Tables']['comments']['Row']

interface CommentsProps {
  tokenId: string
}

export function Comments({ tokenId }: CommentsProps) {
  const { publicKey } = useWallet()
  const { login, authenticated } = usePrivy()

  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadComments()

    const subscription = supabase
      .channel(`comments-${tokenId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments', filter: `token_id=eq.${tokenId}` },
        (payload) => {
          setComments((current) => [payload.new as Comment, ...current])
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [tokenId])

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('token_id', tokenId)
        .is('parent_id', null)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error loading comments:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!authenticated || !publicKey) {
      login()
      return
    }

    if (!newComment.trim()) return

    setLoading(true)

    try {
      const { error } = await supabase.from('comments').insert({
        token_id: tokenId,
        wallet_address: publicKey.toBase58(),
        content: newComment.trim(),
        parent_id: null,
      })

      if (error) throw error

      setNewComment('')
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-bold text-white mb-4">Comments</h3>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={authenticated ? 'Share your thoughts...' : 'Connect wallet to comment'}
            disabled={!authenticated}
            className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-spartan-red disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !authenticated || !newComment.trim()}
            className="px-4 py-2 bg-spartan-red text-white rounded-lg hover:bg-spartan-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No comments yet. Be the first!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-background rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-mono text-spartan-gold">
                  {comment.wallet_address.slice(0, 4)}...{comment.wallet_address.slice(-4)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </p>
              </div>
              <p className="text-sm text-white">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
