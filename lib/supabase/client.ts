/**
 * Supabase Client-Side Client
 *
 * This file creates a Supabase client for use in Client Components.
 * It uses the browser-based authentication flow and is safe to use in client-side code.
 *
 * Usage:
 * import { createClient } from '@/lib/supabase/client'
 * const supabase = createClient()
 */

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Get the Supabase URL and anon key from environment variables
  // These are safe to expose in the browser as they're prefixed with NEXT_PUBLIC_
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Validate that environment variables are set
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  // Create and return the browser client
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
