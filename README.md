# LeadFinder Pro

A web-based lead generation tool that helps CRM/marketing automation consultants find qualified service-based local businesses with contact information and buying probability scores.

## 🎯 Product Overview

**Phase 1** of a 3-phase product roadmap (Web App → Course Platform → Native Mobile App)

- **Target Users:** CRM/marketing automation consultants selling to local service businesses
- **Core Value:** Automatically discovers 1000+ qualified leads per week with contact info and buying probability scores
- **UI/UX:** Dopamine-optimized with celebration animations and engaging feedback

## 🛠 Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- react-confetti

### Backend
- Next.js API Routes
- Supabase PostgreSQL (with Row Level Security)
- Supabase Auth
- Inngest (background job processing)

### External APIs
- Google Maps Places API (business discovery)
- Hunter.io (email finding)
- Apify (social media scraping)
- Custom website scraping (CRM detection)

### Payments & Hosting
- Stripe (subscription management)
- Vercel (frontend + API hosting)
- Supabase (database + auth)

## 📋 Features

### Core MVP Features
- **Lead Discovery Engine:** Find local businesses by location and industry
- **Contact Enrichment:** Automatically find emails, phone numbers, and social profiles
- **CRM Detection:** Identify businesses without existing automation tools
- **Probability Scoring:** 0-100 score based on lead qualification criteria
- **Lead Management:** Dashboard with filtering, sorting, and status tracking
- **Bulk Operations:** Export to CSV, bulk status updates
- **Subscription Tiers:** Starter ($97/mo), Pro ($197/mo), Agency ($297/mo)
- **Usage Limits:** Monthly lead limits based on subscription tier

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- API keys for: Google Maps, Hunter.io, Apify, Stripe, Inngest

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/leadfinder-pro.git
cd leadfinder-pro

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to view the app.

### Environment Variables

See `.env.example` for required environment variables. You'll need:
- Supabase (database + auth)
- Google Maps API key
- Hunter.io API key
- Apify API key
- Stripe keys (test mode initially)
- Inngest keys

## 📖 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Complete development guide for AI assistants and developers
- **[to-do.md](./to-do.md)** - Comprehensive 8-week implementation roadmap (55 tasks)
- **[LeadFinder_Pro_PRD.md](./LeadFinder_Pro_PRD.md)** - Product requirements document

## 🏗 Project Structure

```
/app                    # Next.js App Router
  /auth                 # Authentication pages
  /search              # Search form
  /dashboard           # Lead dashboard
  /account             # User account
  /pricing             # Pricing page
  /api                 # API routes
/components            # React components
/lib
  /supabase           # Supabase client setup
  /services           # External API integrations
  /utils              # Helper functions
/types                # TypeScript types
/hooks                # Custom React hooks
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test
npm test path/to/test.test.ts
```

## 🚢 Deployment

The application is designed to be deployed on:
- **Frontend:** Vercel (one-click deployment)
- **Database:** Supabase (managed PostgreSQL)
- **Background Jobs:** Inngest (serverless functions)

See `to-do.md` Week 8 for detailed deployment instructions.

## 📊 Development Status

**Current Phase:** Planning complete, ready for Week 1 implementation

- ✅ Product Requirements Document (PRD)
- ✅ Technical architecture defined
- ✅ 8-week implementation roadmap created
- ⏳ Week 1: Project setup and infrastructure
- ⏳ Weeks 2-4: Core lead discovery features
- ⏳ Weeks 5-6: UI/UX and payment integration
- ⏳ Week 7: Testing and QA
- ⏳ Week 8: Deployment and launch

## 🎯 Success Metrics

- User signs up and runs first search within 5 minutes
- 80%+ of leads have at least email OR Instagram
- Users return weekly to find new leads
- 50+ paying users within first 60 days
- 70%+ user retention month-over-month

## 💰 Estimated Costs

- **Development:** $0 (using free tiers during development)
- **Production APIs:** ~$70-100/mo (Google Maps, Hunter.io, Apify)
- **Hosting:** Free tier on Vercel + Supabase (scales with usage)

## 📝 License

[Add your license here]

## 👥 Team

[Add your team information]

## 🤝 Contributing

Contributions are welcome! Please read the development guidelines in [CLAUDE.md](./CLAUDE.md) before contributing.

## 📞 Support

For questions or support, contact: [your-email@example.com]
