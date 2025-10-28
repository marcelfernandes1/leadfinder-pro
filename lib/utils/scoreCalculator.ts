/**
 * Probability Score Calculator
 *
 * This module calculates a buying probability score (0-100) for each lead
 * based on various qualification factors. Higher scores indicate better leads.
 *
 * Score Breakdown:
 * - No CRM/automation detected: +40 points (biggest qualifier)
 * - Has website: +15 points
 * - Active on social media (Instagram OR Facebook): +10 points
 * - Email found: +10 points
 * - Phone found: +10 points
 * - Google rating >= 4.0: +10 points
 * - Service-based industry confirmed: +5 points
 *
 * Score Interpretation:
 * - 80-100 (green): High priority - excellent lead quality
 * - 60-79 (yellow): Medium priority - good lead quality
 * - 0-59 (gray): Low priority - missing key qualifiers
 */

/**
 * Interface for lead data used in score calculation
 */
export interface LeadData {
  // Contact information
  website?: string | null;
  email?: string | null;
  phone?: string | null;

  // Social media presence
  instagram?: string | null;
  facebook?: string | null;
  linkedin?: string | null;
  tiktok?: string | null;
  whatsapp?: string | null;

  // CRM/automation detection
  hasAutomation: boolean;

  // Business quality indicators
  googleRating?: number | null;
  industry?: string | null;
  businessType?: string | null;
}

/**
 * Service-based business types that are ideal for CRM/automation
 * These industries typically benefit most from marketing automation
 */
const SERVICE_BASED_INDUSTRIES = [
  // Home services
  'plumber', 'plumbing', 'hvac', 'heating', 'cooling', 'electrician', 'electrical',
  'roofing', 'roofer', 'contractor', 'remodeling', 'renovation', 'painting', 'painter',
  'landscaping', 'landscaper', 'lawn care', 'pest control', 'cleaning', 'maid service',
  'handyman', 'carpenter', 'flooring', 'garage door',

  // Professional services
  'lawyer', 'attorney', 'legal', 'accountant', 'accounting', 'bookkeeping',
  'real estate', 'realtor', 'insurance agent', 'financial advisor', 'consultant',
  'marketing', 'advertising', 'web design', 'web development',

  // Health & wellness
  'dentist', 'dental', 'chiropractor', 'physical therapy', 'massage', 'spa',
  'medical', 'doctor', 'veterinarian', 'vet', 'clinic',

  // Personal services
  'salon', 'hair', 'barber', 'beauty', 'fitness', 'gym', 'personal trainer',
  'photography', 'photographer', 'catering', 'event planning',

  // Automotive
  'auto repair', 'mechanic', 'car wash', 'detailing', 'towing',
];

/**
 * Checks if a business is service-based
 *
 * Service-based businesses are typically better leads because they:
 * 1. Rely heavily on customer relationships
 * 2. Benefit from marketing automation
 * 3. Have higher lifetime customer value
 *
 * @param industry - The industry or business type
 * @returns True if service-based
 */
export function isServiceBased(industry: string | null | undefined): boolean {
  if (!industry) return false;

  const industryLower = industry.toLowerCase();

  // Check if industry matches any of our service-based keywords
  return SERVICE_BASED_INDUSTRIES.some(keyword =>
    industryLower.includes(keyword)
  );
}

/**
 * Calculates the buying probability score for a lead
 *
 * This is a pure function with no side effects - easy to test and reason about.
 * It takes lead data and returns a score from 0-100.
 *
 * @param lead - The lead data to score
 * @returns Probability score from 0-100
 *
 * @example
 * const score = calculateProbabilityScore({
 *   website: "example.com",
 *   email: "contact@example.com",
 *   phone: "+1-555-0100",
 *   hasAutomation: false,
 *   googleRating: 4.5,
 *   industry: "plumber"
 * });
 * // Returns: 100 (perfect score!)
 */
export function calculateProbabilityScore(lead: LeadData): number {
  let score = 0;

  // 1. No CRM/automation detected (BIGGEST qualifier - 40 points)
  // These businesses need our help the most
  if (!lead.hasAutomation) {
    score += 40;
  }

  // 2. Has website (15 points)
  // Shows they're established and serious about their business
  if (lead.website) {
    score += 15;
  }

  // 3. Active on social media (10 points)
  // If they have ANY social presence (Instagram OR Facebook OR other)
  // This shows they understand online marketing
  const hasSocial = Boolean(
    lead.instagram ||
    lead.facebook ||
    lead.linkedin ||
    lead.tiktok
  );
  if (hasSocial) {
    score += 10;
  }

  // 4. Email found (10 points)
  // We can reach them directly for outreach
  if (lead.email) {
    score += 10;
  }

  // 5. Phone found (10 points)
  // Alternative contact method - shows they're reachable
  if (lead.phone) {
    score += 10;
  }

  // 6. Good Google rating (10 points)
  // Rating >= 4.0 indicates a quality, customer-focused business
  // These businesses care about reviews and would benefit from automation
  if (lead.googleRating && lead.googleRating >= 4.0) {
    score += 10;
  }

  // 7. Service-based industry confirmed (5 points)
  // Service businesses benefit most from CRM/automation
  const industry = lead.industry || lead.businessType;
  if (isServiceBased(industry)) {
    score += 5;
  }

  // Ensure score is within valid range (should already be, but just in case)
  return Math.max(0, Math.min(100, score));
}

