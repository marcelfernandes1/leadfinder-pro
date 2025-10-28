/**
 * Next.js Proxy (formerly Middleware)
 *
 * This proxy runs before every request to the application.
 * It handles authentication session management via Supabase.
 *
 * The proxy will:
 * 1. Refresh user sessions automatically
 * 2. Protect routes that require authentication
 * 3. Redirect unauthenticated users to login
 * 4. Redirect authenticated users away from auth pages
 */

import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest } from 'next/server'

export default async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - API routes that handle their own auth
     * - /api/inngest (Inngest webhook endpoint)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/inngest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
