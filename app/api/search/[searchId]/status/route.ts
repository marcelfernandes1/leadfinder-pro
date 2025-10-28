/**
 * Search Status API Endpoint
 *
 * GET /api/search/[searchId]/status
 * Returns the current status and progress of a lead search
 *
 * Used by the loading animation page to poll for updates
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ searchId: string }> }
) {
  try {
    // Get searchId from params
    const { searchId } = await params

    // Check authentication
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch search status from database
    const { data: search, error } = await supabase
      .from('searches')
      .select('*')
      .eq('id', searchId)
      .eq('user_id', user.id) // Ensure user owns this search
      .single()

    if (error || !search) {
      return NextResponse.json({ error: 'Search not found' }, { status: 404 })
    }

    // Map progress to user-friendly status messages
    const getStatusMessage = (progress: number): string => {
      if (progress < 20) return 'Scanning local businesses...'
      if (progress < 40) return 'Filtering for service-based companies...'
      if (progress < 70) return 'Detecting CRM & automation tools...'
      if (progress < 90) return 'Calculating buying probability...'
      if (progress < 100) return 'Finding your best leads...'
      return 'Complete!'
    }

    return NextResponse.json({
      searchId: search.id,
      status: search.status,
      progress: search.progress,
      currentStep: getStatusMessage(search.progress),
      leadsFound: search.results_count,
      location: search.location,
      industry: search.industry,
      createdAt: search.created_at,
    })
  } catch (error) {
    console.error('Search status API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
