/**
 * Auth Callback Route
 *
 * Handles the OAuth callback from Supabase after email verification or social login.
 * Exchanges the auth code for a session and redirects to the dashboard.
 */

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  // If there's a code, exchange it for a session
  if (code) {
    const supabase = await createClient()

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      // If there's an error, redirect to login with error message
      return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(error.message)}`)
    }
  }

  // Redirect to dashboard after successful authentication
  // The middleware will handle checking if the user is actually authenticated
  return NextResponse.redirect(`${origin}/dashboard`)
}
