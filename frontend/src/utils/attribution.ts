export interface AttributionData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landing_page?: string;
  referrer?: string;
}

const STORAGE_KEY = 'ccp_lead_attribution_v1';
const MAX_UTM_LENGTH = 100;
const MAX_URL_LENGTH = 500;

// In-memory fallback if sessionStorage is blocked/unavailable
let memoryAttribution: AttributionData | null = null;

function sanitizeLength(val: string | null | undefined, maxLen: number): string | undefined {
  if (!val) return undefined;
  const trimmed = val.trim();
  if (!trimmed) return undefined;
  return trimmed.length > maxLen ? trimmed.slice(0, maxLen) : trimmed;
}

function isStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      return false;
    }
    const testKey = '__ccp_storage_test__';
    window.sessionStorage.setItem(testKey, '1');
    window.sessionStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Initializes and captures session attribution on first touch.
 * Preserves the original landing page, referrer, and UTMs for the duration of the session.
 */
export function initAttributionCapture(): AttributionData {
  if (typeof window === 'undefined') {
    return {};
  }

  const storageOk = isStorageAvailable();

  // If already captured in session storage, return existing attribution (first-touch principle)
  if (storageOk) {
    try {
      const existing = window.sessionStorage.getItem(STORAGE_KEY);
      if (existing) {
        const parsed = JSON.parse(existing) as AttributionData;
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch {
      // Fall through to re-capture if corrupted
    }
  } else if (memoryAttribution) {
    return memoryAttribution;
  }

  // Extract from current URL search params and document
  const params = new URLSearchParams(window.location.search);

  const utm_source = sanitizeLength(params.get('utm_source'), MAX_UTM_LENGTH);
  const utm_medium = sanitizeLength(params.get('utm_medium'), MAX_UTM_LENGTH);
  const utm_campaign = sanitizeLength(params.get('utm_campaign'), MAX_UTM_LENGTH);
  const utm_content = sanitizeLength(params.get('utm_content'), MAX_UTM_LENGTH);
  const utm_term = sanitizeLength(params.get('utm_term'), MAX_UTM_LENGTH);

  const landing_page = sanitizeLength(window.location.href, MAX_URL_LENGTH);
  const referrer = sanitizeLength(document.referrer, MAX_URL_LENGTH);

  const data: AttributionData = {
    ...(utm_source ? { utm_source } : {}),
    ...(utm_medium ? { utm_medium } : {}),
    ...(utm_campaign ? { utm_campaign } : {}),
    ...(utm_content ? { utm_content } : {}),
    ...(utm_term ? { utm_term } : {}),
    ...(landing_page ? { landing_page } : {}),
    ...(referrer ? { referrer } : {}),
  };

  if (storageOk) {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      memoryAttribution = data;
    }
  } else {
    memoryAttribution = data;
  }

  return data;
}

/**
 * Retrieves the current session attribution data, initializing it if not yet captured.
 */
export function getAttribution(): AttributionData {
  if (typeof window === 'undefined') {
    return {};
  }

  if (isStorageAvailable()) {
    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as AttributionData;
      }
    } catch {
      // Fall through to init
    }
  } else if (memoryAttribution) {
    return memoryAttribution;
  }

  return initAttributionCapture();
}

/**
 * Resets attribution (primarily for testing).
 */
export function resetAttributionForTesting(): void {
  memoryAttribution = null;
  if (isStorageAvailable()) {
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
}
