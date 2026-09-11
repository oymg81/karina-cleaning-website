import test, { describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import handler, { normalizeGoogleReviews, matchesBusinessIdentity } from '../api/google-reviews.ts';
import { translations } from '../src/translations.ts';

function createMockReq(options = {}) {
  return {
    method: options.method || 'GET',
    headers: options.headers || {},
    query: options.query || {},
    body: options.body || null,
  };
}

function createMockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(key, value) {
      this.headers[key] = value;
      return this;
    },
    json(payload) {
      this.data = payload;
      return this;
    },
  };
  return res;
}

describe('Google Reviews Places API (New) Hardening & Compliance Tests', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.GOOGLE_PLACES_API_KEY;
    delete process.env.GOOGLE_PLACE_ID;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  test('Response normalization for a valid Places API payload', () => {
    const rawReviews = [
      {
        name: 'places/ChIJ123/reviews/456',
        relativePublishTimeDescription: '2 weeks ago',
        rating: 5,
        text: { text: 'Outstanding cleaning service! Very detail-oriented.', languageCode: 'en' },
        authorAttribution: {
          displayName: 'Jane Doe',
          photoUri: 'https://lh3.googleusercontent.com/a/test-photo',
          uri: 'https://www.google.com/maps/contrib/123/reviews',
        },
        publishTime: '2026-02-15T10:00:00Z',
        googleMapsUri: 'https://www.google.com/maps/reviews/data=123456',
      },
    ];

    const normalized = normalizeGoogleReviews(rawReviews);
    assert.equal(normalized.length, 1);
    assert.equal(normalized[0].authorName, 'Jane Doe');
    assert.equal(normalized[0].authorUri, 'https://www.google.com/maps/contrib/123/reviews');
    assert.equal(normalized[0].rating, 5);
    assert.equal(normalized[0].text, 'Outstanding cleaning service! Very detail-oriented.');
    assert.equal(normalized[0].relativePublishTime, '2 weeks ago');
    assert.equal(normalized[0].authorPhoto, 'https://lh3.googleusercontent.com/a/test-photo');
    assert.equal(normalized[0].googleMapsUri, 'https://www.google.com/maps/reviews/data=123456');
  });

  test('Rejection of an ambiguous/mismatched place identity', () => {
    const validPlace = {
      displayName: { text: 'Clean & Care Pro' },
      websiteUri: 'https://cleancareproservice.com',
      nationalPhoneNumber: '(714) 473-1140',
    };
    assert.equal(matchesBusinessIdentity(validPlace), true);

    const validPlaceIntlPhone = {
      displayName: { text: 'Clean Care Pro LLC' },
      websiteUri: 'https://otherdomain.com',
      internationalPhoneNumber: '+1 714-473-1140',
    };
    assert.equal(matchesBusinessIdentity(validPlaceIntlPhone), true);

    const mismatchedPlace = {
      displayName: { text: 'Random Appliance Repair' },
      websiteUri: 'https://randomrepair.com',
      nationalPhoneNumber: '(555) 123-4567',
    };
    assert.equal(matchesBusinessIdentity(mismatchedPlace), false);

    const emptyPlace = {};
    assert.equal(matchesBusinessIdentity(emptyPlace), false);
  });

  test('Filtering reviews without text', () => {
    const rawReviews = [
      {
        rating: 5,
        text: { text: '   ' }, // Whitespace only
        authorAttribution: { displayName: 'User 1' },
      },
      {
        rating: 5,
        text: { text: '' }, // Empty string
        authorAttribution: { displayName: 'User 2' },
      },
      {
        rating: 5,
        // Missing text object
        authorAttribution: { displayName: 'User 3' },
      },
      {
        rating: 5,
        text: { text: 'Great work!' },
        authorAttribution: { displayName: 'User 4' },
      },
    ];

    const normalized = normalizeGoogleReviews(rawReviews);
    assert.equal(normalized.length, 1);
    assert.equal(normalized[0].authorName, 'User 4');
    assert.equal(normalized[0].text, 'Great work!');
  });

  test('Maximum 5 reviews cap', () => {
    const rawReviews = Array.from({ length: 8 }, (_, i) => ({
      name: `places/ChIJ/reviews/${i + 1}`,
      rating: 5,
      text: { text: `Review text ${i + 1}` },
      authorAttribution: { displayName: `Reviewer ${i + 1}` },
    }));

    const normalized = normalizeGoogleReviews(rawReviews);
    assert.equal(normalized.length, 5);
    assert.equal(normalized[0].authorName, 'Reviewer 1');
    assert.equal(normalized[4].authorName, 'Reviewer 5');
  });

  test('405 Method Not Allowed for unsupported methods with no-store cache header', async () => {
    const methods = ['POST', 'PUT', 'DELETE', 'PATCH'];
    for (const method of methods) {
      const req = createMockReq({ method });
      const res = createMockRes();
      await handler(req, res);

      assert.equal(res.statusCode, 405);
      assert.equal(res.headers['Allow'], 'GET');
      assert.equal(res.headers['Cache-Control'].includes('no-store'), true);
      assert.equal(res.data.error, 'Method Not Allowed');
    }
  });

  test('400 Bad Request for unexpected query parameters to prevent cache-busting paid request amplification', async () => {
    const req = createMockReq({ method: 'GET', query: { cacheBuster: '12345' } });
    const res = createMockRes();
    await handler(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(res.headers['Cache-Control'].includes('no-store'), true);
    assert.equal(res.data.error, 'Unexpected query parameters');
  });

  test('Safe 503 failure state when GOOGLE_PLACES_API_KEY environment variable is absent with no-store cache header', async () => {
    delete process.env.GOOGLE_PLACES_API_KEY;

    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();
    await handler(req, res);

    assert.equal(res.statusCode, 503);
    assert.equal(res.headers['Cache-Control'].includes('no-store'), true);
    assert.equal(res.data.error, 'Google reviews service temporarily unavailable');
    assert.equal(res.data.rating, 5.0);
    assert.equal(res.data.userRatingCount, 0);
    assert.deepEqual(res.data.reviews, []);
  });

  test('Mandatory English & Spanish translations for Google Reviews CTAs and relevance notice', () => {
    assert.equal(translations.en.reviews.relevanceNotice, 'Reviews are selected and ordered by Google based on relevance.');
    assert.equal(translations.es.reviews.relevanceNotice, 'Google selecciona y ordena estas reseñas según su relevancia.');
    assert.equal(translations.en.reviews.readAllReviews, 'Read all reviews on Google');
    assert.equal(translations.es.reviews.readAllReviews, 'Ver todas las reseñas en Google');
    assert.equal(translations.en.reviews.leaveReview, 'Leave a review');
    assert.equal(translations.es.reviews.leaveReview, 'Dejar una reseña');
  });

  test('Security check: Client bundle contains no GOOGLE_PLACES_API_KEY secret references', () => {
    const distDir = join(process.cwd(), 'dist');
    if (!existsSync(distDir)) {
      return;
    }

    const assetsDir = join(distDir, 'assets');
    if (!existsSync(assetsDir)) return;

    const files = readdirSync(assetsDir).filter((f) => f.endsWith('.js') || f.endsWith('.css'));
    for (const file of files) {
      const content = readFileSync(join(assetsDir, file), 'utf-8');
      assert.equal(
        content.includes('GOOGLE_PLACES_API_KEY'),
        false,
        `Found GOOGLE_PLACES_API_KEY in client bundle asset ${file}`
      );
    }
  });
});
