/**
 * Saved Leads Page
 *
 * Placeholder page for saved leads functionality.
 * This will be implemented in a future update.
 */

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, ArrowLeft, Target, Search } from 'lucide-react';

export default function SavedLeadsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Simple Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
              type="button"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                LeadFinder Pro
              </span>
            </button>

            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="hover:bg-slate-100 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-16">
        <Card className="max-w-2xl w-full bg-white/90 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Download className="w-10 h-10 text-blue-600" />
            </div>
            <CardTitle className="text-3xl mb-3">Saved Leads</CardTitle>
            <CardDescription className="text-lg">
              This feature is coming soon!
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">What's Coming:</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Save your favorite leads for quick access</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Organize leads into custom collections</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Export saved leads to CSV</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Track outreach progress and notes</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="flex-1 hover:bg-slate-100 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button
                onClick={() => router.push('/search')}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg cursor-pointer"
              >
                <Search className="w-4 h-4 mr-2" />
                Start New Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
