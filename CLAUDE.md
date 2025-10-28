# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

### Common Commands
```bash
# Development server (runs on port 3001, not 3000)
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Lint code
npm run lint

# Test (not yet configured)
npm test
```

### Checking Background Processes
Multiple dev server instances may be running. Check their status with the BashOutput tool using these shell IDs (if they exist):
- Look for "npm run dev" processes
- The latest one is usually the active development server

### Quick Testing
```bash
# Test Supabase connection
curl http://localhost:3001/api/test

# Test Inngest connection
curl http://localhost:3001/api/inngest

# Test search endpoint (requires auth)
curl -X POST http://localhost:3001/api/search
```

### Tech Version Notes
**IMPORTANT: This project uses bleeding-edge versions:**
- **Next.js 16.0.0** (with Turbopack) - Not the 14.x mentioned in older docs
- **React 19.2.0** - Latest version with breaking changes from React 18
- **Tailwind CSS 4.1.16** - v4, not v3 (different configuration)
- **TypeScript 5.9.3**
- **Zod 4.1.12** - v4, not v3 (API differences)

⚠️ **When searching for solutions online, always specify the correct version numbers to avoid outdated answers.**

### Known Issues & Workarounds

1. **Next.js 16 Changes:**
   - Uses Turbopack by default in development
   - Some API route patterns may differ from Next.js 14 tutorials
   - Check Next.js 16 migration guide if issues arise

2. **React 19 Changes:**
   - Server Components are more strict
   - Some hooks behavior may differ
   - Client components must explicitly use 'use client' directive

3. **Tailwind CSS v4:**
   - Configuration uses `@tailwindcss/postcss` plugin
   - Some class names or patterns may differ from v3 tutorials
   - Check Tailwind v4 docs for breaking changes

4. **Proxy.ts Warnings:**
   - You may see "proxy.ts" in dev server logs
   - This is a Next.js internal mechanism for handling requests
   - Can be safely ignored unless there are actual errors

5. **Foreign Key Constraint Errors:**
   - Test searches may fail with FK constraint errors
   - Need valid user profile before creating searches
   - Always authenticate before testing search functionality

### Debugging & Development Tips

**Common Development Tasks:**

1. **Kill all dev server instances:**
   ```bash
   # Find all node processes running Next.js
   ps aux | grep "next dev"

   # Kill specific process
   kill -9 <PID>

   # Or kill all node processes (nuclear option)
   pkill -f "next dev"
   ```

2. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Check Supabase connection:**
   - Verify `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL` and keys
   - Test with: `curl http://localhost:3001/api/test`
   - Check Supabase dashboard for RLS policy issues

4. **Debug Inngest functions:**
   - Inngest logs appear in dev server output (PUT /api/inngest)
   - Check Inngest dashboard for function run history
   - Use `console.log` liberally in Inngest functions
   - Test with: `curl http://localhost:3001/api/test-inngest`

5. **Debug authentication issues:**
   - Check if user is in `profiles` table (Supabase dashboard)
   - Verify RLS policies allow the user to access data
   - Check browser cookies for Supabase session
   - Test auth callback URL is configured correctly

6. **Database debugging:**
   - Use Supabase SQL Editor to run queries directly
   - Check RLS policies in Table Editor → Policies tab
   - Verify foreign key constraints (searches require valid user_id)
   - Use Supabase logs to see actual SQL queries

7. **Common error patterns:**
   - "Foreign key constraint violation" → Need to create profile first
   - "401 Unauthorized" → User not authenticated or session expired
   - "404 on /api/search" → Using GET instead of POST
   - "proxy.ts: XXXms" in logs → Normal, can be ignored
   - Turbopack compilation errors → Try clearing .next folder

**Performance Tips:**
- Dev server with Turbopack is fast, but initial compilation can take time
- Hot reload should work automatically for most changes
- If changes don't appear, check browser console for errors
- Database queries should be fast (<100ms) - check indexes if slow

### Current Implementation Status

**✅ Completed (as of latest commit):**
- Next.js 16 project setup with TypeScript
- Supabase client configuration (client-side, server-side, middleware)
- Supabase PostgreSQL database with all tables (profiles, searches, leads, lead_status)
- Row Level Security (RLS) policies on all tables
- Authentication pages (login, signup, callback)
- Search form page with validation
- Loading animation page with progress tracking
- Dashboard with lead display, filtering, and sorting
- Google Maps API integration for business discovery
- Hunter.io email finding service
- Custom CRM detection service
- Probability score calculator
- Inngest background job processing setup
- Inngest functions for lead discovery and enrichment
- API endpoints: /api/search, /api/search/[id]/status, /api/search/[id]/results
- Development environment running on port 3001

