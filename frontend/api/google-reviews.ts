import type { VercelRequest, VercelResponse } from '@vercel/node';

export interface PublicGoogleReview {
  id: string;
  authorName: string;
  authorPhoto: string | null;
  authorUri: string | null;
  rating: number;
  text: string;
  relativePublishTime: string;
  publishTime: string | null;
  googleMapsUri: string | null;
}

export interface GoogleReviewsResponse {
  placeId?: string;
  name?: string;
  rating?: number;
  userRatingCount?: number;
  reviewsUri?: string;
  reviews: PublicGoogleReview[];
  error?: string;
}

interface PlacesApiTextSearchResponse {
  places?: Array<{
    id?: string;
    displayName?: { text?: string; languageCode?: string };
    formattedAddress?: string;
    websiteUri?: string;
    nationalPhoneNumber?: string;
    internationalPhoneNumber?: string;
    rating?: number;
    userRatingCount?: number;
    googleMapsUri?: string;
    reviews?: Array<{
      name?: string;
      relativePublishTimeDescription?: string;
      rating?: number;
      text?: { text?: string; languageCode?: string };
      originalText?: { text?: string; languageCode?: string };
      authorAttribution?: {
        displayName?: string;
        uri?: string;
        photoUri?: string;
      };
      publishTime?: string;
      googleMapsUri?: string;
    }>;
  }>;
  [key: string]: unknown;
}

interface PlacesApiDetailsResponse {
  id?: string;
  displayName?: { text?: string; languageCode?: string };
  formattedAddress?: string;
  websiteUri?: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: Array<{
    name?: string;
    relativePublishTimeDescription?: string;
    rating?: number;
    text?: { text?: string; languageCode?: string };
    originalText?: { text?: string; languageCode?: string };
    authorAttribution?: {
      displayName?: string;
      uri?: string;
      photoUri?: string;
    };
    publishTime?: string;
    googleMapsUri?: string;
  }>;
  [key: string]: unknown;
}

const BUSINESS_NAME = 'Clean & Care Pro';
const OFFICIAL_DOMAIN = 'cleancareproservice.com';
const PHONE_DIGITS = '7144731140';
const DEFAULT_REVIEWS_URI = 'https://share.google/PCz0f74BtOPSLcESV';
// Verified Place ID for Clean & Care Pro (allowed to be retained under Google Maps Platform Section 3.2.3(a) Place ID exemption)
const VERIFIED_PLACE_ID = 'ChIJG2Qs6xPfkUYR_s_BSocoxzs';

