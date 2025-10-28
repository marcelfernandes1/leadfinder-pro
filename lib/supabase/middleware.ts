/**
 * Supabase Middleware Client
 *
 * This file creates a Supabase client for use in Next.js middleware.
 * Middleware runs before requests are processed, making it ideal for
 * authentication checks and session refreshing.
 *
 * This middleware:
 * 1. Refreshes the user's session if needed
 * 2. Makes the user session available to Server Components
 * 3. Handles authentication redirects
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Create a response object that we can modify
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  // Create a Supabase client with cookie handling for middleware
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      // Get all cookies from the request
      getAll() {
        return request.cookies.getAll()
      },
      // Set cookies on the response
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set(name, value)
        )
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // Refresh the user's session if it exists
  // This ensures the session doesn't expire while the user is actively using the app
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes check
  // Add routes that require authentication here
  const protectedRoutes = ['/dashboard', '/search', '/account', '/history', '/settings']
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  // If accessing a protected route without being authenticated, redirect to login
  if (isProtectedRoute && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/login'
    // Store the original URL to redirect back after login
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If authenticated and trying to access auth pages, redirect to dashboard
  if (user && request.nextUrl.pathname.startsWith('/auth/')) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so: NextResponse.next({ request })
  // 2. Copy over the cookies, like so: supabaseResponse.cookies.getAll().forEach(...)
  // 3. Change the supabaseResponse object to your new response object
  // 4. Make sure to return your new response object at the end
  return supabaseResponse
}
