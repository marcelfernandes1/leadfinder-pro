/**
 * Bulk Lead Status Update API Endpoint
 *
 * POST /api/leads/bulk-status
 *
 * Updates the status of multiple leads for the current user.
 * Useful for bulk operations in the dashboard.
 *
 * Request body:
 * {
 *   "leadIds": ["uuid1", "uuid2", ...],
 *   "status": "messaged" | "responded" | "not_interested" | "closed" | "not_contacted"
 * }
 *
 * Returns success count and any errors.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

/**
 * Request validation schema
 */
const bulkStatusSchema = z.object({
  leadIds: z.array(z.string().uuid()).min(1, 'Must provide at least one lead ID').max(100, 'Maximum 100 leads at a time'),
  status: z.enum([
    'not_contacted',
    'messaged',
    'responded',
    'not_interested',
    'closed',
  ]),
});

/**
 * POST /api/leads/bulk-status
 * Update status for multiple leads
 */
export async function POST(request: NextRequest) {
  try {
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
    const validation = bulkStatusSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { leadIds, status } = validation.data;

    console.log(`[Bulk Status] Updating ${leadIds.length} leads to status: ${status} for user ${user.id}`);

    // Verify all leads exist (optional check, but good for security)
    const { data: existingLeads, error: leadsError } = await supabase
      .from('leads')
      .select('id')
      .in('id', leadIds);

    if (leadsError) {
      console.error('Error fetching leads:', leadsError);
      return NextResponse.json(
        { error: 'Failed to verify leads' },
        { status: 500 }
      );
    }

    if (!existingLeads || existingLeads.length === 0) {
      return NextResponse.json(
        { error: 'No valid leads found' },
        { status: 404 }
      );
    }

    // Track results
    let successCount = 0;
    let errorCount = 0;
    const errors: Array<{ leadId: string; error: string }> = [];

    // Update each lead's status using upsert
    // We do this in a loop to ensure each lead status is properly handled
    // For better performance in production, consider using Supabase batch operations or RPC
    for (const leadId of existingLeads.map(l => l.id)) {
      try {
        const { error: upsertError } = await supabase
          .from('lead_status')
          .upsert(
            {
              lead_id: leadId,
              user_id: user.id,
              status: status,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: 'lead_id,user_id',
            }
          );

        if (upsertError) {
          errorCount++;
          errors.push({ leadId, error: upsertError.message });
        } else {
          successCount++;
        }
      } catch (err) {
        errorCount++;
        errors.push({ leadId, error: String(err) });
      }
    }

    console.log(`[Bulk Status] Completed: ${successCount} successful, ${errorCount} failed`);

    // Return results
    return NextResponse.json({
      success: true,
      successCount,
      errorCount,
      totalProcessed: existingLeads.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully updated ${successCount} lead(s)`,
    });
  } catch (error) {
    console.error('Error in bulk status update:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
