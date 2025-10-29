/**
 * CSV Export API Endpoint
 *
 * POST /api/leads/export
 *
 * Exports leads to CSV format for download.
 * Can export specific leads by ID, or all leads from a search.
 *
 * Request body:
 * {
 *   "leadIds": ["uuid1", "uuid2", ...], // Export specific leads
 *   OR
 *   "searchId": "uuid" // Export all leads from a search
 * }
 *
 * Returns CSV file as downloadable attachment.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

/**
 * Request validation schema
 * Must provide either leadIds array or searchId
 */
const exportSchema = z.object({
  leadIds: z.array(z.string().uuid()).optional(),
  searchId: z.string().uuid().optional(),
}).refine(
  (data) => data.leadIds || data.searchId,
  {
    message: 'Must provide either leadIds or searchId',
  }
);

/**
 * POST /api/leads/export
 * Export leads to CSV
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
    const validation = exportSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { leadIds, searchId } = validation.data;

    // Build query to fetch leads
    let query = supabase
      .from('leads')
      .select('*');

    if (leadIds && leadIds.length > 0) {
      // Export specific leads by ID
      query = query.in('id', leadIds);
    } else if (searchId) {
      // Export all leads from a search
      // First verify user has access to this search
      const { data: search, error: searchError } = await supabase
        .from('searches')
        .select('id, user_id')
        .eq('id', searchId)
        .single();

      if (searchError || !search) {
        return NextResponse.json(
          { error: 'Search not found' },
          { status: 404 }
        );
      }

      if (search.user_id !== user.id) {
        return NextResponse.json(
          { error: 'Unauthorized to access this search' },
          { status: 403 }
        );
      }

      query = query.eq('search_id', searchId);
    }

    // Execute query
    const { data: leads, error: leadsError } = await query;

    if (leadsError) {
      console.error('Error fetching leads for export:', leadsError);
      return NextResponse.json(
        { error: 'Failed to fetch leads' },
        { status: 500 }
      );
    }

    if (!leads || leads.length === 0) {
      return NextResponse.json(
        { error: 'No leads found to export' },
        { status: 404 }
      );
    }

    // Convert leads to CSV format
    // Define column headers
    const headers = [
      'Business Name',
      'Website',
      'Email',
      'Phone',
      'Instagram',
      'Facebook',
      'WhatsApp',
      'LinkedIn',
      'TikTok',
      'Probability Score',
      'Has Automation',
      'Industry',
      'Address',
      'Google Rating',
      'Created At',
    ];

    // Convert leads to CSV rows
    const rows = leads.map((lead) => [
      lead.business_name || '',
      lead.website || '',
      lead.email || '',
      lead.phone || '',
      lead.instagram || '',
      lead.facebook || '',
      lead.whatsapp || '',
      lead.linkedin || '',
      lead.tiktok || '',
      lead.probability_score !== null ? lead.probability_score.toString() : '',
      lead.has_automation ? 'Yes' : 'No',
      lead.industry || '',
      lead.address || '',
      lead.google_rating !== null ? lead.google_rating.toString() : '',
      lead.created_at || '',
    ]);

    // Build CSV content
    // Escape fields that contain commas, quotes, or newlines
    const escapeCSVField = (field: string) => {
      if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    };

    const csvContent = [
      // Header row
      headers.map(escapeCSVField).join(','),
      // Data rows
      ...rows.map((row) => row.map(escapeCSVField).join(',')),
    ].join('\n');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const filename = searchId
      ? `leads-search-${searchId}-${timestamp}.csv`
      : `leads-export-${timestamp}.csv`;

    // Return CSV file as downloadable response
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error in CSV export:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
