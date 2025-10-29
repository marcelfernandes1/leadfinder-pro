/**
 * Usage Limits Utility
 *
 * Checks if a user has exceeded their monthly lead limit based on subscription tier.
 * Manages usage tracking and limit enforcement for the freemium business model.
 *
 * Subscription tiers and limits:
 * - Free: 0 leads/month (signup only, must upgrade to use)
 * - Starter: 500 leads/month ($97/mo)
 * - Pro: 2000 leads/month ($197/mo)
 * - Agency: Unlimited leads ($297/mo)
 */

import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Lead limits per subscription tier
 */
export const TIER_LIMITS: Record<string, number> = {
  free: 0,
  starter: 500,
  pro: 2000,
  agency: Infinity, // Unlimited
};

/**
 * Get lead limit for a subscription tier
 */
export function getLeadLimitForTier(tier: string): number {
  return TIER_LIMITS[tier.toLowerCase()] || 0;
}

/**
 * Check if user has exceeded their usage limit
 *
 * @param supabase - Supabase client instance
 * @param userId - User ID to check
 * @param requestedLeads - Number of leads user is requesting
 * @returns Object with canProceed flag and usage info
 */
export async function checkUsageLimits(
  supabase: SupabaseClient,
  userId: string,
  requestedLeads: number
): Promise<{
  canProceed: boolean;
  currentUsage: number;
  limit: number;
  tier: string;
  remainingLeads: number;
  message?: string;
}> {
  try {
    // Fetch user's profile with subscription info
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('subscription_tier, leads_used_this_month')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      console.error('Error fetching user profile:', error);
      return {
        canProceed: false,
        currentUsage: 0,
        limit: 0,
        tier: 'free',
        remainingLeads: 0,
        message: 'Unable to verify subscription status',
      };
    }

    const tier = profile.subscription_tier || 'free';
    const currentUsage = profile.leads_used_this_month || 0;
    const limit = getLeadLimitForTier(tier);
    const remainingLeads = Math.max(0, limit - currentUsage);

    // Check if user is on free tier
    if (tier === 'free') {
      return {
        canProceed: false,
        currentUsage,
        limit,
        tier,
        remainingLeads: 0,
        message: 'Free tier users cannot create searches. Please upgrade to a paid plan.',
      };
    }

    // Check if user is on agency tier (unlimited)
    if (tier === 'agency') {
      return {
        canProceed: true,
        currentUsage,
        limit,
        tier,
        remainingLeads: Infinity,
      };
    }

    // Check if adding requested leads would exceed limit
    if (currentUsage + requestedLeads > limit) {
      const shortfall = currentUsage + requestedLeads - limit;
      return {
        canProceed: false,
        currentUsage,
        limit,
        tier,
        remainingLeads,
        message: `This search would exceed your monthly limit by ${shortfall} leads. You have ${remainingLeads} leads remaining this month. Please upgrade your plan or wait until next billing cycle.`,
      };
    }

    // User has enough remaining leads
    return {
      canProceed: true,
      currentUsage,
      limit,
      tier,
      remainingLeads,
    };
  } catch (error) {
    console.error('Error checking usage limits:', error);
    return {
      canProceed: false,
      currentUsage: 0,
      limit: 0,
      tier: 'free',
      remainingLeads: 0,
      message: 'An error occurred while checking usage limits',
    };
  }
}

/**
 * Increment user's usage counter after leads are found
 *
 * @param supabase - Supabase client instance
 * @param userId - User ID
 * @param leadsFound - Number of leads to add to usage
 */
export async function incrementUsage(
  supabase: SupabaseClient,
  userId: string,
  leadsFound: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // Increment leads_used_this_month
    const { error } = await supabase.rpc('increment_leads_usage', {
      user_id: userId,
      increment_by: leadsFound,
    });

    if (error) {
      // If RPC doesn't exist, fall back to manual increment
      console.warn('RPC not found, using manual increment');

      const { data: profile } = await supabase
        .from('profiles')
        .select('leads_used_this_month')
        .eq('id', userId)
        .single();

      if (!profile) {
        return { success: false, error: 'User profile not found' };
      }

      const newUsage = (profile.leads_used_this_month || 0) + leadsFound;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ leads_used_this_month: newUsage })
        .eq('id', userId);

      if (updateError) {
        console.error('Error incrementing usage:', updateError);
        return { success: false, error: updateError.message };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error incrementing usage:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Reset monthly usage for a user (called on billing cycle)
 *
 * @param supabase - Supabase client instance
 * @param userId - User ID
 */
export async function resetMonthlyUsage(
  supabase: SupabaseClient,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        leads_used_this_month: 0,
        billing_cycle_start: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Error resetting monthly usage:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error resetting monthly usage:', error);
    return { success: false, error: String(error) };
  }
}
