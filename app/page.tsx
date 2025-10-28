/**
 * Home Page
 *
 * Landing page for LeadFinder Pro
 * Shows welcome message and links to authentication pages
 */

import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-indigo-50 to-white">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">LeadFinder Pro</h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover qualified local business leads with contact info and buying probability scores
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center mb-12">
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Get Started
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Sign In
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Targeting</h3>
            <p className="text-sm text-gray-600">
              Find businesses that need your CRM/automation services
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">Probability Scores</h3>
            <p className="text-sm text-gray-600">
              Each lead scored 0-100 based on buying potential
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl mb-2">📧</div>
            <h3 className="font-semibold text-gray-900 mb-2">Complete Contact Info</h3>
            <p className="text-sm text-gray-600">
              Email, phone, social profiles, and more
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-12">
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            ✅ Authentication System Ready
          </span>
        </div>
      </div>
    </main>
  )
}
