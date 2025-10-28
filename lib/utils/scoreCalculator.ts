/**
 * Probability Score Calculator
 *
 * Calculates a 0-100 score indicating how likely a business is to buy
 * CRM/marketing automation services.
 *
 * Higher scores = better leads
 * - 80-100 (Green): High priority leads
 * - 60-79 (Yellow): Medium priority leads
 * - 0-59 (Gray): Low priority leads
 */

/**
 * Interface for lead data used in score calculation
 */
export interface LeadData {
  // Contact information availability
  hasWebsite: boolean
  hasEmail: boolean
  hasPhone: boolean
  hasInstagram: boolean
  hasFacebook: boolean
  hasWhatsApp: boolean
  hasLinkedIn: boolean

  // CRM/automation status (most important factor)
  hasAutomation: boolean

  // Business quality indicators
  googleRating?: number
  userRatingsTotal?: number

  // Business type
  industry?: string
  businessTypes?: string[]
}

/**
 * Calculate probability score for a lead
 *
 * @param lead - Lead data with contact info and business details
 * @returns Probability score (0-100)
 *
 * Scoring breakdown:
 * - No CRM/automation detected: +40 points (biggest qualifier)
 * - Has website: +15 points (shows they're established)
 * - Active on social media (Instagram OR Facebook): +10 points (reachable)
 * - Email found: +10 points (can contact them)
 * - Phone found: +10 points (can call them)
 * - Good Google rating (4.0+): +10 points (quality business)
 * - Service-based business: +5 points (target market)
 */
export function calculateProbabilityScore(lead: LeadData): number {
  let score = 0

  // 1. NO CRM/AUTOMATION DETECTED (40 points) - Most important factor
  // This is the primary qualifier - businesses without automation are our target
  if (!lead.hasAutomation) {
    score += 40
  }

  // 2. HAS WEBSITE (15 points)
  // Shows the business is established and professional
  if (lead.hasWebsite) {
    score += 15
  }

  // 3. ACTIVE ON SOCIAL MEDIA (10 points)
  // Indicates they understand digital marketing and are reachable
  if (lead.hasInstagram || lead.hasFacebook) {
    score += 10
  }

  // 4. EMAIL FOUND (10 points)
  // Critical for outreach campaigns
  if (lead.hasEmail) {
    score += 10
  }

  // 5. PHONE NUMBER (10 points)
  // Enables direct calling for warm outreach
  if (lead.hasPhone) {
    score += 10
  }

  // 6. GOOD GOOGLE RATING (10 points)
  // Indicates a quality business worth targeting
  if (lead.googleRating && lead.googleRating >= 4.0) {
    score += 10
  }

  // 7. SERVICE-BASED BUSINESS (5 points)
  // Service businesses are our ideal customer profile
  if (lead.industry && isServiceBasedIndustry(lead.industry)) {
    score += 5
  }

  // Alternative check using Google Places business types
  if (lead.businessTypes && isServiceBasedTypes(lead.businessTypes)) {
    score += 5
  }

  // Ensure score is within 0-100 range
  return Math.max(0, Math.min(100, score))
}

/**
 * Determine if an industry is service-based
 *
 * @param industry - Industry name or description
 * @returns true if the industry is service-based
 */
export function isServiceBasedIndustry(industry: string): boolean {
  const industryLower = industry.toLowerCase()

  const serviceKeywords = [
    'plumber',
    'plumbing',
    'electrician',
    'electrical',
    'contractor',
    'construction',
    'hvac',
    'heating',
    'cooling',
    'repair',
    'maintenance',
    'cleaning',
    'landscaping',
    'lawn',
    'roofing',
    'painting',
    'renovation',
    'remodeling',
    'lawyer',
    'attorney',
    'legal',
    'accounting',
    'accountant',
    'consulting',
    'consultant',
    'marketing',
    'advertising',
    'real estate',
    'realtor',
    'insurance',
    'financial',
    'dental',
    'dentist',
    'doctor',
    'medical',
    'veterinary',
    'vet',
    'salon',
    'spa',
    'fitness',
    'gym',
    'training',
    'tutoring',
    'education',
    'moving',
    'storage',
    'locksmith',
    'security',
    'pest control',
    'auto repair',
    'mechanic',
    'towing',
  ]

  return serviceKeywords.some((keyword) => industryLower.includes(keyword))
}

