/**
 * How It Works Page
 *
 * Detailed walkthrough of the LeadFinder Pro process with visuals and step-by-step explanations.
 * Shows users exactly how the platform discovers and qualifies leads.
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Mail,
  Globe,
  TrendingUp,
  Target,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Brain,
  MapPin,
  Phone,
  Instagram,
  Facebook,
  Linkedin,
  Award,
  Filter,
  Download,
  Clock,
  Shield,
  Rocket,
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                LeadFinder Pro
              </span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/how-it-works" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors">
                How It Works
              </Link>
              <Link href="/pricing" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors">
                Pricing
              </Link>
              <Link href="/auth/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 px-6 py-2 text-sm">
            <Zap className="w-4 h-4 mr-2 inline" />
            Fully Automated Lead Discovery
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              How LeadFinder Pro
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Finds Your Perfect Clients
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            From search to qualified lead in under 60 seconds. Here's exactly how our AI-powered system discovers, enriches, and scores your ideal prospects.
          </p>
        </div>
      </section>

      {/* The Process - Step by Step */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              The Complete Process
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Four powerful steps that run automatically while you watch the progress in real-time
            </p>
          </div>

          {/* Step 1: Search & Discover */}
          <div className="mb-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <Badge className="bg-blue-100 text-blue-700 border-0 mb-2">Step 1</Badge>
                    <h3 className="text-3xl font-bold text-slate-900">Search & Discover</h3>
                  </div>
                </div>
                <p className="text-lg text-slate-600 mb-6">
                  Tell us your target location, industry, and how many leads you want. Our system instantly searches Google Maps for local businesses matching your criteria.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-slate-900">Precise Location Targeting</p>
                      <p className="text-slate-600">Search by city, zip code, or custom radius</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-slate-900">20+ Industry Categories</p>
                      <p className="text-slate-600">HVAC, plumbers, electricians, lawyers, dentists, and more</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-slate-900">Real-Time Discovery</p>
                      <p className="text-slate-600">Finds 50-100 businesses in seconds</p>
                    </div>
                  </div>
                </div>
              </div>
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
                <CardContent className="p-8">
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-600 mb-1">Location</p>
                          <p className="font-semibold text-slate-900">Austin, TX (10 mile radius)</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Search className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-600 mb-1">Industry</p>
                          <p className="font-semibold text-slate-900">HVAC Contractors</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Target className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-600 mb-1">Lead Count</p>
                          <p className="font-semibold text-slate-900">100 qualified leads</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Businesses Found</span>
                        <span className="font-bold text-green-600 text-lg">127 results</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Step 2: Enrich Contact Data */}
          <div className="mb-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl md:order-1 order-2">
                <CardContent className="p-8">
                  <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl p-6 border border-slate-200">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600">Enriching Contact Data</span>
                        <span className="text-sm font-bold text-indigo-600">72%</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" style={{ width: '72%' }} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">Phone Numbers</p>
                          <p className="text-sm text-slate-600">114/127 found (90%)</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">Email Addresses</p>
                          <p className="text-sm text-slate-600">76/127 found (60%)</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center animate-pulse">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">Social Media Profiles</p>
                          <p className="text-sm text-slate-600">Scanning Instagram & Facebook...</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Globe className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">Website Analysis</p>
                          <p className="text-sm text-slate-600">Queued</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="md:order-2 order-1">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <Badge className="bg-green-100 text-green-700 border-0 mb-2">Step 2</Badge>
                    <h3 className="text-3xl font-bold text-slate-900">Enrich Contact Data</h3>
                  </div>
                </div>
                <p className="text-lg text-slate-600 mb-6">
                  For each business discovered, we automatically find their email addresses, phone numbers, social media profiles, and website details using multiple data sources.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Phone className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-slate-900">Phone & Website</p>
                      <p className="text-slate-600">90% of businesses have verified phone numbers</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-slate-900">Email Discovery</p>
                      <p className="text-slate-600">Hunter.io finds 60% of business emails</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Instagram className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-slate-900">Social Media Profiles</p>
                      <p className="text-slate-600">Instagram, Facebook, LinkedIn, and more</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: CRM Detection */}
          <div className="mb-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <Badge className="bg-purple-100 text-purple-700 border-0 mb-2">Step 3</Badge>
                    <h3 className="text-3xl font-bold text-slate-900">CRM Detection</h3>
                  </div>
                </div>
                <p className="text-lg text-slate-600 mb-6">
                  Our AI scans each business website to detect if they're already using CRM or marketing automation tools. Businesses without these systems are your hottest prospects.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-slate-900">10+ Tool Detection</p>
                      <p className="text-slate-600">HubSpot, Mailchimp, ActiveCampaign, and more</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-slate-900">Smart Filtering</p>
                      <p className="text-slate-600">Prioritizes businesses without automation</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-slate-900">Website Analysis</p>
                      <p className="text-slate-600">Deep scans to detect hidden integrations</p>
                    </div>
                  </div>
                </div>
              </div>
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
                <CardContent className="p-8">
                  <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-xl p-6 border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-purple-600" />
                      Website Scan Results
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-green-900">No CRM Detected</span>
                          <Badge className="bg-green-600 text-white border-0">High Priority</Badge>
                        </div>
                        <p className="text-sm text-green-700">89 businesses (70%)</p>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-yellow-900">Basic Tools Found</span>
                          <Badge className="bg-yellow-600 text-white border-0">Medium</Badge>
                        </div>
                        <p className="text-sm text-yellow-700">23 businesses (18%)</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-slate-900">Advanced CRM</span>
                          <Badge className="bg-slate-600 text-white border-0">Low Priority</Badge>
                        </div>
                        <p className="text-sm text-slate-600">15 businesses (12%)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Step 4: AI Scoring */}
          <div className="mb-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl md:order-1 order-2">
                <CardContent className="p-8">
                  <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl p-6 border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-indigo-600" />
                      Probability Score Breakdown
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">No CRM Detected</span>
                          <span className="text-sm font-bold text-indigo-600">+40 pts</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600" style={{ width: '40%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">Has Website</span>
                          <span className="text-sm font-bold text-indigo-600">+15 pts</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600" style={{ width: '15%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">Email Found</span>
                          <span className="text-sm font-bold text-indigo-600">+10 pts</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600" style={{ width: '10%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">Active on Social</span>
                          <span className="text-sm font-bold text-indigo-600">+10 pts</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600" style={{ width: '10%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">4+ Star Rating</span>
                          <span className="text-sm font-bold text-indigo-600">+10 pts</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600" style={{ width: '10%' }} />
                        </div>
                      </div>
                      <div className="pt-4 border-t border-slate-200">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900">Total Score</span>
                          <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">85/100</span>
                        </div>
                        <Badge className="w-full mt-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 justify-center">
                          🔥 Hot Lead - Contact Immediately
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="md:order-2 order-1">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <Badge className="bg-orange-100 text-orange-700 border-0 mb-2">Step 4</Badge>
                    <h3 className="text-3xl font-bold text-slate-900">AI Scoring</h3>
                  </div>
                </div>
                <p className="text-lg text-slate-600 mb-6">
                  Our proprietary algorithm calculates a buying probability score (0-100) for each lead based on multiple factors. Higher scores mean they're more likely to buy.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-lg font-bold text-green-600">A</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">80-100: Hot Leads (Green)</p>
                      <p className="text-slate-600">Contact immediately - highest conversion potential</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-lg font-bold text-yellow-600">B</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">60-79: Warm Leads (Yellow)</p>
                      <p className="text-slate-600">Good prospects - follow up within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-lg font-bold text-slate-600">C</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Below 60: Cold Leads (Gray)</p>
                      <p className="text-slate-600">Lower priority - nurture over time</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              What You Get with Every Search
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Complete contact information and intelligence for each qualified lead
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Business Details</h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Business name & address</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Industry & category</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Google rating & reviews</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Operating hours</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Contact Info</h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Direct phone numbers</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Email addresses (60%)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Website URLs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Social media profiles</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Intelligence</h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>CRM detection status</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Automation tool analysis</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Buying probability score</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Priority ranking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Powerful Dashboard Features
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Manage your leads efficiently with advanced filtering, sorting, and export capabilities
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Filter className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Smart Filtering</h3>
                </div>
                <p className="text-slate-600 mb-4">
                  Filter leads by score range, contact status, email availability, CRM status, and more. Save time by focusing on your best prospects.
                </p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>Score-based filtering (hot, warm, cold)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>Status tracking (contacted, responded, closed)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>CRM status (no CRM, basic tools, advanced)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">CSV Export</h3>
                </div>
                <p className="text-slate-600 mb-4">
                  Export your leads to CSV for use in your existing CRM, email marketing tools, or spreadsheets. One-click export with all data.
                </p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>All contact info & scores included</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Import directly to HubSpot, Salesforce, etc.</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Export filtered results only</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Status Tracking</h3>
                </div>
                <p className="text-slate-600 mb-4">
                  Track your outreach progress with customizable status labels. Never lose track of where you are with each lead.
                </p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span>Not Contacted, Messaged, Responded</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span>Not Interested, Closed Won</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span>Visual pipeline management</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Real-Time Updates</h3>
                </div>
                <p className="text-slate-600 mb-4">
                  Watch as leads are discovered and enriched in real-time. See progress updates every 2 seconds during the search process.
                </p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4 text-orange-600 flex-shrink-0" />
                    <span>Live progress bar with percentage</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4 text-orange-600 flex-shrink-0" />
                    <span>Step-by-step status updates</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4 text-orange-600 flex-shrink-0" />
                    <span>Celebration screen when complete</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Speed & Reliability */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-3 bg-white/10 rounded-2xl mb-6">
            <Zap className="w-12 h-12 text-yellow-400" />
          </div>
          <h2 className="text-4xl font-bold mb-6">
            Lightning Fast. Rock Solid Reliable.
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Our system processes thousands of leads daily with 99.9% uptime. Here's what makes us different:
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-400 mb-2">60s</div>
              <div className="text-slate-300">Average search time</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-green-400 mb-2">90%</div>
              <div className="text-slate-300">Data accuracy rate</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-slate-300">Automated processing</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 px-6 py-2 text-sm">
            <Shield className="w-4 h-4 mr-2 inline" />
            14-Day Free Trial • No Credit Card Required
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              Ready to Find Your Perfect Clients?
            </span>
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of agencies and consultants who've already discovered their next 1,000+ qualified leads.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-6 text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-slate-300 hover:border-indigo-600 hover:text-indigo-600 px-12 py-6 text-lg transition-all"
              >
                View Pricing
              </Button>
            </Link>
          </div>
          <p className="text-sm text-slate-500 mt-6">
            No credit card required • Cancel anytime • Setup in 2 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                LeadFinder Pro
              </span>
            </div>
            <div className="flex space-x-6 text-sm text-slate-600">
              <Link href="/how-it-works" className="hover:text-indigo-600 transition-colors">
                How It Works
              </Link>
              <Link href="/pricing" className="hover:text-indigo-600 transition-colors">
                Pricing
              </Link>
              <Link href="/" className="hover:text-indigo-600 transition-colors">
                Home
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-slate-500">
            © 2024 LeadFinder Pro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
