/**
 * CRM/Marketing Automation Detection Service
 *
 * This service scrapes business websites to detect if they're using
 * CRM or marketing automation tools. This is a key qualifier - businesses
 * WITHOUT automation are higher priority leads.
 *
 * Detection Method: Analyzes website HTML for common CRM/automation scripts and tracking pixels
 *
 * Expected Success Rate: 70-80% of websites will be reachable and scannable
 * Failures are normal - websites can be slow, unreachable, or block scraping
 *
 * Important: Website scraping failures should NOT block the pipeline.
 * If a website can't be reached, assume NO CRM (return false).
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Interface for CRM detection result
 */
export interface CRMDetectionResult {
  hasAutomation: boolean;        // True if any CRM/automation detected
  detectedTools: string[];       // List of detected tool names
  confidence: number;            // 0-100, how confident we are in the detection
  checkedAt: Date;               // When the check was performed
}

/**
 * List of CRM and marketing automation tools to detect
 * Each entry contains the tool name and patterns to look for in the HTML
 */
const CRM_PATTERNS = [
  {
    name: 'HubSpot',
    patterns: ['hs-scripts.com', 'hsforms.net', 'hubspot.com/api', 'hbspt.forms', '_hsq'],
  },
  {
    name: 'Mailchimp',
    patterns: ['list-manage.com', 'mc.js', 'mailchimp.com', 'chimpstatic.com'],
  },
  {
    name: 'ActiveCampaign',
    patterns: ['activehosted.com', 'activecampaign.com', 'actid', 'vgo('],
  },
  {
    name: 'Klaviyo',
    patterns: ['klaviyo.com', 'klaviyo', 'static.klaviyo.com'],
  },
  {
    name: 'ConvertKit',
    patterns: ['convertkit.com', 'ck.page', 'app.convertkit.com'],
  },
  {
    name: 'Drip',
    patterns: ['drip.com', 'getdrip.com', '_dcq'],
  },
  {
    name: 'Constant Contact',
    patterns: ['constantcontact.com', 'ctctcdn.com'],
  },
  {
    name: 'SendGrid',
    patterns: ['sendgrid.net', 'sendgrid.com'],
  },
  {
    name: 'Intercom',
    patterns: ['intercom.io', 'intercom.com', 'widget.intercom.io', 'Intercom('],
  },
  {
    name: 'Drift',
    patterns: ['drift.com', 'driftt.com', 'js.driftt.com'],
  },
  {
    name: 'Salesforce',
    patterns: ['salesforce.com', 'pardot.com', 'force.com'],
  },
  {
    name: 'Marketo',
    patterns: ['marketo.com', 'munchkin', 'marketo.net'],
  },
  {
    name: 'GetResponse',
    patterns: ['getresponse.com', 'gr-api'],
  },
  {
    name: 'MailerLite',
    patterns: ['mailerlite.com', 'ml-cdn.com'],
  },
  {
    name: 'AWeber',
    patterns: ['aweber.com', 'forms.aweber.com'],
  },
];

/**
 * Detects CRM and marketing automation tools on a website
 *
 * This function fetches the website HTML and searches for known CRM scripts
 * and tracking pixels. It handles timeouts, errors, and unreachable sites gracefully.
 *
 * @param websiteUrl - The business website URL
 * @returns Detection result with tools found and confidence score
 *
 * @example
 * const result = await detectCRM("https://example.com");
 * if (result.hasAutomation) {
 *   console.log(`Found automation tools: ${result.detectedTools.join(', ')}`);
 * } else {
 *   console.log('No automation detected - good lead!');
 * }
 *
 * Note: If website can't be reached, returns { hasAutomation: false }
 * This is intentional - unreachable sites don't block the pipeline.
 */