/**
 * Gets the score category for display purposes
 *
 * @param score - The probability score
 * @returns Category object with label and color
 */
export function getScoreCategory(score: number): {
  label: string;
  color: 'green' | 'yellow' | 'gray';
  priority: 'high' | 'medium' | 'low';
} {
  if (score >= 80) {
    return {
      label: 'High Priority',
      color: 'green',
      priority: 'high',
    };
  }

  if (score >= 60) {
    return {
      label: 'Medium Priority',
      color: 'yellow',
      priority: 'medium',
    };
  }

  return {
    label: 'Low Priority',
    color: 'gray',
    priority: 'low',
  };
}

/**
 * Explains why a lead got their score
 *
 * Useful for showing users why certain leads scored higher/lower.
 * Returns a breakdown of points earned.
 *
 * @param lead - The lead data
 * @returns Array of score factors with points
 */
export function explainScore(lead: LeadData): Array<{ factor: string; points: number; hasIt: boolean }> {
  const factors = [
    {
      factor: 'No CRM/automation detected',
      points: 40,
      hasIt: !lead.hasAutomation,
    },
    {
      factor: 'Has website',
      points: 15,
      hasIt: Boolean(lead.website),
    },
    {
      factor: 'Active on social media',
      points: 10,
      hasIt: Boolean(lead.instagram || lead.facebook || lead.linkedin || lead.tiktok),
    },
    {
      factor: 'Email found',
      points: 10,
      hasIt: Boolean(lead.email),
    },
    {
      factor: 'Phone found',
      points: 10,
      hasIt: Boolean(lead.phone),
    },
    {
      factor: 'Google rating ≥ 4.0',
      points: 10,
      hasIt: Boolean(lead.googleRating && lead.googleRating >= 4.0),
    },
    {
      factor: 'Service-based business',
      points: 5,
      hasIt: isServiceBased(lead.industry || lead.businessType),
    },
  ];

  return factors;
}

/**
 * Calculates scores for multiple leads
 *
 * @param leads - Array of leads to score
 * @returns Array of scores in same order as input
 */
export function calculateScoresBatch(leads: LeadData[]): number[] {
  return leads.map(lead => calculateProbabilityScore(lead));
}

/**
 * Sorts leads by probability score (highest first)
 *
 * @param leads - Array of leads with scores
 * @returns Sorted array (does not mutate original)
 */
export function sortByScore<T extends { probability_score?: number | null }>(leads: T[]): T[] {
  return [...leads].sort((a, b) => {
    const scoreA = a.probability_score ?? 0;
    const scoreB = b.probability_score ?? 0;
    return scoreB - scoreA;  // Highest scores first
  });
}

/**
 * Filters leads by minimum score threshold
 *
 * @param leads - Array of leads with scores
 * @param minScore - Minimum score to include
 * @returns Filtered array
 */
export function filterByMinScore<T extends { probability_score?: number | null }>(
  leads: T[],
  minScore: number
): T[] {
  return leads.filter(lead => (lead.probability_score ?? 0) >= minScore);
}

/**
 * Gets statistics about a set of leads
 *
 * @param leads - Array of leads with scores
 * @returns Statistics object
 */
export function getLeadStatistics<T extends { probability_score?: number | null }>(leads: T[]): {
  total: number;
  highPriority: number;  // 80-100
  mediumPriority: number;  // 60-79
  lowPriority: number;  // 0-59
  averageScore: number;
  medianScore: number;
} {
  const scores = leads.map(l => l.probability_score ?? 0);

  const highPriority = scores.filter(s => s >= 80).length;
  const mediumPriority = scores.filter(s => s >= 60 && s < 80).length;
  const lowPriority = scores.filter(s => s < 60).length;

  const average = scores.length > 0
    ? scores.reduce((sum, s) => sum + s, 0) / scores.length
    : 0;

  const sortedScores = [...scores].sort((a, b) => a - b);
  const median = sortedScores.length > 0
    ? sortedScores[Math.floor(sortedScores.length / 2)]
    : 0;

  return {
    total: leads.length,
    highPriority,
    mediumPriority,
    lowPriority,
    averageScore: Math.round(average),
    medianScore: median,
  };
}
