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
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Slider } from '@/components/ui/slider'
import { Loader2 } from 'lucide-react'

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
    control,
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
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="text-sm"
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Discover Qualified Leads</CardTitle>
            <CardDescription>
              Find local service businesses that need CRM and marketing automation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Error Message */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Search Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Location Input */}
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  {...register('location')}
                  placeholder="e.g., Miami, FL or Los Angeles, CA"
                  disabled={isSubmitting}
                />
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location.message}</p>
                )}
                <p className="text-sm text-muted-foreground">Enter city, state, or full address</p>
              </div>

              {/* Industry Input (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="industry">
                  Industry or Business Type <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <Input
                  id="industry"
                  {...register('industry')}
                  placeholder="e.g., plumber, HVAC, electrician"
                  disabled={isSubmitting}
                />
                <p className="text-sm text-muted-foreground">
                  Leave blank to search all service-based businesses
                </p>
              </div>

              {/* Radius Slider */}
              <div className="space-y-2">
                <Label htmlFor="radius">Search Radius: {radiusValue} miles</Label>
                <Controller
                  name="radius"
                  control={control}
                  render={({ field }) => (
                    <Slider
                      id="radius"
                      min={1}
                      max={50}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      disabled={isSubmitting}
                      className="w-full"
                    />
                  )}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 mile</span>
                  <span>50 miles</span>
                </div>
              </div>

              {/* Lead Count Slider */}
              <div className="space-y-2">
                <Label htmlFor="requestedCount">Number of Leads: {countValue}</Label>
                <Controller
                  name="requestedCount"
                  control={control}
                  render={({ field }) => (
                    <Slider
                      id="requestedCount"
                      min={50}
                      max={500}
                      step={50}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      disabled={isSubmitting}
                      className="w-full"
                    />
                  )}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>50</span>
                  <span>500</span>
                </div>
              </div>

              {/* Info Box */}
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-800">
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
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Starting Search...
                  </>
                ) : (
                  '🔍 Find Leads'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
