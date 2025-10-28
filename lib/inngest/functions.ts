/**
 * Inngest Background Functions
 *
 * These functions handle all async lead discovery and enrichment operations.
 * They run in the background to keep API routes fast and responsive.
 *
 * Flow:
 * 1. User creates search → API triggers 'search/discover-leads' event
 * 2. Discover leads from Google Maps → Save basic data to DB
 * 3. For each lead, trigger enrichment events:
 *    - 'lead/enrich.email' - Find email via Hunter.io
 *    - 'lead/enrich.crm' - Detect CRM tools on website
 * 4. After enrichment, trigger 'lead/calculate-score'
 * 5. Update search progress throughout
 */

import { inngest } from './client'
import { searchBusinesses } from '@/lib/services/googleMaps'
import { findEmail } from '@/lib/services/emailFinder'
import { detectCRMCached } from '@/lib/services/crmDetector'
import { calculateProbabilityScore } from '@/lib/utils/scoreCalculator'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * Main function: Discover leads from Google Maps
 *
 * Triggered by: search/discover-leads event
 * This function:
 * 1. Searches Google Maps for businesses
 * 2. Saves basic business data to database
 * 3. Triggers enrichment jobs for each lead
 * 4. Updates search progress
 */
export const discoverLeads = inngest.createFunction(
  { id: 'search-discover-leads', name: 'Discover Leads from Google Maps' },
  { event: 'search/discover-leads' },
  async ({ event, step }) => {
    const { searchId, location, industry, radius, requestedCount } = event.data
    const supabase = createAdminClient()

    console.log(`🚀 Starting lead discovery for search ${searchId}`)

    // Step 1: Update search status to processing
    await step.run('update-search-status', async () => {
      await supabase
        .from('searches')
        .update({ status: 'processing', progress: 10 })
        .eq('id', searchId)

      return { status: 'processing' }
    })

    // Step 2: Search Google Maps for businesses
    const businesses = await step.run('search-google-maps', async () => {
      try {
        const results = await searchBusinesses(location, industry, radius)
        console.log(`✅ Found ${results.length} businesses from Google Maps`)
        return results
      } catch (error) {
        console.error('Google Maps search failed:', error)
        throw error
      }
    })

    // Update progress after Google Maps search
    await step.run('update-progress-30', async () => {
      await supabase.from('searches').update({ progress: 30 }).eq('id', searchId)
    })

    // Step 3: Save basic lead data to database
    const savedLeads = await step.run('save-leads-to-db', async () => {
      const leadsToInsert = businesses.map((business) => ({
        search_id: searchId,
        business_name: business.name,
        address: business.address || null,
        phone: business.phone || null,
        website: business.website || null,
        google_rating: business.rating || null,
        has_automation: false, // Will be updated by CRM detection
        probability_score: null, // Will be calculated after enrichment
      }))

      const { data, error } = await supabase
        .from('leads')
        .insert(leadsToInsert)
        .select('id, website')

      if (error) {
        console.error('Failed to save leads:', error)
        throw error
      }

      console.log(`✅ Saved ${data.length} leads to database`)
      return data
    })

    // Update progress and results count
    await step.run('update-progress-50', async () => {
      await supabase
        .from('searches')
        .update({
          progress: 50,
          results_count: savedLeads.length,
        })
        .eq('id', searchId)
    })

    // Step 4: Trigger enrichment for each lead (email + CRM detection)
    await step.run('trigger-enrichment-jobs', async () => {
      for (const lead of savedLeads) {
        if (lead.website) {
          // Trigger email enrichment
          await inngest.send({
            name: 'lead/enrich.email',
            data: {
              leadId: lead.id,
              website: lead.website,
              searchId,
            },
          })

          // Trigger CRM detection
          await inngest.send({
            name: 'lead/enrich.crm',
            data: {
              leadId: lead.id,
              website: lead.website,
              searchId,
            },
          })
        }
      }

      console.log(`✅ Triggered enrichment for ${savedLeads.length} leads`)
    })

    // Update progress to 70% (enrichment will happen in background)
    await step.run('update-progress-70', async () => {
      await supabase.from('searches').update({ progress: 70 }).eq('id', searchId)
    })

    // Step 5: Wait a bit for enrichments to complete, then trigger scoring
    await step.sleep('wait-for-enrichment', '30s')

    // Trigger score calculation for all leads
    await step.run('trigger-score-calculation', async () => {
      for (const lead of savedLeads) {
        await inngest.send({
          name: 'lead/calculate-score',
          data: {
            leadId: lead.id,
            searchId,
          },
        })
      }
    })

    // Update progress to 90%
    await step.run('update-progress-90', async () => {
      await supabase.from('searches').update({ progress: 90 }).eq('id', searchId)
    })

    // Final step: Mark search as completed
    await step.run('complete-search', async () => {
      await supabase
        .from('searches')
        .update({
          status: 'completed',
          progress: 100,
        })
        .eq('id', searchId)

      console.log(`🎉 Search ${searchId} completed successfully!`)
    })

    return {
      searchId,
      leadsFound: savedLeads.length,
      status: 'completed',
    }
  }
)

