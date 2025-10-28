/**
 * Loading Animation Page
 * 
 * Shows animated progress while leads are being discovered.
 * Polls the API every 2 seconds to get progress updates.
 * Redirects to dashboard when complete.
 */

'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface SearchStatus {
  searchId: string;
  status: string;
  progress: number;
  currentStep: string;
  leadsFound: number;
}

export default function LoadingPage({
  params,
}: {
  params: Promise<{ searchId: string }>;
}) {
  const { searchId } = use(params);
  const router = useRouter();
  const [status, setStatus] = useState<SearchStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchId) return;

    // Poll for status updates every 2 seconds
    const poll = async () => {
      try {
        const response = await fetch(`/api/search/${searchId}/status`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Search not found');
          } else {
            setError('Failed to fetch status');
          }
          return;
        }

        const data = await response.json();
        setStatus(data);

        // If search is complete, wait 2 seconds then redirect
        if (data.status === 'completed' && data.progress === 100) {
          setTimeout(() => {
            router.push(`/dashboard?search=${searchId}`);
          }, 2000);
        }

        // If search failed, show error
        if (data.status === 'failed') {
          setError('Search failed. Please try again.');
        }
      } catch (err) {
        console.error('Failed to fetch search status:', err);
        setError('An error occurred while checking status');
      }
    };

    // Initial poll
    poll();

    // Set up polling interval
    const interval = setInterval(poll, 2000);

    // Clean up
    return () => clearInterval(interval);
  }, [searchId, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-4">{error}</div>
          <button
            onClick={() => router.push('/search')}
            className="text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Search
          </button>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const progress = status.progress || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="mx-auto w-16 h-16 mb-4"
            >
              🔍
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Finding Your Leads
            </h1>
            <p className="text-gray-600">
              {status.currentStep}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {status.leadsFound}
              </div>
              <div className="text-sm text-gray-600">Leads Found</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((progress / 100) * 100)}s
              </div>
              <div className="text-sm text-gray-600">Est. Time</div>
            </div>
          </div>

          {/* Status Messages */}
          <div className="space-y-2 text-sm">
            <StatusStep
              label="Scanning businesses"
              isComplete={progress > 20}
              isCurrent={progress > 0 && progress <= 20}
            />
            <StatusStep
              label="Finding contact info"
              isComplete={progress > 40}
              isCurrent={progress > 20 && progress <= 40}
            />
            <StatusStep
              label="Detecting CRM tools"
              isComplete={progress > 80}
              isCurrent={progress > 40 && progress <= 80}
            />
            <StatusStep
              label="Calculating scores"
              isComplete={progress === 100}
              isCurrent={progress > 80 && progress < 100}
            />
          </div>

          {/* Completion Message */}
          {progress === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center"
            >
              <div className="text-green-800 font-semibold mb-1">
                ✨ Search Complete!
              </div>
              <div className="text-green-600 text-sm">
                Redirecting to your leads...
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Cancel Button */}
        {progress < 100 && (
          <div className="text-center mt-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel and return to dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Status Step Component
 * Shows checkmark, spinner, or pending state
 */
function StatusStep({
  label,
  isComplete,
  isCurrent,
}: {
  label: string;
  isComplete: boolean;
  isCurrent: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
          isComplete
            ? 'bg-green-500'
            : isCurrent
            ? 'bg-indigo-500'
            : 'bg-gray-200'
        }`}
      >
        {isComplete ? (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : isCurrent ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
          />
        ) : null}
      </div>
      <span
        className={`${
          isComplete ? 'text-gray-900' : isCurrent ? 'text-indigo-600 font-medium' : 'text-gray-400'
        }`}
      >
        {label}
      </span>
    </div>
  );
}
