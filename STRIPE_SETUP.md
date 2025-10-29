# Stripe Integration Setup Guide

This guide will help you complete the Stripe integration for LeadFinder Pro, enabling payment processing with 7-day free trials.

## What's Already Done ✅

- ✅ Stripe checkout API endpoint (`/api/stripe/checkout`)
- ✅ Stripe webhook handler (`/api/stripe/webhook`)
- ✅ Billing portal endpoint (`/api/stripe/billing-portal`)
- ✅ Interactive pricing section with checkout buttons
- ✅ 7-day free trial configuration
- ✅ Stripe keys configured in `.env.local`

## What You Need to Do

### Step 1: Add `stripe_customer_id` Column to Profiles Table

Your Supabase `profiles` table needs a column to store each user's Stripe customer ID.

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to: **Project** → **SQL Editor**
3. Click **"New Query"**
4. Paste this SQL and click **"Run"**:

```sql
-- Add stripe_customer_id column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id
ON profiles(stripe_customer_id);

-- Add comment for documentation
COMMENT ON COLUMN profiles.stripe_customer_id IS 'Stripe customer ID (cus_xxx) for subscription management';
```

5. Verify the column was added by going to **Table Editor** → **profiles** table

---

### Step 2: Create Stripe Products and Prices

You need to create 3 subscription products in your Stripe dashboard.

#### 2.1 Go to Stripe Dashboard

1. Log in to https://dashboard.stripe.com
2. Make sure you're in **TEST MODE** (toggle in top right corner)
3. Navigate to **Products** → **Add Product**

#### 2.2 Create the Products

Create these 3 products with the following details:

**Product 1: Starter Plan**
- Name: `LeadFinder Pro - Starter`
- Description: `500 leads per month with full contact info`
- Pricing:
  - Type: `Recurring`
  - Price: `$97.00 USD`
  - Billing period: `Monthly`
  - Free trial: `7 days` *(set this in the "Trial period" field)*
- Click **Save product**
- **Copy the Price ID** (starts with `price_...`) - you'll need this

**Product 2: Pro Plan**
- Name: `LeadFinder Pro - Pro`
- Description: `2,000 leads per month with advanced features`
- Pricing:
  - Type: `Recurring`
  - Price: `$197.00 USD`
  - Billing period: `Monthly`
  - Free trial: `7 days`
- Click **Save product**
- **Copy the Price ID** (starts with `price_...`)

**Product 3: Agency Plan**
- Name: `LeadFinder Pro - Agency`
- Description: `Unlimited leads with team features`
- Pricing:
  - Type: `Recurring`
  - Price: `$297.00 USD`
  - Billing period: `Monthly`
  - Free trial: `7 days`
- Click **Save product**
- **Copy the Price ID** (starts with `price_...`)

#### 2.3 Add Price IDs to Environment Variables

Update your `.env.local` file with the price IDs you just copied:

```bash
# Add these lines (replace with your actual price IDs from Stripe):
STRIPE_PRICE_STARTER=price_XXXXXXXXXXXXXXXXXXXXX
STRIPE_PRICE_PRO=price_XXXXXXXXXXXXXXXXXXXXX
STRIPE_PRICE_AGENCY=price_XXXXXXXXXXXXXXXXXXXXX
```

After adding these, restart your dev server:
```bash
npm run dev
```

---

### Step 3: Set Up Stripe Webhook

Webhooks allow Stripe to notify your app when subscription events occur (payments, cancellations, etc.).

#### 3.1 For Local Development (Testing)

Use the Stripe CLI to forward webhooks to your local server:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   ```

2. Login to Stripe CLI:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to http://localhost:3001/api/stripe/webhook
   ```

4. The CLI will output a webhook signing secret (starts with `whsec_`). **Copy it.**

5. Update `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXX
   ```

6. Restart your dev server

#### 3.2 For Production (After Deployment)

Once you deploy to production (Vercel):

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://your-domain.com/api/stripe/webhook`
4. Events to listen to (select these):
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Click **Reveal** to see the webhook signing secret
7. Add it to your Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

---

### Step 4: Test the Integration

