/**
 * Database Type Definitions
 *
 * TypeScript types for all database tables and their relationships.
 * These types match the Supabase schema and provide type safety throughout the app.
 *
 * Note: These types will be updated once the actual database schema is created in Supabase.
 * For now, they serve as a blueprint for what will be created.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          subscription_tier: 'free' | 'starter' | 'pro' | 'agency'
          leads_used_this_month: number
          billing_cycle_start: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          subscription_tier?: 'free' | 'starter' | 'pro' | 'agency'
          leads_used_this_month?: number
          billing_cycle_start?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          subscription_tier?: 'free' | 'starter' | 'pro' | 'agency'
          leads_used_this_month?: number
          billing_cycle_start?: string | null
          created_at?: string
        }
      }
      searches: {
        Row: {
          id: string
          user_id: string
          location: string
          industry: string | null
          radius: number | null
          requested_count: number | null
          status: 'processing' | 'completed' | 'failed'
          progress: number
          results_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          location: string
          industry?: string | null
          radius?: number | null
          requested_count?: number | null
          status?: 'processing' | 'completed' | 'failed'
          progress?: number
          results_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          location?: string
          industry?: string | null
          radius?: number | null
          requested_count?: number | null
          status?: 'processing' | 'completed' | 'failed'
          progress?: number
          results_count?: number
          created_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          search_id: string
          business_name: string
          address: string | null
          website: string | null
          phone: string | null
          email: string | null
          instagram: string | null
          facebook: string | null
          whatsapp: string | null
          linkedin: string | null
          tiktok: string | null
          has_automation: boolean
          probability_score: number | null
          industry: string | null
          google_rating: number | null
          created_at: string
        }
        Insert: {
          id?: string
          search_id: string
          business_name: string
          address?: string | null
          website?: string | null
          phone?: string | null
          email?: string | null
          instagram?: string | null
          facebook?: string | null
          whatsapp?: string | null
          linkedin?: string | null
          tiktok?: string | null
          has_automation?: boolean
          probability_score?: number | null
          industry?: string | null
          google_rating?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          search_id?: string
          business_name?: string
          address?: string | null
          website?: string | null
          phone?: string | null
          email?: string | null
          instagram?: string | null
          facebook?: string | null
          whatsapp?: string | null
          linkedin?: string | null
          tiktok?: string | null
          has_automation?: boolean
          probability_score?: number | null
          industry?: string | null
          google_rating?: number | null
          created_at?: string
        }
      }
      lead_status: {
        Row: {
          id: string
          lead_id: string
          user_id: string
          status: 'not_contacted' | 'messaged' | 'responded' | 'not_interested' | 'closed'
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          user_id: string
          status?: 'not_contacted' | 'messaged' | 'responded' | 'not_interested' | 'closed'
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          user_id?: string
          status?: 'not_contacted' | 'messaged' | 'responded' | 'not_interested' | 'closed'
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
