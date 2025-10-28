/**
 * Search API Endpoint
 * POST /api/search
 * 
 * Creates a new lead search and triggers background processing via Inngest.
 * This endpoint returns immediately with a search ID - actual lead discovery
 * happens asynchronously in the background.
 * 
 * Flow:
 * 1. Validate request body
 * 2. Check user authentication
 * 3. Create search record in database
 * 4. Trigger Inngest background function
 * 5. Return search ID to client
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { inngest } from '@/lib/inngest/client';

// Request body validation schema
const searchSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  radius: z.number().min(1).max(50).optional().default(10),
  industry: z.string().optional(),
  requestedCount: z.number().min(10).max(500).optional().default(50),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = searchSchema.parse(body);

    console.log('[API] New search request:', validatedData);

    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log(`[API] User authenticated: ${user.id}`);

    // TODO: Check usage limits based on subscription tier
    // For now, we'll skip this check and implement it later

    // Create search record in database
    const { data: search, error: dbError } = await supabase
      .from('searches')
      .insert({
        user_id: user.id,
        location: validatedData.location,
        industry: validatedData.industry || null,
        radius: validatedData.radius,
        requested_count: validatedData.requestedCount,
        status: 'processing',
        progress: 0,
        results_count: 0,
      })
      .select()
      .single();

    if (dbError || !search) {
      console.error('[API] Failed to create search:', dbError);
      return NextResponse.json(
        { error: 'Failed to create search' },
        { status: 500 }
      );
    }

    console.log(`[API] Search created: ${search.id}`);

    // Trigger Inngest background function
    try {
      await inngest.send({
        name: 'search/discover-leads',
        data: {
          searchId: search.id,
          userId: user.id,
          location: validatedData.location,
          industry: validatedData.industry,
          radius: validatedData.radius,
          requestedCount: validatedData.requestedCount,
        },
      });

      console.log(`[API] Inngest function triggered for search ${search.id}`);
    } catch (inngestError) {
      console.error('[API] Failed to trigger Inngest:', inngestError);
      
      // Mark search as failed
      await supabase
        .from('searches')
        .update({ status: 'failed' })
        .eq('id', search.id);

      return NextResponse.json(
        { error: 'Failed to start background processing' },
        { status: 500 }
      );
    }

    // Return search ID immediately
    // Client will poll for progress updates
    return NextResponse.json({
      success: true,
      searchId: search.id,
      message: 'Search started. Check status for progress updates.',
    }, { status: 201 });

  } catch (error) {
    console.error('[API] Search endpoint error:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
