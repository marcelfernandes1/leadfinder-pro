/**
 * Inngest Client Configuration
 *
 * Inngest handles all background job processing for lead discovery and enrichment.
 * This keeps the main API routes fast by offloading slow operations (API calls,
 * web scraping) to background workers.
 *
 * Documentation: https://www.inngest.com/docs
 */

import { Inngest } from 'inngest'

/**
 * Create Inngest client instance
 * This is used to send events and define background functions
 */
export const inngest = new Inngest({
  id: 'leadfinder-pro',
  name: 'LeadFinder Pro',
})
