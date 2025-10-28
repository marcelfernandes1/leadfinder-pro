/**
 * Database Type Definitions
 * 
 * These types match the Supabase database schema.
 * They ensure type safety when working with database records.
 */

/**
 * Subscription tier types
 */
export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'agency';

/**
 * Search status types
 */
export type SearchStatus = 'processing' | 'completed' | 'failed';

/**
 * Lead status types (for user tracking)
 */
export type LeadStatus = 'not_contacted' | 'messaged' | 'responded' | 'not_interested' | 'closed';

/**
 * Profile table - User accounts
 */
export interface Profile {
  id: string;  // UUID, references auth.users
  email: string;
  subscription_tier: SubscriptionTier;
  leads_used_this_month: number;
  billing_cycle_start: string | null;  // ISO date string
  created_at: string;  // ISO date string
}

/**
 * Searches table - Lead search operations
 */
export interface Search {
  id: string;  // UUID
  user_id: string;  // UUID
  location: string;
  industry: string | null;
  radius: number | null;
  requested_count: number | null;
  status: SearchStatus;
  progress: number;  // 0-100
  results_count: number;
  created_at: string;  // ISO date string
}

/**
 * Leads table - Business leads
 */
export interface Lead {
  id: string;  // UUID
  search_id: string;  // UUID
  business_name: string;
  address: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  facebook: string | null;
  whatsapp: string | null;
  linkedin: string | null;
  tiktok: string | null;
  has_automation: boolean;
  probability_score: number | null;  // 0-100
  industry: string | null;
  google_rating: number | null;  // 0.0-5.0
  created_at: string;  // ISO date string
}

/**
 * Lead Status table - User-specific lead tracking
 */
export interface LeadStatusRecord {
  id: string;  // UUID
  lead_id: string;  // UUID
  user_id: string;  // UUID
  status: LeadStatus;
  updated_at: string;  // ISO date string
}

/**
 * Extended Lead type with status for UI display
 */
export interface LeadWithStatus extends Lead {
  status?: LeadStatus;
}

/**
 * Search with lead count for UI display
 */
export interface SearchWithLeads extends Search {
  leads?: Lead[];
  lead_count?: number;
}
