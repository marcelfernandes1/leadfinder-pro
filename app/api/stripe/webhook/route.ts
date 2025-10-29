/**
 * Stripe Webhook Handler
 *
 * Handles Stripe webhook events for subscription management.
 * Critical events:
 * - checkout.session.completed: User completed checkout
 * - customer.subscription.created: New subscription created
 * - customer.subscription.updated: Subscription changed (upgrade/downgrade)
 * - customer.subscription.deleted: Subscription canceled
 * - invoice.payment_succeeded: Payment succeeded
 * - invoice.payment_failed: Payment failed
 *
 * IMPORTANT: This endpoint must verify webhook signatures for security
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

/**
 * POST handler for Stripe webhook events
 * Must use raw body for signature verification
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('No stripe-signature header found');
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    // Verify webhook signature (CRITICAL for security)
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log('Webhook event received:', event.type);

    // Create Supabase client with service role key for admin operations
    const supabase = createClient();

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session, supabase);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription, supabase);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription, supabase);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice, supabase);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice, supabase);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful checkout session
 * Updates user profile with subscription tier and Stripe customer ID
 */
async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  supabase: any
) {
  const userId = session.metadata?.supabase_uid || session.client_reference_id;
  const plan = session.metadata?.plan;
  const customerId = session.customer as string;

  if (!userId || !plan) {
    console.error('Missing user ID or plan in checkout session metadata');
    return;
  }

  console.log(`Checkout completed for user ${userId}, plan: ${plan}`);

  // Update user profile with subscription info
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_tier: plan,
      stripe_customer_id: customerId,
      billing_cycle_start: new Date().toISOString(),
      leads_used_this_month: 0, // Reset usage counter on subscription start
    })
    .eq('id', userId);

  if (error) {
    console.error('Failed to update profile after checkout:', error);
  } else {
    console.log(`Successfully updated profile for user ${userId}`);
  }
}

/**
 * Handle subscription updates (upgrades, downgrades, renewals)
 */
async function handleSubscriptionUpdate(
  subscription: Stripe.Subscription,
  supabase: any
) {
  const userId = subscription.metadata?.supabase_uid;
  const plan = subscription.metadata?.plan;
  const customerId = subscription.customer as string;

  if (!userId) {
    // If no user ID in metadata, try to find user by Stripe customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (!profile) {
      console.error('Cannot find user for subscription update');
      return;
    }
  }

  console.log(`Subscription updated for user ${userId}, status: ${subscription.status}`);

  // Determine tier from subscription price ID if not in metadata
  let tier = plan;
  if (!tier && subscription.items.data.length > 0) {
    const priceId = subscription.items.data[0].price.id;
    // Map price ID back to tier
    const priceToTierMap: Record<string, string> = {
      [process.env.STRIPE_PRICE_STARTER || 'price_starter']: 'starter',
      [process.env.STRIPE_PRICE_PRO || 'price_pro']: 'pro',
      [process.env.STRIPE_PRICE_AGENCY || 'price_agency']: 'agency',
    };
    tier = priceToTierMap[priceId] || 'free';
  }

  // Update profile based on subscription status
  const updates: any = {
    subscription_tier: subscription.status === 'active' || subscription.status === 'trialing' ? tier : 'free',
  };

  if (subscription.status === 'trialing' || subscription.status === 'active') {
    updates.billing_cycle_start = new Date(subscription.current_period_start * 1000).toISOString();
  }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq(userId ? 'id' : 'stripe_customer_id', userId || customerId);

  if (error) {
    console.error('Failed to update profile after subscription update:', error);
  }
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: any
) {
  const customerId = subscription.customer as string;

  console.log(`Subscription deleted for customer ${customerId}`);

  // Downgrade user to free tier
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_tier: 'free',
      billing_cycle_start: null,
    })
    .eq('stripe_customer_id', customerId);

  if (error) {
    console.error('Failed to downgrade user after subscription deletion:', error);
  }
}

/**
 * Handle successful payment
 * Resets monthly usage counter at the start of new billing cycle
 */
async function handlePaymentSucceeded(
  invoice: Stripe.Invoice,
  supabase: any
) {
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string;

  console.log(`Payment succeeded for customer ${customerId}`);

  // If this is a subscription invoice (not trial), reset usage counter
  if (subscriptionId && !invoice.billing_reason?.includes('trial')) {
    const { error } = await supabase
      .from('profiles')
      .update({
        leads_used_this_month: 0,
        billing_cycle_start: new Date(invoice.period_start * 1000).toISOString(),
      })
      .eq('stripe_customer_id', customerId);

    if (error) {
      console.error('Failed to reset usage counter after payment:', error);
    } else {
      console.log(`Reset usage counter for customer ${customerId}`);
    }
  }
}

/**
 * Handle failed payment
 * Could send notification to user or log for follow-up
 */
async function handlePaymentFailed(
  invoice: Stripe.Invoice,
  supabase: any
) {
  const customerId = invoice.customer as string;

  console.error(`Payment failed for customer ${customerId}`);

  // Optionally: Send email notification to user
  // Optionally: Suspend account after multiple failed payments
  // For now, just log the failure - Stripe will handle retry logic
}
