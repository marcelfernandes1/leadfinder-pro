/**
 * Search Form Page
 *
 * Allows users to create a new lead search by specifying:
 * - Location (city, state, or full address)
 * - Industry/business type (optional)
 * - Search radius
 * - Number of leads to find
 *
 * After submission, redirects to loading animation page
 */

'use client'

// Force dynamic rendering - don't prerender during build
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

/**
 * Form validation schema
 */
const searchFormSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  industry: z.string().optional(),
  radius: z.number().min(1).max(50),
  requestedCount: z.number().min(50).max(500),
})

type SearchFormData = z.infer<typeof searchFormSchema>

export default function SearchPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      location: '',
      industry: '',
      radius: 10,
      requestedCount: 200,
    },
  })

  const radiusValue = watch('radius')
  const countValue = watch('requestedCount')

  /**
   * Handle form submission
   * Creates search and redirects to loading page
   */
  const onSubmit = async (data: SearchFormData) => {
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Failed to create search')
        setIsSubmitting(false)
        return
      }

      // Redirect to loading page with search ID
      router.push(`/search/${result.searchId}/loading`)
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Find Leads</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Discover Qualified Leads
            </h2>
            <p className="text-gray-600">
              Find local service businesses that need CRM and marketing automation
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          {/* Search Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Location Input */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                id="location"
                type="text"
                {...register('location')}
                className="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                placeholder="e.g., Miami, FL or Los Angeles, CA"
                disabled={isSubmitting}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">Enter city, state, or full address</p>
            </div>

            {/* Industry Input (Optional) */}
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                Industry or Business Type <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                id="industry"
                type="text"
                {...register('industry')}
                className="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                placeholder="e.g., plumber, HVAC, electrician"
                disabled={isSubmitting}
              />
              <p className="mt-1 text-sm text-gray-500">
                Leave blank to search all service-based businesses
              </p>
            </div>

            {/* Radius Slider */}
            <div>
              <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">
                Search Radius: {radiusValue} miles
              </label>
              <input
                id="radius"
                type="range"
                min="1"
                max="50"
                step="1"
                {...register('radius', { valueAsNumber: true })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                disabled={isSubmitting}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 mile</span>
                <span>50 miles</span>
              </div>
            </div>

            {/* Lead Count Slider */}
            <div>
              <label
                htmlFor="requestedCount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Number of Leads: {countValue}
              </label>
              <input
                id="requestedCount"
                type="range"
                min="50"
                max="500"
                step="50"
                {...register('requestedCount', { valueAsNumber: true })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                disabled={isSubmitting}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>50</span>
                <span>500</span>
              </div>
            </div>

            {/* Info Box */}
            <div className="rounded-md bg-blue-50 p-4">
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">What happens next:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>We&apos;ll scan local businesses in your area</li>
                  <li>Filter for service-based companies</li>
                  <li>Find contact information (email, phone, social media)</li>
                  <li>Detect existing CRM/automation tools</li>
                  <li>Calculate buying probability scores</li>
                </ul>
                <p className="mt-2 text-xs">
                  ⏱️ This process takes 1-2 minutes depending on the number of leads
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center rounded-md bg-indigo-600 px-4 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Starting Search...
                </>
              ) : (
                '🔍 Find Leads'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
