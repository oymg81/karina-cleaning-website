declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: {
      (...args: unknown[]): void;
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
      push?: (...args: unknown[]) => void;
    };
    _fbq?: unknown;
  }
}

export interface LeadConversionParams {
  service?: string;
  locale?: 'en' | 'es' | string;
}

let isAnalyticsInitialized = false;

/**
 * Extracts and validates analytics IDs from environment variables.
 * Validates format to reject placeholder or malformed IDs.
 */
export function getAnalyticsConfig(): { gaId?: string; pixelId?: string } {
  const rawGaId = (import.meta.env?.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim();
  const rawPixelId = (import.meta.env?.VITE_META_PIXEL_ID as string | undefined)?.trim();

  const gaId = rawGaId && /^G-[A-Za-z0-9]+$/i.test(rawGaId) ? rawGaId : undefined;
  const pixelId = rawPixelId && /^[0-9]{5,25}$/.test(rawPixelId) ? rawPixelId : undefined;

  return { gaId, pixelId };
}

/**
 * Idempotently initializes GA4 and Meta Pixel scripts only when legitimate IDs are configured.
 * Safely no-ops in development, test, or when IDs are absent.
 */
export function initAnalytics(): void {
  if (typeof window === 'undefined' || isAnalyticsInitialized) {
    return;
  }

  const { gaId, pixelId } = getAnalyticsConfig();
  if (!gaId && !pixelId) {
    return;
  }

  // 1. Google Analytics 4 (GA4) setup
  if (gaId) {
    const existingGaScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${gaId}"]`);
    if (!existingGaScript) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer?.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', gaId, {
        anonymize_ip: true,
        send_page_view: true,
      });

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);
    }
  }

  // 2. Meta Pixel setup
  if (pixelId) {
    if (!window.fbq) {
      const fbqFunction = Object.assign(
        function (...args: unknown[]) {
          const self = fbqFunction as { callMethod?: (...a: unknown[]) => void; queue: unknown[] };
          if (typeof self.callMethod === 'function') {
            self.callMethod(...args);
          } else {
            self.queue.push(args);
          }
        },
        {
          callMethod: undefined as ((...a: unknown[]) => void) | undefined,
          queue: [] as unknown[],
          loaded: true,
          version: '2.0',
          push: undefined as unknown as (...args: unknown[]) => void,
        }
      );
      fbqFunction.push = fbqFunction as unknown as (...args: unknown[]) => void;

      window.fbq = fbqFunction;
      window._fbq = fbqFunction;

      fbqFunction('init', pixelId);
      fbqFunction('track', 'PageView');

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);
    }
  }

  isAnalyticsInitialized = true;
}

/**
 * Fires conversion tracking events (GA4 generate_lead, Meta Lead).
 * Strictly excludes any Personally Identifiable Information (PII) like names, emails, phones, or messages.
 */
export function trackLeadConversion(params?: LeadConversionParams): void {
  if (typeof window === 'undefined') {
    return;
  }

  const safeService = params?.service ? String(params.service).slice(0, 60) : 'general';
  const safeLocale = params?.locale === 'es' ? 'es' : 'en';

  // 1. Google Analytics 4: generate_lead
  if (typeof window.gtag === 'function') {
    try {
      window.gtag('event', 'generate_lead', {
        service_category: safeService,
        language: safeLocale,
      });
    } catch {
      // Safe no-op
    }
  }

  // 2. Meta Pixel: Lead
  if (typeof window.fbq === 'function') {
    try {
      window.fbq('track', 'Lead', {
        content_category: safeService,
        content_name: 'Quote Request',
        locale: safeLocale,
      });
    } catch {
      // Safe no-op
    }
  }
}

/**
 * Reset initialization state (primarily for automated unit testing).
 */
export function resetAnalyticsForTesting(): void {
  isAnalyticsInitialized = false;
}
