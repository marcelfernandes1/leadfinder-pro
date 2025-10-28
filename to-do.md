# LeadFinder Pro Development To-Do List

## Confirmed Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- react-confetti (celebration effects)

**Backend:**
- Next.js API Routes
- Supabase PostgreSQL (database)
- Supabase Auth (authentication)
- Inngest (background job processing)

**Data Sources:**
- Google Maps Places API (business discovery)
- Hunter.io (email finding)
- Apify (social media scraping)
- Custom website scraping (CRM detection)

**Payments:**
- Stripe (subscriptions)

**Hosting:**
- Vercel (frontend + API routes)
- Supabase (database + auth)

**Estimated Monthly API Costs:** ~$70-100/mo

---

## Project Setup & Architecture (Week 1)

### 1. Initial Project Setup
- [x] Initialize Next.js 14 project with TypeScript
  ```bash
  npx create-next-app@latest leadfinder-pro --typescript --tailwind --app --eslint
  ```
- [x] Configure Tailwind CSS (should be auto-configured)
- [x] Set up ESLint and Prettier
- [x] Create `.env.local` file for environment variables
- [x] Create `.env.example` file with all required env vars (no secrets)
- [x] Set up Git repository with proper .gitignore
- [x] Create folder structure:
  ```
  /app               - Next.js app directory (pages + API routes)
  /components        - Reusable React components
  /lib
    /services        - External API integrations
    /utils           - Helper functions
    /supabase        - Supabase client setup
  /types             - TypeScript type definitions
  /hooks             - Custom React hooks
  ```

**AI Coding Note:** Keep folder structure simple. Don't over-organize. Add folders as needed.

---

### 2. Supabase Setup
- [x] Create Supabase account at https://supabase.com
- [x] Create new project (choose region closest to users)
- [x] Copy project URL and anon key to `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_project_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
  ```
- [x] Install Supabase client:
  ```bash
  npm install @supabase/supabase-js @supabase/ssr
  ```
- [x] Create `/lib/supabase/client.ts` - client-side Supabase client
- [x] Create `/lib/supabase/server.ts` - server-side Supabase client
- [x] Create `/lib/supabase/middleware.ts` - auth middleware

**AI Coding Note:** Follow Supabase Next.js 14 docs exactly. Don't deviate from their recommended setup.

---

### 3. Database Schema Design
- [x] Open Supabase SQL Editor
- [x] Create `profiles` table:
  ```sql
  create table profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    subscription_tier text default 'free',
    leads_used_this_month integer default 0,
    billing_cycle_start timestamp with time zone,
    created_at timestamp with time zone default now()
  );
  ```
- [x] Create `searches` table:
  ```sql
  create table searches (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references profiles(id) on delete cascade not null,
    location text not null,
    industry text,
    radius integer,
    requested_count integer,
    status text default 'processing',
    progress integer default 0,
    results_count integer default 0,
    created_at timestamp with time zone default now()
  );
  ```
- [x] Create `leads` table:
  ```sql
  create table leads (
    id uuid default gen_random_uuid() primary key,
    search_id uuid references searches(id) on delete cascade not null,
    business_name text not null,
    address text,
    website text,
    phone text,
    email text,
    instagram text,
    facebook text,
    whatsapp text,
    linkedin text,
    tiktok text,
    has_automation boolean default false,
    probability_score integer,
    industry text,
    google_rating numeric,
    created_at timestamp with time zone default now()
  );
  ```
- [x] Create `lead_status` table:
  ```sql
  create table lead_status (
    id uuid default gen_random_uuid() primary key,
    lead_id uuid references leads(id) on delete cascade not null,
    user_id uuid references profiles(id) on delete cascade not null,
    status text default 'not_contacted',
    updated_at timestamp with time zone default now(),
    unique(lead_id, user_id)
  );
  ```
- [x] Create indexes for performance:
  ```sql
  create index idx_leads_search_id on leads(search_id);
  create index idx_leads_probability_score on leads(probability_score desc);
  create index idx_lead_status_user_id on lead_status(user_id);
  create index idx_searches_user_id on searches(user_id);
  ```
- [x] Enable Row Level Security (RLS) on all tables
- [x] Create RLS policies (users can only see their own data)

**AI Coding Note:** Run each SQL statement one at a time. Verify in Supabase table editor before moving to next. RLS is critical for security.

---

### 4. Supabase Authentication Setup
- [x] Enable email authentication in Supabase dashboard (Authentication → Providers → Email)
- [x] Configure email templates (optional, use defaults for MVP)
- [x] Create `/app/auth/login/page.tsx` - login page
- [x] Create `/app/auth/signup/page.tsx` - signup page
- [x] Create `/app/auth/callback/route.ts` - auth callback handler
- [x] Implement sign up form with email + password
- [x] Implement login form with email + password
- [x] Add password validation (min 8 chars)
- [x] Add email verification flow
- [x] Create protected route middleware
- [x] Test full auth flow (signup → email verify → login)

**AI Coding Note:** Use Supabase Auth UI library if you want pre-built components, or build custom forms. Supabase handles all password hashing, session management automatically.

---

### 5. Environment Variables Setup
- [x] Add all required env vars to `.env.local`:
  ```
  # Supabase
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=

  # Google Maps
  GOOGLE_MAPS_API_KEY=

  # Hunter.io
  HUNTER_IO_API_KEY=

  # Apify
  APIFY_API_KEY=

  # Stripe
  STRIPE_SECRET_KEY=
  STRIPE_PUBLISHABLE_KEY=
  STRIPE_WEBHOOK_SECRET=

  # Inngest
  INNGEST_EVENT_KEY=
  INNGEST_SIGNING_KEY=
  ```
- [x] Create `.env.example` with same keys but empty values
- [x] Add `.env.local` to `.gitignore` (should already be there)

**AI Coding Note:** Don't commit real API keys. Ever.

---

