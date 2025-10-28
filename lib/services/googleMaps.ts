/**
 * Google Maps Places API Service
 *
 * Integrates with Google Maps Places API to discover local businesses.
 * This is the primary data source for lead discovery.
 *
 * Expected coverage:
 * - ~90% of businesses have phone numbers
 * - ~80% of businesses have websites
 * - Google returns max 60 results per search
 *
 * API Documentation: https://developers.google.com/maps/documentation/places/web-service
 */

import { Client, PlaceData } from '@googlemaps/google-maps-services-js'

// Initialize Google Maps client
const googleMapsClient = new Client({})

/**
 * Interface for business data returned from Google Maps
 */
export interface GoogleMapsBusiness {
  placeId: string
  name: string
  address?: string
  phone?: string
  website?: string
  rating?: number
  userRatingsTotal?: number
  types?: string[]
  location?: {
    lat: number
    lng: number
  }
}

/**
 * Search for businesses using Google Maps Places API
 *
 * @param location - Location to search (e.g., "Miami, FL" or "New York, NY")
 * @param businessType - Optional business type/industry (e.g., "plumber", "restaurant")
 * @param radius - Search radius in meters (default: 16093 = 10 miles)
 * @returns Array of businesses with contact information
 *
 * Note: Google Places API returns maximum 60 results per search.
 * For more results, you need to make multiple searches with different locations.
 */
export async function searchBusinesses(
  location: string,
  businessType?: string,
  radius: number = 16093 // 10 miles in meters
): Promise<GoogleMapsBusiness[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    throw new Error('GOOGLE_MAPS_API_KEY is not configured')
  }

  try {
    // Step 1: Geocode the location to get coordinates
    console.log(`🗺️  Geocoding location: ${location}`)
    const geocodeResponse = await googleMapsClient.geocode({
      params: {
        address: location,
        key: apiKey,
      },
    })

    if (!geocodeResponse.data.results || geocodeResponse.data.results.length === 0) {
      throw new Error(`Could not geocode location: ${location}`)
    }

    const locationCoords = geocodeResponse.data.results[0].geometry.location
    console.log(`📍 Coordinates: ${locationCoords.lat}, ${locationCoords.lng}`)

    // Step 2: Search for nearby businesses
    // Build the query - combine business type with general service-based keywords
    let query = businessType || 'business'

    // Add service-based business indicators if no specific type provided
    if (!businessType) {
      query = 'service business local company'
    }

    console.log(`🔍 Searching for: "${query}" within ${radius}m radius`)

    const placesResponse = await googleMapsClient.textSearch({
      params: {
        query,
        location: locationCoords,
        radius,
        key: apiKey,
      },
    })

    const places = placesResponse.data.results || []
    console.log(`✅ Found ${places.length} businesses from Google Maps`)

    // Step 3: Get detailed information for each place
    // We need to make individual Place Details requests to get phone, website, etc.
    const businesses: GoogleMapsBusiness[] = []

    for (const place of places) {
      try {
        // Get place details to retrieve phone number and website
        const detailsResponse = await googleMapsClient.placeDetails({
          params: {
            place_id: place.place_id!,
            fields: [
              'name',
              'formatted_address',
              'formatted_phone_number',
              'website',
              'rating',
              'user_ratings_total',
              'types',
              'geometry',
            ],
            key: apiKey,
          },
        })

        const details = detailsResponse.data.result

        if (!details) continue

        businesses.push({
          placeId: place.place_id!,
          name: details.name || 'Unknown Business',
          address: details.formatted_address,
          phone: details.formatted_phone_number,
          website: details.website,
          rating: details.rating,
          userRatingsTotal: details.user_ratings_total,
          types: details.types,
          location: details.geometry?.location
            ? {
                lat: details.geometry.location.lat,
                lng: details.geometry.location.lng,
              }
            : undefined,
        })

        // Small delay to respect rate limits (optional)
        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`Failed to get details for place ${place.place_id}:`, error)
        // Continue with other places even if one fails
        continue
      }
    }

    console.log(`📊 Enriched ${businesses.length} businesses with details`)

    // Filter out businesses without basic information
    const validBusinesses = businesses.filter((b) => b.name && (b.phone || b.website))

    console.log(`✨ Returning ${validBusinesses.length} businesses with contact info`)

    return validBusinesses
  } catch (error) {
    console.error('Google Maps API error:', error)
    throw new Error(
      `Failed to search businesses: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Extract domain from website URL for email finding
 *
 * @param websiteUrl - Full website URL (e.g., "https://example.com/page")
 * @returns Clean domain (e.g., "example.com")
 */
export function extractDomain(websiteUrl: string): string | null {
  try {
    const url = new URL(websiteUrl)
    // Remove www. prefix if present
    return url.hostname.replace(/^www\./, '')
  } catch {
    // If URL parsing fails, try basic string manipulation
    const match = websiteUrl.match(/(?:https?:\/\/)?(?:www\.)?([^\/\?]+)/)
    return match ? match[1] : null
  }
}

/**
 * Determine if a business type is service-based
 * Service-based businesses are more likely to need CRM/automation tools
 *
 * @param types - Array of Google Places business types
 * @returns true if the business is likely service-based
 */
export function isServiceBased(types?: string[]): boolean {
  if (!types || types.length === 0) return false

  const serviceTypes = [
    'plumber',
    'electrician',
    'contractor',
    'lawyer',
    'attorney',
    'doctor',
    'dentist',
    'veterinary_care',
    'car_repair',
    'home_goods_store',
    'real_estate_agency',
    'insurance_agency',
    'travel_agency',
    'accounting',
    'locksmith',
    'roofing_contractor',
    'general_contractor',
    'hvac',
    'moving_company',
    'spa',
    'beauty_salon',
    'hair_care',
    'gym',
    'personal_trainer',
  ]

  return types.some((type) => serviceTypes.includes(type))
}
