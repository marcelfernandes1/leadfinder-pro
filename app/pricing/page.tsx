/**
 * Pricing Page - LeadFinder Pro
 *
 * Comprehensive pricing page with plan comparison, features, and FAQ
 */

import Link from 'next/link';
import {
  ArrowRight, Target, CheckCircle, Shield, Users, Zap, TrendingUp,
  Mail, Phone, Globe, Download, Settings, Crown, Sparkles, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
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
              <Link href="/#how-it-works" className="text-slate-700 hover:text-indigo-600 font-medium">
                How It Works
              </Link>
              <Link href="/pricing" className="text-indigo-600 font-semibold">
                Pricing
              </Link>
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

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="text-center space-y-6">
          <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 text-sm">
            <Shield className="w-4 h-4 mr-2" />
            14-Day Free Trial • No Credit Card Required
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
              Plans That Scale
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              With Your Business
            </span>
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            From solo consultants to growing agencies — find the perfect plan to fuel your pipeline.
            All plans include our AI-powered lead scoring and CRM detection.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Starter Plan */}
          <Card className="border-2 border-slate-200 hover:shadow-2xl transition-all hover:-translate-y-1">
            <CardHeader className="text-center border-b border-slate-100 pb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2">Starter</CardTitle>
              <div className="text-5xl font-bold text-slate-900 mb-2">
                $97<span className="text-xl text-slate-600">/mo</span>
              </div>
              <CardDescription className="text-base">
                Perfect for solo consultants testing the waters
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">500 leads per month</span>
                    <p className="text-sm text-slate-600">Approximately 125 leads per week</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Complete contact info (email, phone, social)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>AI-powered probability scores (0-100)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Automatic CRM detection</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Basic filters (location, industry, score)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Priority email support</span>
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-slate-600 to-slate-700 text-lg" size="lg" asChild>
                <Link href="/auth/signup">Start Free Trial</Link>
              </Button>
              <p className="text-center text-sm text-slate-500 mt-4">No credit card required</p>
            </CardContent>
          </Card>

          {/* Pro Plan (Most Popular) */}
          <Card className="border-4 border-indigo-500 hover:shadow-2xl transition-all hover:-translate-y-1 relative">
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 px-6 py-2 text-sm font-bold shadow-lg">
                ⭐ MOST POPULAR
              </Badge>
            </div>
            <CardHeader className="text-center border-b border-slate-100 pb-6 pt-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2">Pro</CardTitle>
              <div className="text-5xl font-bold text-slate-900 mb-2">
                $197<span className="text-xl text-slate-600">/mo</span>
              </div>
              <CardDescription className="text-base">
                For growing agencies building consistent pipelines
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">2,000 leads per month</span>
                    <p className="text-sm text-slate-600">Approximately 500 leads per week</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Complete contact info (email, phone, social)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>AI-powered probability scores (0-100)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Automatic CRM detection</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Advanced filters</span>
                    <p className="text-sm text-slate-600">Filter by Google rating, social presence, phone/email availability</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">CSV export</span>
                    <p className="text-sm text-slate-600">Export leads to your CRM or email tools</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Priority support with faster response times</span>
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-lg shadow-lg" size="lg" asChild>
                <Link href="/auth/signup">Start Free Trial</Link>
              </Button>
              <p className="text-center text-sm text-slate-500 mt-4">No credit card required</p>
            </CardContent>
          </Card>

          {/* Agency Plan */}
          <Card className="border-2 border-slate-200 hover:shadow-2xl transition-all hover:-translate-y-1">
            <CardHeader className="text-center border-b border-slate-100 pb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2">Agency</CardTitle>
              <div className="text-5xl font-bold text-slate-900 mb-2">
                $297<span className="text-xl text-slate-600">/mo</span>
              </div>
              <CardDescription className="text-base">
                Built for teams that need to scale fast
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Unlimited leads</span>
                    <p className="text-sm text-slate-600">No monthly caps — search as much as you need</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Complete contact info (email, phone, social)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>AI-powered probability scores (0-100)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Automatic CRM detection</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Advanced filters</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>CSV export</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Multi-user access (up to 5 seats)</span>
                    <p className="text-sm text-slate-600">Your whole team can collaborate</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Dedicated account manager</span>
                    <p className="text-sm text-slate-600">Personalized onboarding and strategy calls</p>
                  </div>
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-lg" size="lg" asChild>
                <Link href="/auth/signup">Start Free Trial</Link>
              </Button>
              <p className="text-center text-sm text-slate-500 mt-4">No credit card required</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Compare Plans
            </h2>
            <p className="text-xl text-slate-600">
              See exactly what's included in each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-900">Starter</th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-900 bg-indigo-50">Pro</th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-900">Agency</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-100">
                  <td className="py-4 px-6">Monthly lead quota</td>
                  <td className="text-center py-4 px-6">500</td>
                  <td className="text-center py-4 px-6 bg-indigo-50">2,000</td>
                  <td className="text-center py-4 px-6">Unlimited</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-4 px-6">AI probability scores</td>
                  <td className="text-center py-4 px-6"><CheckCircle className="w-5 h-5 text-green-500 inline" /></td>
                  <td className="text-center py-4 px-6 bg-indigo-50"><CheckCircle className="w-5 h-5 text-green-500 inline" /></td>
                  <td className="text-center py-4 px-6"><CheckCircle className="w-5 h-5 text-green-500 inline" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-4 px-6">CRM detection</td>
                  <td className="text-center py-4 px-6"><CheckCircle className="w-5 h-5 text-green-500 inline" /></td>
                  <td className="text-center py-4 px-6 bg-indigo-50"><CheckCircle className="w-5 h-5 text-green-500 inline" /></td>
                  <td className="text-center py-4 px-6"><CheckCircle className="w-5 h-5 text-green-500 inline" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-4 px-6">Email & phone data</td>
                  <td className="text-center py-4 px-6"><CheckCircle className="w-5 h-5 text-green-500 inline" /></td>
                  <td className="text-center py-4 px-6 bg-indigo-50"><CheckCircle className="w-5 h-5 text-green-500 inline" /></td>
                  <td className="text-center py-4 px-6"><CheckCircle className="w-5 h-5 text-green-500 inline" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-4 px-6">Social media profiles</td>
                  <td className="text-center py-4 px-6"><CheckCircle className="w-5 h-5 text-green-500 inline" /></td>
                  <td className="text-center py-4 px-6 bg-indigo-50"><CheckCircle className="w-5 h-5 text-green-500 inline" /></td>
                  <td className="text-center py-4 px-6"><CheckCircle className="w-5 h-5 text-green-500 inline" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-4 px-6">Advanced filters</td>
                  <td className="text-center py-4 px-6">—</td>
                  <td className="text-center py-4 px-6 bg-indigo-50"><CheckCircle className="w-5 h-5 text-green-500 inline" /></td>
                  <td className="text-center py-4 px-6"><CheckCircle className="w-5 h-5 text-green-500 inline" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-4 px-6">CSV export</td>
                  <td className="text-center py-4 px-6">—</td>
                  <td className="text-center py-4 px-6 bg-indigo-50"><CheckCircle className="w-5 h-5 text-green-500 inline" /></td>
                  <td className="text-center py-4 px-6"><CheckCircle className="w-5 h-5 text-green-500 inline" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-4 px-6">Multi-user access</td>
                  <td className="text-center py-4 px-6">1 seat</td>
                  <td className="text-center py-4 px-6 bg-indigo-50">1 seat</td>
                  <td className="text-center py-4 px-6">Up to 5 seats</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-4 px-6">Dedicated account manager</td>
                  <td className="text-center py-4 px-6">—</td>
                  <td className="text-center py-4 px-6 bg-indigo-50">—</td>
                  <td className="text-center py-4 px-6"><CheckCircle className="w-5 h-5 text-green-500 inline" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-4 px-6">Support</td>
                  <td className="text-center py-4 px-6 text-sm">Email</td>
                  <td className="text-center py-4 px-6 bg-indigo-50 text-sm">Priority Email</td>
                  <td className="text-center py-4 px-6 text-sm">Priority + Phone</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Pricing <span className="text-indigo-600">Questions?</span>
            </h2>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Can I switch plans later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Yes! You can upgrade or downgrade at any time. When you upgrade, you'll be charged a prorated amount
                  for the remainder of your billing cycle. When you downgrade, the change takes effect at the start of
                  your next billing cycle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What happens if I exceed my monthly lead quota?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  On Starter and Pro plans, you'll receive a notification when you approach your limit. You can either
                  upgrade to the next tier or wait for your quota to reset at the start of your next billing cycle.
                  We don't charge overage fees — we'll just prevent additional searches until you upgrade or your cycle resets.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Yes! All plans come with a 14-day free trial — no credit card required. You'll get full access to all
                  features of your chosen plan during the trial period.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Do you offer discounts for annual billing?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Yes! If you pay annually, you'll save 20% compared to monthly billing. That's 2 months free! Contact us
                  at support@leadfinderpro.com to set up annual billing.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  We accept all major credit cards (Visa, Mastercard, American Express, Discover) and debit cards.
                  Payments are securely processed through Stripe.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Fill Your Pipeline?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your 14-day free trial today. No credit card required.
          </p>
          <Button size="lg" className="bg-white text-indigo-600 hover:bg-blue-50 text-xl px-12 py-6 shadow-2xl" asChild>
            <Link href="/auth/signup" className="group">
              <span>Start Free Trial</span>
              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <p className="text-blue-100 mt-6">
            Join 50+ agencies already winning with LeadFinder Pro
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">LeadFinder Pro</span>
            </Link>
            <div className="text-slate-600 text-sm">
              © 2025 LeadFinder Pro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
