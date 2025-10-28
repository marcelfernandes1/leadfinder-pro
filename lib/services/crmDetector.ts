/**
 * CRM/Automation Detection Service
 *
 * Scrapes business websites to detect if they're already using CRM or marketing
 * automation tools. Businesses without these tools are higher-quality leads.
 *
 * Expected success rate: 70-80% (websites can be slow/unreachable)
 *
 * Detection method: Search website HTML for known CRM/automation tool scripts and identifiers
 */

import axios from 'axios'
import * as cheerio from 'cheerio'

/**
 * Interface for CRM detection result
 */
export interface CRMDetectionResult {
  hasAutomation: boolean
  detectedTools: string[]
  checkedAt: Date
}

/**
 * List of CRM and marketing automation tools to detect
 * Each tool has identifying strings found in their script URLs or code
 */
const CRM_SIGNATURES = {
  HubSpot: ['hs-scripts.com', 'hsforms.net', 'hubspot.com/api'],
  Mailchimp: ['list-manage.com', 'mc.js', 'mailchimp.com/'],
  ActiveCampaign: ['activehosted.com', 'actid', 'active campaign'],
  Klaviyo: ['klaviyo.com', 'klaviyo', 'kl.js'],
  ConvertKit: ['convertkit.com', 'ck.page'],
  Drip: ['drip.com', 'drip.js'],
  'Constant Contact': ['constantcontact.com', 'ctct.net'],
  SendGrid: ['sendgrid.net', 'sendgrid.com'],
  Intercom: ['intercom.io', 'intercom.com', 'widget.intercom'],
  Drift: ['drift.com', 'driftt.com', 'drift.js'],
  Salesforce: ['salesforce.com', 'force.com', 'salesforceliveagent'],
  Pipedrive: ['pipedrive.com', 'pipedrivecdn'],
  Zoho: ['zoho.com', 'zohopublic', 'salesiq.zoho'],
  Freshworks: ['freshworks.com', 'freshchat.com', 'freshsales'],
  GetResponse: ['getresponse.com', 'gr-cdn.com'],
  AWeber: ['aweber.com', 'aweber-static.com'],
  Autopilot: ['autopilot.com', 'autopilothq'],
  'Marketing Cloud': ['exacttarget.com', 'marketingcloud'],
  Pardot: ['pardot.com', 'pi.pardot'],
  Marketo: ['marketo.com', 'marketo.net', 'munchkin'],
}

/**
 * Detect CRM/automation tools on a website
 *
 * @param websiteUrl - Full website URL to check
 * @returns Detection result with list of found tools
 *
 * Note: This function can fail for many reasons (timeout, CORS, website down).
 * Failures should not block lead processing. Return hasAutomation: false if unable to check.
 */
