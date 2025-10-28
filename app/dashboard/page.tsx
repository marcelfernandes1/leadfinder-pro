/**
 * Dashboard Page
 *
 * Main page for viewing leads from completed searches.
 * Features:
 * - Display leads in card format with contact information
 * - Filter by score range, email, phone, social media
 * - Sort by score, name, or date
 * - Status tracking for each lead
 * - Export to CSV
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Filter,
  Download,
  Search,
  Mail,
  Phone,
  Globe,
  Star,
  Sparkles,
  TrendingUp,
  Settings,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// Force dynamic rendering to avoid pre-render issues with useSearchParams
export const dynamic = 'force-dynamic';

interface Lead {
  id: string;
  business_name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  whatsapp: string | null;
  linkedin: string | null;
  tiktok: string | null;
  google_rating: number | null;
  has_automation: boolean;
  probability_score: number | null;
  created_at: string;
}

interface SearchInfo {
  id: string;
  location: string;
  industry: string | null;
  status: string;
  createdAt: string;
}

/**
 * Navbar Component
 * Professional navigation bar with user avatar and dropdown
 */
function Navbar() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  return (
    <nav className="border-b border-slate-200/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              LeadFinder Pro
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => router.push('/search')}
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>New Search</span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2"
                  >
                    <button
                      onClick={() => router.push('/account')}
                      className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center space-x-2 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => router.push('/auth/logout')}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Dashboard content component that uses useSearchParams
