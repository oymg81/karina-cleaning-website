import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

describe('Analytics Architecture & Privacy Guards', () => {
  let analyticsModule;

  beforeEach(async () => {
    analyticsModule = await import('../src/utils/analytics.ts');
    analyticsModule.resetAnalyticsForTesting();
  });

  afterEach(() => {
    delete global.window;
    delete global.document;
    analyticsModule.resetAnalyticsForTesting();
  });

  it('safely handles missing or empty environment variables without throwing', () => {
    const config = analyticsModule.getAnalyticsConfig();
    assert.strictEqual(typeof config, 'object');
    assert.strictEqual(config.gaId, undefined);
    assert.strictEqual(config.pixelId, undefined);
  });

  it('initAnalytics safely no-ops when environment IDs are missing', () => {
    global.window = {};
    global.document = { querySelector: () => null, createElement: () => ({}), head: { appendChild: () => {} } };

    assert.doesNotThrow(() => {
      analyticsModule.initAnalytics();
    });

    assert.strictEqual(global.window.gtag, undefined);
    assert.strictEqual(global.window.fbq, undefined);
  });

  it('trackPageView safely no-ops when GA4 is unavailable', () => {
    global.window = {
      location: { pathname: '/quote', href: 'https://cleancareproservice.com/quote' },
    };

    assert.doesNotThrow(() => {
      analyticsModule.trackPageView('/quote');
    });

    assert.strictEqual(global.window.gtag, undefined);
  });

  it('trackPageView dispatches standard page_view event when window.gtag exists', () => {
    let capturedEvent = null;
    global.window = {
      location: { pathname: '/orange-county-cleaning-services', href: 'https://cleancareproservice.com/orange-county-cleaning-services' },
      gtag: (command, action, payload) => {
        capturedEvent = { command, action, payload };
      },
    };
    global.document = { title: 'Orange County Cleaning Services' };

    analyticsModule.trackPageView('/orange-county-cleaning-services');

    assert.ok(capturedEvent, 'gtag must be called');
    assert.strictEqual(capturedEvent.command, 'event');
    assert.strictEqual(capturedEvent.action, 'page_view');
    assert.strictEqual(capturedEvent.payload.page_path, '/orange-county-cleaning-services');
    assert.strictEqual(capturedEvent.payload.page_location, 'https://cleancareproservice.com/orange-county-cleaning-services');
    assert.strictEqual(capturedEvent.payload.page_title, 'Orange County Cleaning Services');

    // Zero PII check
    assert.strictEqual(capturedEvent.payload.name, undefined);
    assert.strictEqual(capturedEvent.payload.email, undefined);
    assert.strictEqual(capturedEvent.payload.phone, undefined);
    assert.strictEqual(capturedEvent.payload.message, undefined);
  });

  it('trackPageView gracefully falls back to window.location.pathname if path is empty', () => {
    let capturedEvent = null;
    global.window = {
      location: { pathname: '/quote', href: 'https://cleancareproservice.com/quote' },
      gtag: (command, action, payload) => {
        capturedEvent = { command, action, payload };
      },
    };

    analyticsModule.trackPageView('');

    assert.ok(capturedEvent);
    assert.strictEqual(capturedEvent.payload.page_path, '/quote');
  });

  it('trackPageView never throws if window.gtag encounters an error', () => {
    global.window = {
      location: { pathname: '/quote', href: 'https://cleancareproservice.com/quote' },
      gtag: () => {
        throw new Error('Adblocker or tracking protection exception');
      },
    };

    assert.doesNotThrow(() => {
      analyticsModule.trackPageView('/quote');
    });
  });

  it('trackLeadConversion dispatches GA4 and Meta Pixel events with zero PII', () => {
    let capturedGtag = null;
    let capturedFbq = null;

    global.window = {
      gtag: (command, action, payload) => {
        capturedGtag = { command, action, payload };
      },
      fbq: (command, eventName, payload) => {
        capturedFbq = { command, eventName, payload };
      },
    };

    analyticsModule.trackLeadConversion({
      service: 'deep',
      locale: 'es',
    });

    // Verify GA4 event
    assert.ok(capturedGtag, 'gtag must be called');
    assert.strictEqual(capturedGtag.command, 'event');
    assert.strictEqual(capturedGtag.action, 'generate_lead');
    assert.strictEqual(capturedGtag.payload.service_category, 'deep');
    assert.strictEqual(capturedGtag.payload.language, 'es');

    // Strict PII check on GA4 payload
    assert.strictEqual(capturedGtag.payload.name, undefined);
    assert.strictEqual(capturedGtag.payload.email, undefined);
    assert.strictEqual(capturedGtag.payload.phone, undefined);
    assert.strictEqual(capturedGtag.payload.message, undefined);

    // Verify Meta Pixel event
    assert.ok(capturedFbq, 'fbq must be called');
    assert.strictEqual(capturedFbq.command, 'track');
    assert.strictEqual(capturedFbq.eventName, 'Lead');
    assert.strictEqual(capturedFbq.payload.content_category, 'deep');
    assert.strictEqual(capturedFbq.payload.locale, 'es');

    // Strict PII check on Meta payload
    assert.strictEqual(capturedFbq.payload.name, undefined);
    assert.strictEqual(capturedFbq.payload.email, undefined);
    assert.strictEqual(capturedFbq.payload.phone, undefined);
    assert.strictEqual(capturedFbq.payload.message, undefined);
  });

  it('trackLeadConversion safely falls back to defaults when called with no parameters', () => {
    let capturedGtag = null;
    let capturedFbq = null;

    global.window = {
      gtag: (command, action, payload) => {
        capturedGtag = { command, action, payload };
      },
      fbq: (command, eventName, payload) => {
        capturedFbq = { command, eventName, payload };
      },
    };

    assert.doesNotThrow(() => {
      analyticsModule.trackLeadConversion();
    });

    assert.strictEqual(capturedGtag.payload.service_category, 'general');
    assert.strictEqual(capturedGtag.payload.language, 'en');
    assert.strictEqual(capturedFbq.payload.content_category, 'general');
  });

  it('trackLeadConversion never throws if window.gtag or window.fbq encounter an internal error', () => {
    global.window = {
      gtag: () => {
        throw new Error('Analytics blocker exception');
      },
      fbq: () => {
        throw new Error('Meta Pixel blocked');
      },
    };

    assert.doesNotThrow(() => {
      analyticsModule.trackLeadConversion({ service: 'commercial', locale: 'en' });
    });
  });

  it('Router Navigation Contract: skips initial load and emits exactly one virtual pageview per route change', () => {
    const pageviews = [];
    global.window = {
      location: { pathname: '/', href: 'https://cleancareproservice.com/' },
      gtag: (command, action, payload) => {
        if (command === 'event' && action === 'page_view') {
          pageviews.push(payload);
        }
      },
    };

    // Simulate RouteAnalyticsTracker logic
    let isFirstRender = true;
    function simulateNavigation(newPath) {
      if (isFirstRender) {
        isFirstRender = false;
        return; // Initial load: GA4 native config already handles send_page_view
      }
      analyticsModule.trackPageView(newPath);
    }

    // Step 1: Initial mount (e.g. at "/")
    simulateNavigation('/');
    assert.strictEqual(pageviews.length, 0, 'Initial mount must not fire a redundant trackPageView');

    // Step 2: Navigate to "/quote"
    simulateNavigation('/quote');
    assert.strictEqual(pageviews.length, 1, 'First client-side navigation must fire exactly 1 pageview');
    assert.strictEqual(pageviews[0].page_path, '/quote');

    // Step 3: Navigate to "/orange-county-cleaning-services"
    simulateNavigation('/orange-county-cleaning-services');
    assert.strictEqual(pageviews.length, 2, 'Second client-side navigation must fire exactly 1 additional pageview');
    assert.strictEqual(pageviews[1].page_path, '/orange-county-cleaning-services');

    // Step 4: Navigate back to "/"
    simulateNavigation('/');
    assert.strictEqual(pageviews.length, 3, 'Third client-side navigation must fire exactly 1 additional pageview');
    assert.strictEqual(pageviews[2].page_path, '/');
  });
});
