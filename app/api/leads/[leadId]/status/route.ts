/**
 * Lead Status Update API Endpoint
 *
 * PATCH /api/leads/[leadId]/status
 *
 * Updates the status of a lead for the current user.
 * Status is tracked per user in the lead_status table.
 *
 * Request body:
 * {
 *   "status": "not_contacted" | "messaged" | "responded" | "not_interested" | "closed"
 * }
 *
 * Returns the updated lead status data.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

/**
 * Status validation schema
 * Only these status values are allowed
 */
const statusSchema = z.object({
  status: z.enum([
    'not_contacted',
    'messaged',
    'responded',
    'not_interested',
    'closed',
  ]),
});

/**
 * PATCH /api/leads/[leadId]/status
 * Update lead status for current user
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId } = await params;

    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = statusSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid status value',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { status } = validation.data;

    // Verify the lead exists and user has access to it
    // (either they created the search, or we allow all authenticated users to update any lead)
    // For now, we'll allow any authenticated user to update any lead status
    const { data: leadExists, error: leadError } = await supabase
      .from('leads')
      .select('id')
      .eq('id', leadId)
      .single();

    if (leadError || !leadExists) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Upsert the lead status
    // This will insert if not exists, or update if exists
    const { data: leadStatus, error: upsertError } = await supabase
      .from('lead_status')
      .upsert(
        {
          lead_id: leadId,
          user_id: user.id,
          status: status,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'lead_id,user_id', // Unique constraint on these two columns
        }
      )
      .select()
      .single();

    if (upsertError) {
      console.error('Error upserting lead status:', upsertError);
      return NextResponse.json(
        { error: 'Failed to update lead status' },
        { status: 500 }
      );
    }

    // Return the updated lead status
    return NextResponse.json({
      success: true,
      data: leadStatus,
    });
  } catch (error) {
    console.error('Error in lead status update:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/leads/[leadId]/status
 * Get lead status for current user
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId } = await params;

    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get lead status for this user
    const { data: leadStatus, error: statusError } = await supabase
      .from('lead_status')
      .select('*')
      .eq('lead_id', leadId)
      .eq('user_id', user.id)
      .maybeSingle(); // maybeSingle allows null if not found

    if (statusError) {
      console.error('Error fetching lead status:', statusError);
      return NextResponse.json(
        { error: 'Failed to fetch lead status' },
        { status: 500 }
      );
    }

    // If no status exists, return default status
    if (!leadStatus) {
      return NextResponse.json({
        success: true,
        data: {
          lead_id: leadId,
          user_id: user.id,
          status: 'not_contacted',
          updated_at: null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: leadStatus,
    });
  } catch (error) {
    console.error('Error fetching lead status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