export async function detectCRM(websiteUrl: string): Promise<CRMDetectionResult> {
  // Validate URL
  if (!websiteUrl || !isValidUrl(websiteUrl)) {
    console.log(`⚠️  Invalid URL: ${websiteUrl}`)
    return {
      hasAutomation: false,
      detectedTools: [],
      checkedAt: new Date(),
    }
  }

  try {
    console.log(`🔍 Checking CRM tools on: ${websiteUrl}`)

    // Fetch website HTML with generous timeout (10 seconds)
    // Many small business websites are slow
    const response = await axios.get(websiteUrl, {
      timeout: 10000,
      maxRedirects: 5,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; LeadFinderBot/1.0; +https://leadfinderpro.com/bot)',
      },
      // Don't fail on bad SSL certificates (common with small businesses)
      httpsAgent: new (require('https').Agent)({
        rejectUnauthorized: false,
      }),
    })

    const html = response.data
    const $ = cheerio.load(html)

    // Get all script sources and inline scripts
    const scripts: string[] = []

    // External scripts
    $('script[src]').each((_, el) => {
      const src = $(el).attr('src')
      if (src) scripts.push(src.toLowerCase())
    })

    // Inline scripts
    $('script:not([src])').each((_, el) => {
      const content = $(el).html()
      if (content) scripts.push(content.toLowerCase())
    })

    // Also check meta tags and links (some tools inject there)
    const metaContent: string[] = []
    $('meta, link').each((_, el) => {
      const content = $(el).attr('content') || $(el).attr('href') || ''
      metaContent.push(content.toLowerCase())
    })

    // Combine all content to search
    const allContent = [...scripts, ...metaContent, html.toLowerCase()].join(' ')

    // Check for each CRM signature
    const detectedTools: string[] = []

    for (const [toolName, signatures] of Object.entries(CRM_SIGNATURES)) {
      const found = signatures.some((sig) => allContent.includes(sig.toLowerCase()))

      if (found) {
        detectedTools.push(toolName)
        console.log(`✅ Detected ${toolName} on ${websiteUrl}`)
      }
    }

    const result = {
      hasAutomation: detectedTools.length > 0,
      detectedTools,
      checkedAt: new Date(),
    }

    if (detectedTools.length > 0) {
      console.log(`🤖 Website has automation: ${detectedTools.join(', ')}`)
    } else {
      console.log(`✨ No automation detected - good lead!`)
    }

    return result
  } catch (error) {
    // Website unreachable, timeout, or other error
    // Don't throw - this should not block the pipeline
    // Assume no CRM if we can't check (benefit of the doubt)

    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        console.log(`⏱️  Timeout checking ${websiteUrl}`)
      } else if (error.response?.status === 403 || error.response?.status === 401) {
        console.log(`🚫 Access denied for ${websiteUrl}`)
      } else if (error.response?.status === 404) {
        console.log(`❌ Website not found: ${websiteUrl}`)
      } else {
        console.log(`⚠️  Error checking ${websiteUrl}: ${error.message}`)
      }
    } else {
      console.log(`⚠️  Unexpected error checking ${websiteUrl}`)
    }

    // Return no automation detected if unable to check
    // This gives the lead benefit of the doubt
    return {
      hasAutomation: false,
      detectedTools: [],
      checkedAt: new Date(),
    }
  }
}

/**
 * Validate URL format
 *
 * @param url - URL to validate
 * @returns true if URL is valid
 */
function isValidUrl(url: string): boolean {
  try {
    // Ensure URL has protocol
    const urlToTest = url.startsWith('http') ? url : `https://${url}`
    new URL(urlToTest)
    return true
  } catch {
    return false
  }
}

/**
 * Normalize URL for consistent checking
 * Adds https:// if missing and removes trailing slashes
 *
 * @param url - URL to normalize
 * @returns Normalized URL
 */
export function normalizeUrl(url: string): string {
  let normalized = url.trim()

  // Add https:// if no protocol
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `https://${normalized}`
  }

  // Remove trailing slash
  normalized = normalized.replace(/\/$/, '')

  return normalized
}

/**
 * Cache for CRM detection results to avoid re-checking same domains
 * Key: domain, Value: detection result
 *
 * Note: In production, this should be stored in database or Redis
 * For MVP, an in-memory cache is sufficient
 */
class CRMDetectionCache {
  private cache = new Map<string, CRMDetectionResult>()
  private maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days

  get(domain: string): CRMDetectionResult | null {
    const cached = this.cache.get(domain)

    if (!cached) return null

    // Check if cache is still valid
    const age = Date.now() - cached.checkedAt.getTime()

    if (age > this.maxAge) {
      this.cache.delete(domain)
      return null
    }

    return cached
  }

  set(domain: string, result: CRMDetectionResult): void {
    this.cache.set(domain, result)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}

export const crmDetectionCache = new CRMDetectionCache()

/**
 * Detect CRM with caching
 * Checks cache first before making HTTP request
 *
 * @param websiteUrl - Website URL to check
 * @returns Detection result (from cache or fresh check)
 */
export async function detectCRMCached(websiteUrl: string): Promise<CRMDetectionResult> {
  // Extract domain for cache key
  try {
    const url = new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`)
    const domain = url.hostname

    // Check cache first
    const cached = crmDetectionCache.get(domain)
    if (cached) {
      console.log(`💾 Using cached CRM detection for ${domain}`)
      return cached
    }

    // Not in cache, do fresh check
    const result = await detectCRM(websiteUrl)

    // Cache the result
    crmDetectionCache.set(domain, result)

    return result
  } catch {
    // If URL parsing fails, just do fresh check without caching
    return detectCRM(websiteUrl)
  }
}