## External API Setup (Week 1-2)

### 6. Google Maps API Setup
- [x] Go to Google Cloud Console (console.cloud.google.com)
- [x] Create new project
- [x] Enable Google Maps Places API (New)
- [x] Create API key
- [x] Restrict API key to Places API only
- [x] Add billing account (required even for free tier)
- [x] Add API key to `.env.local`
- [x] Test with sample query in Postman or curl

**Cost Estimate:** $17 per 1000 place details requests. Start with $50 budget.

**AI Coding Note:** Google Maps has generous free tier ($200 credit/month). You likely won't pay anything during development.

---

### 7. Hunter.io API Setup
- [x] Sign up at https://hunter.io
- [x] Choose plan (start with $49/mo for 500 searches)
- [x] Get API key from dashboard
- [x] Add to `.env.local`
- [x] Test email finding with a known domain
- [ ] Document success rate for later optimization

**AI Coding Note:** Hunter.io has 50 free searches. Use those for testing. Don't upgrade until production.

---

### 8. Apify Setup
- [x] Sign up at https://apify.com
- [x] Browse Apify Store for these actors:
  - "Google Maps Scraper" (for additional business data)
  - "Instagram Profile Scraper" (for finding Instagram handles)
  - "Facebook Pages Scraper" (for finding Facebook pages)
- [x] Get API key from dashboard
- [x] Add to `.env.local`
- [ ] Test each actor with small dataset (1-2 businesses)
- [ ] Calculate cost per lead (~$0.01-0.05 per profile)

**Cost Estimate:** ~$20-30/mo for 500-1000 social profiles

**AI Coding Note:** Apify is pay-as-you-go. Test extensively with free credits. Each actor has different input/output format - read docs carefully.

---

### 9. Stripe Setup
- [x] Create Stripe account at https://stripe.com
- [x] Get test API keys (starts with `sk_test_` and `pk_test_`)
- [x] Add to `.env.local`
- [x] Create products in test mode:
  - **Starter:** $97/mo recurring (500 leads/month) - prod_TJuMAi9hvlNnLB
  - **Pro:** $197/mo recurring (2000 leads/month) - prod_TJuM8sUoAKfFPv
  - **Agency:** $297/mo recurring (unlimited leads) - prod_TJuMLo1AV6cqE5
- [x] Save product IDs and price IDs for later use
- [x] Install Stripe SDK:
  ```bash
  npm install stripe @stripe/stripe-js
  ```

**AI Coding Note:** Stay in test mode until launch. Use test card numbers (4242 4242 4242 4242) for testing.

---

### 10. Inngest Setup
- [x] Sign up at https://inngest.com
- [x] Create new app
- [x] Get event key and signing key
- [x] Add to `.env.local`
- [x] Install Inngest SDK:
  ```bash
  npm install inngest
  ```
- [x] Create `/app/api/inngest/route.ts` for Inngest webhook endpoint
- [ ] Test connection with simple "hello world" function

**AI Coding Note:** Inngest has generous free tier (5000 function runs/month). Perfect for MVP. Use for background lead processing.

---

## Core Feature Development (Weeks 2-4)

### 11. Google Maps Service Integration
- [ ] Create `/lib/services/googleMaps.ts`
- [x] Install Google Maps client:
  ```bash
  npm install @googlemaps/google-maps-services-js
  ```
- [ ] Create function `searchBusinesses(location, radius, businessType)`:
  - Use Places API Text Search
  - Return array of business objects
  - Extract: name, formatted_address, formatted_phone_number, website, rating
- [ ] Add error handling for API limits
- [ ] Add retry logic (3 attempts)
- [ ] Test with multiple locations (e.g., "Miami, FL", "Los Angeles, CA")
- [ ] Log API usage for monitoring

**Expected Output:** Array of 20-60 businesses per search (Google returns max 60)

**AI Coding Note:** Google Maps API is well-documented. Use TypeScript types from the SDK. Don't reinvent the wheel.

---

### 12. Email Finding Service
- [ ] Create `/lib/services/emailFinder.ts`
- [ ] Implement Hunter.io integration:
  - Function `findEmail(domain)` - finds email from domain
  - Function `verifyEmail(email)` - verifies if email is valid
