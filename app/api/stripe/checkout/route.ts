/**
 * Stripe Checkout API Endpoint
 *
 * Creates a Stripe checkout session for the specified plan.
 * Handles customer creation and subscribes them to the plan.
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Map plan types to Stripe price IDs
const PLAN_PRICES: Record<string, string> = {
  starter: process.env.STRIPE_PRICE_STARTER || 'price_starter',
  pro: process.env.STRIPE_PRICE_PRO || 'price_pro',
  agency: process.env.STRIPE_PRICE_AGENCY || 'price_agency',
};

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json();

    // Validate plan
    if (!plan || !PLAN_PRICES[plan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Check if Stripe price IDs are configured
    const priceId = PLAN_PRICES[plan];
    if (!priceId || priceId.startsWith('price_starter') || priceId.startsWith('price_pro') || priceId.startsWith('price_agency')) {
      console.error('Stripe price IDs not configured properly');
      return NextResponse.json(
        {
          error: 'Payment system not fully configured. Please contact support or check STRIPE_SETUP.md for setup instructions.'
        },
        { status: 500 }
      );
    }

    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create Stripe customer
    let stripeCustomerId: string;
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (profile?.stripe_customer_id) {
      stripeCustomerId = profile.stripe_customer_id;
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_uid: user.id,
        },
      });

      stripeCustomerId = customer.id;

      // Save customer ID to profile
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', user.id);
    }

    // Create checkout session with 7-day free trial
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: PLAN_PRICES[plan],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.headers.get('origin') || 'http://localhost:3001'}/dashboard?checkout_success=true`,
      cancel_url: `${request.headers.get('origin') || 'http://localhost:3001'}/pricing`,
      subscription_data: {
        trial_period_days: 7, // 7-day free trial
        metadata: {
          supabase_uid: user.id,
          plan: plan,
        },
      },
    });

    if (!session.url) {
      throw new Error('Failed to create checkout session URL');
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
