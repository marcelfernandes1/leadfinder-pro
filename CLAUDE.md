# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LeadFinder Pro is a web-based lead generation tool that helps CRM/marketing automation consultants find qualified service-based local businesses. The application automatically discovers leads with contact information and buying probability scores, wrapped in a dopamine-optimized UI.

**Product Type:** Web Application (Phase 1 of 3-phase roadmap)
**Target Users:** CRM/marketing automation consultants selling to local service businesses
**Core Value:** Automatically discovers 1000+ qualified leads per week with contact info and buying probability scores

## Tech Stack

### Frontend
- **Next.js 14** (App Router) - React framework with built-in API routes
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library for loading sequences
- **react-confetti** - Celebration effects
- **react-hook-form + Zod** - Form validation

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

### Initial Setup
```bash
# Initialize Next.js project
npx create-next-app@latest leadfinder-pro --typescript --tailwind --app --eslint

# Install dependencies
npm install @supabase/supabase-js @supabase/ssr
npm install inngest
npm install stripe @stripe/stripe-js
npm install react-hook-form zod @hookform/resolvers
npm install framer-motion react-confetti
npm install axios cheerio
npm install json2csv
npm install @googlemaps/google-maps-services-js

# Dev dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

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
# Development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Lint code
npm run lint
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

```
/app
  /auth              - Login, signup, callback pages
  /search            - Search form page
  /dashboard         - Main dashboard with lead list
  /account           - User account and settings
  /pricing           - Pricing page with Stripe integration
  /api
    /search          - Search creation and status endpoints
    /leads           - Lead CRUD and bulk operations
    /stripe          - Stripe checkout, webhook, portal
    /inngest         - Inngest webhook endpoint

/components
  /LeadCard.tsx      - Individual lead display (break into subcomponents)
  /LoadingAnimation.tsx
  /CelebrationScreen.tsx
  /Navbar.tsx
  /Sidebar.tsx

/lib
  /supabase          - Supabase client setup (client.ts, server.ts, middleware.ts)
  /services          - External API integrations
    /googleMaps.ts   - Google Maps Places API
    /emailFinder.ts  - Hunter.io integration
    /socialMedia.ts  - Apify social scraping
    /crmDetector.ts  - Custom website scraping
    /leadOrchestrator.ts - Main search coordinator
  /utils             - Helper functions
    /scoreCalculator.ts - Probability score calculation
    /checkUsageLimits.ts - Subscription tier enforcement

/types               - TypeScript type definitions
/hooks               - Custom React hooks
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

This is a **greenfield project** with no existing codebase. Follow the comprehensive implementation plan in `to-do.md` which breaks down all 55 tasks across 8 weeks.

**Current Phase:** Planning complete, ready for Week 1 implementation (project setup, Supabase, authentication, external API setup).

## Reference Documentation

- **PRD:** See `LeadFinder_Pro_PRD.md` for complete product requirements
- **Implementation Plan:** See `to-do.md` for detailed 8-week development roadmap
- **Supabase Docs:** https://supabase.com/docs (follow Next.js 14 setup exactly)
- **Inngest Docs:** https://inngest.com/docs
- **Stripe Docs:** https://stripe.com/docs (use hosted checkout and portal)
- **Next.js 14 Docs:** https://nextjs.org/docs (App Router)

## AI Development Rules

### Task Tracking
**CRITICAL:** When completing any task from `to-do.md`, you MUST:
1. Mark the task as completed by changing `- [ ]` to `- [x]`
2. Update the task in the to-do.md file immediately after completion
3. This helps track progress and shows what has been accomplished

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