**🚧 In Progress:**
- Testing and debugging search flow
- Social media discovery (Apify integration - skipped for MVP)
- Celebration screen implementation
- CSV export functionality
- Usage limits enforcement

**⏳ Not Started:**
- Stripe payment integration
- Account settings page
- Search history page
- Bulk lead operations
- Production deployment
- Beta testing

## Project Overview

LeadFinder Pro is a web-based lead generation tool that helps CRM/marketing automation consultants find qualified service-based local businesses. The application automatically discovers leads with contact information and buying probability scores, wrapped in a dopamine-optimized UI.

**Product Type:** Web Application (Phase 1 of 3-phase roadmap)
**Target Users:** CRM/marketing automation consultants selling to local service businesses
**Core Value:** Automatically discovers 1000+ qualified leads per week with contact info and buying probability scores

## Tech Stack

### Frontend
- **Next.js 16.0.0** (App Router with Turbopack) - React framework with built-in API routes
- **React 19.2.0** - Latest React with server components
- **TypeScript 5.9.3** - Type safety throughout
- **Tailwind CSS 4.1.16** - Utility-first styling (v4)
- **Framer Motion 12.23.24** - Animation library for loading sequences
- **react-confetti 6.4.0** - Celebration effects
- **react-hook-form 7.65.0 + Zod 4.1.12** - Form validation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Supabase PostgreSQL** - Database with Row Level Security (RLS)
- **Supabase Auth** - Email/password authentication
- **Inngest** - Background job processing for async lead enrichment

### External APIs & Data Sources
- **Google Maps Places API** - Business discovery (~90% phone coverage, ~80% website)
- **Hunter.io** - Email finding (~50-60% success rate)
- **Apify** - Social media scraping (Instagram, Facebook ~40-60% success rate)
- **Custom Website Scraping** - CRM/automation detection (~70-80% success rate)

### Payments & Hosting
- **Stripe** - Subscription management (Starter $97/mo, Pro $197/mo, Agency $297/mo)
- **Vercel** - Frontend and API route hosting
- **Supabase** - Database and authentication hosting

**Estimated Monthly API Costs:** ~$70-100/mo

## Architecture Overview

### Database Schema

**profiles** - User accounts linked to Supabase auth
- Tracks subscription tier, monthly usage limits, billing cycle

**searches** - Search operations initiated by users
- Stores search parameters (location, industry, radius)
- Tracks progress (0-100%) and status (processing/completed)

**leads** - Business leads discovered from searches
- Business data: name, address, website, phone, email
- Social profiles: instagram, facebook, whatsapp, linkedin, tiktok
- Qualification: has_automation (boolean), probability_score (0-100), google_rating
- Linked to parent search via search_id

**lead_status** - User-specific status tracking for leads
- Tracks outreach status per user (not_contacted, messaged, responded, not_interested, closed)
- Unique constraint on (lead_id, user_id) for proper isolation

### Data Flow

1. **Search Initiation** (`/app/api/search/route.ts`)
   - User submits search form with location, radius, industry, lead count
   - Validates usage limits against subscription tier
   - Creates search record in database
   - Triggers Inngest background job
   - Returns searchId immediately (non-blocking)

2. **Lead Discovery** (Inngest background jobs)
   - **Step 1:** Google Maps API discovers businesses (20-60 per search)
   - **Step 2:** Saves basic business data to database immediately
   - **Step 3:** Queues enrichment jobs for each lead:
     - Email enrichment (Hunter.io)
     - Social media discovery (Apify)
     - CRM detection (custom scraping)
   - **Step 4:** Calculates probability score after enrichment completes
   - Updates search progress (0-100%) throughout process

3. **Frontend Polling** (`/app/search/[searchId]/loading/page.tsx`)
   - Polls `/api/search/[searchId]/status` every 2 seconds
   - Displays animated progress with status messages
   - Redirects to celebration screen at 100%

4. **Results Display** (`/app/dashboard/page.tsx`)
   - Fetches leads from `/api/search/[searchId]/results`
   - Supports filtering (score range, status, has_email, etc.)
   - Supports sorting (score, name, date)
   - Uses URL search params for shareable/bookmarkable filters

### Probability Score Algorithm

Located in `/lib/utils/scoreCalculator.ts` (to be created)

```typescript
Score calculation (0-100):
- No CRM/automation detected: +40 points (biggest qualifier)
- Has website: +15 points
- Active on social media (Instagram OR Facebook): +10 points
- Email found: +10 points
- Phone found: +10 points
- Google rating >= 4.0: +10 points
- Service-based industry confirmed: +5 points
```

