/**
 * Sign Out API Route
 *
 * Handles user logout by clearing the Supabase session
 * and redirecting to the home page.
 */

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Sign out the user
  await supabase.auth.signOut()

  // Get the origin from the request
  const requestUrl = new URL(request.url)
  const origin = requestUrl.origin

  // Redirect to home page
  return NextResponse.redirect(`${origin}/`)
}
