/**
 * Discover Leads - Main Inngest Function
 * 
 * This is the orchestrator function that:
 * 1. Searches for businesses using Google Maps
 * 2. Saves basic business data to database
 * 3. Triggers enrichment jobs for each lead (email, CRM detection)
 * 4. Calculates probability scores after enrichment
 * 5. Updates search progress throughout
 */

import { inngest } from '../client';
import { searchBusinesses, GoogleMapsBusiness } from '@/lib/services/googleMaps';
import { findEmail } from '@/lib/services/emailFinder';
import { detectCRM } from '@/lib/services/crmDetector';
import { calculateProbabilityScore } from '@/lib/utils/scoreCalculator';
import { createClient } from '@/lib/supabase/server';

interface DiscoverLeadsEvent {
  data: {
    searchId: string;
    userId: string;
    location: string;
    industry?: string;
    radius?: number;
    requestedCount?: number;
  };
}

export const discoverLeads = inngest.createFunction(
  {
    id: 'search-discover-leads',
    name: 'Discover and Enrich Leads',
  },
  { event: 'search/discover' },
  async ({ event, step }: { event: DiscoverLeadsEvent; step: any }) => {
    const { searchId, userId, location, industry, radius = 10, requestedCount = 50 } = event.data;

    console.log(`[Inngest] Starting lead discovery for search ${searchId}`);

    // Step 1: Update search status
    await step.run('update-search-status', async () => {
      const supabase = await createClient();
      await supabase
        .from('searches')
        .update({ status: 'processing', progress: 0 })
        .eq('id', searchId);
    });

    // Step 2: Discover businesses
    const businesses = await step.run('discover-businesses', async () => {
      try {
        const results = await searchBusinesses({
          location,
          radius,
          businessType: industry,
          maxResults: requestedCount,
        });

        const supabase = await createClient();
        await supabase
          .from('searches')
          .update({ progress: 20 })
          .eq('id', searchId);

        return results;
      } catch (error) {
        const supabase = await createClient();
        await supabase
          .from('searches')
          .update({ status: 'failed', progress: 0 })
          .eq('id', searchId);
        throw error;
      }
    });

    if (businesses.length === 0) {
      await step.run('no-results', async () => {
        const supabase = await createClient();
        await supabase
          .from('searches')
          .update({ status: 'completed', progress: 100, results_count: 0 })
          .eq('id', searchId);
      });
      return { success: true, leadsFound: 0 };
    }

    // Step 3: Save basic lead data
    const savedLeadIds = await step.run('save-basic-leads', async () => {
      const supabase = await createClient();
      
      const leadRecords = businesses.map((business: GoogleMapsBusiness) => ({
        search_id: searchId,
        business_name: business.name,
        address: business.address,
        website: business.website || null,
        phone: business.phone || null,
        google_rating: business.rating || null,
        industry: business.businessType || industry || null,
        has_automation: false,
        probability_score: null,
      }));

      const { data, error } = await supabase
        .from('leads')
        .insert(leadRecords)
        .select('id');

      if (error) throw error;

      await supabase
        .from('searches')
        .update({ progress: 40, results_count: data?.length || 0 })
        .eq('id', searchId);

      return data?.map(l => l.id) || [];
    });

    // Step 4: Enrich leads
    await step.run('enrich-leads', async () => {
      const supabase = await createClient();
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .in('id', savedLeadIds);

      if (!leads || leads.length === 0) return;

      const totalLeads = leads.length;
      let processedCount = 0;

      for (const lead of leads) {
        try {
          let emailResult = null;
          if (lead.website) {
            emailResult = await findEmail(lead.website);
          }

          let crmResult = { hasAutomation: false };
          if (lead.website) {
            crmResult = await detectCRM(lead.website);
          }

          await supabase
            .from('leads')
            .update({
              email: emailResult?.email || null,
              has_automation: crmResult.hasAutomation,
            })
            .eq('id', lead.id);

          processedCount++;
          const enrichmentProgress = Math.floor((processedCount / totalLeads) * 40);
          await supabase
            .from('searches')
            .update({ progress: 40 + enrichmentProgress })
            .eq('id', searchId);

          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Failed to enrich lead ${lead.id}:`, error);
        }
      }
    });

    // Step 5: Calculate scores
    await step.run('calculate-scores', async () => {
      const supabase = await createClient();
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .in('id', savedLeadIds);

      if (!leads) return;

      for (const lead of leads) {
        const score = calculateProbabilityScore({
          website: lead.website,
          email: lead.email,
          phone: lead.phone,
          hasAutomation: lead.has_automation,
          googleRating: lead.google_rating,
          industry: lead.industry,
        });

        await supabase
          .from('leads')
          .update({ probability_score: score })
          .eq('id', lead.id);
      }

      await supabase
        .from('searches')
        .update({ progress: 90 })
        .eq('id', searchId);
    });

    // Step 6: Complete
    await step.run('complete-search', async () => {
      const supabase = await createClient();
      await supabase
        .from('searches')
        .update({ status: 'completed', progress: 100 })
        .eq('id', searchId);
    });

    return { success: true, leadsFound: savedLeadIds.length, searchId };
  }
);
