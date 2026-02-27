import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key'

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      tokens: {
        Row: {
          id: string
          mint_address: string
          name: string
          symbol: string
          description: string
          image_url: string
          banner_url: string | null
          website: string | null
          telegram: string | null
          twitter: string | null
          linkedin: string | null
          product_video_url: string | null
          founder_video_url: string | null
          creator_wallet: string
          bonding_curve_address: string
          total_supply: number
          current_supply: number
          sol_reserves: number
          market_cap: number
          transaction_count: number
          holder_count: number
          status: 'active' | 'paused' | 'graduated' | 'delisted'
          verified: boolean
          featured: boolean
          graduated: boolean
          raydium_pool_address: string | null
          graduation_date: string | null
          category: string | null
          volume: number
          price_change_24h: number
          price_sol: number | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['tokens']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['tokens']['Insert']>
      }
      founders: {
        Row: {
          id: string
          token_id: string
          name: string
          social_url: string | null
          order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['founders']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['founders']['Insert']>
      }
      transactions: {
        Row: {
          id: string
          token_id: string
          wallet_address: string
          type: 'buy' | 'sell'
          sol_amount: number
          token_amount: number
          price_per_token: number
          signature: string
          timestamp: string
        }
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'timestamp'>
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>
      }
      holders: {
        Row: {
          id: string
          token_id: string
          wallet_address: string
          balance: number
          avg_buy_price: number
          total_bought_sol: number
          total_sold_sol: number
          first_purchase_at: string | null
          last_purchase_at: string | null
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['holders']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['holders']['Insert']>
      }
      comments: {
        Row: {
          id: string
          token_id: string
          wallet_address: string
          username: string | null
          content: string
          parent_id: string | null
          likes_count: number
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['comments']['Insert']>
      }
      comment_likes: {
        Row: {
          id: string
          comment_id: string
          wallet_address: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['comment_likes']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['comment_likes']['Insert']>
      }
      users: {
        Row: {
          id: string
          wallet_address: string
          username: string | null
          bio: string | null
          website: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
    }
    Views: {
      token_stats: {
        Row: {
          id: string
          mint_address: string
          name: string
          symbol: string
          market_cap: number
          sol_reserves: number
          current_supply: number
          total_supply: number
          transaction_count: number
          holder_count: number
          graduated: boolean
          verified: boolean
          featured: boolean
          status: string
          created_at: string
          total_volume_sol: number
          avg_price_24h: number
          transactions_24h: number
        }
      }
      popular_tokens: {
        Row: {
          id: string
          mint_address: string
          name: string
          symbol: string
          market_cap: number
          sol_reserves: number
          current_supply: number
          total_supply: number
          transaction_count: number
          holder_count: number
          graduated: boolean
          verified: boolean
          featured: boolean
          status: string
          created_at: string
          total_volume_sol: number
          avg_price_24h: number
          transactions_24h: number
        }
      }
      user_portfolio: {
        Row: {
          wallet_address: string
          token_id: string
          mint_address: string
          name: string
          symbol: string
          image_url: string
          balance: number
          avg_buy_price: number
          total_bought_sol: number
          total_sold_sol: number
          market_cap: number
          current_supply: number
          estimated_value_sol: number
          first_purchase_at: string | null
          last_purchase_at: string | null
        }
      }
    }
  }
}
