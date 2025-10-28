# Inngest Production Setup on Vercel

This guide will help you set up Inngest for production on Vercel.

## Prerequisites

- ✅ Code deployed to Vercel (just pushed!)
- ⏳ Inngest Cloud account (free tier available)

## Step 1: Create Inngest Cloud Account

1. Go to https://www.inngest.com/
2. Click "Sign Up" or "Get Started"
3. Sign up with GitHub (recommended) or email
4. Create a new workspace/account

## Step 2: Create an Inngest App

1. In Inngest Dashboard, click **"Create App"** or **"New App"**
2. Name it: `leadfinder-pro` (or whatever you prefer)
3. Copy the following values (you'll need them for Vercel):
   - **Event Key** (for sending events)
   - **Signing Key** (for securing your webhook)

## Step 3: Add Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these variables:

```bash
# Inngest Configuration
INNGEST_EVENT_KEY=<your-event-key-from-inngest>
INNGEST_SIGNING_KEY=<your-signing-key-from-inngest>
```

**Important:** Add these to **all environments** (Production, Preview, Development)

4. Click **Save**

## Step 4: Register Your App with Inngest Cloud

After deploying to Vercel with the environment variables:

1. Go back to Inngest Dashboard
2. Click **"Sync"** or **"Register Functions"**
3. Enter your Vercel app URL:
   ```
   https://your-app-name.vercel.app/api/inngest
   ```
4. Click **"Sync App"**

Inngest will:
- Discover your 4 background functions
- Register them in Inngest Cloud
- Start monitoring for events

## Step 5: Verify Everything Works

### Check Function Registration

In Inngest Dashboard, you should see:
- ✅ `search-discover-leads` - Main orchestrator
- ✅ `lead-enrich-email` - Email enrichment
- ✅ `lead-enrich-crm` - CRM detection
- ✅ `lead-calculate-score` - Probability scoring

### Test a Search

1. Go to your production app: `https://your-app-name.vercel.app`
2. Sign up / Log in
3. Navigate to `/search`
4. Submit a search
5. Go back to Inngest Dashboard → **Runs**
6. You should see your function running in real-time!

## Troubleshooting

### "Functions not found" in Inngest Dashboard

**Problem:** Inngest can't reach your `/api/inngest` endpoint

**Solutions:**
1. Check that environment variables are set in Vercel
2. Verify the URL is correct: `https://your-domain.vercel.app/api/inngest`
3. Try accessing the endpoint directly in your browser (should return JSON)
4. Redeploy your app if you just added the environment variables

### "Unauthorized" errors in function logs

**Problem:** Signing key mismatch

**Solutions:**
1. Double-check `INNGEST_SIGNING_KEY` in Vercel matches Inngest Dashboard
2. No extra spaces or quotes in the environment variable
3. Redeploy after fixing

### Functions run but fail immediately

**Problem:** Missing environment variables for external APIs

**Solutions:**
Check these are set in Vercel:
```bash
GOOGLE_MAPS_API_KEY=<your-key>
HUNTER_IO_API_KEY=<your-key>
APIFY_API_KEY=<your-key>
NEXT_PUBLIC_SUPABASE_URL=<your-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>
SUPABASE_SERVICE_ROLE_KEY=<your-key>
```

### Rate limiting or timeout errors

**Problem:** Too many API calls or slow responses

**Solutions:**
1. Check your API quotas (Google Maps, Hunter.io, Apify)
2. Upgrade API plans if needed
3. Reduce search lead counts for testing
4. Check Inngest function timeout settings

## Cost Estimates

### Inngest Cloud
- **Free Tier:** 1,000 function runs/month
- **Pro Plan:** $10/month for 10,000 runs
- **Estimate:** ~50 runs per search (1 main + enrichment + scoring)
  - Free tier = ~20 searches/month
  - Pro plan = ~200 searches/month

### Vercel
- **Hobby (Free):** 100 GB-hours/month
- **Pro:** $20/month for more resources
- **Note:** Background jobs via Inngest don't count against Vercel function timeout limits!

### Total Monthly Costs (Estimated)
- **Minimum:** $0 (free tiers + your existing API costs)
- **Low Volume:** ~$30-50/month (Vercel free, Inngest Pro, APIs)
- **Medium Volume:** ~$70-100/month (all Pro plans)

## Monitoring & Debugging

### Inngest Dashboard
- **Runs:** See all function executions in real-time
- **Logs:** Detailed logs for each step
- **Replay:** Re-run failed functions with one click
- **Metrics:** Success rates, execution times, error rates

### Key Metrics to Watch
- Success rate (should be >90%)
- Average execution time (~2-3 min per search)
- Error types (API failures vs code bugs)
- API quota usage

## Best Practices

1. **Start Small**
   - Test with 1-2 searches first
   - Monitor costs closely
   - Scale up gradually

2. **Set Up Alerts**
   - Inngest can send alerts for failed functions
   - Monitor API quota usage
   - Track error rates

3. **Handle Failures Gracefully**
   - Email/social not found = OK (expected)
   - Website timeout = OK (continue processing)
   - Database errors = NOT OK (needs fixing)

4. **Rate Limiting**
   - Respect API rate limits
   - Add delays between API calls if needed
   - Consider queueing searches during high traffic

## Next Steps

After Inngest is working in production:

1. ✅ Test the full search flow end-to-end
2. ✅ Verify lead data quality
3. ✅ Set up monitoring and alerts
4. ✅ Document any API quota issues
5. ✅ Plan for scaling (more users = more runs)

## Need Help?

- **Inngest Docs:** https://www.inngest.com/docs
- **Inngest Discord:** https://www.inngest.com/discord
- **Vercel Support:** https://vercel.com/support

## Security Checklist

Before going live:
- [ ] All environment variables are set correctly
- [ ] Signing key is configured (prevents unauthorized function calls)
- [ ] RLS policies are enabled in Supabase
- [ ] API keys have appropriate permissions (not admin/owner)
- [ ] Test endpoint (`/api/test-inngest`) is disabled in production (it already checks `NODE_ENV`)