- [ ] Add rate limiting (respect Hunter.io limits)
- [ ] Add fallback: if Hunter.io fails, try extracting email from website
- [ ] Create helper function to extract domain from full URL
- [ ] Handle common edge cases:
  - No website provided
  - Invalid domain
  - Rate limit reached
  - No email found (return null, don't error)

**Expected Success Rate:** 50-60% of businesses will have email found

**AI Coding Note:** Email finding WILL fail often. This is normal. Handle gracefully and continue processing other leads.

---

### 13. Social Media Discovery Service
- [ ] Create `/lib/services/socialMedia.ts`
- [ ] Implement Apify integration for Instagram:
  - Use "Instagram Profile Scraper" actor
  - Search by business name + location
  - Return Instagram username (without @ symbol)
  - Handle "not found" gracefully
- [ ] Implement Apify integration for Facebook:
  - Use "Facebook Pages Scraper" actor
  - Search by business name + location
  - Return Facebook page URL
- [ ] Add function to extract WhatsApp from Facebook page or website
- [ ] Add basic LinkedIn company search (optional - lower priority)
- [ ] Batch process: send 5-10 businesses to Apify at once (more efficient)

**Expected Success Rate:** 40-60% for Instagram, 50-70% for Facebook

**AI Coding Note:** Apify actors are async and slow (10-60 seconds). Don't wait for them synchronously. Use Inngest to process in background.

---

### 14. CRM/Automation Detection Service
- [ ] Create `/lib/services/crmDetector.ts`
- [x] Install dependencies:
  ```bash
  npm install axios cheerio
  ```
- [ ] Create function `detectCRM(websiteUrl)`:
  - Fetch website HTML (with 10 second timeout)
  - Search HTML for common CRM/automation scripts:
    - HubSpot: `hs-scripts.com`, `hsforms.net`
    - Mailchimp: `list-manage.com`, `mc.js`
    - ActiveCampaign: `activehosted.com`, `actid`
    - Klaviyo: `klaviyo.com`, `klaviyo`
    - ConvertKit: `convertkit.com`
    - Drip: `drip.com`
    - Constant Contact: `constantcontact.com`
    - SendGrid: `sendgrid.net`
    - Intercom: `intercom.io`
    - Drift: `drift.com`
  - Return object: `{ hasAutomation: boolean, detectedTools: string[] }`
- [ ] Handle errors gracefully:
  - Website unreachable → assume no CRM
  - Invalid URL → skip detection
  - Timeout → assume no CRM
- [ ] Add caching (don't check same domain twice)

**Expected Success Rate:** 70-80% of websites will be reachable and checkable

**AI Coding Note:** Websites are slow and unreliable. Add generous timeout (10 seconds). Don't let this block the entire pipeline.

---

### 15. Probability Score Calculator
- [ ] Create `/lib/utils/scoreCalculator.ts`
- [ ] Implement pure function `calculateProbabilityScore(lead)`:
  ```typescript
  interface Lead {
    hasWebsite: boolean;
    hasEmail: boolean;
    hasPhone: boolean;
    hasInstagram: boolean;
    hasFacebook: boolean;
    hasAutomation: boolean;
    googleRating?: number;
    // ... other fields
  }

  function calculateProbabilityScore(lead: Lead): number {
    let score = 0;

    // No CRM/automation detected (biggest qualifier)
    if (!lead.hasAutomation) score += 40;

    // Has website (shows they're established)
    if (lead.hasWebsite) score += 15;

    // Active on social media (reachable)
    if (lead.hasInstagram || lead.hasFacebook) score += 10;

    // Email found (can contact them)
    if (lead.hasEmail) score += 10;

    // Phone found (can call them)
    if (lead.hasPhone) score += 10;

    // Good Google rating (quality business)
    if (lead.googleRating && lead.googleRating >= 4.0) score += 10;

    // Service-based business (confirmed via industry)
    if (lead.industry && isServiceBased(lead.industry)) score += 5;

    return Math.min(score, 100); // Cap at 100
  }
  ```
- [ ] Add helper function `isServiceBased(industry)` to check if service-based
- [ ] Add unit tests for edge cases (all fields missing, all fields present, etc.)

**AI Coding Note:** This is a pure function. Easy to test. No side effects. Keep it simple.

---

### 16. Lead Orchestrator Service
- [ ] Create `/lib/services/leadOrchestrator.ts`
- [ ] Create main function `processLeadSearch(searchId, location, industry, count)`:
  1. Update search status to "processing"
  2. Call Google Maps API to get businesses
  3. For each business:
     - Save basic info to database immediately
     - Queue background jobs for enrichment (email, social, CRM)
  4. Update search status to "completed"
  5. Return search results
- [ ] Create Inngest function for email enrichment:
  ```typescript
  inngest.createFunction(
    { id: "enrich-lead-email" },
    { event: "lead/enrich.email" },
    async ({ event }) => {
      const { leadId, domain } = event.data;
      const email = await findEmail(domain);
      await updateLead(leadId, { email });
    }
  );
  ```
- [ ] Create Inngest function for social media enrichment
- [ ] Create Inngest function for CRM detection
- [ ] Create Inngest function to calculate probability score (runs after all enrichment)
- [ ] Add progress tracking (update `searches.progress` field)

**AI Coding Note:** This is the most complex part. Build incrementally:
1. First, just get Google Maps working
2. Then add email enrichment
3. Then add social media
4. Then add CRM detection
5. Finally, add probability scoring

Test each step before moving to next. Don't try to build it all at once.

---

## User Interface Development (Weeks 3-5)

### 17. Main Layout & Navigation
- [ ] Create `/app/layout.tsx` (if not exists)
- [ ] Create `/components/Navbar.tsx`:
  - Logo/brand name
  - Navigation links: Dashboard, New Search, Account
  - User avatar/email in top right
  - Logout button
- [ ] Create `/components/Sidebar.tsx` (optional, for dashboard filters)
- [ ] Add Tailwind CSS styling
- [ ] Make responsive (hamburger menu on mobile)

**AI Coding Note:** Use Tailwind UI or Shadcn UI for pre-built components. Don't reinvent navbar.

---

### 18. Search Form Page
- [ ] Create `/app/search/page.tsx`
- [x] Install form library:
  ```bash
  npm install react-hook-form zod @hookform/resolvers
  ```
- [ ] Create form with fields:
  - **Location input:** text field (city, state, or full address)
  - **Radius selector:** dropdown (5, 10, 25, 50 miles)
  - **Industry keywords:** optional text field (comma-separated)
  - **Number of leads:** slider (100-500)
- [ ] Add form validation with Zod:
  - Location is required
  - Radius must be valid option
  - Lead count between 100-500
- [ ] Style with Tailwind CSS
- [ ] Add "Find Leads" button (primary CTA)
- [ ] Handle form submission:
  - Call API to start search
  - Redirect to loading page with searchId
- [ ] Make mobile responsive

**AI Coding Note:** React Hook Form + Zod is industry standard. Follow their docs. Don't over-complicate.

---

### 19. Loading Animation Screen
- [ ] Create `/app/search/[searchId]/loading/page.tsx`
- [x] Install animation libraries:
  ```bash
  npm install framer-motion
  ```
- [ ] Design animated progress sequence:
  - Step 1: "🔍 Scanning 10,000+ local businesses..." (0-20%)
  - Step 2: "🎯 Filtering for service-based companies..." (20-40%)
  - Step 3: "🤖 Detecting CRM & automation tools..." (40-70%)
  - Step 4: "💰 Calculating buying probability..." (70-90%)
  - Step 5: "✨ Finding your best leads..." (90-100%)
- [ ] Add progress bar with smooth animation
- [ ] Poll API every 2 seconds to get real progress:
  ```typescript
  useEffect(() => {
    const interval = setInterval(async () => {
      const status = await fetch(`/api/search/${searchId}/status`);
      const { progress, currentStep } = await status.json();
      setProgress(progress);
    }, 2000);
    return () => clearInterval(interval);
  }, [searchId]);
  ```
- [ ] When progress reaches 100%, redirect to celebration screen
- [ ] Add subtle animations (pulsing icons, shimmer effects)

**AI Coding Note:** You can fake the progress if needed (linear 0-100 over 15 seconds). Real progress is better but not critical for MVP.

---

### 20. Celebration Screen
- [ ] Create `/app/search/[searchId]/results/page.tsx` (shows celebration first)
- [x] Install confetti library:
  ```bash
  npm install react-confetti
  ```
- [ ] Design celebration animation:
  - Confetti explosion (full screen)
  - Large text: "DEALS FOUND!!!" (animated entrance)
  - Display count: "147 High-Quality Leads Discovered!"
  - Optional: celebration sound effect (with mute toggle)
  - "View Leads" button (appears after 2-3 seconds)
- [ ] Auto-transition to dashboard after 5 seconds (or on button click)
- [ ] Make confetti performant (stop after 5 seconds to save CPU)

**AI Coding Note:** Keep this simple. It's just a feel-good screen. Don't over-engineer.

---

### 21. Lead Dashboard - Layout & Structure
- [ ] Create `/app/dashboard/page.tsx`
- [ ] Design layout:
  ```
  +----------------------------------+
  | Header (user info, new search)   |
  +--------+-------------------------+
  | Filter |  Lead List              |
  | Sidebar|  (cards or table)       |
  |        |                         |
  |        |  Pagination             |
  +--------+-------------------------+
  ```
- [ ] Add header section:
  - Display total leads found
  - "New Search" button
  - Usage meter (e.g., "347/500 leads used this month")
- [ ] Create filter sidebar (empty for now, will populate next)
- [ ] Create main content area for lead cards
- [ ] Add pagination or infinite scroll
- [ ] Make responsive (filters collapse on mobile)

**AI Coding Note:** Build static layout first. Add functionality later. Easier to debug.

---

### 22. Lead Dashboard - Filters & Sorting
- [ ] Add filter controls in sidebar:
  - **Probability Score:** range slider (0-100)
  - **Status:** dropdown (All, Not Contacted, Messaged, Responded, Not Interested, Closed)
  - **Has Email:** checkbox
  - **Has Phone:** checkbox
  - **Has Instagram:** checkbox
  - **Has Facebook:** checkbox
- [ ] Add sort dropdown in header:
  - Probability Score (High to Low) - default
  - Probability Score (Low to High)
  - Business Name (A-Z)
  - Recently Added
- [ ] Use URL search params for filters:
  ```typescript
  const searchParams = useSearchParams();
  const minScore = searchParams.get('minScore') || 0;
  const status = searchParams.get('status') || 'all';
  ```
- [ ] Update URL when filters change (enables sharing filtered views)
- [ ] Fetch leads with filters applied
- [ ] Add "Clear Filters" button
- [ ] Show filter count (e.g., "3 filters applied")

**AI Coding Note:** URL params are better than local state. Enables sharing, bookmarking, back button works.

---

### 23. Lead Card Component
- [ ] Create `/components/LeadCard.tsx`
- [ ] Design card layout:
  ```
  +----------------------------------------+
  | [Checkbox] Business Name          [85] | <- Score badge
  | Industry Tag                            |
  |                                         |
  | 🌐 Website   📧 Email   📱 Phone       |
  | 📸 Instagram  👥 Facebook  💬 WhatsApp |
  |                                         |
  | Status: [Dropdown]     Last updated: 2h|
  +----------------------------------------+
  ```
- [ ] Implement color-coded probability score badge:
  - Green (80-100): High probability
  - Yellow (60-79): Medium probability
  - Gray (<60): Low probability
- [ ] Add clickable contact links:
  - Website: `<a href={website} target="_blank">`
  - Email: `<a href={`mailto:${email}`}>`
  - Phone: `<a href={`tel:${phone}`}>`
  - Instagram: `<a href={`https://instagram.com/${username}`} target="_blank">`
  - Facebook: `<a href={facebookUrl} target="_blank">`
  - WhatsApp: `<a href={`https://wa.me/${whatsapp}`} target="_blank">`
- [ ] Add status dropdown (controlled component)
- [ ] Handle missing data gracefully (hide link if data not available)
- [ ] Add hover effects for better UX
- [ ] Add checkbox for bulk selection

**AI Coding Note:** This component will be large. Consider breaking into subcomponents:
- `LeadCardHeader`
- `LeadCardContacts`
- `LeadCardStatus`

Keep it under 200 lines total.

---

### 24. Lead Dashboard - Bulk Actions
- [ ] Add "Select All" checkbox in dashboard header
- [ ] Track selected leads using React state or Zustand:
  ```typescript
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  ```
- [ ] Create bulk actions toolbar (appears when leads selected):
  - Show count: "3 leads selected"
  - Export to CSV button
  - Mark as Messaged button
  - Mark as Not Interested button
  - Delete button (with confirmation modal)
- [ ] Implement CSV export:
  - Call API with selected lead IDs
  - Download CSV file
  - Show success toast
- [ ] Implement bulk status update:
  - Call API with selected lead IDs and new status
  - Refetch leads to show updated data
  - Clear selection
- [ ] Add loading states for bulk actions

**AI Coding Note:** Use Zustand for selection state if passing through many components. Otherwise, simple useState is fine.

---

### 25. User Account Page
- [ ] Create `/app/account/page.tsx`
- [ ] Display user information:
  - Email address
  - Subscription tier (Free, Starter, Pro, Agency)
  - Account created date
- [ ] Display usage statistics:
  - Total leads found this month: 347/500
  - Total searches this month: 5
  - Progress bar for usage
- [ ] Add "Upgrade Plan" button (if not on highest tier)
- [ ] Add "Manage Subscription" button (opens Stripe portal)
- [ ] Add "Change Email" button (optional)
- [ ] Add "Delete Account" button (with confirmation modal)

**AI Coding Note:** Keep this page simple. Most functionality handled by Stripe portal.

---

### 26. Search History Page
- [ ] Create `/app/history/page.tsx`
- [ ] Fetch user's last 10-20 searches from database
- [ ] Display in table or card view:
  - Date/time of search
  - Location searched
  - Industry keywords (if provided)
  - Number of leads found
  - "View Results" button → goes to dashboard filtered to that search
  - Delete button
- [ ] Add pagination if more than 20 searches
- [ ] Add search/filter by location or date

**AI Coding Note:** Simple CRUD page. Don't over-complicate. Table is fine.

---

### 27. Settings Page
- [ ] Create `/app/settings/page.tsx`
- [ ] Add user preferences:
  - Enable confetti animation (toggle)
  - Enable celebration sound (toggle)
  - Email notifications for completed searches (toggle)
  - Email weekly usage reports (toggle)
- [ ] Save settings to database (add `settings` jsonb column to profiles table)
- [ ] Load settings on app init
- [ ] Add "Save Changes" button

**AI Coding Note:** Store settings as JSONB in profiles table. Easier than separate table.

---

## API Development (Weeks 4-5)

### 28. Search API Endpoint
- [ ] Create `/app/api/search/route.ts`
- [ ] Accept POST request with body:
  ```json
  {
    "location": "Miami, FL",
    "radius": 10,
    "industry": "plumber, hvac",
    "count": 200
  }
  ```
- [ ] Validate input with Zod
- [ ] Check user authentication (Supabase session)
- [ ] Check usage limits (don't exceed subscription tier limits)
- [ ] Create new search record in database
- [ ] Trigger Inngest function to start lead discovery:
  ```typescript
  await inngest.send({
    name: "search/discover-leads",
    data: { searchId, location, industry, count }
  });
  ```
- [ ] Return search ID immediately (don't wait for results)
- [ ] Add rate limiting (max 5 searches per hour per user)

**AI Coding Note:** This endpoint just kicks off the process. Don't do heavy work here. Return quickly.

---

### 29. Search Status API Endpoint
- [ ] Create `/app/api/search/[searchId]/status/route.ts`
- [ ] Accept GET request
- [ ] Fetch search from database by ID
- [ ] Return status object:
  ```json
  {
    "status": "processing",
    "progress": 65,
    "currentStep": "Detecting CRM tools...",
    "leadsFound": 127
  }
  ```
- [ ] Add authentication check (user must own this search)

**AI Coding Note:** Simple GET endpoint. Just return data from database.

---

### 30. Search Results API Endpoint
- [ ] Create `/app/api/search/[searchId]/results/route.ts`
- [ ] Accept GET request with query params for filtering/sorting:
  - `minScore`, `maxScore` - filter by probability score
  - `status` - filter by lead status
  - `hasEmail`, `hasPhone`, `hasInstagram` - filter by contact data
  - `sortBy` - sort field (score, name, createdAt)
  - `page`, `limit` - pagination
- [ ] Fetch leads from database using Supabase with filters applied
- [ ] Join with lead_status table to get status for current user
- [ ] Return paginated results:
  ```json
  {
    "leads": [...],
    "total": 147,
    "page": 1,
    "limit": 20
  }
  ```
- [ ] Add authentication check

**AI Coding Note:** Use Supabase's query builder. It handles filtering, sorting, pagination. Don't reinvent.

---

### 31. Lead Status Update API Endpoint
- [ ] Create `/app/api/leads/[leadId]/status/route.ts`
- [ ] Accept PATCH request with body:
  ```json
  {
    "status": "messaged"
  }
  ```
- [ ] Validate status value (must be one of: not_contacted, messaged, responded, not_interested, closed)
- [ ] Update or insert into lead_status table (upsert)
- [ ] Return updated lead data
- [ ] Add authentication check

**AI Coding Note:** Use Supabase upsert to handle create or update in one query.

---

### 32. Bulk Status Update API Endpoint
- [ ] Create `/app/api/leads/bulk-status/route.ts`
- [ ] Accept POST request with body:
  ```json
  {
    "leadIds": ["uuid1", "uuid2", ...],
    "status": "messaged"
  }
  ```
- [ ] Validate input (max 100 leads at a time)
- [ ] Update all lead_status records in a transaction
- [ ] Return success count
- [ ] Add authentication check

**AI Coding Note:** Use Supabase transaction or batch upsert. Keep it atomic.

---

### 33. CSV Export API Endpoint
- [ ] Create `/app/api/leads/export/route.ts`
- [x] Install CSV library:
  ```bash
  npm install json2csv
  ```
- [ ] Accept POST request with body:
  ```json
  {
    "leadIds": ["uuid1", "uuid2", ...],
    // OR
    "searchId": "uuid"
  }
  ```
- [ ] Fetch leads from database
- [ ] Convert to CSV with columns:
  - Business Name, Website, Email, Phone, Instagram, Facebook, WhatsApp
  - Probability Score, Status, Industry, Address
- [ ] Return CSV file as download:
  ```typescript
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="leads.csv"'
    }
  });
  ```
- [ ] Add authentication check

**AI Coding Note:** json2csv library handles everything. Just pass data and column config.

---

## Payment Integration (Week 6)

### 34. Pricing Page
- [ ] Create `/app/pricing/page.tsx`
- [ ] Design pricing cards for 3 tiers:
  ```
  +------------------+  +------------------+  +------------------+
  |    STARTER       |  |       PRO        |  |     AGENCY       |
  |    $97/mo        |  |    $197/mo       |  |    $297/mo       |
  |  500 leads/mo    |  |  2000 leads/mo   |  | Unlimited leads  |
  |  [Select Plan]   |  |  [Select Plan]   |  |  [Select Plan]   |
  +------------------+  +------------------+  +------------------+
  ```
- [ ] Add feature comparison list
- [ ] Add FAQ section
- [ ] Make "Select Plan" button call API to create Stripe checkout session
- [ ] Highlight recommended plan (Pro)

**AI Coding Note:** Use Tailwind UI pricing component. Don't build from scratch.

---

### 35. Stripe Checkout Integration
- [ ] Create `/app/api/stripe/checkout/route.ts`
- [ ] Accept POST request with body:
  ```json
  {
    "priceId": "price_xxx" // Stripe price ID for selected plan
  }
  ```
- [ ] Create Stripe Checkout Session:
  ```typescript
  const session = await stripe.checkout.sessions.create({
    customer_email: user.email,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?success=true`,
    cancel_url: `${baseUrl}/pricing`,
  });
  ```
- [ ] Return checkout URL
- [ ] Redirect user to Stripe hosted checkout
- [ ] Add authentication check

**AI Coding Note:** Use Stripe's hosted checkout. Don't build custom payment form. Too risky.

---

### 36. Stripe Webhook Handler
- [ ] Create `/app/api/stripe/webhook/route.ts`
- [ ] Verify webhook signature (critical for security):
  ```typescript
  const sig = request.headers.get('stripe-signature');
  const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  ```
- [ ] Handle `checkout.session.completed` event:
  - Extract customer email and subscription info
  - Update user's `subscription_tier` in database
  - Reset `leads_used_this_month` to 0
  - Set `billing_cycle_start` to now
- [ ] Handle `customer.subscription.deleted` event:
  - Downgrade user to free tier
- [ ] Handle `customer.subscription.updated` event:
  - Update subscription tier if changed
- [ ] Return 200 response (Stripe will retry if not 200)

**AI Coding Note:** Webhooks are critical. Test thoroughly with Stripe CLI. Failed webhooks = incorrect subscription status = angry users.

---

### 37. Stripe Customer Portal
- [ ] Create `/app/api/stripe/portal/route.ts`
- [ ] Accept POST request
- [ ] Create Stripe Customer Portal session:
  ```typescript
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${baseUrl}/account`,
  });
  ```
- [ ] Return portal URL
- [ ] Redirect user to Stripe hosted portal
- [ ] Portal allows users to:
  - Cancel subscription
  - Update payment method
  - View invoices
  - Change plan

**AI Coding Note:** Again, use Stripe's hosted portal. Don't build custom.

---

### 38. Usage Limits Enforcement
- [ ] Create middleware `/lib/utils/checkUsageLimits.ts`:
  ```typescript
  async function checkUsageLimits(userId: string, requestedLeads: number) {
    const user = await getUser(userId);
    const limit = getLeadLimitForTier(user.subscription_tier);

    if (user.leads_used_this_month + requestedLeads > limit) {
      throw new Error('Usage limit exceeded');
    }
  }
  ```
- [ ] Call this middleware in search API endpoint before starting search
- [ ] Increment `leads_used_this_month` after each search completes
- [ ] Add cron job (or Inngest scheduled function) to reset usage on billing cycle:
  ```typescript
  inngest.createFunction(
    { id: "reset-monthly-usage" },
    { cron: "0 0 * * *" }, // Daily at midnight
    async () => {
      // Find users whose billing cycle started 30 days ago
      // Reset their leads_used_this_month to 0
    }
  );
  ```
- [ ] Show usage meter in dashboard header
- [ ] Show upgrade prompt when user approaches limit (e.g., 90%)

**AI Coding Note:** Usage limits are critical for business model. Test thoroughly.

---

## Testing & Quality Assurance (Week 7)

### 39. API Endpoint Testing
- [ ] Install testing libraries:
  ```bash
  npm install --save-dev jest @testing-library/react @testing-library/jest-dom
  ```
- [ ] Write tests for critical API endpoints:
  - `/api/search` - test input validation, auth check, usage limits
  - `/api/search/[searchId]/results` - test filtering, sorting, pagination
  - `/api/leads/[leadId]/status` - test status update
  - `/api/stripe/webhook` - test webhook signature verification
- [ ] Use Supabase test client (separate test database)
- [ ] Run tests with: `npm test`

**AI Coding Note:** Focus on critical paths. Don't aim for 100% coverage. Test what breaks often.

---

### 40. Component Testing
- [ ] Write tests for critical components:
  - `LeadCard` - test rendering with different data, missing data
  - `SearchForm` - test form validation, submission
  - `LoadingAnimation` - test progress updates
  - `CelebrationScreen` - test confetti loads
- [ ] Use React Testing Library
- [ ] Mock API calls with MSW (Mock Service Worker)

**AI Coding Note:** Component testing is lower priority than API testing. Focus on user flows.

---

### 41. Manual Testing Checklist
- [ ] Test full user flow end-to-end:
  1. Sign up → verify email → log in
  2. Start new search → see loading animation → see celebration
  3. View lead dashboard → filter leads → sort leads
  4. Update lead status → export to CSV
  5. Upgrade subscription → verify Stripe checkout works
  6. Check usage limits enforced correctly
- [ ] Test on real devices:
  - iPhone Safari
  - Android Chrome
  - Desktop Chrome, Firefox, Safari
- [ ] Test API integrations with real data:
  - Google Maps returns businesses
  - Hunter.io finds emails
  - Apify finds social profiles
  - CRM detection works on sample websites
- [ ] Test edge cases:
  - No results found
  - API rate limits hit
  - Invalid location
  - Network errors

**AI Coding Note:** Manual testing catches things automated tests miss. Don't skip this.

---

### 42. Performance Testing
- [ ] Test page load times (should be <3 seconds)
- [ ] Test API response times:
  - Search creation: <500ms
  - Results fetching: <1s
  - Status updates: <200ms
- [ ] Test with large datasets (500+ leads)
- [ ] Check database query performance (use Supabase query analyzer)
- [ ] Optimize slow queries with indexes
- [ ] Test Inngest function execution times

**AI Coding Note:** Use Chrome DevTools Network tab and Lighthouse. Easy performance wins.

---

## Deployment & Launch (Week 8)

### 43. Environment Variables Setup (Production)
- [ ] Add all production API keys to Vercel environment variables:
  - Supabase URL and keys
  - Google Maps API key
  - Hunter.io API key (production key)
  - Apify API key
  - Stripe production keys
  - Inngest keys
- [ ] Verify all keys are correct (test each service)
- [ ] Enable Vercel Environment Variable Encryption

**AI Coding Note:** Triple-check production keys. Wrong keys = broken app on launch day.

---

### 44. Supabase Production Setup
- [ ] Upgrade Supabase project to paid plan (if needed for usage)
- [ ] Enable database backups (daily)
- [ ] Review RLS policies (ensure security)
- [ ] Add database indexes if not already done
- [ ] Set up monitoring/alerts for database usage
- [ ] Test production database connection from Vercel

**AI Coding Note:** Supabase has generous free tier. May not need to upgrade for MVP.

---

### 45. Vercel Deployment
- [x] Connect GitHub repo to Vercel
- [x] Configure build settings:
  - Framework: Next.js
  - Build command: `npm run build`
  - Output directory: `.next`
- [x] Add environment variables
- [x] Deploy to production
- [ ] Test deployed app thoroughly
- [ ] Add custom domain (if available)
- [ ] Enable Vercel Analytics

**AI Coding Note:** Vercel deployment is literally 1 click. Easiest part of the project.

---

### 46. Inngest Production Setup
- [ ] Go to Inngest dashboard
- [ ] Create production environment
- [ ] Get production event key and signing key
- [ ] Add to Vercel environment variables
- [ ] Register production functions:
  ```bash
  npx inngest-cli dev
  ```
- [ ] Test Inngest functions in production
- [ ] Monitor function executions in Inngest dashboard

**AI Coding Note:** Inngest dashboard shows all function runs. Great for debugging.

---

### 47. Stripe Production Setup
- [ ] Switch Stripe account to live mode
- [ ] Complete Stripe account setup (business info, banking)
- [ ] Get live API keys (starts with `sk_live_` and `pk_live_`)
- [ ] Update Vercel environment variables
- [ ] Update webhook endpoint to production URL
- [ ] Test full payment flow end-to-end with real card
- [ ] Set up Stripe email receipts

**AI Coding Note:** Don't activate live mode until ready to accept real payments. Test mode is safer.

---

### 48. Monitoring & Error Tracking
- [ ] Set up Sentry for error tracking:
  ```bash
  npm install @sentry/nextjs
  npx @sentry/wizard@latest -i nextjs
  ```
- [ ] Add Sentry DSN to environment variables
- [ ] Test error reporting (trigger intentional error)
- [ ] Set up Uptime monitoring (e.g., UptimeRobot, free tier)
- [ ] Set up Vercel Analytics (already included with Vercel)
- [ ] Create simple admin dashboard for monitoring:
  - Total users
  - Total searches today/this week
  - Total leads found
  - API error rates
  - Revenue (Stripe dashboard)

**AI Coding Note:** Sentry catches errors in production. Essential for debugging user issues.

---

### 49. Beta Testing
- [ ] Invite 10-20 beta testers (friends, students, colleagues)
- [ ] Give them free Pro tier access for testing
- [ ] Create feedback form (Google Form or Typeform)
- [ ] Ask specific questions:
  - How easy was signup/search flow?
  - Was lead data quality good enough?
  - What contact info was most valuable?
  - Any bugs or issues?
  - What features would you want next?
- [ ] Monitor usage patterns in Supabase
- [ ] Fix critical bugs immediately
- [ ] Collect testimonials from happy testers

**AI Coding Note:** Beta testing reveals issues you never anticipated. Take feedback seriously.

---

### 50. Launch Preparation
- [ ] Create onboarding tutorial (optional):
  - Welcome modal on first login
  - Tooltips on key features
  - Sample search to get started
- [ ] Write help documentation:
  - How to search for leads
  - How to interpret probability scores
  - How to export leads
  - Pricing and billing FAQs
- [ ] Create demo video (2-3 minutes):
  - Show searching for leads
  - Show dashboard and filtering
  - Show exporting leads
- [ ] Set up customer support:
  - Support email (e.g., support@leadfinderpro.com)
  - Add to footer and contact page
- [ ] Prepare launch announcement:
  - Social media posts
  - Email to students/clients
  - Product Hunt submission (optional)

**AI Coding Note:** Good onboarding = higher activation rate. Worth the time.

---

## Post-Launch Tasks (Ongoing)

### 51. Monitor Key Metrics
- [ ] Track daily/weekly:
  - New signups
  - Free → paid conversion rate
  - Monthly Recurring Revenue (MRR)
  - Churn rate
  - Average leads found per user
  - API costs vs. revenue
- [ ] Set up alerts for anomalies:
  - API errors spike
  - Signup rate drops
  - Churn rate increases

**AI Coding Note:** Metrics inform product decisions. Track from day 1.

---

### 52. Collect User Feedback
- [ ] Add in-app feedback widget (e.g., Canny, Hotjar)
- [ ] Send post-signup survey (after 7 days)
- [ ] Send post-cancellation survey (learn why they left)
- [ ] Schedule user interviews monthly (5-10 users)
- [ ] Track feature requests in spreadsheet or Linear

**AI Coding Note:** Users will tell you what to build next. Listen to them.

---

### 53. Optimize Lead Data Quality
- [ ] Monitor email finding success rate
- [ ] Monitor social media finding success rate
- [ ] Monitor CRM detection accuracy
- [ ] If rates are too low, consider:
  - Switching to Apollo.io for better email data
  - Adding more Apify scrapers
  - Improving CRM detection regex
- [ ] Run A/B tests on different data sources

**AI Coding Note:** Data quality is everything. Users will churn if leads are bad.

---

### 54. Performance Optimization
- [ ] Identify slow API endpoints (use Vercel Analytics)
- [ ] Add caching where appropriate:
  - Cache CRM detection results by domain
  - Cache Google Maps results by location
- [ ] Optimize database queries:
  - Add more indexes if needed
  - Use Supabase query analyzer
- [ ] Optimize image loading:
  - Use Next.js Image component
  - Add lazy loading

**AI Coding Note:** Don't optimize prematurely. Wait until you see real performance issues.

---

### 55. Plan Phase 2 Features
Based on user feedback, prioritize these potential features:
- [ ] Built-in email templates for outreach
- [ ] Email sequence automation
- [ ] CRM integrations (GoHighLevel, HubSpot)
- [ ] Team collaboration (share leads with team)
- [ ] Lead scoring refinement with ML
- [ ] Mobile app (Phase 3)

**AI Coding Note:** Don't build new features until MVP is proven. Resist scope creep.

---

## AI Coding Best Practices for This Project

### General Guidelines
1. **Build incrementally:** Complete one section at a time. Test before moving to next.
2. **Use TypeScript strictly:** Define types for all API responses, database models, props.
3. **Error handling everywhere:** Every API call needs try-catch and fallback.
4. **Log extensively:** Use console.log during development. Replace with proper logging later.
5. **Test as you go:** Don't wait until the end. Test each feature when complete.
6. **Use established libraries:** Don't reinvent authentication, payments, forms, etc.
7. **Read the docs:** Supabase, Stripe, Inngest docs are excellent. Follow them.
8. **Keep components small:** Under 200 lines. Break into smaller components if larger.
9. **Keep API routes simple:** Under 100 lines. Extract logic to service files.
10. **Don't over-engineer:** Simple solutions usually work. Don't add complexity unnecessarily.

### Specific Gotchas to Avoid
- **Google Maps API:** Can get expensive. Monitor usage. Add budget alerts.
- **Email finding:** Will fail often (50% success rate). Handle gracefully.
- **Social media scraping:** Apify actors can break when platforms change. Have fallbacks.
- **CRM detection:** Websites can be slow/unreachable. Add 10 second timeout.
- **Stripe webhooks:** Must verify signature. Test with Stripe CLI before production.
- **Supabase RLS:** If RLS policies are wrong, users can see each other's data. Test thoroughly.
- **Inngest rate limits:** Free tier has limits. Monitor function runs.
- **Next.js API routes:** Have 10 second timeout on Vercel free tier. Use Inngest for long tasks.

### When You Get Stuck
1. Read the error message carefully
2. Check the official docs for the library/service
3. Search GitHub issues for similar problems
4. Ask in Discord/Slack communities
5. Simplify: remove complexity until it works, then add back piece by piece

### Code Organization Tips
- Use barrel exports (`index.ts`) to simplify imports
- Co-locate related code (component + hooks + utils in same folder)
- Use consistent naming: `LeadCard.tsx`, `leadCard.test.ts`, `leadCard.utils.ts`
- Keep utils pure functions (no side effects) for easier testing

---

## Success Checklist

Before considering MVP complete:
- [ ] A user can sign up with email and verify account
- [ ] A user can log in and see dashboard
- [ ] A user can start a search with location + filters
- [ ] Search displays loading animation
- [ ] Search displays celebration screen when complete
- [ ] Dashboard displays all leads with correct data
- [ ] User can filter and sort leads
- [ ] User can update lead status
- [ ] User can export leads to CSV
- [ ] Probability scores are calculated and displayed correctly
- [ ] User can upgrade to paid plan via Stripe
- [ ] Usage limits are enforced correctly
- [ ] App is fully responsive (mobile + desktop)
- [ ] App is deployed and accessible via URL
- [ ] No critical bugs in main user flows
- [ ] External APIs are working (Google Maps, Hunter.io, Apify)

---

## Estimated Timeline

**Week 1:** Project setup, Supabase, auth, external API setup
**Week 2:** Google Maps integration, basic lead discovery
**Week 3:** Email finding, social media discovery, CRM detection
**Week 4:** Probability scoring, Inngest background jobs, lead orchestrator
**Week 5:** UI development (search form, loading, celebration, dashboard)
**Week 6:** Payment integration (Stripe), usage limits
**Week 7:** Testing (API, components, manual testing)
**Week 8:** Deployment, beta testing, launch preparation

**Total: 8 weeks with focused development**

---

## Final Notes

- This to-do list is comprehensive but flexible. Adjust based on your pace and priorities.
- Each task is designed to be completable in 1-4 hours. If a task takes longer, break it down further.
- Don't skip testing. It's faster to test as you go than debug later.
- Don't over-engineer. Simple solutions usually work best for MVP.
- Ship fast, iterate faster. Phase 1 doesn't need to be perfect.
- Focus on core value: finding qualified leads quickly with good data.

**Remember:** The goal is to validate the business model and get paying users. Everything else is secondary.

---

**Tech Stack Summary:**
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Next.js API Routes, Supabase PostgreSQL, Supabase Auth, Inngest
- **Data:** Google Maps, Hunter.io, Apify, custom CRM detection
- **Payments:** Stripe
- **Hosting:** Vercel + Supabase
- **Estimated Cost:** ~$70-100/mo for APIs

**Let's build this! 🚀**
