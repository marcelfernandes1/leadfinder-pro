/**
 * Inngest API Route
 *
 * This endpoint serves as the webhook handler for Inngest.
 * Inngest will call this endpoint to execute background functions.
 *
 * In development: Uses Inngest Dev Server
 * In production: Connects to Inngest Cloud
 */

import { serve } from 'inngest/next'
import { inngest } from '@/lib/inngest/client'
import { functions } from '@/lib/inngest/functions'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
})
