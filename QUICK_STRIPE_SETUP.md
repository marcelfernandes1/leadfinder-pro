# Quick Stripe Setup - Get Up and Running in 10 Minutes

Follow these steps to get Stripe working **right now**:

## Step 1: Create Stripe Products (5 minutes)

### Go to Stripe Dashboard
1. Open https://dashboard.stripe.com/test/products
2. Make sure you're in **TEST MODE** (toggle in top-right corner)

### Create Product #1: Starter Plan
1. Click **"+ Add product"**
2. Fill in:
   - **Name:** `LeadFinder Pro - Starter`
   - **Description:** `500 leads per month`
   - **Pricing model:** `Standard pricing`
   - **Price:** `97.00` USD
   - **Billing period:** `Recurring` → `Monthly`
3. Click **"Add pricing"** or scroll down
4. Under **"Free trial"**, enter `7` days
5. Click **"Save product"**
6. **COPY THE PRICE ID** - it looks like `price_1ABC123xyz...`
7. Save it for Step 2

### Create Product #2: Pro Plan
1. Click **"+ Add product"** again
2. Fill in:
   - **Name:** `LeadFinder Pro - Pro`
   - **Description:** `2,000 leads per month`
   - **Price:** `197.00` USD
   - **Billing period:** `Recurring` → `Monthly`
   - **Free trial:** `7` days
3. Click **"Save product"**
4. **COPY THE PRICE ID** (starts with `price_`)
5. Save it for Step 2

### Create Product #3: Agency Plan
1. Click **"+ Add product"** again
2. Fill in:
   - **Name:** `LeadFinder Pro - Agency`
   - **Description:** `Unlimited leads`
   - **Price:** `297.00` USD
   - **Billing period:** `Recurring` → `Monthly`
   - **Free trial:** `7` days
3. Click **"Save product"**
4. **COPY THE PRICE ID** (starts with `price_`)
5. Save it for Step 2

---

## Step 2: Add Price IDs to Your Project (2 minutes)

1. Open `.env.local` in your project
2. Add these lines at the bottom (replace with your actual price IDs from Step 1):

```bash
# Stripe Product Price IDs
STRIPE_PRICE_STARTER=price_PASTE_YOUR_STARTER_PRICE_ID_HERE
STRIPE_PRICE_PRO=price_PASTE_YOUR_PRO_PRICE_ID_HERE
STRIPE_PRICE_AGENCY=price_PASTE_YOUR_AGENCY_PRICE_ID_HERE
```

3. Save the file

---

## Step 3: Restart Your Dev Server (30 seconds)

```bash
# Stop your current dev server (Ctrl+C in the terminal)
# Then restart it:
npm run dev
```

---

## Step 4: Add Database Column (2 minutes)

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New query"**
5. Paste this SQL:

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
```

6. Click **"Run"** (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

---

## Step 5: Test It! (2 minutes)

1. Go to http://localhost:3001
2. **Sign in** (or sign up if you haven't already)
3. Scroll to the pricing section
4. Click **"Start Free Trial"** on any plan
5. You should be redirected to Stripe Checkout!

### Use Stripe Test Card
On the Stripe checkout page, use:
- **Card number:** 4242 4242 4242 4242
- **Expiry:** Any future date (e.g., 12/34)
- **CVC:** Any 3 digits (e.g., 123)
- **ZIP:** Any 5 digits (e.g., 12345)

---

## ✅ Done!

After completing checkout, check:
1. **Stripe Dashboard** → Customers (you should see your test customer)
2. **Supabase** → profiles table (subscription_tier should be updated)

---

## 🐛 Troubleshooting

**Error: "Payment system not fully configured"**
- Make sure you added all 3 price IDs to `.env.local`
- Make sure you restarted the dev server
- Check that price IDs start with `price_` (not `prod_`)

**Error: "Unauthorized"**
- You need to be signed in before selecting a plan
- Go to http://localhost:3001/auth/login

**Checkout page doesn't show 7-day trial**
- Make sure you checked "Free trial: 7 days" when creating the products
- You might need to recreate the products with the trial enabled

**Database error after checkout**
- Run the SQL from Step 4 to add the stripe_customer_id column

---

## Next: Set Up Webhooks (Optional for Now)

For now, you can skip webhooks. They're mainly needed for:
- Automatic subscription updates
- Handling cancellations
- Processing payments

To set up webhooks later, see the full **STRIPE_SETUP.md** guide.

---

Need help? Check the browser console (F12) and server logs for error messages.
