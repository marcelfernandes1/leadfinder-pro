/**
 * Stripe Client Configuration
 *
 * Server-side Stripe client for handling payments, subscriptions, and webhooks.
 * This file initializes the Stripe SDK with the secret API key.
 */

import Stripe from 'stripe';

// Validate that Stripe secret key is configured
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

/**
 * Server-side Stripe client instance
 * Used for creating checkout sessions, handling webhooks, and managing subscriptions
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia', // Use the latest API version
  typescript: true,
});

/**
 * Stripe price IDs for each subscription tier
 * These must match the price IDs created in your Stripe dashboard
 *
 * To find these:
 * 1. Go to https://dashboard.stripe.com/test/products
 * 2. Click on each product
 * 3. Copy the price ID (starts with "price_")
 */
export const STRIPE_PRICES = {
  starter: process.env.STRIPE_PRICE_STARTER || 'price_PLACEHOLDER_STARTER',
  pro: process.env.STRIPE_PRICE_PRO || 'price_PLACEHOLDER_PRO',
  agency: process.env.STRIPE_PRICE_AGENCY || 'price_PLACEHOLDER_AGENCY',
};

/**
 * Subscription tier to price ID mapping
 */
export function getPriceId(tier: 'starter' | 'pro' | 'agency'): string {
  return STRIPE_PRICES[tier];
}

/**
 * Price ID to subscription tier mapping (for webhooks)
 */
export function getTierFromPriceId(priceId: string): 'starter' | 'pro' | 'agency' | null {
  const entries = Object.entries(STRIPE_PRICES);
  for (const [tier, id] of entries) {
    if (id === priceId) {
      return tier as 'starter' | 'pro' | 'agency';
    }
  }
  return null;
}
