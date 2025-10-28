# Product Requirements Document (PRD)
## Phase 1: LeadFinder Pro Web App

### 1. Product Overview
A web-based lead generation tool that helps CRM/marketing automation consultants find qualified service-based local businesses, track outreach efforts, and prioritize high-probability prospects.

**Product Type:** Web Application (Desktop & Mobile Browser Responsive)

**Target Users:** Students/clients who sell CRM implementation and email marketing services to local service businesses

**Core Value Prop:** Automatically discovers 1000+ qualified leads per week with contact info and buying probability scores, wrapped in a highly engaging, dopamine-optimized UI.

**Strategic Context:** This is Phase 1 of a 3-phase product roadmap. Phase 2 will add a course platform, Phase 3 will merge both into a native mobile app.

---

### 2. MVP Feature Set

#### 2.1 Lead Discovery Engine

**Inputs (User provides):**
- Geographic location (city, state, radius)
- Industry/business type keywords (optional: "plumber," "lawyer," "gym," or leave broad)
- Number of leads desired (default: 100-500 per search)

**Data Sources (via APIs):**
- Google Maps/Places API for business discovery
- Clearbit, Hunter.io, or similar for email finding
- Social media APIs (Instagram, Facebook) or scraping services for social profiles
- Website scraping to detect CRM/automation tools (look for: HubSpot, Mailchimp, ActiveCampaign, Klaviyo tracking scripts)

**Output per Lead:**
- Business name
- Website URL
- Email address
- Phone number
- Instagram handle
- Facebook page
- WhatsApp number (if available)
- Other social profiles (LinkedIn, TikTok, etc.)
- **CRM/Automation Detection:** Yes/No flag (qualified = "No")
- **Buying Probability Score:** 1-100 scale

**Buying Probability Score Logic:**

Calculate based on:
- No existing CRM/automation detected (+40 points)
- Has website but low engagement/old design (+15 points)
- Active on social media (+10 points)
- Email found (+10 points)
- Phone number found (+10 points)
- Business age 2-10 years (+10 points, avoid brand new or very old/established)
- Industry fit (service-based confirmed) (+5 points)

---

#### 2.2 Loading & Results UI (Dopamine-Optimized)

**Search/Loading Screen:**

Animated search sequence with status updates:
- "🔍 Scanning 10,000+ local businesses..."
- "🎯 Filtering for service-based companies..."
- "🤖 Detecting CRM & automation tools..."
- "💰 Calculating buying probability..."
- "✨ Finding your best leads..."

Features:
- Progress bar (fake or real, doesn't matter - just needs to feel fast, 10-20 seconds max)
- Modern, sleek design with micro-animations

**Results Reveal:**

Big dopamine hit animation:
- **Confetti explosion** 🎉
- **"DEALS FOUND!!!"** in large, bold text
- Show total count: "147 High-Quality Leads Discovered!"
- Option: Quick celebration sound effect (optional toggle)
- Smooth transition to lead dashboard

---

#### 2.3 Lead Management Dashboard

**Lead List View:**
- Table/card view of all discovered leads
- Sortable by: Buying Probability Score (default), Business Name, Industry
- Filterable by: Contacted Status, Probability Score Range, Has Email/Instagram/etc.

**Individual Lead Card displays:**
- Business name & industry
- **Buying Probability Score** (color-coded: Green 80-100, Yellow 60-79, Gray <60)
- All contact info with **clickable links:**
  - Website → opens in new tab
  - Email → opens mailto link
  - Phone → opens tel link (click-to-call on mobile)
  - Instagram → opens Instagram profile
  - Facebook → opens Facebook page
  - WhatsApp → opens WhatsApp chat
- **Outreach Status dropdown:**
  - Not Contacted (default)
  - Messaged
  - Responded
  - Not Interested
  - Closed/Client
- Last updated timestamp

**Bulk Actions:**
- Export selected leads to CSV
- Mark multiple leads as "Messaged" at once

---

#### 2.4 User Account & Settings
- Simple login/signup (email + password)
- Subscription tier display
- Search history (last 10 searches)
- Basic usage stats: "You've found 1,247 leads this month"

---

### 3. Technical Stack Recommendations

**Frontend:**
- React or Next.js (fast, modern, great for animations)
- Framer Motion or Lottie for animations/confetti
- Tailwind CSS for styling
- Deployed on Vercel or Netlify

**Backend:**
- Node.js + Express (or Next.js API routes)
- PostgreSQL or MongoDB for storing leads & user data
- Deployed on Railway, Render, or AWS

**APIs & Data Sources:**
- **Google Maps/Places API** - business discovery
- **Hunter.io or Snov.io** - email finding
- **Clearbit or FullContact** - business enrichment
- **Apify or Bright Data** - web scraping for social profiles & CRM detection
- **Stripe** - subscription billing

**CRM/Automation Detection:**

Scrape website HTML for common tracking scripts:
- HubSpot: `hs-scripts.com`
- Mailchimp: `list-manage.com`
- ActiveCampaign: `activehosted.com`
- Klaviyo: `klaviyo.com`

Flag as "Has Automation" if any detected

---

### 4. User Flow

1. User logs in
2. Clicks "Find New Leads"
3. Enters location + optional industry filters
4. Clicks "Search"
5. **Loading animation plays** (10-20 sec)
6. **"DEALS FOUND!!!" celebration screen**
7. User views lead dashboard
8. Clicks Instagram/email/phone links to reach out
9. Marks leads as "Messaged" after outreach
10. Repeats weekly to hit 1000+ outreach goal

---

### 5. Pricing & Monetization

- **Starter:** $97/mo - 500 leads/month
- **Pro:** $197/mo - 2000 leads/month
- **Agency:** $297/mo - Unlimited leads + priority support

---

### 6. Future Enhancements (Post-MVP)

- Goal tracking dashboard (weekly outreach counter)
- Built-in email/DM templates
- CRM integrations (push leads to GoHighLevel, HubSpot, etc.)
- Automated outreach sequences
- Team collaboration features
- Lead scoring refinement with ML

---

### 7. Success Metrics

- User signs up and runs first search within 5 minutes
- Average 80%+ of leads have at least email OR Instagram
- Users return weekly to find new leads
- NPS score 50+ (measure after 30 days)

---

### 8. Timeline Estimate

- **MVP Build:** 6-8 weeks with a solid dev team
- **Beta Testing:** 2 weeks with 10-20 students
- **Launch:** Week 10-12

---

### 9. Phase 1 Success Criteria

**Launch Goals:**
- 50+ paying users within first 60 days
- Average user finds 200+ leads in first week
- 70%+ user retention month-over-month
- Proven willingness to pay $97-$297/mo
- Clear user feedback on what they need in course platform (Phase 2)

**Key Learnings to Gather:**
- Which industries/locations perform best for lead quality
- What contact info is most valuable (email vs Instagram vs phone)
- How often users need new lead batches
- What additional features users request most
- Mobile usage patterns (sets requirements for Phase 3)

---

### 10. Notes

- Focus on service-based local businesses only (B2B or B2C)
- Exclude product-based businesses (grocery stores, retail, etc.)
- Users need to manually message leads via Instagram, email, etc. (software just provides the links and tracking)
- Partial contact data is acceptable - not every lead will have all fields populated
- Build mobile-responsive from day 1 (will inform Phase 3 native app design)
