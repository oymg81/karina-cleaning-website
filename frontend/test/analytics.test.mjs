import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

describe('Analytics Architecture & Privacy Guards', () => {
  let analyticsModule;

  beforeEach(async () => {
    // Reset module cache if needed
    analyticsModule = await import('../src/utils/analytics.ts');
    analyticsModule.resetAnalyticsForTesting();
  });

  afterEach(() => {
    delete global.window;
    delete global.document;
  });

  it('safely handles missing or empty environment variables without throwing', () => {
    const config = analyticsModule.getAnalyticsConfig();
    assert.strictEqual(typeof config, 'object');
    // In test environment without explicit valid env vars, config returns undefined for both
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
});