function normalizePhoneDigits(phone: string | undefined): string {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

export function matchesBusinessIdentity(place: {
  displayName?: { text?: string };
  websiteUri?: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
}): boolean {
  if (!place) return false;

  const displayName = place.displayName?.text?.toLowerCase() || '';
  const nameMatches = displayName.includes('clean') && displayName.includes('care');
  if (!nameMatches) return false;

  const websiteUri = place.websiteUri?.toLowerCase() || '';
  const websiteMatches = websiteUri.includes(OFFICIAL_DOMAIN);

  const nationalPhone = normalizePhoneDigits(place.nationalPhoneNumber);
  const intlPhone = normalizePhoneDigits(place.internationalPhoneNumber);
  const phoneMatches = nationalPhone.includes(PHONE_DIGITS) || intlPhone.includes(PHONE_DIGITS);

  return websiteMatches || phoneMatches;
}

export function normalizeGoogleReviews(
  rawReviews: Array<{
    name?: string;
    relativePublishTimeDescription?: string;
    rating?: number;
    text?: { text?: string };
    originalText?: { text?: string };
    authorAttribution?: {
      displayName?: string;
      uri?: string;
      photoUri?: string;
    };
    publishTime?: string;
    googleMapsUri?: string;
  }> = []
): PublicGoogleReview[] {
  const result: PublicGoogleReview[] = [];

  for (let i = 0; i < rawReviews.length; i++) {
    const r = rawReviews[i];
    if (!r || typeof r !== 'object') continue;

    const rawText = r.originalText?.text || r.text?.text || '';
    const text = typeof rawText === 'string' ? rawText.trim() : '';
    if (!text) continue; // Exclude empty text reviews

    const rawRating = typeof r.rating === 'number' ? r.rating : Number(r.rating);
    const rating = Math.min(Math.max(isNaN(rawRating) ? 5 : Math.round(rawRating), 1), 5);

    const authorName = r.authorAttribution?.displayName?.trim() || 'Google Reviewer';
    const authorPhoto = r.authorAttribution?.photoUri?.trim() || null;
    const authorUri = r.authorAttribution?.uri?.trim() || null;
    const relativePublishTime = r.relativePublishTimeDescription?.trim() || '';
    const publishTime = r.publishTime?.trim() || null;
    const googleMapsUri = r.googleMapsUri?.trim() || null;
    const id = r.name?.trim() || `google-review-${i}-${Date.now()}`;

    result.push({
      id,
      authorName,
      authorPhoto,
      authorUri,
      rating,
      text,
      relativePublishTime,
      publishTime,
      googleMapsUri,
    });

    if (result.length >= 5) break; // Maximum 5 reviews
  }

  return result;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Security headers & Strict no-store Cache-Control per Google Maps Platform TOS Section 3.2.3(a)
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  // Method restriction: Accept only GET
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({
      error: 'Method Not Allowed',
    });
  }

  // Reject unexpected query parameters to prevent cache-busting paid request amplification
  if (req.query && Object.keys(req.query).length > 0) {
    return res.status(400).json({
      error: 'Unexpected query parameters',
    });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!apiKey) {
    return res.status(503).json({
      error: 'Google reviews service temporarily unavailable',
      rating: 5.0,
      userRatingCount: 0,
      reviews: [],
    });
  }

  try {
    const targetPlaceId = process.env.GOOGLE_PLACE_ID?.trim() || VERIFIED_PLACE_ID;
    let placeData: PlacesApiDetailsResponse | null = null;

    // Minimal Fieldmask required for UI and identity validation
    const fieldMask = [
      'id',
      'displayName',
      'formattedAddress',
      'websiteUri',
      'nationalPhoneNumber',
      'internationalPhoneNumber',
      'rating',
      'userRatingCount',
      'googleMapsUri',
      'reviews',
    ].join(',');

    if (targetPlaceId) {
      // Direct Place Details lookup using verified Place ID exception
      const detailsUrl = `https://places.googleapis.com/v1/places/${encodeURIComponent(targetPlaceId)}`;
      const detailsRes = await fetch(detailsUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': fieldMask,
          'User-Agent': 'CleanCarePro-GoogleReviews/1.0',
        },
        signal: AbortSignal.timeout(8000),
      });

      if (detailsRes.ok) {
        const data = (await detailsRes.json()) as PlacesApiDetailsResponse;
        if (data && matchesBusinessIdentity(data)) {
          placeData = data;
        }
      }
    }

    if (!placeData) {
      // Fallback Text Search lookup with includePureServiceAreaBusinesses: true
      const searchUrl = 'https://places.googleapis.com/v1/places:searchText';
      const searchRes = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': fieldMask.split(',').map((f) => `places.${f}`).join(','),
          'User-Agent': 'CleanCarePro-GoogleReviews/1.0',
        },
        body: JSON.stringify({
          textQuery: BUSINESS_NAME,
          includePureServiceAreaBusinesses: true,
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (searchRes.ok) {
        const searchJson = (await searchRes.json()) as PlacesApiTextSearchResponse;
        const places = searchJson.places || [];
        const matched = places.find((p) => matchesBusinessIdentity(p));
        if (matched) {
          placeData = matched;
        }
      }
    }

    if (!placeData) {
      return res.status(503).json({
        error: 'Google reviews service temporarily unavailable',
        rating: 5.0,
        userRatingCount: 0,
        reviews: [],
      });
    }

    const rating = typeof placeData.rating === 'number' ? placeData.rating : 5.0;
    const userRatingCount = typeof placeData.userRatingCount === 'number' ? placeData.userRatingCount : 0;
    const reviewsUri = placeData.googleMapsUri || DEFAULT_REVIEWS_URI;
    const reviews = normalizeGoogleReviews(placeData.reviews);

    return res.status(200).json({
      placeId: placeData.id || undefined,
      name: placeData.displayName?.text || BUSINESS_NAME,
      rating,
      userRatingCount,
      reviewsUri,
      reviews,
    });
  } catch {
    return res.status(503).json({
      error: 'Google reviews service temporarily unavailable',
      rating: 5.0,
      userRatingCount: 0,
      reviews: [],
    });
  }
}
