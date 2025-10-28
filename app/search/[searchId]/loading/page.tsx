/**
 * Loading Animation Page
 *
 * Shows animated progress while leads are being discovered.
 * Polls the API every 2 seconds to get progress updates.
 * Shows celebration screen with confetti when complete.
 * Redirects to dashboard when complete.
 */

'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import {
  Search,
  Mail,
  Globe,
  Sparkles,
  Target,
  TrendingUp,
  CheckCircle,
  Loader2,
  ArrowRight,
  Trophy,
} from 'lucide-react';

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
  const [showCelebration, setShowCelebration] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  // Get window dimensions for confetti
  useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

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

        // If search is complete, show celebration then redirect
        if (data.status === 'completed' && data.progress === 100) {
          setShowCelebration(true);
          setTimeout(() => {
            router.push(`/dashboard?search=${searchId}`);
          }, 4000); // Show celebration for 4 seconds
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Oops!</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/search')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Back to Search
          </button>
        </motion.div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
            <Sparkles className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-600 font-medium">Initializing search...</p>
        </div>
      </div>
    );
  }

  const progress = status.progress || 0;

  // Show celebration screen when complete
  if (showCelebration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Confetti */}
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={true}
          numberOfPieces={500}
          colors={['#3b82f6', '#6366f1', '#8b5cf6', '#10b981', '#f59e0b']}
        />

        {/* Celebration Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
          className="relative z-10 max-w-2xl w-full"
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center border border-slate-200">
            {/* Trophy Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', bounce: 0.6 }}
              className="mx-auto w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-xl"
            >
              <Trophy className="w-14 h-14 text-white" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4"
            >
              Leads Found!
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-slate-600 mb-8"
            >
              We discovered <span className="font-bold text-indigo-600">{status.leadsFound}</span> qualified leads for you
            </motion.p>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">{status.leadsFound}</div>
                <div className="text-xs text-green-600">Total Leads</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-700">100%</div>
                <div className="text-xs text-blue-600">Complete</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-700">Ready</div>
                <div className="text-xs text-purple-600">To Review</div>
              </div>
            </motion.div>

            {/* Loading message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center justify-center space-x-2 text-slate-600"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Redirecting to your leads...</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show loading screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-200"
        >
          {/* Header with Animated Icon */}
          <div className="text-center mb-8">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
            >
              <Search className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent mb-3">
              Finding Your Leads
            </h1>
            <p className="text-slate-600 text-lg">{status.currentStep}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm font-semibold text-slate-700 mb-3">
              <span>Progress</span>
              <span className="text-indigo-600">{progress}%</span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
              </motion.div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center border border-blue-200"
            >
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-blue-700 mb-1">
                {status.leadsFound}
              </div>
              <div className="text-sm text-blue-600 font-medium">Leads Found</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center border border-purple-200"
            >
              <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-purple-700 mb-1">
                {Math.min(Math.round((progress / 100) * 60), 60)}s
              </div>
              <div className="text-sm text-purple-600 font-medium">Time Remaining</div>
            </motion.div>
          </div>

          {/* Status Steps */}
          <div className="space-y-3">
            <StatusStep
              icon={<Search className="w-4 h-4" />}
              label="Scanning local businesses"
              isComplete={progress > 25}
              isCurrent={progress > 0 && progress <= 25}
            />
            <StatusStep
              icon={<Mail className="w-4 h-4" />}
              label="Finding email addresses"
              isComplete={progress > 50}
              isCurrent={progress > 25 && progress <= 50}
            />
            <StatusStep
              icon={<Globe className="w-4 h-4" />}
              label="Detecting CRM & automation tools"
              isComplete={progress > 75}
              isCurrent={progress > 50 && progress <= 75}
            />
            <StatusStep
              icon={<TrendingUp className="w-4 h-4" />}
              label="Calculating probability scores"
              isComplete={progress === 100}
              isCurrent={progress > 75 && progress < 100}
            />
          </div>
        </motion.div>

        {/* Cancel Button */}
        {progress < 100 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6"
          >
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Cancel and return to dashboard
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/**
 * Status Step Component
 * Shows checkmark, spinner, or pending state with icon
 */
function StatusStep({
  icon,
  label,
  isComplete,
  isCurrent,
}: {
  icon: React.ReactNode;
  label: string;
  isComplete: boolean;
  isCurrent: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 p-3 rounded-lg transition-colors"
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
          isComplete
            ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg'
            : isCurrent
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg animate-pulse'
            : 'bg-slate-200'
        }`}
      >
        {isComplete ? (
          <CheckCircle className="w-5 h-5 text-white" />
        ) : isCurrent ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-white"
          >
            {icon}
          </motion.div>
        ) : (
          <div className="text-slate-400">{icon}</div>
        )}
      </div>
      <span
        className={`text-sm transition-colors ${
          isComplete
            ? 'text-slate-900 font-semibold'
            : isCurrent
            ? 'text-indigo-600 font-semibold'
            : 'text-slate-400'
        }`}
      >
        {label}
      </span>
    </motion.div>
  );
}
