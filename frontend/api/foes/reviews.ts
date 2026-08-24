import type { VercelRequest, VercelResponse } from '@vercel/node';

interface RawReviewItem {
  id?: unknown;
  reviewer_name?: unknown;
  name?: unknown;
  rating?: unknown;
  message?: unknown;
  text?: unknown;
  service_type?: unknown;
  service?: unknown;
  created_at?: unknown;
  createdAt?: unknown;
  is_featured?: unknown;
  isFeatured?: unknown;
  [key: string]: unknown;
}

export interface SanitizedPublicReview {
  id: string;
  reviewer_name: string;
  rating: number;
  message: string;
  service_type: string | null;
  created_at: string;
  is_featured: boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{1,20}$/;
const MAX_PAYLOAD_SIZE_BYTES = 16384; // 16 KB

function getEnvConfig() {
  const apiUrl = (process.env.FOES_API_URL || 'https://app.foes.pro').replace(/\/+$/, '');
  const formKey = process.env.FOES_PUBLIC_FORM_KEY?.trim();
  return { apiUrl, formKey };
}

function sanitizeString(val: unknown, maxLen: number): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLen);
}

function normalizeReview(item: RawReviewItem, idx: number): SanitizedPublicReview | null {
  if (!item || typeof item !== 'object') return null;

  const rawRating = typeof item.rating === 'number' ? item.rating : Number(item.rating);
  const rating = Math.min(Math.max(Math.round(isNaN(rawRating) ? 5 : rawRating), 1), 5);

  const rawName = typeof item.reviewer_name === 'string' ? item.reviewer_name : (typeof item.name === 'string' ? item.name : '');
  const reviewer_name = rawName.trim().slice(0, 120) || 'Verified Client';

  const rawMessage = typeof item.message === 'string' ? item.message : (typeof item.text === 'string' ? item.text : '');
  const message = rawMessage.trim().slice(0, 1000);
  if (!message) return null;

  const rawService = typeof item.service_type === 'string' ? item.service_type : (typeof item.service === 'string' ? item.service : null);
  const service_type = rawService ? rawService.trim().slice(0, 100) : null;

  const rawDate = typeof item.created_at === 'string' ? item.created_at : (typeof item.createdAt === 'string' ? item.createdAt : null);
  const created_at = rawDate ? new Date(rawDate).toISOString() : new Date().toISOString();

  const is_featured = Boolean(item.is_featured ?? item.isFeatured);
  const id = typeof item.id === 'string' && item.id.trim() ? item.id.trim() : `review-${idx}-${Date.now()}`;

  return {
    id,
    reviewer_name,
    rating,
    message,
    service_type,
    created_at,
    is_featured,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apply standard security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  const { apiUrl, formKey } = getEnvConfig();

  // Route: GET /api/foes/reviews
  if (req.method === 'GET') {
    if (!formKey) {
      // Configuration fallback - safe service unavailable
      return res.status(503).json({
        error: 'Review service temporarily unavailable',
        reviews: [],
      });
    }

    try {
      const limitParam = typeof req.query?.limit === 'string' ? parseInt(req.query.limit, 10) : 20;
      const limit = Math.min(Math.max(isNaN(limitParam) ? 20 : limitParam, 1), 50);

      const targetUrl = `${apiUrl}/api/public/reviews?key=${encodeURIComponent(formKey)}&limit=${limit}`;

      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CleanCarePro-ReviewsProxy/1.0',
        },
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        return res.status(503).json({
          error: 'Review service temporarily unavailable',
          reviews: [],
        });
      }

      const json: unknown = await response.json();
      let rawList: RawReviewItem[] = [];

      if (Array.isArray(json)) {
        rawList = json as RawReviewItem[];
      } else if (json && typeof json === 'object') {
        const jsonObj = json as Record<string, unknown>;
        if (Array.isArray(jsonObj.reviews)) {
          rawList = jsonObj.reviews as RawReviewItem[];
        } else if (Array.isArray(jsonObj.data)) {
          rawList = jsonObj.data as RawReviewItem[];
        }
      }

      const reviews = rawList
        .map((item, idx) => normalizeReview(item, idx))
        .filter((r): r is SanitizedPublicReview => r !== null)
        .sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));

      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
      return res.status(200).json({ reviews });
    } catch {
      return res.status(503).json({
        error: 'Review service temporarily unavailable',
        reviews: [],
      });
    }
  }

  // Route: POST /api/foes/reviews
  if (req.method === 'POST') {
    // Check payload size
    const contentLength = req.headers['content-length'];
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_SIZE_BYTES) {
      return res.status(400).json({
        success: false,
        error: 'Request payload exceeds maximum allowed size',
      });
    }

    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({
          success: false,
          error: 'Invalid JSON payload',
        });
      }
    }

    if (!body || typeof body !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Missing request body',
      });
    }

    // Honeypot check
    const honeypot = sanitizeString(body.website_url, 100);
    if (honeypot.length > 0) {
      // Silently accept honeypot submissions
      return res.status(200).json({
        success: true,
        message: 'Review submitted for verification',
      });
    }

    // Check environment configuration
    if (!formKey) {
      return res.status(503).json({
        success: false,
        error: 'Review service temporarily unavailable',
      });
    }

    // Validate reviewer_name (2–120 characters)
    const reviewer_name = sanitizeString(body.reviewer_name, 120);
    if (!reviewer_name || reviewer_name.length < 2 || reviewer_name.length > 120) {
      return res.status(400).json({
        success: false,
        error: 'Reviewer name must be between 2 and 120 characters',
      });
    }

    // Validate rating (integer 1–5)
    const rawRating = typeof body.rating === 'number' ? body.rating : parseInt(String(body.rating), 10);
    if (isNaN(rawRating) || rawRating < 1 || rawRating > 5 || !Number.isInteger(rawRating)) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be an integer between 1 and 5',
      });
    }
    const rating = rawRating;

    // Validate message (10–1000 characters)
    const message = sanitizeString(body.message, 1000);
    if (!message || message.length < 10 || message.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Message must be between 10 and 1000 characters',
      });
    }

    // Validate optional email
    const reviewer_email = sanitizeString(body.reviewer_email, 255);
    if (reviewer_email && (!EMAIL_REGEX.test(reviewer_email) || reviewer_email.length > 255)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address format',
      });
    }

    // Validate optional phone (minimum 3 characters, max 30)
    const reviewer_phone = sanitizeString(body.reviewer_phone, 30);
    if (reviewer_phone && (reviewer_phone.length < 3 || reviewer_phone.length > 30 || !PHONE_REGEX.test(reviewer_phone))) {
      return res.status(400).json({
        success: false,
        error: 'Phone number must be at least 3 characters',
      });
    }

    const service_type = sanitizeString(body.service_type, 100);

    const foesPayload = {
      formKey,
      reviewer_name,
      rating,
      message,
      ...(reviewer_email ? { reviewer_email } : {}),
      ...(reviewer_phone ? { reviewer_phone } : {}),
      ...(service_type ? { service_type } : {}),
    };

    try {
      const response = await fetch(`${apiUrl}/api/public/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'CleanCarePro-ReviewsProxy/1.0',
        },
        body: JSON.stringify(foesPayload),
        signal: AbortSignal.timeout(8000),
      });

      if (response.status === 200 || response.status === 201) {
        return res.status(200).json({
          success: true,
          message: 'Review submitted for verification',
        });
      }

      if (response.status === 400) {
        return res.status(400).json({
          success: false,
          error: 'Review submission could not be processed',
        });
      }

      if (response.status === 429) {
        return res.status(429).json({
          success: false,
          error: 'Too many submissions. Please try again later.',
        });
      }

      return res.status(503).json({
        success: false,
        error: 'Review service temporarily unavailable. Please try again later.',
      });
    } catch {
      return res.status(503).json({
        success: false,
        error: 'Review service temporarily unavailable. Please try again later.',
      });
    }
  }

  // Method not allowed
  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({
    error: 'Method Not Allowed',
  });
}
