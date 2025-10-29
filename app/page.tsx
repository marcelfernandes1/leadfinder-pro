/**
 * Landing Page - LeadFinder Pro
 *
 * Direct-response landing page with elite conversion copywriting
 * Sections: Hero, Problem, Solution, How It Works, Proof, Pricing, FAQ, About, Final CTA
 */

import Link from 'next/link';
import {
  ArrowRight, Target, Zap, TrendingUp, CheckCircle, Sparkles,
  XCircle, Search, Mail, Phone, Globe, Star, Shield, Users,
  Clock, DollarSign, MapPin, BarChart3, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                LeadFinder Pro
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600" asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* SECTION 1: HERO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-8">
          {/* Badge */}
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 text-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Lead Generation
          </Badge>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
              Stop Hunting for Clients.
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Start Choosing Who You Work With.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Find local business owners who need your marketing services — complete with email, phone, and an AI-calculated "ready to buy" score — in under 60 seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-lg shadow-lg hover:shadow-xl" asChild>
              <Link href="/auth/signup" className="group">
                <span>Start Finding Leads Free</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="ghost" size="lg" className="text-lg" asChild>
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>

          {/* Trust Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>1000+ leads found this week</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>80% contact success rate</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: THE PROBLEM */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Here's Why Most Agencies Are Stuck in <span className="text-red-600">Feast-or-Famine Hell</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Problem 1 */}
            <Card className="border-2 border-red-100">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      Cold calling businesses that hang up before you finish your pitch
                    </h3>
                    <p className="text-slate-600">
                      You burned through 50 calls last week. Got 2 "maybe"s and zero clients.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Problem 2 */}
            <Card className="border-2 border-red-100">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      Scrolling LinkedIn for hours, sending DMs that go unanswered
                    </h3>
                    <p className="text-slate-600">
                      "Hi [First Name], I noticed you run a landscaping business..." <span className="italic">Left on read.</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Problem 3 */}
            <Card className="border-2 border-red-100">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      Paying for stale lead lists that every other agency already called
                    </h3>
                    <p className="text-slate-600">
                      Half the numbers are disconnected. The other half are sick of hearing from marketers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Problem 4 */}
            <Card className="border-2 border-red-100">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      Spending $3,000/month on Facebook ads hoping someone will book a call
                    </h3>
                    <p className="text-slate-600">
                      You're getting clicks, but the people showing up aren't qualified — or don't show up at all.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pull Quote */}
          <div className="mt-16 max-w-3xl mx-auto text-center">
            <blockquote className="text-2xl md:text-3xl font-bold text-slate-900 italic border-l-4 border-indigo-600 pl-6">
              "It's not that great leads don't exist. It's that you have no idea WHO they are or HOW to reach them."
            </blockquote>
            <p className="text-xl text-indigo-600 font-semibold mt-4">Until now.</p>
          </div>
        </div>
      </div>

      {/* SECTION 3: THE SOLUTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            LeadFinder Pro: Your <span className="text-indigo-600">Unfair Advantage</span> in the Local Marketing Game
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Imagine if you could see exactly which businesses in your area need CRM automation, email marketing, or social media management — and you could contact them instantly with verified emails and phone numbers.
          </p>
          <p className="text-xl font-semibold text-indigo-600 mt-4">
            That's LeadFinder Pro.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Feature 1 */}
          <Card className="border-2 border-blue-100 hover:shadow-xl transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Location-Based Discovery</h3>
              <p className="text-slate-600">
                Search by city, ZIP code, or radius. Get local leads you can actually meet and serve.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="border-2 border-blue-100 hover:shadow-xl transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Probability Scores (0-100)</h3>
              <p className="text-slate-600">
                Every lead gets an instant "readiness score" based on buying signals. Focus on 80+ scores first.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="border-2 border-blue-100 hover:shadow-xl transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Complete Contact Info</h3>
              <p className="text-slate-600">
                Email, phone, website, Instagram, Facebook — all verified and ready to use. No detective work.
              </p>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card className="border-2 border-blue-100 hover:shadow-xl transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">CRM Detection Technology</h3>
              <p className="text-slate-600">
                We check if they're using HubSpot, Mailchimp, etc. If not? They're perfect for your pitch.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pull Quote */}
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-100">
          <blockquote className="text-xl md:text-2xl font-bold text-slate-900 italic">
            "It's like having X-ray vision for which businesses are ready to buy from you right now."
          </blockquote>
          <p className="text-indigo-600 font-semibold mt-4">— Sarah M., Digital Marketing Consultant</p>
        </div>
      </div>

      {/* SECTION 4: HOW IT WORKS */}
      <div id="how-it-works" className="bg-gradient-to-br from-slate-50 to-blue-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              From Zero to Pipeline in <span className="text-indigo-600">3 Clicks</span>
            </h2>
            <p className="text-xl text-slate-600">
              No learning curve. No complicated setup. Just results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="relative overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-center text-2xl">Step 1: Search Your Territory</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center">
                  Enter your city, choose your industry (restaurants, real estate, fitness, etc.), and set your radius. LeadFinder Pro scans thousands of local businesses in seconds.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="relative overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-center text-2xl">Step 2: Filter by Readiness</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center">
                  Sort leads by their AI probability score. See who's got email, phone, no CRM, and strong social presence. The 80+ scores? Those are your hottest leads.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="relative overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-center text-2xl">Step 3: Reach Out & Close</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center">
                  Click to call, email, or message them on social — all their info is right there. No spreadsheets, no data entry. Just straight outreach.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-lg shadow-lg" asChild>
              <Link href="/auth/signup" className="group">
                <span>Try It Free — No Credit Card Required</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* SECTION 5: PROOF & RESULTS */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Real Agencies. Real Results. <span className="text-indigo-600">Real Fast.</span>
            </h2>
            <p className="text-xl text-slate-600">
              Don't take our word for it — see what happens when marketers get access to qualified leads on demand.
            </p>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Testimonial 1 */}
            <Card className="border-2 border-green-100 hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    MT
                  </div>
                  <div className="ml-3">
                    <p className="font-bold text-slate-900">Marcus T.</p>
                    <p className="text-sm text-slate-600">Austin, TX</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  "I closed 3 clients in my first week using LeadFinder Pro."
                </h3>
                <p className="text-slate-600">
                  I was skeptical at first, but I tried it anyway. Within 7 days, I had 3 new retainer clients — all from the high-score leads. I'm never going back to cold calling.
                </p>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="border-2 border-green-100 hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    JK
                  </div>
                  <div className="ml-3">
                    <p className="font-bold text-slate-900">Jennifer K.</p>
                    <p className="text-sm text-slate-600">Denver, CO</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  "This tool literally paid for itself in one deal."
                </h3>
                <p className="text-slate-600">
                  I landed a $5K/month CRM client from a lead I found in LeadFinder Pro. The probability score was 92, and sure enough, they were ready to sign. Best ROI I've ever gotten from a software.
                </p>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="border-2 border-green-100 hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    DR
                  </div>
                  <div className="ml-3">
                    <p className="font-bold text-slate-900">David R.</p>
                    <p className="text-sm text-slate-600">Miami, FL</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  "I went from 10 cold calls a day to 3 warm conversations."
                </h3>
                <p className="text-slate-600">
                  Instead of dialing random numbers, I'm only reaching out to businesses that actually fit my services. My close rate went from 2% to 35% in a month.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12">
            <div className="grid md:grid-cols-4 gap-8 text-center text-white">
              <div>
                <div className="text-5xl font-bold mb-2">1000+</div>
                <div className="text-blue-100">Leads Found Per Week</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">80%</div>
                <div className="text-blue-100">Email Accuracy Rate</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">50+</div>
                <div className="text-blue-100">Happy Consultants</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">24/7</div>
                <div className="text-blue-100">Lead Discovery</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: PRICING */}
      <div id="pricing" className="bg-gradient-to-br from-slate-50 to-blue-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Simple Pricing. <span className="text-indigo-600">Massive ROI.</span>
            </h2>
            <p className="text-xl text-slate-600">
              No long-term contracts. Cancel anytime. Start free.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <Card className="border-2 border-slate-200 hover:shadow-2xl transition-shadow">
              <CardHeader className="text-center border-b border-slate-100 pb-6">
                <CardTitle className="text-2xl mb-2">Starter</CardTitle>
                <div className="text-5xl font-bold text-slate-900 mb-2">
                  $97<span className="text-xl text-slate-600">/mo</span>
                </div>
                <CardDescription>Perfect for solo consultants getting started</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>500 leads per month</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Full contact info (email, phone, social)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>AI probability scores</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>CRM detection</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-slate-600 to-slate-700" asChild>
                  <Link href="/auth/signup">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan (Most Popular) */}
            <Card className="border-4 border-indigo-500 hover:shadow-2xl transition-shadow relative">
              <div className="absolute top-0 left-0 right-0">
                <Badge className="w-full rounded-t-none bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
                  ⭐ MOST POPULAR
                </Badge>
              </div>
              <CardHeader className="text-center border-b border-slate-100 pb-6 pt-12">
                <CardTitle className="text-2xl mb-2">Pro</CardTitle>
                <div className="text-5xl font-bold text-slate-900 mb-2">
                  $197<span className="text-xl text-slate-600">/mo</span>
                </div>
                <CardDescription>For growing agencies that need pipeline predictability</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="font-semibold">2,000 leads per month</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Full contact info (email, phone, social)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>AI probability scores</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>CRM detection</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="font-semibold">Advanced filters</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="font-semibold">Export to CSV</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-lg" asChild>
                  <Link href="/auth/signup">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Agency Plan */}
            <Card className="border-2 border-slate-200 hover:shadow-2xl transition-shadow">
              <CardHeader className="text-center border-b border-slate-100 pb-6">
                <CardTitle className="text-2xl mb-2">Agency</CardTitle>
                <div className="text-5xl font-bold text-slate-900 mb-2">
                  $297<span className="text-xl text-slate-600">/mo</span>
                </div>
                <CardDescription>Built for teams that need to scale fast</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="font-semibold">Unlimited leads</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Full contact info (email, phone, social)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>AI probability scores</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>CRM detection</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Advanced filters</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Export to CSV</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="font-semibold">Multi-user access</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="font-semibold">Dedicated account manager</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-slate-600 to-slate-700" asChild>
                  <Link href="/auth/signup">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Risk Reversal */}
          <div className="mt-16 max-w-3xl mx-auto">
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Try It Risk-Free for 14 Days</h3>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  Not sure if LeadFinder Pro is right for you? Start your free trial — no credit card required.
                  If you don't find at least 10 qualified leads in your first week, we'll personally help you
                  refine your search criteria. That's how confident we are.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* SECTION 7: FAQ */}
      <div className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Questions? We've Got <span className="text-indigo-600">Answers.</span>
            </h2>
          </div>

          <div className="space-y-6">
            {/* FAQ 1 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-indigo-600 mr-3 mt-1 flex-shrink-0" />
                  <span>Do I need any technical experience to use LeadFinder Pro?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 ml-8">
                  Nope. If you can use Google, you can use LeadFinder Pro. The interface is designed for
                  non-technical users — just point, click, and get leads.
                </p>
              </CardContent>
            </Card>

            {/* FAQ 2 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-indigo-600 mr-3 mt-1 flex-shrink-0" />
                  <span>How accurate is the contact information?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 ml-8">
                  Our email accuracy rate is ~80%, and phone coverage is ~90%. We pull from verified sources
                  like Google Maps, public business directories, and social profiles. If a lead's info changes,
                  we update it automatically.
                </p>
              </CardContent>
            </Card>

            {/* FAQ 3 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-indigo-600 mr-3 mt-1 flex-shrink-0" />
                  <span>What does the "probability score" actually mean?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 ml-8">
                  It's an AI-calculated number (0-100) based on buying signals like: no CRM detected, active
                  social media, has a website, good Google rating, and more. An 80+ score means they're highly
                  likely to need your services.
                </p>
              </CardContent>
            </Card>

            {/* FAQ 4 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-indigo-600 mr-3 mt-1 flex-shrink-0" />
                  <span>Can I export leads to my CRM or email list?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 ml-8">
                  Yes! Pro and Agency plans include CSV export so you can integrate LeadFinder Pro leads into
                  your existing workflow.
                </p>
              </CardContent>
            </Card>

            {/* FAQ 5 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-indigo-600 mr-3 mt-1 flex-shrink-0" />
                  <span>Is this data legal to use for outreach?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 ml-8">
                  Absolutely. All data is sourced from publicly available business directories, Google Maps,
                  and websites. You're free to contact these businesses for legitimate B2B outreach.
                </p>
              </CardContent>
            </Card>

            {/* FAQ 6 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-indigo-600 mr-3 mt-1 flex-shrink-0" />
                  <span>How many leads will I actually get?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 ml-8">
                  It depends on your search criteria and location. Most users find 50-100+ qualified leads per
                  search. Starter plan gives you 500/month, Pro gives 2,000, and Agency is unlimited.
                </p>
              </CardContent>
            </Card>

            {/* FAQ 7 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-indigo-600 mr-3 mt-1 flex-shrink-0" />
                  <span>What if I don't find any good leads?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 ml-8">
                  Unlikely, but if you're struggling, reach out to support. We'll help you refine your search
                  criteria or suggest alternative industries. We want you to win.
                </p>
              </CardContent>
            </Card>

            {/* FAQ 8 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-indigo-600 mr-3 mt-1 flex-shrink-0" />
                  <span>Can I cancel anytime?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 ml-8">
                  Yep. No contracts, no commitments. Cancel with one click from your account settings.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* SECTION 8: ABOUT US */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              We're on a Mission to End the <span className="text-indigo-600">Prospecting Nightmare</span>
            </h2>
          </div>

          <Card className="border-2 border-blue-100">
            <CardContent className="pt-8">
              <div className="prose prose-lg max-w-none text-slate-600">
                <p className="text-lg mb-6">
                  LeadFinder Pro was born out of frustration.
                </p>
                <p className="text-lg mb-6">
                  We're a team of ex-agency owners and SaaS builders who spent <strong>years</strong> struggling
                  with the same problem you're facing: how do you find qualified clients without burning out?
                </p>
                <p className="text-lg mb-6">
                  We tried it all. Cold calling. Facebook ads. Referrals. LinkedIn spam. Nothing was consistent.
                </p>
                <p className="text-lg mb-6">
                  So we asked ourselves: <span className="italic">"What if we could build a tool that makes
                  prospecting as easy as searching Google?"</span>
                </p>
                <p className="text-lg mb-6">
                  That question became LeadFinder Pro.
                </p>
                <p className="text-lg mb-8">
                  Today, we're helping hundreds of marketing consultants, freelancers, and agencies find qualified
                  leads in minutes instead of months. We're not here to sell you a pipe dream — we're here to give
                  you the <strong>tool</strong> you need to build the business you deserve.
                </p>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-100">
                  <blockquote className="text-xl font-bold text-slate-900 italic text-center">
                    "Every great agency needs two things: amazing work and consistent clients. We built LeadFinder
                    Pro to solve the second one."
                  </blockquote>
                  <p className="text-center text-indigo-600 font-semibold mt-4">— The LeadFinder Pro Team</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECTION 9: FINAL CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            You're One Click Away from Never Worrying About Leads Again
          </h2>
          <p className="text-xl text-blue-100 mb-4 max-w-3xl mx-auto">
            Here's the truth:
          </p>
          <p className="text-lg text-blue-100 mb-6 max-w-3xl mx-auto">
            Every day you wait is another day your competitors are ahead of you.
          </p>
          <p className="text-lg text-blue-100 mb-8 max-w-3xl mx-auto">
            While you're manually searching LinkedIn or buying stale lead lists, someone else is using LeadFinder
            Pro to fill their pipeline with qualified prospects.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 max-w-2xl mx-auto border-2 border-white/20">
            <p className="text-xl text-white mb-4">The choice is simple:</p>
            <div className="space-y-4 text-left">
              <div className="flex items-start">
                <XCircle className="w-6 h-6 text-red-300 mr-3 mt-1 flex-shrink-0" />
                <p className="text-blue-100">
                  Keep struggling with outdated prospecting methods and hoping something changes.
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-300 mr-3 mt-1 flex-shrink-0" />
                <p className="text-white font-semibold">
                  Start using the tool that gives you an unfair advantage — and finally build the predictable,
                  profitable business you've been chasing.
                </p>
              </div>
            </div>
          </div>

          <Button size="lg" className="bg-white text-indigo-600 hover:bg-blue-50 text-xl px-12 py-6 shadow-2xl" asChild>
            <Link href="/auth/signup" className="group">
              <span>Start Your Free Trial Now — No Credit Card Required</span>
              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <p className="text-blue-100 mt-6">
            Join 50+ agencies and consultants who are already winning with LeadFinder Pro.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">LeadFinder Pro</span>
            </div>
            <div className="text-slate-600 text-sm">
              © 2025 LeadFinder Pro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
