/**
 * Landing Page - LeadFinder Pro
 *
 * Stunning, modern landing page with hero, features, and CTA sections
 */

import Link from 'next/link';
import { ArrowRight, Target, Zap, TrendingUp, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-8">
          {/* Badge */}
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 text-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Lead Generation
          </Badge>

          {/* Headline */}
          <h1 className="text-6xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
              Find Your Perfect Leads
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              In Minutes, Not Months
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Discover qualified local business leads with contact info and AI-powered buying probability scores.
            Built for CRM consultants who want to <span className="text-indigo-600 font-semibold">close more deals</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-lg" asChild>
              <Link href="/auth/signup" className="group">
                <span>Start Finding Leads</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="ghost" size="lg" className="text-lg" asChild>
              <Link href="#features">See How It Works</Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>1000+ Leads Found Daily</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>80%+ Contact Success Rate</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>AI-Powered Scoring</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Everything You Need to <span className="text-indigo-600">Win</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Powerful features designed to help you find and close more deals
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-200">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Smart Targeting</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Find businesses that need your CRM/automation services with AI-powered detection.
              We identify companies without existing automation tools.
            </p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Location-based search</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Industry filtering</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>CRM detection</span>
              </li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-200">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Probability Scores</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Each lead gets an AI-calculated score (0-100) based on buying signals.
              Focus on high-probability leads that are ready to buy.
            </p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>0-100 buying score</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Qualification factors</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Priority sorting</span>
              </li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-200">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Complete Contact Info</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Get email, phone, website, and social profiles automatically.
              Start reaching out immediately with verified contact data.
            </p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Email addresses</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Phone numbers</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Social profiles</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Leads Per Week</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">80%</div>
              <div className="text-blue-100">Contact Success Rate</div>
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

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          Ready to 10x Your Lead Generation?
        </h2>
        <p className="text-xl text-slate-600 mb-8">
          Join consultants who are finding more qualified leads in less time
        </p>
        <Link
          href="/auth/signup"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-5 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
        >
          <span>Start Free Trial</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-sm text-slate-500 mt-4">No credit card required • Cancel anytime</p>
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
