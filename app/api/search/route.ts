/**
 * Search API Endpoint
 *
 * POST /api/search
 * Creates a new lead search and triggers background discovery process
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { inngest } from '@/lib/inngest/client'
import { z } from 'zod'

/**
 * Request body validation schema
 */
const searchSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  industry: z.string().optional(),
  radius: z.number().min(1).max(50).optional().default(10), // Miles
  requestedCount: z.number().min(50).max(500).optional().default(200),
})

/**
 * Usage limits by subscription tier
 */
const TIER_LIMITS = {
  free: 0,
  starter: 500,
  pro: 2000,
  agency: 999999, // Unlimited
}

export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse and validate request body
    const body = await request.json()
    const validation = searchSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { location, industry, radius, requestedCount } = validation.data

    // 3. Get user profile and check usage limits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const tierLimit = TIER_LIMITS[profile.subscription_tier as keyof typeof TIER_LIMITS] || 0
    const currentUsage = profile.leads_used_this_month || 0

    // Check if user would exceed their monthly limit
    if (currentUsage + requestedCount > tierLimit) {
      return NextResponse.json(
        {
          error: 'Usage limit exceeded',
          message: `You have ${currentUsage}/${tierLimit} leads used this month. This search would exceed your limit.`,
          currentUsage,
          limit: tierLimit,
          requested: requestedCount,
        },
        { status: 403 }
      )
    }

    // 4. Create search record in database
    const { data: search, error: searchError } = await supabase
      .from('searches')
      .insert({
        user_id: user.id,
        location,
        industry: industry || null,
        radius: Math.round(radius * 1609.34), // Convert miles to meters
        requested_count: requestedCount,
        status: 'processing',
        progress: 0,
        results_count: 0,
      })
      .select()
      .single()

    if (searchError || !search) {
      console.error('Failed to create search:', searchError)
      return NextResponse.json({ error: 'Failed to create search' }, { status: 500 })
    }

    console.log(`🔍 Created search ${search.id} for user ${user.id}`)

    // 5. Trigger Inngest background job
    await inngest.send({
      name: 'search/discover-leads',
      data: {
        searchId: search.id,
        userId: user.id,
        location,
        industry,
        radius: Math.round(radius * 1609.34), // Meters
        requestedCount,
      },
    })

    console.log(`🚀 Triggered lead discovery job for search ${search.id}`)

    // 6. Return search ID immediately (don't wait for results)
    return NextResponse.json({
      searchId: search.id,
      status: 'processing',
      message: 'Lead discovery started. This will take 1-2 minutes.',
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