/**
 * Determine if business types indicate service-based business
 *
 * @param types - Array of Google Places business types
 * @returns true if types indicate service-based business
 */
export function isServiceBasedTypes(types: string[]): boolean {
  const serviceTypes = [
    'plumber',
    'electrician',
    'general_contractor',
    'roofing_contractor',
    'hvac',
    'lawyer',
    'attorney',
    'doctor',
    'dentist',
    'veterinary_care',
    'car_repair',
    'real_estate_agency',
    'insurance_agency',
    'accounting',
    'locksmith',
    'moving_company',
    'spa',
    'beauty_salon',
    'hair_care',
    'gym',
    'personal_trainer',
    'home_goods_store',
    'painter',
    'carpenter',
    'landscaper',
  ]

  return types.some((type) => serviceTypes.includes(type.toLowerCase()))
}

/**
 * Get color category for score (for UI display)
 *
 * @param score - Probability score (0-100)
 * @returns Color category: 'high', 'medium', or 'low'
 */
export function getScoreCategory(score: number): 'high' | 'medium' | 'low' {
  if (score >= 80) return 'high' // Green
  if (score >= 60) return 'medium' // Yellow
  return 'low' // Gray
}

/**
 * Get color code for score category
 *
 * @param category - Score category
 * @returns Tailwind CSS color class
 */
export function getScoreCategoryColor(category: 'high' | 'medium' | 'low'): string {
  switch (category) {
    case 'high':
      return 'bg-green-100 text-green-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'low':
      return 'bg-gray-100 text-gray-800'
  }
}

/**
 * Get score badge with color
 *
 * @param score - Probability score (0-100)
 * @returns Object with score, category, and color class
 */
export function getScoreBadge(score: number): {
  score: number
  category: 'high' | 'medium' | 'low'
  colorClass: string
  label: string
} {
  const category = getScoreCategory(score)
  const colorClass = getScoreCategoryColor(category)

  const labels = {
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority',
  }

  return {
    score,
    category,
    colorClass,
    label: labels[category],
  }
}

/**
 * Explain why a lead got their score
 * Useful for debugging and user transparency
 *
 * @param lead - Lead data
 * @returns Array of score factors with points
 */
export function explainScore(lead: LeadData): Array<{
  factor: string
  points: number
  present: boolean
}> {
  const factors: Array<{ factor: string; points: number; present: boolean }> = []

  factors.push({
    factor: 'No CRM/Automation detected',
    points: 40,
    present: !lead.hasAutomation,
  })

  factors.push({
    factor: 'Has website',
    points: 15,
    present: lead.hasWebsite,
  })

  factors.push({
    factor: 'Active on social media',
    points: 10,
    present: lead.hasInstagram || lead.hasFacebook,
  })

  factors.push({
    factor: 'Email address found',
    points: 10,
    present: lead.hasEmail,
  })

  factors.push({
    factor: 'Phone number available',
    points: 10,
    present: lead.hasPhone,
  })

  factors.push({
    factor: 'Good Google rating (4.0+)',
    points: 10,
    present: Boolean(lead.googleRating && lead.googleRating >= 4.0),
  })

  factors.push({
    factor: 'Service-based business',
    points: 5,
    present: Boolean(
      (lead.industry && isServiceBasedIndustry(lead.industry)) ||
        (lead.businessTypes && isServiceBasedTypes(lead.businessTypes))
    ),
  })

  return factors
}
