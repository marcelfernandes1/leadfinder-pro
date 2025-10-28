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
import { motion } from 'framer-motion';

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

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchId = searchParams.get('search');

  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchInfo, setSearchInfo] = useState<SearchInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leads...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-4">{error}</div>
          <button
            onClick={() => router.push('/search')}
            className="text-indigo-600 hover:text-indigo-800"
          >
            ← Start New Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Leads</h1>
              {searchInfo && (
                <p className="mt-1 text-sm text-gray-500">
                  {searchInfo.location}
                  {searchInfo.industry && ` • ${searchInfo.industry}`}
                </p>
              )}
            </div>
            <div className="mt-4 sm:mt-0 flex gap-3">
              <button
                onClick={() => router.push('/search')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                New Search
              </button>
              <button
                onClick={exportToCSV}
                disabled={leads.length === 0}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Score Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Score Range: {minScore} - {maxScore}
              </label>
              <div className="flex gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  className="flex-1"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={maxScore}
                  onChange={(e) => setMaxScore(Number(e.target.value))}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Contact Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Info
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hasEmail}
                    onChange={(e) => setHasEmail(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Has Email</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hasPhone}
                    onChange={(e) => setHasPhone(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Has Phone</span>
                </label>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="probability_score">Probability Score</option>
                <option value="business_name">Business Name</option>
                <option value="created_at">Date Added</option>
                <option value="google_rating">Google Rating</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="desc">Highest First</option>
                <option value="asc">Lowest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{leads.length}</span> leads
          </p>
        </div>

        {/* Leads Grid */}
        {leads.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No leads match your filters</p>
            <button
              onClick={() => {
                setMinScore(0);
                setMaxScore(100);
                setHasEmail(false);
                setHasPhone(false);
              }}
              className="mt-4 text-indigo-600 hover:text-indigo-800"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {leads.map((lead, index) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
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
  const scoreColor = score >= 80 ? 'bg-green-100 text-green-700' : score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600';
  const scoreLabel = score >= 80 ? 'High Priority' : score >= 60 ? 'Medium' : 'Low Priority';

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
      {/* Header with Score */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {lead.business_name}
          </h3>
          {lead.address && (
            <p className="text-sm text-gray-500">{lead.address}</p>
          )}
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${scoreColor}`}>
          {score}
        </div>
      </div>

      {/* Score Label */}
      <div className="mb-4">
        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${scoreColor}`}>
          {scoreLabel}
        </span>
      </div>

      {/* Contact Information */}
      <div className="space-y-2 mb-4">
        {lead.phone && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">📞</span>
            <a href={`tel:${lead.phone}`} className="text-indigo-600 hover:underline">
              {lead.phone}
            </a>
          </div>
        )}
        {lead.email && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">📧</span>
            <a href={`mailto:${lead.email}`} className="text-indigo-600 hover:underline">
              {lead.email}
            </a>
          </div>
        )}
        {lead.website && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">🌐</span>
            <a
              href={lead.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline truncate"
            >
              {lead.website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
      </div>

      {/* Social Media Links */}
      <div className="flex gap-2 mb-4">
        {lead.instagram && (
          <a
            href={lead.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90"
            title="Instagram"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
            </svg>
          </a>
        )}
        {lead.facebook && (
          <a
            href={lead.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-blue-600 text-white rounded-lg hover:opacity-90"
            title="Facebook"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
        )}
        {lead.linkedin && (
          <a
            href={lead.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-blue-700 text-white rounded-lg hover:opacity-90"
            title="LinkedIn"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        )}
      </div>

      {/* Additional Info */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          {lead.google_rating && (
            <span>⭐ {lead.google_rating.toFixed(1)}</span>
          )}
          {lead.has_automation && (
            <span className="text-red-600">🤖 Has CRM</span>
          )}
          {!lead.has_automation && (
            <span className="text-green-600">✨ No CRM</span>
          )}
        </div>
      </div>
    </div>
  );
}
