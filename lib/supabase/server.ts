/**
 * Supabase Server-Side Client
 *
 * This file creates Supabase clients for use in Server Components, Server Actions,
 * and API Routes. It properly handles cookie-based authentication using Next.js cookies.
 *
 * Usage:
 * import { createClient } from '@/lib/supabase/server'
 * const supabase = await createClient()
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  // Get the Next.js cookies store
  const cookieStore = await cookies()

  // Get the Supabase URL and anon key from environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Validate that environment variables are set
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  // Create and return the server client with cookie handling
  // This ensures that authentication state is properly maintained across server requests
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      // Get all cookies
      getAll() {
        return cookieStore.getAll()
      },
      // Set a cookie (used during authentication)
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

/**
 * Create a Supabase client with service role key for admin operations
 *
 * WARNING: This client has elevated permissions and should only be used
 * for backend operations that require bypassing Row Level Security (RLS).
 * Never expose this client to the frontend.
 *
 * Usage:
 * import { createAdminClient } from '@/lib/supabase/server'
 * const supabase = createAdminClient()
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase admin environment variables')
  }

  return createServerClient(supabaseUrl, supabaseServiceRoleKey, {
    cookies: {
      getAll() {
        return []
      },
      setAll() {
        // No-op for admin client
      },
    },
  })
}
