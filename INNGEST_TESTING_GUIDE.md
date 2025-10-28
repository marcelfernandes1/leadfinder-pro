# Inngest Local Testing Guide

This guide will help you test your Inngest background jobs locally.

## Prerequisites

### 1. Start the Dev Servers

You need **two terminals running** for Inngest to work:

**Terminal 1 - Next.js Dev Server:**
```bash
npm run dev
```
This starts Next.js on http://localhost:3001

**Terminal 2 - Inngest Dev Server:**
```bash
npx inngest-cli@latest dev
```
This starts Inngest Dev Server on http://localhost:8288

### 2. Create a User Account

Before you can test searches, you need to have at least one user in your database:

1. Open http://localhost:3001/auth/signup
2. Create an account (any email/password works in development)
3. Verify the email if prompted (check Supabase dashboard for the verification link)

## Testing Methods

### Method 1: Test Endpoint (Easiest)

We've created a special test endpoint that bypasses authentication:

```bash
curl -X POST http://localhost:3001/api/test-inngest \
  -H "Content-Type: application/json" \
  -d '{}'
```

This will:
- Create a test search in the database
- Trigger the Inngest background job
- Return a link to view the run in the Inngest UI

Example response:
```json
{
  "success": true,
  "searchId": "abc-123-def",
  "message": "Test search created! Check Inngest Dev Server at http://localhost:8288 to see the run.",
  "inngestUrl": "http://localhost:8288/runs"
}
```

### Method 2: Via the Web UI (Most Realistic)

1. **Sign in** at http://localhost:3001/auth/login
2. **Navigate to search** at http://localhost:3001/search
3. **Fill out the form:**
   - Location: "San Francisco, CA"
   - Industry: "restaurants" (optional)
   - Radius: 10 miles
   - Lead count: 50
4. **Submit** and you'll be redirected to a loading page
5. **Open Inngest Dev UI** at http://localhost:8288 to watch the job run

### Method 3: Direct Event Trigger (Advanced)

You can trigger events directly from code:

```typescript
import { inngest } from '@/lib/inngest/client'

await inngest.send({
  name: 'search/discover-leads',
  data: {
    searchId: 'your-search-id',
    userId: 'your-user-id',
    location: 'San Francisco, CA',
    industry: 'restaurants',
    radius: 16093, // meters
    requestedCount: 50,
  },
})
```

## Monitoring Your Inngest Jobs

### Inngest Dev UI

Open http://localhost:8288 in your browser to:
- **View all function runs** (http://localhost:8288/runs)
- **See function definitions** (http://localhost:8288/functions)
- **Inspect event history**
- **View logs and errors**
- **Replay failed runs**

### What to Look For

After triggering a search, you should see:

1. **Main Function:** `search-discover-leads`
   - Status: Running → Completed
   - Steps:
     - `update-search-status`
     - `search-google-maps`
     - `update-progress-30`
     - `save-leads-to-db`
     - `update-progress-50`
     - `trigger-enrichment-jobs`
     - And more...

2. **Enrichment Functions** (one per lead found):
   - `lead-enrich-email` - Finds email addresses
   - `lead-enrich-crm` - Detects CRM tools

3. **Scoring Functions** (one per lead):
   - `lead-calculate-score` - Calculates probability scores

## Common Issues & Solutions

### Issue: "No runs showing in Inngest UI"

**Possible Causes:**
1. Inngest Dev Server not running
2. Next.js app not registering functions with Inngest
3. Authentication issues (search never created)

**Solutions:**
```bash
# 1. Check Inngest is running
ps aux | grep inngest

# 2. Restart Inngest dev server
# Kill it with Ctrl+C and restart:
npx inngest-cli@latest dev

# 3. Use the test endpoint (bypasses auth):
curl -X POST http://localhost:3001/api/test-inngest -H "Content-Type: application/json" -d '{}'
```

### Issue: "Functions not registered"

**Symptoms:**
- Inngest UI shows "No functions" or 0 functions
- Errors about "function not found"

**Solution:**
```bash
# 1. Check the /api/inngest endpoint is accessible
curl http://localhost:3001/api/inngest

# 2. Restart Next.js dev server
# Terminal 1:
npm run dev

# 3. Check Inngest can reach your app
# You should see PUT requests to /api/inngest in your Next.js logs
```

### Issue: "ReferenceError: fetch is not defined"

**Solution:**
This usually happens when using Node.js < 18. Upgrade to Node 18+:
```bash
node -v  # Should be >= 18.0.0
```

### Issue: "Google Maps API error" or "Hunter.io API error"

**Cause:** Missing or invalid API keys

**Solution:**
Check your `.env.local` file has:
```bash
GOOGLE_MAPS_API_KEY=your-key-here
HUNTER_IO_API_KEY=your-key-here
APIFY_API_KEY=your-key-here
```

### Issue: "Search stays at 0% progress"

**Possible Causes:**
1. Background job failed silently
2. Database connection issue
3. API rate limits

**Debug Steps:**
1. Check Inngest UI for error messages
2. Check Next.js console for errors
3. Check database logs in Supabase dashboard

## Expected Behavior

### Timeline

For a search requesting 50 leads:

- **0-10s:** Google Maps search runs, finds ~20-60 businesses
- **10-30s:** Businesses saved to database
- **30s-2min:** Email finding and CRM detection (parallel)
- **2-3min:** Probability scores calculated
- **3min:** Search marked as completed (100% progress)

### Success Indicators

✅ **Inngest Dev UI shows:**
- Function run with "Completed" status
- Green checkmarks on all steps
- Multiple enrichment jobs spawned

✅ **Database shows:**
- New search record with status="completed"
- Multiple lead records linked to that search
- Leads have emails, phone numbers, etc.

✅ **Next.js logs show:**
- `🚀 Starting lead discovery for search xyz`
- `✅ Found X businesses from Google Maps`
- `✅ Saved X leads to database`
- `🎉 Search xyz completed successfully!`

## Pro Tips

1. **Keep Inngest UI open** - It's the best way to debug what's happening
2. **Check the "Logs" tab** in each run to see detailed output
3. **Use the test endpoint** for quick iterations
4. **Replay failed runs** using the "Replay" button in Inngest UI
5. **Check the "Events" tab** to see what events are being sent

## API Costs Warning

Even in development, these APIs cost money:
- **Google Maps:** Free tier ($200/month credit)
- **Hunter.io:** Free tier (50 searches/month)
- **Apify:** Paid (starts at $49/month)

To avoid costs during testing:
- Keep requested lead counts low (50 max)
- Don't run tests continuously
- Consider mocking API responses for development

## Next Steps

Once Inngest is working locally:
1. Test with different locations and industries
2. Verify lead data quality in the database
3. Test the loading page and results display
4. Deploy to production (Vercel + Inngest Cloud)

## Need Help?

If you're still having issues:
1. Check the main console logs (both Next.js and Inngest)
2. Look for errors in the Inngest Dev UI
3. Check your database in Supabase dashboard
4. Verify all environment variables are set correctly
