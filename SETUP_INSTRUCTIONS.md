# LeadFinder Pro - Setup Instructions

## ✅ Completed Steps

1. **Next.js 14 Project Initialization** ✓
   - Installed Next.js 14 with TypeScript
   - Configured Tailwind CSS for styling
   - Set up ESLint for code quality
   - Created proper folder structure

2. **Supabase Client Setup** ✓
   - Installed `@supabase/supabase-js` and `@supabase/ssr`
   - Created client-side Supabase client (`lib/supabase/client.ts`)
   - Created server-side Supabase client (`lib/supabase/server.ts`)
   - Created middleware for auth management (`lib/supabase/middleware.ts`)
   - Set up Next.js middleware for route protection

3. **TypeScript Configuration** ✓
   - Created database type definitions (`types/database.ts`)
   - Configured path aliases (`@/*`)

4. **Environment Variables** ✓
   - Created `.env.local` file (ready for API keys)
   - Created `.env.example` for reference

## 🔄 Next Steps: Supabase Database Setup

You need to manually complete the following steps:

### Step 1: Create Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up (or log in)
3. Click "New Project"
4. Fill in:
   - **Project name:** leadfinder-pro
   - **Database password:** (create a strong password - save it securely!)
   - **Region:** Choose closest to your users (e.g., US East, US West, Europe)
   - **Pricing plan:** Free (for development)
5. Click "Create new project" and wait 2-3 minutes for setup

### Step 2: Get API Keys

1. Once your project is ready, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJhbGciOi...`)
   - **service_role key** (starts with `eyJhbGciOi...`) - Keep this secret!

3. Add these to your `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

### Step 3: Create Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Run the following SQL commands **one at a time** (copy and execute each block):

#### Create profiles table:
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

#### Create searches table:
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

#### Create leads table:
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

#### Create lead_status table:
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

#### Create indexes for performance:
```sql
create index idx_leads_search_id on leads(search_id);
create index idx_leads_probability_score on leads(probability_score desc);
create index idx_lead_status_user_id on lead_status(user_id);
create index idx_searches_user_id on searches(user_id);
```

### Step 4: Enable Row Level Security (RLS)

**CRITICAL FOR SECURITY:** Run these commands to ensure users can only access their own data.

#### Enable RLS on all tables:
```sql
alter table profiles enable row level security;
alter table searches enable row level security;
alter table leads enable row level security;
alter table lead_status enable row level security;
```

#### Create RLS policies for profiles:
```sql
-- Users can view their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);
```

#### Create RLS policies for searches:
```sql
-- Users can view their own searches
create policy "Users can view own searches"
  on searches for select
  using (auth.uid() = user_id);

-- Users can create searches
create policy "Users can create searches"
  on searches for insert
  with check (auth.uid() = user_id);

-- Users can update their own searches
create policy "Users can update own searches"
  on searches for update
  using (auth.uid() = user_id);
```

#### Create RLS policies for leads:
```sql
-- Users can view leads from their searches
create policy "Users can view own leads"
  on leads for select
  using (
    exists (
      select 1 from searches
      where searches.id = leads.search_id
      and searches.user_id = auth.uid()
    )
  );
```

#### Create RLS policies for lead_status:
```sql
-- Users can view their own lead status
create policy "Users can view own lead status"
  on lead_status for select
  using (auth.uid() = user_id);

-- Users can create lead status
create policy "Users can create lead status"
  on lead_status for insert
  with check (auth.uid() = user_id);

-- Users can update their own lead status
create policy "Users can update own lead status"
  on lead_status for update
  using (auth.uid() = user_id);
```

### Step 5: Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (it should be by default)
3. Optional: Customize email templates under **Email Templates**

### Step 6: Test the Connection

Once you've added the API keys to `.env.local`, test the connection:

```bash
npm run dev
```

Visit `http://localhost:3000` - you should see the homepage without errors.

## 📝 What's Next After Database Setup?

After completing the Supabase setup, we'll implement:

1. **Authentication Pages** (Week 1)
   - Login page
   - Signup page
   - Email verification flow

2. **External API Setup** (Week 1-2)
   - Google Maps API
   - Hunter.io API
   - Apify API
   - Stripe API
   - Inngest

3. **Core Features** (Week 2-4)
   - Lead discovery system
   - Dashboard
   - Search functionality

## 🆘 Troubleshooting

### Common Issues:

**Issue:** "Invalid API key" or "Failed to fetch"
- **Solution:** Double-check your API keys in `.env.local` are correct and have no extra spaces

**Issue:** "Could not load user"
- **Solution:** Make sure RLS policies are created correctly

**Issue:** Database queries failing
- **Solution:** Verify all tables were created successfully in the Supabase Table Editor

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Project PRD](./LeadFinder_Pro_PRD.md)
- [Full To-Do List](./to-do.md)
