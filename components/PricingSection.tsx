/**
 * Pricing Section Component
 *
 * Interactive pricing cards with Stripe checkout integration
 * Handles checkout session creation and redirects users to Stripe
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Plan = 'starter' | 'pro' | 'agency';

export default function PricingSection() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle plan selection and create Stripe checkout session
   */
  const handleSelectPlan = async (plan: Plan) => {
    try {
      setLoadingPlan(plan);
      setError(null);

      // Call API to create checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      // Log the full error for debugging
      console.log('API Response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setLoadingPlan(null);
    }
  };

  return (
    <div id="pricing" className="bg-gradient-to-br from-slate-50 to-blue-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Simple Pricing. <span className="text-indigo-600">Massive ROI.</span>
          </h2>
          <p className="text-xl text-slate-600">
            No long-term contracts. Cancel anytime. 7-day free trial on all plans.
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-center">
              {error}
              {error.includes('sign in') && (
                <Link href="/auth/login" className="underline ml-2">
                  Sign in here
                </Link>
              )}
            </p>
          </div>
        )}

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
              <Button
                className="w-full bg-gradient-to-r from-slate-600 to-slate-700"
                onClick={() => handleSelectPlan('starter')}
                disabled={loadingPlan !== null}
              >
                {loadingPlan === 'starter' ? 'Loading...' : 'Start Free Trial'}
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
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-lg"
                onClick={() => handleSelectPlan('pro')}
                disabled={loadingPlan !== null}
              >
                {loadingPlan === 'pro' ? 'Loading...' : 'Start Free Trial'}
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
              <Button
                className="w-full bg-gradient-to-r from-slate-600 to-slate-700"
                onClick={() => handleSelectPlan('agency')}
                disabled={loadingPlan !== null}
              >
                {loadingPlan === 'agency' ? 'Loading...' : 'Start Free Trial'}
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
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Try It Risk-Free for 7 Days</h3>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Start your free 7-day trial — credit card required but you won't be charged until the trial ends.
                If you don't find at least 10 qualified leads in your first week, we'll personally help you
                refine your search criteria. Cancel anytime during the trial with no charge.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