Leads with score 80-100 (green) are highest priority, 60-79 (yellow) medium, <60 (gray) low.

### Authentication & Authorization

- **Supabase Auth** handles all authentication (email/password)
- **Row Level Security (RLS)** enforces data isolation:
  - Users can only access their own searches, leads, and lead_status records
  - RLS policies must be created for all tables (critical for security)
- Session management via Supabase client (server-side and client-side)
- Protected routes use middleware in `/lib/supabase/middleware.ts`

### Background Job Processing

**Inngest** handles all async operations to avoid Next.js API route timeouts (10s on Vercel free tier):

Key functions:
- `search/discover-leads` - Main orchestrator
- `lead/enrich.email` - Hunter.io email finding
- `lead/enrich.social` - Apify social media scraping
- `lead/detect.crm` - Website CRM detection
- `lead/calculate.score` - Runs after all enrichment completes
- `billing/reset-usage` - Cron job (daily) to reset monthly usage counters

### Subscription Tiers & Usage Limits

Enforced in `/lib/utils/checkUsageLimits.ts` (to be created):
- **Free:** 0 leads/month (signup only)
- **Starter:** 500 leads/month ($97/mo)
- **Pro:** 2000 leads/month ($197/mo)
- **Agency:** Unlimited leads ($297/mo)

Usage limit check happens BEFORE search starts. Increment `profiles.leads_used_this_month` AFTER search completes.

## Development Workflow

### Initial Setup (✅ Already Completed)
The project has already been initialized with all core dependencies. If you need to set up a fresh environment:

```bash
# Clone and install
git clone <repository-url>
cd leadfinder-pro
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your actual API keys
```

**Already installed dependencies (as of current package.json):**
- ✅ Next.js 16.0.0, React 19.2.0, TypeScript 5.9.3
- ✅ Tailwind CSS 4.1.16 with PostCSS
- ✅ Supabase client (@supabase/supabase-js, @supabase/ssr)
- ✅ Inngest 3.44.3
- ✅ Stripe (stripe, @stripe/stripe-js)
- ✅ Form handling (react-hook-form 7.65.0, zod 4.1.12, @hookform/resolvers)
- ✅ Animations (framer-motion 12.23.24, react-confetti 6.4.0)
- ✅ HTTP & scraping (axios 1.13.0, cheerio 1.1.2)
- ✅ CSV export (json2csv 6.0.0-alpha.2)
- ✅ Google Maps (@googlemaps/google-maps-services-js 3.4.2)

**Not yet installed:**
- Testing libraries (jest, @testing-library/react, @testing-library/jest-dom)

**Note:** If you add new dependencies, remember to commit the updated package.json and package-lock.json.

### Environment Variables
Create `.env.local` with:
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

### Running the Application
```bash
# Development server (runs on port 3001)
npm run dev
# Access at: http://localhost:3001

# Build for production
npm run build

# Run production build locally
npm run start

# Lint code
npm run lint
```

**Important:** This project runs on port **3001** (not the default 3000). This is configured in `package.json` as `"dev": "next dev -p 3001"`.

If you see "port already in use" errors:
```bash
# Find what's using port 3001
lsof -ti:3001

# Kill the process
kill -9 $(lsof -ti:3001)
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test path/to/test-file.test.ts
```

## Key Implementation Notes

### API Integration Expectations

**Google Maps Places API**
- Returns max 60 businesses per search
- Cost: $17 per 1000 place details requests
- Free tier: $200 credit/month (~11,000 requests)
- Phone coverage: ~90%, Website coverage: ~80%

**Hunter.io Email Finding**
- Success rate: 50-60% (this is normal and expected)
- Handle failures gracefully - continue processing other leads
- Rate limits: respect API quotas
- Free tier: 50 searches/month (testing only)

**Apify Social Media Scraping**
- Actors are async (10-60 seconds per batch)
- Use Inngest background jobs (never synchronous)
- Success rates: Instagram 40-60%, Facebook 50-70%
- Cost: ~$0.01-0.05 per profile scraped

