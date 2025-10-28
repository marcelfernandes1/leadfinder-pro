/**
 * Inngest Functions Index
 *
 * Exports all Inngest background functions for registration.
 */

import { discoverLeads } from './discoverLeads';

// Re-export individual functions
export { discoverLeads };

// Export array of all functions for easy registration
export const functions = [
  discoverLeads,
];