/**
 * Enrich lead with email address
 *
 * Triggered by: lead/enrich.email event
 * Finds email address using Hunter.io
 */
export const enrichLeadEmail = inngest.createFunction(
  { id: 'lead-enrich-email', name: 'Find Email Address' },
  { event: 'lead/enrich.email' },
  async ({ event }) => {
    const { leadId, website } = event.data
    const supabase = createAdminClient()

    try {
      // Extract domain from website URL
      const domain = extractDomain(website)

      if (!domain) {
        console.log(`⚠️  Invalid domain for lead ${leadId}: ${website}`)
        return { leadId, email: null }
      }

      // Find email using Hunter.io
      const email = await findEmail(domain)

      if (email) {
        // Update lead with found email
        await supabase.from('leads').update({ email }).eq('id', leadId)

        console.log(`✅ Found email for lead ${leadId}: ${email}`)
      }

      return { leadId, email }
    } catch (error) {
      console.error(`Failed to enrich email for lead ${leadId}:`, error)
      return { leadId, email: null, error: String(error) }
    }
  }
)

/**
 * Detect CRM/automation tools on lead's website
 *
 * Triggered by: lead/enrich.crm event
 * Scrapes website to detect existing CRM tools
 */
export const enrichLeadCRM = inngest.createFunction(
  { id: 'lead-enrich-crm', name: 'Detect CRM Tools' },
  { event: 'lead/enrich.crm' },
  async ({ event }) => {
    const { leadId, website } = event.data
    const supabase = createAdminClient()

    try {
      // Detect CRM tools (with caching)
      const detection = await detectCRMCached(website)

      // Update lead with detection results
      await supabase
        .from('leads')
        .update({
          has_automation: detection.hasAutomation,
        })
        .eq('id', leadId)

      console.log(
        `✅ CRM detection for lead ${leadId}: ${detection.hasAutomation ? 'HAS' : 'NO'} automation`
      )

      return {
        leadId,
        hasAutomation: detection.hasAutomation,
        detectedTools: detection.detectedTools,
      }
    } catch (error) {
      console.error(`Failed to detect CRM for lead ${leadId}:`, error)
      return { leadId, hasAutomation: false, error: String(error) }
    }
  }
)

/**
 * Calculate probability score for a lead
 *
 * Triggered by: lead/calculate-score event
 * Runs after all enrichment is complete
 */
export const calculateLeadScore = inngest.createFunction(
  { id: 'lead-calculate-score', name: 'Calculate Probability Score' },
  { event: 'lead/calculate-score' },
  async ({ event }) => {
    const { leadId } = event.data
    const supabase = createAdminClient()

    try {
      // Fetch lead with all enriched data
      const { data: lead, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single()

      if (error || !lead) {
        throw new Error(`Lead ${leadId} not found`)
      }

      // Calculate probability score
      const score = calculateProbabilityScore({
        hasWebsite: Boolean(lead.website),
        hasEmail: Boolean(lead.email),
        hasPhone: Boolean(lead.phone),
        hasInstagram: Boolean(lead.instagram),
        hasFacebook: Boolean(lead.facebook),
        hasWhatsApp: Boolean(lead.whatsapp),
        hasLinkedIn: Boolean(lead.linkedin),
        hasAutomation: lead.has_automation,
        googleRating: lead.google_rating || undefined,
        industry: lead.industry || undefined,
      })

      // Update lead with calculated score
      await supabase.from('leads').update({ probability_score: score }).eq('id', leadId)

      console.log(`✅ Calculated score for lead ${leadId}: ${score}`)

      return { leadId, score }
    } catch (error) {
      console.error(`Failed to calculate score for lead ${leadId}:`, error)
      return { leadId, score: null, error: String(error) }
    }
  }
)

/**
 * Export all functions for Inngest serve endpoint
 */
export const inngestFunctions = [discoverLeads, enrichLeadEmail, enrichLeadCRM, calculateLeadScore]