export async function detectCRM(websiteUrl: string): Promise<CRMDetectionResult> {
  const defaultResult: CRMDetectionResult = {
    hasAutomation: false,
    detectedTools: [],
    confidence: 0,
    checkedAt: new Date(),
  };

  // Validate URL
  if (!websiteUrl || typeof websiteUrl !== 'string') {
    console.log('[CRMDetector] Invalid website URL provided');
    return defaultResult;
  }

  // Ensure URL has protocol
  let url = websiteUrl;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  console.log(`[CRMDetector] Checking website: ${url}`);

  try {
    // Fetch website HTML with 10 second timeout
    // Some small business websites are slow - be patient but not too patient
    const response = await axios.get(url, {
      timeout: 10000,  // 10 seconds
      maxRedirects: 5,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      validateStatus: (status) => status < 400,  // Accept any non-error status
    });

    // Get HTML content
    const html = response.data;
    if (!html || typeof html !== 'string') {
      console.log(`[CRMDetector] No HTML content received from ${url}`);
      return defaultResult;
    }

    // Parse HTML with cheerio
    const $ = cheerio.load(html);

    // Get all script tags and HTML content for analysis
    const scripts = .map((i, el) => .html() || '').get().join(' ');
    const fullHtml = html.toLowerCase();

    // Check for each CRM tool
    const detectedTools: string[] = [];
    const matches: { tool: string; matchCount: number }[] = [];

    for (const tool of CRM_PATTERNS) {
      let matchCount = 0;

      // Check if any of this tool's patterns exist in the HTML
      for (const pattern of tool.patterns) {
        const patternLower = pattern.toLowerCase();

        // Check in scripts
        if (scripts.toLowerCase().includes(patternLower)) {
          matchCount++;
        }

        // Check in full HTML
        if (fullHtml.includes(patternLower)) {
          matchCount++;
        }
      }

      // If we found at least 2 matches (for confidence), consider it detected
      if (matchCount >= 2) {
        detectedTools.push(tool.name);
        matches.push({ tool: tool.name, matchCount });
      }
    }

    // Calculate confidence based on number of matches
    let confidence = 0;
    if (detectedTools.length > 0) {
      // Average match count across detected tools
      const avgMatches = matches.reduce((sum, m) => sum + m.matchCount, 0) / matches.length;
      confidence = Math.min(Math.round((avgMatches / 5) * 100), 100);
    }

    const hasAutomation = detectedTools.length > 0;

    if (hasAutomation) {
      console.log(`[CRMDetector] ✓ Found automation on ${url}: ${detectedTools.join(', ')} (confidence: ${confidence}%)`);
    } else {
      console.log(`[CRMDetector] ✓ No automation detected on ${url} - good lead!`);
    }

    return {
      hasAutomation,
      detectedTools,
      confidence,
      checkedAt: new Date(),
    };

  } catch (error) {
    // Don't throw - website issues should not crash the pipeline
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.log(`[CRMDetector] Timeout checking ${url} (website too slow)`);
      } else if (error.code === 'ENOTFOUND') {
        console.log(`[CRMDetector] Website not found: ${url}`);
      } else if (error.response?.status === 403 || error.response?.status === 401) {
        console.log(`[CRMDetector] Access denied to ${url} (blocked or requires auth)`);
      } else {
        console.log(`[CRMDetector] Error checking ${url}: ${error.message}`);
      }
    } else {
      console.log(`[CRMDetector] Unexpected error checking ${url}:`, error);
    }

    // Return default (no automation) if website can't be checked
    // This ensures unreachable websites don't get marked as having automation
    return defaultResult;
  }
}

/**
 * Checks multiple websites for CRM tools in batch
 *
 * Processes all websites but adds small delays to avoid hammering servers.
 *
 * @param websiteUrls - Array of website URLs to check
 * @returns Array of detection results
 */
export async function detectCRMBatch(websiteUrls: string[]): Promise<CRMDetectionResult[]> {
  console.log(`[CRMDetector] Processing batch of ${websiteUrls.length} websites`);

  const results: CRMDetectionResult[] = [];

  // Process websites sequentially with small delays
  // This prevents overwhelming servers and getting blocked
  for (const url of websiteUrls) {
    const result = await detectCRM(url);
    results.push(result);

    // Wait 500ms between requests to be respectful
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  const automationCount = results.filter(r => r.hasAutomation).length;
  console.log(`[CRMDetector] Batch complete: Found automation on ${automationCount}/${websiteUrls.length} websites`);

  return results;
}

/**
 * Tests the CRM detector with a known website
 *
 * Use this to verify the detector is working correctly.
 *
 * @returns True if test passes
 */
export async function testDetection(): Promise<boolean> {
  try {
    console.log('[CRMDetector] Testing CRM detection...');

    // Test with a website known to use HubSpot
    const result = await detectCRM('https://www.hubspot.com');

    if (result.hasAutomation && result.detectedTools.includes('HubSpot')) {
      console.log('[CRMDetector] ✓ Test passed - correctly detected HubSpot');
      return true;
    }

    console.warn('[CRMDetector] Test failed - did not detect expected automation');
    return false;
  } catch (error) {
    console.error('[CRMDetector] Test failed:', error);
    return false;
  }
}

/**
 * Gets a cached result for a domain to avoid re-checking
 * (To be implemented with actual caching later)
 *
 * @param domain - The domain to check cache for
 * @returns Cached result or null
 */
export async function getCachedResult(domain: string): Promise<CRMDetectionResult | null> {
  // TODO: Implement caching using Redis or database
  // For now, always return null (no cache)
  return null;
}

/**
 * Saves a detection result to cache
 * (To be implemented with actual caching later)
 *
 * @param domain - The domain
 * @param result - The detection result to cache
 */
export async function cacheResult(domain: string, result: CRMDetectionResult): Promise<void> {
  // TODO: Implement caching using Redis or database
  // For now, do nothing
}
