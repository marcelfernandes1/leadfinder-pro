/**
 * Email Finding Service - Hunter.io Integration
 *
 * This service uses Hunter.io API to find email addresses for businesses.
 * Hunter.io searches across the web to find verified email addresses
 * associated with company domains.
 *
 * Expected Success Rate: 50-60% of businesses will have email found
 * This is NORMAL - many small local businesses don't have discoverable emails.
 *
 * API Cost: Paid plans start at /mo for 500 searches
 * Free tier: 50 searches/month (good for testing)
 *
 * Important: Email finding failures should not block the pipeline.
 * Always return null instead of throwing errors.
 */

import axios from 'axios';

/**
 * Interface for Hunter.io email search result
 */
export interface EmailResult {
  email: string | null;
  confidence: number;  // 0-100, how confident Hunter.io is about the email
  firstName?: string;
  lastName?: string;
  position?: string;
  source?: string;  // Where the email was found
}

/**
 * Extracts domain from a full URL or email address
 *
 * @param url - Full URL (e.g., "https://www.example.com/page") or domain ("example.com")
 * @returns Clean domain (e.g., "example.com")
 *
 * @example
 * extractDomain("https://www.example.com/about") // returns "example.com"
 * extractDomain("example.com") // returns "example.com"
 * extractDomain("user@example.com") // returns "example.com"
 */
function extractDomain(url: string): string | null {
  if (!url) return null;

  try {
    // Remove protocol if present
    let domain = url.replace(/^https?:\/\//, '');

    // Remove www. if present
    domain = domain.replace(/^www\./, '');

    // Remove path and query string
    domain = domain.split('/')[0].split('?')[0];

    // If it's an email, extract domain
    if (domain.includes('@')) {
      domain = domain.split('@')[1];
    }

    // Validate domain format (basic check)
    if (!domain.includes('.') || domain.length < 4) {
      return null;
    }

    return domain.toLowerCase();
  } catch (error) {
    console.warn(`[EmailFinder] Failed to extract domain from "${url}":`, error);
    return null;
  }
}

/**
 * Finds an email address for a given domain using Hunter.io
 *
 * This function searches Hunter.io's database for email addresses associated
 * with the given domain. It only returns emails with confidence >= 70.
 *
 * @param websiteUrl - The business website URL or domain
 * @returns Email result with address and confidence, or null if not found
 *
 * @example
 * const result = await findEmail("acme.com");
 * if (result && result.email) {
 *   console.log(`Found email: ${result.email} (confidence: ${result.confidence}%)`);
 * }
 *
 * Note: This function will NOT throw errors. If email finding fails,
 * it returns null. This is intentional - failures are expected and normal.
 */
export async function findEmail(websiteUrl: string): Promise<EmailResult | null> {
  // Validate API key exists
  const apiKey = process.env.HUNTER_IO_API_KEY;
  if (!apiKey) {
    console.error('[EmailFinder] HUNTER_IO_API_KEY environment variable is not set');
    return null;
  }

  // Extract clean domain from URL
  const domain = extractDomain(websiteUrl);
  if (!domain) {
    console.log(`[EmailFinder] Invalid domain format: "${websiteUrl}"`);
    return null;
  }

  console.log(`[EmailFinder] Searching for email at domain: ${domain}`);

  try {
    // Make request to Hunter.io API (Domain Search endpoint)
    const response = await axios.get('https://api.hunter.io/v2/domain-search', {
      params: {
        domain: domain,
        api_key: apiKey,
        limit: 1,  // We only need one email per business
      },
      timeout: 5000,  // 5 second timeout
    });

    // Check if we got results
    const data = response.data?.data;
    if (!data || !data.emails || data.emails.length === 0) {
      console.log(`[EmailFinder] No emails found for domain: ${domain}`);
      return null;
    }

    // Get the first email result
    const emailData = data.emails[0];

    // Hunter.io returns confidence score 0-100
    // Only accept emails with confidence >= 70 to ensure quality
    const confidence = emailData.confidence || 0;
    if (confidence < 70) {
      console.log(`[EmailFinder] Email found but confidence too low (${confidence}%) for domain: ${domain}`);
      return null;
    }

    console.log(`[EmailFinder] ✓ Found email for ${domain}: ${emailData.value} (confidence: ${confidence}%)`);

    return {
      email: emailData.value,
      confidence: confidence,
      firstName: emailData.first_name,
      lastName: emailData.last_name,
      position: emailData.position,
      source: emailData.sources?.[0]?.uri,
    };

  } catch (error) {
    // Don't throw - email finding failures should not crash the pipeline
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        console.warn('[EmailFinder] Rate limit exceeded. Consider upgrading plan or wait.');
      } else if (error.response?.status === 401) {
        console.error('[EmailFinder] Invalid API key. Please check HUNTER_IO_API_KEY.');
      } else {
        console.warn(`[EmailFinder] API error for domain ${domain}:`, error.message);
      }
    } else {
      console.warn(`[EmailFinder] Error finding email for domain ${domain}:`, error);
    }

    return null;
  }
}