**CRM Detection (Custom)**
- Websites can be slow or unreachable (70-80% success rate)
- Use 10 second timeout per website
- If website unreachable, assume no CRM (don't fail the entire pipeline)
- Detect common tools: HubSpot, Mailchimp, ActiveCampaign, Klaviyo, ConvertKit, Drip, Constant Contact, SendGrid, Intercom, Drift

### Critical Security Considerations

1. **Row Level Security (RLS)**
   - MUST be enabled on all tables
   - MUST create policies: users can only access their own data
   - Test thoroughly before production

2. **Stripe Webhooks**
   - MUST verify webhook signature (security critical)
   - Test with Stripe CLI before production
   - Failed webhooks = incorrect subscription status = angry users

3. **API Keys**
   - Never commit to git
   - Use Vercel environment variables in production
   - Enable encryption on Vercel

### Common Pitfalls to Avoid

1. **Don't wait for enrichment synchronously** - Use Inngest for all slow operations (email finding, social scraping, CRM detection)
2. **Don't assume 100% data coverage** - Many leads will have missing email, social profiles, etc. This is expected.
3. **Don't skip RLS testing** - If RLS policies are wrong, users can see each other's data
4. **Don't over-engineer** - Start simple, add complexity only when needed
5. **Don't build entire features at once** - Build incrementally, test each piece

### Code Organization

**Current Structure (as implemented):**
```
/app                          # Next.js 16 App Router
  layout.tsx                  # Root layout with metadata
  page.tsx                    # Landing page
  /auth
    /login/page.tsx           # ✅ Login page
    /signup/page.tsx          # ✅ Signup page
    /callback/route.ts        # ✅ Auth callback handler
  /search
    page.tsx                  # ✅ Search form page
    /[searchId]
      /loading/page.tsx       # ✅ Loading animation
  /dashboard
    page.tsx                  # ✅ Main dashboard (embedded lead cards)
  /api
    /auth
      /signout/route.ts       # ✅ Signout endpoint
    /search
      route.ts                # ✅ POST - Create search
      /[searchId]
        /status/route.ts      # ✅ GET - Search progress
        /results/route.ts     # ✅ GET - Search results
    /inngest
      route.ts                # ✅ Inngest webhook endpoint
    /test/route.ts            # ✅ Test endpoint
    /test-inngest/route.ts    # ✅ Inngest test endpoint

/components                   # Currently empty - components embedded in pages
  (Future: LeadCard, Navbar, etc.)

/lib
  /supabase
    client.ts                 # ✅ Client-side Supabase client
    server.ts                 # ✅ Server-side Supabase client
    middleware.ts             # ✅ Auth middleware
  /services
    googleMaps.ts             # ✅ Google Maps Places API integration
    emailFinder.ts            # ✅ Hunter.io email finding
    crmDetector.ts            # ✅ Custom CRM detection
  /inngest
    client.ts                 # ✅ Inngest client
    functions.ts              # ✅ Function exports
    /functions
      discoverLeads.ts        # ✅ Main lead discovery orchestrator
      index.ts                # ✅ Function exports
  /utils
    scoreCalculator.ts        # ✅ Probability score calculation

/types
  database.ts                 # ✅ Database type definitions

/hooks                        # Not yet created
```

**Planned Structure (not yet implemented):**
```
/components
  /LeadCard.tsx              - Individual lead display
  /Navbar.tsx                - Navigation bar
  /Sidebar.tsx               - Dashboard sidebar

/app
  /account                   - User account and settings
  /pricing                   - Pricing page with Stripe
  /api
    /leads                   - Lead CRUD operations
    /stripe                  - Stripe checkout, webhook, portal
```

### Component Guidelines

- Keep components under 200 lines (break into subcomponents if larger)
- Keep API routes under 100 lines (extract logic to service files)
- Use React Hook Form + Zod for all forms
- Use URL search params for filters (enables sharing/bookmarking)
- Handle missing data gracefully in UI (not all leads have all fields)

### Incremental Development Strategy

**Build in this order to minimize bugs:**

1. Google Maps integration only (no enrichment)
2. Add email enrichment via Inngest
3. Add social media enrichment
4. Add CRM detection
5. Add probability scoring

Test each step before moving to the next. Don't try to build everything at once.

## Project Status

**Current Phase:** Mid-development (Weeks 2-4) - Core features implemented, testing and refinement in progress.

**Progress Summary:**
- ✅ Week 1 tasks mostly complete (project setup, Supabase, auth, external API setup)
- ✅ Weeks 2-3 tasks partially complete (Google Maps integration, lead discovery, UI pages)
- 🚧 Week 4 tasks in progress (testing, refinement, bug fixes)
- ⏳ Weeks 5-8 not started (payment integration, advanced features, deployment)

**What's Working:**
- User authentication (signup, login, logout)
- Search form with validation
- Google Maps business discovery
- Email finding via Hunter.io
- CRM detection via website scraping
- Probability score calculation
- Background job processing via Inngest
- Dashboard with lead filtering and sorting
- Loading animations

**What Needs Work:**
- End-to-end testing of search flow
- Celebration screen implementation
- CSV export functionality
- Social media discovery (Apify) - may skip for MVP
- Usage limits enforcement
- Payment integration (Stripe)
- Production deployment

Follow the comprehensive implementation plan in `to-do.md` which breaks down all 55 tasks across 8 weeks. Update tasks as completed using the checklist format.

## Reference Documentation

- **PRD:** See `LeadFinder_Pro_PRD.md` for complete product requirements
- **Implementation Plan:** See `to-do.md` for detailed 8-week development roadmap
- **Supabase Docs:** https://supabase.com/docs (follow Next.js 14 setup exactly)
- **Inngest Docs:** https://inngest.com/docs
- **Stripe Docs:** https://stripe.com/docs (use hosted checkout and portal)
- **Next.js 14 Docs:** https://nextjs.org/docs (App Router)

## AI Development Rules

### Git Workflow - CRITICAL
**PUSH TO GITHUB FREQUENTLY** to enable easy rollback when needed:

1. **After completing each major task or section**, create a commit:
   ```bash
   git add .
   git commit -m "Descriptive message about what was completed"
   git push origin main
   ```

2. **Commit frequency guidelines:**
   - After completing any section from to-do.md (e.g., "Initial Project Setup")
   - After implementing a complete feature (e.g., "Authentication pages")
   - After fixing bugs or making significant changes
   - Before starting a risky or experimental change
   - At the end of each development session

3. **Commit message format:**
   - Use clear, descriptive messages
   - Example: "feat: add Supabase client setup and auth middleware"
   - Example: "fix: update proxy.ts for Next.js 16 compatibility"
   - Example: "docs: add Supabase setup instructions"

4. **Why this matters:**
   - Enables easy rollback if something breaks
   - Creates checkpoint history for the project
   - Allows reviewing what was done when
   - Makes it easy to compare working vs broken states

**IMPORTANT:** Push frequently - better to have too many commits than too few!

### Task Tracking
**CRITICAL:** When completing any task from `to-do.md`, you MUST:
1. Mark the task as completed by changing `- [ ]` to `- [x]`
2. Update the task in the to-do.md file immediately after completion
3. This helps track progress and shows what has been accomplished
4. **After updating to-do.md, commit and push the changes**

Example:
```markdown
Before: - [ ] Install Supabase client
After:  - [x] Install Supabase client
```

### Code Documentation Standards
**ALL code must be thoroughly documented:**

1. **Function/Method Documentation**
   - Add a comment above every function explaining what it does
   - Include parameter descriptions
   - Explain return values
   - Note any side effects or important behavior

2. **Inline Comments**
   - Add comments explaining WHY code does something (not just WHAT)
   - Document complex logic, edge cases, and business rules
   - Explain non-obvious decisions or workarounds

3. **File Headers**
   - Add a comment at the top of each file explaining its purpose
   - List main exports and their purposes

Example:
```typescript
/**
 * Email Finding Service
 *
 * Integrates with Hunter.io API to find email addresses from business domains.
 * Expected success rate: 50-60% (many businesses don't have discoverable emails).
 */

/**
 * Finds an email address for a given domain using Hunter.io
 *
 * @param domain - The business domain (e.g., "example.com")
 * @returns Email address if found, null if not found or error occurs
 *
 * Note: Failures are expected and should not block lead processing.
 * Rate limits are respected via exponential backoff.
 */
async function findEmail(domain: string): Promise<string | null> {
  // Validate domain format before making API call
  if (!isValidDomain(domain)) {
    console.log(`Invalid domain format: ${domain}`);
    return null;
  }

  try {
    // Hunter.io API call with 5-second timeout
    const response = await hunterClient.findEmail(domain, { timeout: 5000 });

    // Hunter.io returns confidence score 0-100
    // Only accept emails with confidence >= 70
    if (response.confidence >= 70) {
      return response.email;
    }

    return null; // Low confidence, treat as not found
  } catch (error) {
    // Don't throw - email finding failures should not crash the pipeline
    console.error(`Hunter.io error for ${domain}:`, error);
    return null;
  }
}
```

This level of documentation makes debugging significantly easier and helps future developers (or future Claude instances) understand the code quickly.

## Success Criteria (MVP Launch)

- User can sign up, verify email, and log in
- User can search for leads by location + industry
- Search returns 50+ leads with contact info
- Loading animation and celebration screen work
- Dashboard displays leads with filtering/sorting
- User can update lead status and export to CSV
- Probability scores are calculated correctly
- Payment flow works (Stripe checkout + webhooks)
- Usage limits enforced per subscription tier
- Fully responsive (mobile + desktop)
- Deployed to Vercel with Supabase backend
- No critical bugs in main user flows
