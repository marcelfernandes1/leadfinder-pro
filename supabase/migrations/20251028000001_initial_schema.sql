-- LeadFinder Pro - Initial Database Schema
-- This migration creates all tables, indexes, and Row Level Security policies

-- =====================================================
-- PROFILES TABLE
-- Stores user account information and subscription details
-- =====================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'pro', 'agency')),
  leads_used_this_month INTEGER DEFAULT 0,
  billing_cycle_start TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SEARCHES TABLE
-- Stores lead search operations initiated by users
-- =====================================================
CREATE TABLE searches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  location TEXT NOT NULL,
  industry TEXT,
  radius INTEGER,
  requested_count INTEGER,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- LEADS TABLE
-- Stores discovered business leads with contact information
-- =====================================================
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  search_id UUID REFERENCES searches(id) ON DELETE CASCADE NOT NULL,
  business_name TEXT NOT NULL,
  address TEXT,
  website TEXT,
  phone TEXT,
  email TEXT,
  instagram TEXT,
  facebook TEXT,
  whatsapp TEXT,
  linkedin TEXT,
  tiktok TEXT,
  has_automation BOOLEAN DEFAULT FALSE,
  probability_score INTEGER CHECK (probability_score >= 0 AND probability_score <= 100),
  industry TEXT,
  google_rating NUMERIC(2, 1) CHECK (google_rating >= 0 AND google_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- LEAD_STATUS TABLE
-- Tracks user-specific status for each lead (outreach tracking)
-- =====================================================
CREATE TABLE lead_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'not_contacted' CHECK (status IN ('not_contacted', 'messaged', 'responded', 'not_interested', 'closed')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(lead_id, user_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- Optimize query performance for common operations
-- =====================================================
CREATE INDEX idx_leads_search_id ON leads(search_id);
CREATE INDEX idx_leads_probability_score ON leads(probability_score DESC);
CREATE INDEX idx_lead_status_user_id ON lead_status(user_id);
CREATE INDEX idx_searches_user_id ON searches(user_id);
CREATE INDEX idx_searches_created_at ON searches(created_at DESC);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- Critical for data isolation between users
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_status ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES FOR PROFILES
-- Users can only view and update their own profile
-- =====================================================
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- RLS POLICIES FOR SEARCHES
-- Users can only access their own searches
-- =====================================================
CREATE POLICY "Users can view own searches"
  ON searches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create searches"
  ON searches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own searches"
  ON searches FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own searches"
  ON searches FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES FOR LEADS
-- Users can only view leads from their own searches
-- =====================================================
CREATE POLICY "Users can view own leads"
  ON leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM searches
      WHERE searches.id = leads.search_id
      AND searches.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create leads"
  ON leads FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM searches
      WHERE searches.id = leads.search_id
      AND searches.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own leads"
  ON leads FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM searches
      WHERE searches.id = leads.search_id
      AND searches.user_id = auth.uid()
    )
  );

-- =====================================================
-- RLS POLICIES FOR LEAD_STATUS
-- Users can only access their own lead status records
-- =====================================================
CREATE POLICY "Users can view own lead status"
  ON lead_status FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create lead status"
  ON lead_status FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lead status"
  ON lead_status FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lead status"
  ON lead_status FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTION: Auto-create profile on user signup
-- Automatically creates a profile record when a new user signs up
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- FUNCTION: Update lead_status timestamp
-- Automatically updates the updated_at field when status changes
-- =====================================================
CREATE OR REPLACE FUNCTION update_lead_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lead_status_updated_at
  BEFORE UPDATE ON lead_status
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_status_timestamp();
