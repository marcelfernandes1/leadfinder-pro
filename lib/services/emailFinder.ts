/**
 * Email Finding Service (Hunter.io Integration)
 *
 * Integrates with Hunter.io API to find email addresses from business domains.
 * Expected success rate: 50-60% (many businesses don't have discoverable emails).
 *
 * API Documentation: https://hunter.io/api-documentation/v2
 */

import axios from 'axios'

/**
 * Interface for Hunter.io API response
 */
interface HunterResponse {
  data: {
    email?: string
    score?: number
    firstName?: string
    lastName?: string
    position?: string
    type?: string
  }
  meta: {
    params: {
      domain: string
    }
  }
}

/**
 * Find an email address for a given domain using Hunter.io
 *
 * @param domain - The business domain (e.g., "example.com")
 * @returns Email address if found, null if not found or error occurs
 *
 * Note: Failures are expected (~40-50% failure rate). This should not block
 * lead processing. Continue with other leads even if email finding fails.
 */
export async function findEmail(domain: string): Promise<string | null> {
  const apiKey = process.env.HUNTER_IO_API_KEY

  if (!apiKey) {
    console.warn('HUNTER_IO_API_KEY is not configured - email finding disabled')
    return null
  }

  // Validate domain format before making API call
  if (!isValidDomain(domain)) {
    console.log(`⚠️  Invalid domain format: ${domain}`)
    return null
  }

  try {
    console.log(`📧 Finding email for domain: ${domain}`)

    // Call Hunter.io Domain Search API
    // This finds the most common email pattern for the domain
    const response = await axios.get<HunterResponse>(
      'https://api.hunter.io/v2/domain-search',
      {
        params: {
          domain,
          api_key: apiKey,
          limit: 1, // We only need one email
        },
        timeout: 10000, // 10 second timeout
      }
    )

    const emailData = response.data?.data

    if (!emailData || !emailData.email) {
      console.log(`ℹ️  No email found for ${domain}`)
      return null
    }

    // Hunter.io returns a confidence score (0-100)
    // Only accept emails with confidence >= 70 for better quality
    const score = emailData.score || 0

    if (score < 70) {
      console.log(`⚠️  Low confidence email for ${domain} (score: ${score})`)
      return null
    }

    console.log(`✅ Found email for ${domain}: ${emailData.email} (confidence: ${score})`)
    return emailData.email
  } catch (error) {
    // Don't throw - email finding failures should not crash the pipeline
    // This is expected to fail ~40-50% of the time

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        console.warn(`⚠️  Hunter.io rate limit reached`)
      } else if (error.response?.status === 404) {
        console.log(`ℹ️  No email found for ${domain}`)
      } else {
        console.error(`Hunter.io error for ${domain}:`, error.message)
      }
    } else {
      console.error(`Unexpected error finding email for ${domain}:`, error)
    }

    return null
  }
}

/**
 * Verify if an email address is valid and deliverable
 *
 * @param email - Email address to verify
 * @returns Verification result with deliverable status
 *
 * Note: This consumes Hunter.io credits. Use sparingly, only for important leads.
 */
export async function verifyEmail(email: string): Promise<{
  isValid: boolean
  isDeliverable: boolean
  score: number
} | null> {
  const apiKey = process.env.HUNTER_IO_API_KEY

  if (!apiKey) {
    console.warn('HUNTER_IO_API_KEY is not configured - email verification disabled')
    return null
  }

  try {
    console.log(`🔍 Verifying email: ${email}`)

    const response = await axios.get('https://api.hunter.io/v2/email-verifier', {
      params: {
        email,
        api_key: apiKey,
      },
      timeout: 10000,
    })

    const data = response.data?.data

    if (!data) {
      return null
    }

    const result = {
      isValid: data.status !== 'invalid',
      isDeliverable: data.result === 'deliverable',
      score: data.score || 0,
    }

    console.log(`✅ Email verification result:`, result)

    return result
  } catch (error) {
    console.error(`Failed to verify email ${email}:`, error)
    return null
  }
}

/**
 * Validate domain format
 *
 * @param domain - Domain to validate
 * @returns true if domain format is valid
 */
function isValidDomain(domain: string): boolean {
  // Basic domain validation regex
  // Matches: example.com, sub.example.com, etc.
  const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i
  return domainRegex.test(domain)
}

/**
 * Extract domain from full URL
 * Helper function to clean up URLs before passing to Hunter.io
 *
 * @param url - Full URL (e.g., "https://www.example.com/page")
 * @returns Clean domain (e.g., "example.com") or null if invalid
 */
export function extractDomainFromUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`)
    // Remove www. prefix
    return parsedUrl.hostname.replace(/^www\./, '')
  } catch {
    // If URL parsing fails, try basic string extraction
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?([^\/\?\:]+)/)
    return match ? match[1] : null
  }
}

/**
 * Rate limiter for Hunter.io API calls
 * Tracks API usage to avoid hitting rate limits
 *
 * Note: Hunter.io free tier has limits. Implement careful rate limiting.
 */
class HunterRateLimiter {
  private requestCount = 0
  private resetTime = Date.now() + 60000 // Reset every minute

  async checkRateLimit(): Promise<boolean> {
    const now = Date.now()

    // Reset counter if minute has passed
    if (now >= this.resetTime) {
      this.requestCount = 0
      this.resetTime = now + 60000
    }

    // Hunter.io free tier: 50 requests/month, paid: varies
    // Be conservative: max 10 requests per minute to avoid issues
    if (this.requestCount >= 10) {
      console.warn('⚠️  Hunter.io rate limit reached, waiting...')
      const waitTime = this.resetTime - now
      await new Promise((resolve) => setTimeout(resolve, waitTime))
      this.requestCount = 0
      this.resetTime = Date.now() + 60000
    }

    this.requestCount++
    return true
  }
}

export const hunterRateLimiter = new HunterRateLimiter()