/**
 * Verifies if an email address is valid and deliverable
 *
 * This uses Hunter.io's Email Verifier endpoint to check if an email
 * address is valid, exists, and is deliverable.
 *
 * @param email - The email address to verify
 * @returns True if email is valid and deliverable, false otherwise
 *
 * Note: Email verification uses API credits. Use sparingly.
 */
export async function verifyEmail(email: string): Promise<boolean> {
  const apiKey = process.env.HUNTER_IO_API_KEY;
  if (!apiKey) {
    console.error('[EmailFinder] HUNTER_IO_API_KEY environment variable is not set');
    return false;
  }

  if (!email || !email.includes('@')) {
    return false;
  }

  console.log(`[EmailFinder] Verifying email: ${email}`);

  try {
    const response = await axios.get('https://api.hunter.io/v2/email-verifier', {
      params: {
        email: email,
        api_key: apiKey,
      },
      timeout: 5000,
    });

    const data = response.data?.data;
    if (!data) return false;

    // Check verification status
    // Hunter.io returns: 'valid', 'invalid', 'accept_all', 'unknown', 'disposable'
    const status = data.status;
    const isValid = status === 'valid' || status === 'accept_all';

    console.log(`[EmailFinder] Email verification result: ${email} - ${status}`);

    return isValid;

  } catch (error) {
    console.warn(`[EmailFinder] Failed to verify email ${email}:`, error);
    // If verification fails, don't reject the email - just return false
    return false;
  }
}

/**
 * Finds email addresses for multiple domains in batch
 *
 * This is more efficient than calling findEmail() multiple times.
 * It processes all domains but rate limits the requests.
 *
 * @param domains - Array of website URLs or domains
 * @returns Array of email results (nulls for domains with no email found)
 */
export async function findEmailsBatch(domains: string[]): Promise<(EmailResult | null)[]> {
  console.log(`[EmailFinder] Processing batch of ${domains.length} domains`);

  const results: (EmailResult | null)[] = [];

  // Process domains sequentially to avoid rate limiting
  // Add small delay between requests
  for (const domain of domains) {
    const result = await findEmail(domain);
    results.push(result);

    // Wait 200ms between requests to avoid rate limits
    // Hunter.io free tier allows ~10 requests per minute
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  const successCount = results.filter(r => r !== null).length;
  console.log(`[EmailFinder] Batch complete: Found ${successCount}/${domains.length} emails`);

  return results;
}

/**
 * Tests the Hunter.io API connection
 *
 * Use this to verify that the API key is valid and the service is working.
 *
 * @returns True if connection is successful
 */
export async function testConnection(): Promise<boolean> {
  try {
    console.log('[EmailFinder] Testing Hunter.io API connection...');

    // Test with a well-known domain that should have emails
    const result = await findEmail('stripe.com');

    if (result && result.email) {
      console.log('[EmailFinder] ✓ Connection test successful');
      return true;
    }

    console.warn('[EmailFinder] Connection test failed - no email found for test domain');
    return false;
  } catch (error) {
    console.error('[EmailFinder] Connection test failed:', error);
    return false;
  }
}
