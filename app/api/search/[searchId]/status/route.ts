/**
 * Search Status API Endpoint
 * GET /api/search/[searchId]/status
 * 
 * Returns the current status and progress of a search.
 * Used by the frontend for polling during lead discovery.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ searchId: string }> }
) {
  try {
    const { searchId } = await params;

    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch search record
    const { data: search, error: dbError } = await supabase
      .from('searches')
      .select('*')
      .eq('id', searchId)
      .eq('user_id', user.id)  // Ensure user owns this search
      .single();

    if (dbError || !search) {
      return NextResponse.json(
        { error: 'Search not found' },
        { status: 404 }
      );
    }

    // Determine current step message based on progress
    let currentStep = 'Initializing...';
    if (search.progress >= 90) {
      currentStep = '✨ Finalizing your leads...';
    } else if (search.progress >= 70) {
      currentStep = '💰 Calculating buying probability...';
    } else if (search.progress >= 40) {
      currentStep = '🤖 Detecting CRM & automation tools...';
    } else if (search.progress >= 20) {
      currentStep = '📧 Finding contact information...';
    } else if (search.progress >= 10) {
      currentStep = '🔍 Scanning local businesses...';
    }

    // Return status
    return NextResponse.json({
      searchId: search.id,
      status: search.status,
      progress: search.progress,
      currentStep,
      leadsFound: search.results_count,
      location: search.location,
      industry: search.industry,
    });

  } catch (error) {
    console.error('[API] Status endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
