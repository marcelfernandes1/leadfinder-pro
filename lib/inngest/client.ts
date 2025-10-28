/**
 * Inngest Client Configuration
 * 
 * This file sets up the Inngest client for background job processing.
 * Inngest handles all async operations to avoid Next.js API route timeouts.
 */

import { Inngest } from 'inngest';

/**
 * Create Inngest client
 * 
 * The client is used to:
 * 1. Send events to trigger functions
 * 2. Define and register background functions
 * 
 * Event naming convention: "resource/action"
 * Examples: "search/discover", "lead/enrich.email", "lead/calculate.score"
 */
export const inngest = new Inngest({ 
  id: 'leadfinder-pro',
  name: 'LeadFinder Pro',
});