function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchId = searchParams.get('search');

  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchInfo, setSearchInfo] = useState<SearchInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(100);
  const [hasEmail, setHasEmail] = useState(false);
  const [hasPhone, setHasPhone] = useState(false);
  const [sortBy, setSortBy] = useState('probability_score');
  const [sortOrder, setSortOrder] = useState('desc');

  // Fetch leads
  useEffect(() => {
    if (!searchId) {
      setError('No search selected');
      setLoading(false);
      return;
    }

    fetchLeads();
  }, [searchId, minScore, maxScore, hasEmail, hasPhone, sortBy, sortOrder]);

  async function fetchLeads() {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        minScore: minScore.toString(),
        maxScore: maxScore.toString(),
        sortBy,
        sortOrder,
      });

      if (hasEmail) params.append('hasEmail', 'true');
      if (hasPhone) params.append('hasPhone', 'true');

      const response = await fetch(`/api/search/${searchId}/results?${params}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError('Search not found');
        } else if (response.status === 401) {
          router.push('/auth/login');
          return;
        } else {
          setError('Failed to fetch leads');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setLeads(data.leads || []);
      setSearchInfo(data.search);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
      setError('An error occurred while fetching leads');
    } finally {
      setLoading(false);
    }
  }

  // Export to CSV
  function exportToCSV() {
    if (leads.length === 0) return;

    const headers = [
      'Business Name',
      'Phone',
      'Email',
      'Website',
      'Address',
      'Score',
      'Has CRM',
      'Instagram',
      'Facebook',
      'LinkedIn',
      'Rating',
    ];

    const rows = leads.map((lead) => [
      lead.business_name,
      lead.phone || '',
      lead.email || '',
      lead.website || '',
      lead.address || '',
      lead.probability_score || '',
      lead.has_automation ? 'Yes' : 'No',
      lead.instagram || '',
      lead.facebook || '',
      lead.linkedin || '',
      lead.google_rating || '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${searchId}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
              <Sparkles className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-slate-600 font-medium">Loading your leads...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md mx-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Oops!</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/search')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Start New Search
            </button>
          </div>
        </div>
      </>
    );
  }

  const highPriorityCount = leads.filter((l) => (l.probability_score || 0) >= 80).length;
  const mediumPriorityCount = leads.filter((l) => (l.probability_score || 0) >= 60 && (l.probability_score || 0) < 80).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      {/* Header with Stats */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent mb-2">
                Your Leads
              </h1>
              {searchInfo && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Target className="w-4 h-4" />
                  <p className="text-sm">
                    {searchInfo.location}
                    {searchInfo.industry && ` • ${searchInfo.industry}`}
                  </p>
                </div>
              )}
            </div>

            {/* Stats Cards */}
            <div className="flex gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl px-4 py-3 border border-green-200">
                <div className="text-2xl font-bold text-green-700">{highPriorityCount}</div>
                <div className="text-xs text-green-600">High Priority</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl px-4 py-3 border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-700">{mediumPriorityCount}</div>
                <div className="text-xs text-yellow-600">Medium</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl px-4 py-3 border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">{leads.length}</div>
                <div className="text-xs text-blue-600">Total Leads</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all font-medium"
            >
              <Filter className="w-4 h-4" />
              <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
            </button>
            <button
              onClick={exportToCSV}
              disabled={leads.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
                  </div>
                  <button
                    onClick={() => {
                      setMinScore(0);
                      setMaxScore(100);
                      setHasEmail(false);
                      setHasPhone(false);
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Reset All
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Score Range */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Score Range: {minScore} - {maxScore}
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={minScore}
                        onChange={(e) => setMinScore(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={maxScore}
                        onChange={(e) => setMaxScore(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                  </div>

                  {/* Contact Filters */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Contact Info
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={hasEmail}
                          onChange={(e) => setHasEmail(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="ml-3 text-sm text-slate-600 group-hover:text-slate-900">Has Email</span>
                      </label>
                      <label className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={hasPhone}
                          onChange={(e) => setHasPhone(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="ml-3 text-sm text-slate-600 group-hover:text-slate-900">Has Phone</span>
                      </label>
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-700"
                    >
                      <option value="probability_score">Probability Score</option>
                      <option value="business_name">Business Name</option>
                      <option value="created_at">Date Added</option>
                      <option value="google_rating">Google Rating</option>
                    </select>
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Order
                    </label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-700"
                    >
                      <option value="desc">Highest First</option>
                      <option value="asc">Lowest First</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leads Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {leads.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-16 text-center border border-slate-200"
          >
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No leads found</h3>
            <p className="text-slate-600 mb-6">Try adjusting your filters or start a new search</p>
            <button
              onClick={() => {
                setMinScore(0);
                setMaxScore(100);
                setHasEmail(false);
                setHasPhone(false);
              }}
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {leads.map((lead, index) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.4 }}
              >
                <LeadCard lead={lead} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Lead Card Component
 * Displays individual lead information with contact details and score
 */
function LeadCard({ lead }: { lead: Lead }) {
  const score = lead.probability_score || 0;

  // Determine score styling
  const scoreColor = score >= 80
    ? 'from-green-500 to-emerald-600'
    : score >= 60
    ? 'from-yellow-500 to-amber-600'
    : 'from-slate-400 to-slate-500';

  const scoreBgColor = score >= 80
    ? 'from-green-50 to-emerald-50 border-green-200'
    : score >= 60
    ? 'from-yellow-50 to-amber-50 border-yellow-200'
    : 'from-slate-50 to-slate-100 border-slate-200';

  const scoreLabel = score >= 80 ? 'High Priority' : score >= 60 ? 'Medium Priority' : 'Low Priority';

  return (
    <motion.div
      whileHover={{ y: -4, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-slate-200 relative overflow-hidden group"
    >
      {/* Gradient accent bar */}
      <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", scoreColor)} />

      {/* Header with Score Badge */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 pr-4">
          <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
            {lead.business_name}
          </h3>
          {lead.address && (
            <p className="text-sm text-slate-500 line-clamp-2">{lead.address}</p>
          )}
        </div>

        {/* Score Badge */}
        <div className={cn("bg-gradient-to-br rounded-xl px-4 py-2 border shadow-sm", scoreBgColor)}>
          <div className={cn("text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent", scoreColor)}>
            {score}
          </div>
          <div className="text-xs font-medium text-slate-600 text-center">Score</div>
        </div>
      </div>

      {/* Priority Label */}
      <div className="mb-5">
        <span className={cn(
          "inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold",
          score >= 80 ? "bg-green-100 text-green-700" : score >= 60 ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-600"
        )}>
          <TrendingUp className="w-3 h-3" />
          <span>{scoreLabel}</span>
        </span>
        {!lead.has_automation && (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 ml-2">
            <Sparkles className="w-3 h-3" />
            <span>No CRM</span>
          </span>
        )}
      </div>

      {/* Contact Information */}
      <div className="space-y-3 mb-5">
        {lead.phone && (
          <a
            href={`tel:${lead.phone}`}
            className="flex items-center gap-3 text-sm group/item hover:bg-slate-50 p-2 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-slate-700 group-hover/item:text-indigo-600 font-medium">{lead.phone}</span>
          </a>
        )}
        {lead.email && (
          <a
            href={`mailto:${lead.email}`}
            className="flex items-center gap-3 text-sm group/item hover:bg-slate-50 p-2 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-slate-700 group-hover/item:text-indigo-600 font-medium truncate">{lead.email}</span>
          </a>
        )}
        {lead.website && (
          <a
            href={lead.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm group/item hover:bg-slate-50 p-2 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Globe className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-slate-700 group-hover/item:text-indigo-600 font-medium truncate">
              {lead.website.replace(/^https?:\/\//, '')}
            </span>
          </a>
        )}
      </div>

      {/* Social Media & Additional Info */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        {/* Social Links */}
        <div className="flex gap-2">
          {lead.instagram && (
            <a
              href={lead.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg hover:scale-110 transition-transform flex items-center justify-center shadow-md"
              title="Instagram"
            >
              <span className="text-sm font-bold">IG</span>
            </a>
          )}
          {lead.facebook && (
            <a
              href={lead.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-blue-600 text-white rounded-lg hover:scale-110 transition-transform flex items-center justify-center shadow-md"
              title="Facebook"
            >
              <span className="text-sm font-bold">FB</span>
            </a>
          )}
          {lead.linkedin && (
            <a
              href={lead.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-blue-700 text-white rounded-lg hover:scale-110 transition-transform flex items-center justify-center shadow-md"
              title="LinkedIn"
            >
              <span className="text-sm font-bold">in</span>
            </a>
          )}
        </div>

        {/* Google Rating */}
        {lead.google_rating && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold text-slate-700">{lead.google_rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Main dashboard page with Suspense boundary
export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
