/**
 * Dashboard Page
 *
 * Main dashboard view showing user's lead searches and results.
 * This is a protected route - users must be authenticated to access.
 *
 * TODO: This is a placeholder. Will be replaced with full dashboard implementation.
 */

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  // Get the authenticated user
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If no user, redirect to login (backup check, middleware should handle this)
  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile from database
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Action Button */}
        <div className="mb-6">
          <a
            href="/search"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            🔍 Start New Search
          </a>
        </div>

        {/* Welcome Card */}
        <div className="rounded-lg bg-white p-6 shadow mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Welcome to LeadFinder Pro!
          </h2>
          <p className="text-gray-600 mb-4">
            You&apos;re successfully authenticated as: <strong>{user.email}</strong>
          </p>

          {/* User Info */}
          <div className="border-t border-gray-200 pt-4">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">User ID</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">{user.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Subscription Tier</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile?.subscription_tier || 'free'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Leads Used This Month</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile?.leads_used_this_month || 0}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Account Created</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : 'N/A'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Coming Soon Card */}
        <div className="rounded-lg bg-indigo-50 p-6 shadow">
          <h3 className="text-lg font-semibold text-indigo-900 mb-2">Coming Soon</h3>
          <ul className="space-y-2 text-sm text-indigo-800">
            <li>✨ Lead search functionality</li>
            <li>🎯 Probability score calculation</li>
            <li>📊 Lead dashboard with filters</li>
            <li>📤 CSV export</li>
            <li>💳 Payment integration</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
