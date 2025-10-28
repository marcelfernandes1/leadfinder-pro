# LeadFinder Pro - Testing Guide

## Testing the Search System

### Prerequisites

Before testing the search system, you need:

1. ✅ Supabase configured (already done)
2. ✅ Google Maps API key (already in .env.local)
3. ✅ Hunter.io API key (already in .env.local)
4. ⏳ Inngest Dev Server running (instructions below)

### Step 1: Start Inngest Dev Server

Inngest requires a separate dev server to execute background jobs locally.

**Option A: Using Inngest Cloud (Recommended for MVP)**

1. Go to [https://app.inngest.com](https://app.inngest.com)
2. Sign up/login
3. Create a new app called "LeadFinder Pro"
4. Get your Event Key and Signing Key
5. Add to `.env.local`:
   ```
   INNGEST_EVENT_KEY=your_event_key
   INNGEST_SIGNING_KEY=your_signing_key
   ```
6. No additional dev server needed - Inngest Cloud handles everything

**Option B: Using Inngest Dev Server (Local Testing)**

1. Install Inngest CLI globally:
   ```bash
   npm install -g inngest-cli
   ```

2. Start the Inngest dev server:
   ```bash
   npx inngest-cli@latest dev
   ```

3. This will:
   - Start the Inngest dev server at `http://localhost:8288`
   - Automatically discover your functions at `http://localhost:3000/api/inngest`
   - Show you a UI to monitor function execution

4. Keep this running in a separate terminal

### Step 2: Access the Search Form

1. Make sure you're logged in (visit `http://localhost:3000` and sign in)
2. Go to the Dashboard: `http://localhost:3000/dashboard`
3. Click "🔍 Start New Search" button
4. You'll be taken to: `http://localhost:3000/search`

### Step 3: Submit a Test Search

Fill in the form with test data:

**Test Case 1: Miami Plumbers**
- **Location:** Miami, FL
- **Industry:** plumber
- **Radius:** 10 miles
- **Lead Count:** 100

**Test Case 2: Los Angeles Services**
- **Location:** Los Angeles, CA
- **Industry:** (leave blank)
- **Radius:** 5 miles
- **Lead Count:** 50

**Test Case 3: New York Restaurants**
- **Location:** New York, NY
- **Industry:** restaurant
- **Radius:** 3 miles
- **Lead Count:** 150

Click "🔍 Find Leads"

### Step 4: Monitor the Process

#### If using Inngest Cloud:
- Check your Inngest dashboard at `https://app.inngest.com`
- You'll see the functions executing in real-time

#### If using Inngest Dev Server:
- Open `http://localhost:8288` in your browser
- You'll see a UI showing:
  - Functions being triggered
  - Progress of each step
  - Any errors that occur
  - Logs from each function

#### In your terminal:
You should see logs like:
```
🚀 Starting lead discovery for search abc-123
🗺️  Geocoding location: Miami, FL
📍 Coordinates: 25.7617, -80.1918
🔍 Searching for: "plumber" within 16093m radius
✅ Found 45 businesses from Google Maps
✅ Saved 45 leads to database
📧 Finding email for domain: example.com
🤖 Website has automation: HubSpot
✅ Calculated score for lead xyz: 75
```

### Step 5: Check the Database

You can verify the search was created in Supabase:

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Open your project
3. Go to Table Editor
4. Check the `searches` table:
   - Should have a new row with `status: 'processing'`
   - Watch the `progress` field update from 0 to 100
5. Check the `leads` table:
   - Should have new leads being added
   - Watch as `email`, `has_automation`, and `probability_score` get filled in

### Step 6: Check Search Status API

You can manually poll the status endpoint:

```bash
# Replace {searchId} with the actual ID from the API response
curl http://localhost:3000/api/search/{searchId}/status
```

You should see:
```json
{
  "searchId": "abc-123",
  "status": "processing",
  "progress": 45,
  "currentStep": "Detecting CRM & automation tools...",
  "leadsFound": 42,
  "location": "Miami, FL",
  "industry": "plumber"
}
```

### Expected Timeline

For a search of 100 leads:
- **0-10 seconds:** Google Maps search
- **10-30 seconds:** Saving leads to database
- **30-90 seconds:** Email enrichment (parallel)
- **30-120 seconds:** CRM detection (parallel, slow websites)
- **90-150 seconds:** Score calculation
- **Total:** ~2-3 minutes

### Troubleshooting

#### "Usage limit exceeded"
- Your subscription tier doesn't allow searches
- Update your profile in Supabase:
  ```sql
  UPDATE profiles
  SET subscription_tier = 'starter'
  WHERE email = 'your@email.com';
  ```

#### "Google Maps API error"
- Check your API key is correct in `.env.local`
- Verify the API is enabled in Google Cloud Console
- Check you have billing enabled (required even for free tier)

#### "Inngest functions not executing"
- Make sure Inngest dev server is running
- Check `http://localhost:8288` shows your functions
- Verify `.env.local` has Inngest keys (if using cloud)

#### "No emails found"
- This is normal! Hunter.io has ~50-60% success rate
- Check your Hunter.io API key
- Verify you have API credits remaining

#### "CRM detection failing"
- Many small business websites are slow/unreachable
- This is expected behavior (70-80% success rate)
- Check terminal logs for specific errors

### Viewing Results

Once the search completes (`progress: 100`, `status: 'completed'`):

1. Check the database `leads` table
2. You should see:
   - Business names, addresses, phones
   - Some leads with emails (50-60%)
   - `has_automation` field (true/false)
   - `probability_score` (0-100)

**Next step:** Build the results display page to show these leads in the UI!

## Quick Test Without Inngest

If you want to test just the search creation (without background jobs):

```bash
# Create a search
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -b "cookies.txt" \
  -d '{
    "location": "Miami, FL",
    "industry": "plumber",
    "radius": 10,
    "requestedCount": 100
  }'

# Response:
# {
#   "searchId": "abc-123",
#   "status": "processing",
#   "message": "Lead discovery started..."
# }

# Check status
curl http://localhost:3000/api/search/abc-123/status \
  -b "cookies.txt"
```

Note: Without Inngest running, the background jobs won't execute, so the search will stay at `progress: 0`.

## Testing Individual Services

You can test the services independently:

### Test Google Maps Service
Create `test-google-maps.ts`:
```typescript
import { searchBusinesses } from './lib/services/googleMaps'

async function test() {
  const results = await searchBusinesses('Miami, FL', 'plumber', 16093)
  console.log(`Found ${results.length} businesses`)
  console.log(results[0])
}

test()
```

Run: `npx tsx test-google-maps.ts`

### Test Email Finder
Create `test-email-finder.ts`:
```typescript
import { findEmail } from './lib/services/emailFinder'

async function test() {
  const email = await findEmail('example.com')
  console.log('Found email:', email)
}

test()
```

Run: `npx tsx test-email-finder.ts`

### Test CRM Detector
Create `test-crm-detector.ts`:
```typescript
import { detectCRM } from './lib/services/crmDetector'

async function test() {
  const result = await detectCRM('https://example.com')
  console.log('Detection result:', result)
}

test()
```

Run: `npx tsx test-crm-detector.ts`

## Success Criteria

A successful test should show:
- ✅ Search created in database
- ✅ Inngest job triggered
- ✅ Google Maps returns businesses
- ✅ Leads saved to database
- ✅ Some emails found (~50-60%)
- ✅ CRM detection completes (~70-80%)
- ✅ Probability scores calculated
- ✅ Search status updates to "completed"
- ✅ Progress goes from 0 → 100

## Next Steps After Testing

Once you've verified the search system works:

1. **Build Loading Animation Page** - Show progress in real-time
2. **Build Results Display** - Show all leads in dashboard
3. **Add Filtering & Sorting** - Filter by score, status, etc.
4. **Add CSV Export** - Download leads
5. **Add Stripe Integration** - Payment processing

The hardest part (lead discovery) is done! 🎉
