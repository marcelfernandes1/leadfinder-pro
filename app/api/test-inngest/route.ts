/**
 * Test Inngest Endpoint (Development Only)
 *
 * This endpoint allows you to test Inngest functions locally without authentication.
 * DO NOT deploy this to production!
 *
 * Usage:
 * POST http://localhost:3001/api/test-inngest
 * Body: {
 *   "searchId": "test-123" (optional, will generate one if not provided)
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const searchId = body.searchId || `test-${Date.now()}`

    console.log(`🧪 Test Inngest: Creating test search ${searchId}`)

    // Create a test search record (using admin client to bypass RLS)
    const supabase = createAdminClient()

    // First, get or create a test user profile
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single()

    let testUserId: string

    if (existingProfile) {
      testUserId = existingProfile.id
      console.log(`✅ Using existing user: ${testUserId}`)
    } else {
      console.log('⚠️  No users found. Please sign up first at http://localhost:3001/auth/signup')
      return NextResponse.json(
        {
          error: 'No test user available',
          message: 'Please create an account first by signing up at http://localhost:3001/auth/signup',
        },
        { status: 400 }
      )
    }

    const { data: search, error: searchError } = await supabase
      .from('searches')
      .insert({
        user_id: testUserId,
        location: 'San Francisco, CA',
        industry: 'restaurants',
        radius: 16093, // 10 miles
        requested_count: 50,
        status: 'processing',
        progress: 0,
        results_count: 0,
      })
      .select()
      .single()

    if (searchError) {
      console.error('Failed to create test search:', searchError)
      return NextResponse.json({ error: 'Failed to create search', details: searchError }, { status: 500 })
    }

    console.log(`✅ Created test search: ${search.id}`)

    // Trigger Inngest event
    const eventResult = await inngest.send({
      name: 'search/discover-leads',
      data: {
        searchId: search.id,
        userId: testUserId,
        location: 'San Francisco, CA',
        industry: 'restaurants',
        radius: 16093,
        requestedCount: 50,
      },
    })

    console.log(`🚀 Triggered Inngest event:`, eventResult)

    return NextResponse.json({
      success: true,
      searchId: search.id,
      eventResult,
      message: `Test search created! Check Inngest Dev Server at http://localhost:8288 to see the run.`,
      inngestUrl: 'http://localhost:8288/runs',
    })
  } catch (error) {
    console.error('Test Inngest error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  return NextResponse.json({
    message: 'Test Inngest Endpoint',
    usage: 'POST /api/test-inngest with optional body: { "searchId": "test-123" }',
    inngestDevServer: 'http://localhost:8288',
  })
}