#### 4.1 Start Your Dev Server

```bash
npm run dev
```

#### 4.2 Test Checkout Flow

1. **Sign up for an account** at http://localhost:3001/auth/signup
2. Go to the **homepage** at http://localhost:3001
3. Scroll down to the **Pricing section**
4. Click **"Start Free Trial"** on any plan
5. You should be redirected to Stripe Checkout

#### 4.3 Use Stripe Test Cards

Use these test card numbers on the Stripe checkout page:

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

**Failed Payment:**
- Card: `4000 0000 0000 0002`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

Full list: https://stripe.com/docs/testing#cards

#### 4.4 Verify Subscription Created

After completing checkout:

1. Check your **Stripe Dashboard** → **Customers**
   - You should see a new customer with a subscription
2. Check your **Supabase** → **profiles** table
   - The user's `subscription_tier` should be updated (e.g., `starter`, `pro`, or `agency`)
   - `stripe_customer_id` should be populated (e.g., `cus_xxxxx`)
   - `billing_cycle_start` should be set to today's date

#### 4.5 Verify Webhook Events

Check the Stripe CLI output (if running `stripe listen`):
- You should see events like:
  - ✓ `checkout.session.completed`
  - ✓ `customer.subscription.created`

---

### Step 5: Test Subscription Management

#### 5.1 Test Billing Portal

Create a test page to access the billing portal:

1. Sign in to your test account
2. Visit http://localhost:3001/dashboard
3. Add a "Manage Subscription" button that calls `/api/stripe/billing-portal`

The billing portal allows users to:
- Update payment method
- Cancel subscription
- View invoice history

#### 5.2 Test Subscription Cancellation

1. Go to Stripe Dashboard → **Customers** → Select your test customer
2. Click **Cancel subscription**
3. Verify in Supabase that the user's `subscription_tier` changes back to `free`

---

## Important Notes

### 7-Day Free Trial Behavior

- Users enter their credit card during checkout
- **They are NOT charged immediately**
- After 7 days, they are automatically charged
- They can cancel anytime during the trial with no charge

### Webhook Security

- The webhook endpoint verifies Stripe signatures using `STRIPE_WEBHOOK_SECRET`
- **Never skip signature verification** - it prevents attackers from spoofing events
- If webhook signatures fail, check that your webhook secret matches

### Testing vs Production

- Use **test mode** keys during development (they start with `sk_test_` and `pk_test_`)
- Use **live mode** keys in production (they start with `sk_live_` and `pk_live_`)
- Test mode and live mode have separate products, customers, and subscriptions

### Common Issues

**Issue:** Checkout fails with "Invalid plan" error
- **Fix:** Make sure you set `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO`, and `STRIPE_PRICE_AGENCY` in `.env.local`

**Issue:** Webhook events not being received
- **Fix:** Make sure `stripe listen` is running and forwarding to `http://localhost:3001/api/stripe/webhook`
- **Fix:** Check that `STRIPE_WEBHOOK_SECRET` is set correctly

**Issue:** Database not updating after checkout
- **Fix:** Check webhook logs in Stripe CLI for errors
- **Fix:** Verify `stripe_customer_id` column exists in profiles table

---

## Next Steps After Setup

1. **Add Billing Portal Button** to your dashboard/account page
2. **Enforce Usage Limits** based on subscription tier (already in `checkUsageLimits.ts`)
3. **Test Downgrade/Upgrade Flow** (change subscription plans)
4. **Set up Email Notifications** for payment failures, trial ending, etc.
5. **Switch to Live Mode** when ready to launch (update env vars)

---

## Resources

- [Stripe Testing Documentation](https://stripe.com/docs/testing)
- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)

---

## Questions?

If you encounter any issues during setup, check:
1. Browser console for JavaScript errors
2. Server logs (`npm run dev` output) for API errors
3. Stripe CLI output for webhook errors
4. Stripe Dashboard logs for API request details

Need help? Reference this guide and the comments in the code files:
- `/app/api/stripe/checkout/route.ts`
- `/app/api/stripe/webhook/route.ts`
- `/components/PricingSection.tsx`
