import type { VercelRequest, VercelResponse } from '@vercel/node';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{1,20}$/;
const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
const MAX_PAYLOAD_SIZE_BYTES = 16384; // 16 KB
const MAX_NOTES_LENGTH = 1000;

function getEnvConfig() {
  const apiUrl = (process.env.FOES_API_URL || 'https://app.foes.pro').replace(/\/+$/, '');
  const formKey = process.env.FOES_PUBLIC_FORM_KEY?.trim();
  return { apiUrl, formKey };
}

function sanitizeString(val: unknown, maxLen: number): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLen);
}

/**
 * Builds structured FOES notes adhering strictly to the 1000-character upper bound.
 */
export function buildFoesNotes(params: {
  service?: string;
  locale: string;
  submission_id: string;
  message?: string;
  landing_page?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}): string {
  const metadataLines: string[] = [];
  if (params.service) metadataLines.push(`Service: ${params.service.slice(0, 80)}`);
  metadataLines.push(`Language: ${params.locale}`);
  metadataLines.push(`Submission ID: ${params.submission_id}`);

  if (params.landing_page) metadataLines.push(`Landing Page: ${params.landing_page.slice(0, 150)}`);
  if (params.referrer) metadataLines.push(`Referrer: ${params.referrer.slice(0, 150)}`);
  if (params.utm_source) metadataLines.push(`UTM Source: ${params.utm_source.slice(0, 60)}`);
  if (params.utm_medium) metadataLines.push(`UTM Medium: ${params.utm_medium.slice(0, 60)}`);
  if (params.utm_campaign) metadataLines.push(`UTM Campaign: ${params.utm_campaign.slice(0, 60)}`);
  if (params.utm_content) metadataLines.push(`UTM Content: ${params.utm_content.slice(0, 60)}`);
  if (params.utm_term) metadataLines.push(`UTM Term: ${params.utm_term.slice(0, 60)}`);

  const metadataBlock = metadataLines.join('\n');

  let finalNotes = metadataBlock;

  if (params.message && params.message.trim()) {
    const trimmedMsg = params.message.trim();
    const prefix = `${metadataBlock}\n\nMessage:\n`;
    const remainingBudget = MAX_NOTES_LENGTH - prefix.length;

    if (remainingBudget > 20) {
      const boundedMsg = trimmedMsg.length > remainingBudget
        ? trimmedMsg.slice(0, remainingBudget - 3) + '...'
        : trimmedMsg;
      finalNotes = `${prefix}${boundedMsg}`;
    }
  }

  // Hard safety clamp guarantee
  if (finalNotes.length > MAX_NOTES_LENGTH) {
    finalNotes = finalNotes.slice(0, MAX_NOTES_LENGTH - 3) + '...';
  }

  return finalNotes;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apply standard security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      error: 'Method Not Allowed',
    });
  }

  // Size limit check
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
      message: 'Lead received successfully',
    });
  }

  const { apiUrl, formKey } = getEnvConfig();
  if (!formKey) {
    return res.status(503).json({
      success: false,
      error: 'Lead service temporarily unavailable',
    });
  }

  // Validate Name (2–120 characters)
  const name = sanitizeString(body.name, 120);
  if (!name || name.length < 2 || name.length > 120) {
    return res.status(400).json({
      success: false,
      error: 'Name must be between 2 and 120 characters',
    });
  }

  // Validate Email & Phone (at least one is required)
  const email = sanitizeString(body.email, 255);
  const phone = sanitizeString(body.phone, 30);

  if (!email && !phone) {
    return res.status(400).json({
      success: false,
      error: 'At least one contact method (email or phone) is required',
    });
  }

  if (email && (!EMAIL_REGEX.test(email) || email.length > 255)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email address format',
    });
  }

  if (phone && (phone.length < 3 || phone.length > 30 || !PHONE_REGEX.test(phone))) {
    return res.status(400).json({
      success: false,
      error: 'Phone number must be at least 3 characters',
    });
  }

  // Validate submission_id UUID
  const submission_id = sanitizeString(body.submission_id, 50);
  if (!submission_id || !UUID_REGEX.test(submission_id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid or missing submission UUID',
    });
  }

  // Sanitize Optional Fields
  const service = sanitizeString(body.service, 80);
  const message = sanitizeString(body.message, 1000);
  const rawLocale = sanitizeString(body.locale, 10).toLowerCase();
  const locale = rawLocale === 'es' ? 'es' : 'en';

  const landing_page = sanitizeString(body.landing_page, 500);
  const referrer = sanitizeString(body.referrer, 500);
  const utm_source = sanitizeString(body.utm_source, 100);
  const utm_medium = sanitizeString(body.utm_medium, 100);
  const utm_campaign = sanitizeString(body.utm_campaign, 100);
  const utm_content = sanitizeString(body.utm_content, 100);
  const utm_term = sanitizeString(body.utm_term, 100);

  // Construct structured FOES notes with deterministic length <= 1000
  const notes = buildFoesNotes({
    service,
    locale,
    submission_id,
    message,
    landing_page,
    referrer,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
  });

  const foesPayload = {
    formKey,
    name,
    ...(email ? { email } : {}),
    ...(phone ? { phone } : {}),
    ...(service ? { service } : {}),
    ...(message ? { message } : {}),
    notes,
  };

  try {
    const response = await fetch(`${apiUrl}/api/public/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'CleanCarePro-LeadsProxy/1.0',
      },
      body: JSON.stringify(foesPayload),
      signal: AbortSignal.timeout(8000),
    });

    if (response.status === 200 || response.status === 201) {
      return res.status(200).json({
        success: true,
        message: 'Lead received successfully',
      });
    }

    if (response.status === 400) {
      return res.status(400).json({
        success: false,
        error: 'Lead submission could not be processed',
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
      error: 'Lead service temporarily unavailable. Please try again later.',
    });
  } catch {
    return res.status(503).json({
      success: false,
      error: 'Lead service temporarily unavailable. Please try again later.',
    });
  }
}
