/**
 * Search Results API Endpoint
 * GET /api/search/[searchId]/results
 * 
 * Returns leads for a completed search with optional filtering and sorting.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ searchId: string }> }
) {
  try {
    const { searchId } = await params;
    const { searchParams } = new URL(request.url);

    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify search belongs to user
    const { data: search, error: searchError } = await supabase
      .from('searches')
      .select('*')
      .eq('id', searchId)
      .eq('user_id', user.id)
      .single();

    if (searchError || !search) {
      return NextResponse.json(
        { error: 'Search not found' },
        { status: 404 }
      );
    }

    // Parse query parameters for filtering
    const minScore = parseInt(searchParams.get('minScore') || '0');
    const maxScore = parseInt(searchParams.get('maxScore') || '100');
    const hasEmail = searchParams.get('hasEmail') === 'true';
    const hasPhone = searchParams.get('hasPhone') === 'true';
    const sortBy = searchParams.get('sortBy') || 'probability_score';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    let query = supabase
      .from('leads')
      .select('*')
      .eq('search_id', searchId)
      .gte('probability_score', minScore)
      .lte('probability_score', maxScore);

    // Apply filters
    if (hasEmail) {
      query = query.not('email', 'is', null);
    }
    if (hasPhone) {
      query = query.not('phone', 'is', null);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Execute query
    const { data: leads, error: leadsError } = await query;

    if (leadsError) {
      console.error('Failed to fetch leads:', leadsError);
      return NextResponse.json(
        { error: 'Failed to fetch leads' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      leads: leads || [],
      total: leads?.length || 0,
      search: {
        id: search.id,
        location: search.location,
        industry: search.industry,
        status: search.status,
        createdAt: search.created_at,
      },
    });

  } catch (error) {
    console.error('[API] Results endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
