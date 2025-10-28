/**
 * Google Maps Places API Service
 *
 * This service integrates with Google Maps Places API to discover local businesses.
 * It handles business search by location, radius, and industry/business type.
 *
 * Expected Results:
 * - Returns 20-60 businesses per search (Google's max is 60)
 * - ~90% of results have phone numbers
 * - ~80% of results have websites
 *
 * Cost:  per 1000 place details requests
 * Free tier:  credit/month (~11,000 requests)
 */

import { Client, PlaceInputType, TextSearchRequest } from '@googlemaps/google-maps-services-js';

// Initialize Google Maps client
const client = new Client({});

/**
 * Interface for a business result from Google Maps
 */
export interface GoogleMapsBusiness {
  placeId: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  businessType?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Interface for search parameters
 */
export interface SearchParams {
  location: string;      // e.g., "Miami, FL" or "90210"
  radius?: number;       // in miles (converted to meters for API)
  businessType?: string; // e.g., "plumber", "hvac", "restaurant"
  maxResults?: number;   // max number of results to return (default: 60)
}

/**
 * Converts miles to meters for Google Maps API
 */
function milesToMeters(miles: number): number {
  return Math.round(miles * 1609.34);
}

/**
 * Searches for businesses using Google Maps Places API
 */
export async function searchBusinesses(params: SearchParams): Promise<GoogleMapsBusiness[]> {
  const { location, radius = 10, businessType, maxResults = 60 } = params;

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_MAPS_API_KEY environment variable is not set');
  }

  const query = businessType
    ? `${businessType} in ${location}`
    : `businesses in ${location}`;

  console.log(`[GoogleMaps] Searching for: "${query}" within ${radius} miles`);

  try {
    const businesses: GoogleMapsBusiness[] = [];
    let nextPageToken: string | undefined;
    let attempts = 0;
    const maxAttempts = 3;

    while (businesses.length < maxResults && attempts < maxAttempts) {
      attempts++;

      const request: TextSearchRequest = {
        params: {
          query,
          key: apiKey,
          ...(radius && {
            location: location,
            radius: milesToMeters(radius),
          }),
          ...(nextPageToken && { pagetoken: nextPageToken }),
        },
      };

      console.log(`[GoogleMaps] Making API request (attempt ${attempts}/${maxAttempts})`);

      const response = await makeRequestWithRetry(request);

      if (!response.data.results || response.data.results.length === 0) {
        console.log('[GoogleMaps] No more results found');
        break;
      }

      console.log(`[GoogleMaps] Found ${response.data.results.length} businesses in this page`);

      for (const place of response.data.results) {
        if (businesses.length >= maxResults) break;

        const details = await getPlaceDetails(place.place_id!, apiKey);

        businesses.push({
          placeId: place.place_id!,
          name: place.name!,
          address: place.formatted_address!,
          phone: details?.formatted_phone_number,
          website: details?.website,
          rating: place.rating,
          businessType: place.types?.[0],
          latitude: place.geometry?.location.lat,
          longitude: place.geometry?.location.lng,
        });
      }

      nextPageToken = response.data.next_page_token;

      if (nextPageToken && businesses.length < maxResults) {
        console.log('[GoogleMaps] Waiting 2 seconds before fetching next page...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        break;
      }
    }

    console.log(`[GoogleMaps] Search complete: Found ${businesses.length} businesses`);
    return businesses;

  } catch (error) {
    console.error('[GoogleMaps] Search failed:', error);
    throw new Error(`Google Maps search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function getPlaceDetails(placeId: string, apiKey: string) {
  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        key: apiKey,
        fields: ['formatted_phone_number', 'website', 'name'],
      },
    });

    return response.data.result;
  } catch (error) {
    console.warn(`[GoogleMaps] Failed to get details for place ${placeId}:`, error);
    return null;
  }
}

async function makeRequestWithRetry(request: TextSearchRequest, maxRetries = 3) {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await client.textSearch(request);

      if (response.data.status === 'OK' || response.data.status === 'ZERO_RESULTS') {
        return response;
      }

      if (response.data.status === 'OVER_QUERY_LIMIT') {
        throw new Error('Google Maps API quota exceeded');
      }

      if (response.data.status === 'REQUEST_DENIED') {
        throw new Error('Google Maps API request denied');
      }

      if (response.data.status === 'INVALID_REQUEST') {
        throw new Error('Invalid request to Google Maps API');
      }

      throw new Error(`Google Maps API returned status: ${response.data.status}`);

    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.warn(`[GoogleMaps] Request attempt ${attempt}/${maxRetries} failed:`, lastError.message);

      if (attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt - 1) * 1000;
        console.log(`[GoogleMaps] Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError || new Error('Failed to complete Google Maps request after multiple retries');
}

export async function testConnection(): Promise<boolean> {
  try {
    console.log('[GoogleMaps] Testing API connection...');

    const results = await searchBusinesses({
      location: 'Miami, FL',
      businessType: 'restaurant',
      maxResults: 1,
    });

    console.log('[GoogleMaps] Connection test successful');
    return results.length > 0;
  } catch (error) {
    console.error('[GoogleMaps] Connection test failed:', error);
    return false;
  }
}
