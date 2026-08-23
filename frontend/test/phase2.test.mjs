import test, { describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { buildFoesNotes } from '../api/foes/leads.ts';

// Mock request and response helpers
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

// ----------------------------------------------------
// 1. Attribution Utility Tests
// ----------------------------------------------------
describe('Attribution Capture and Length Limits', () => {
  const MAX_UTM_LENGTH = 100;
  const MAX_URL_LENGTH = 500;

  function sanitizeAttribution(rawParams, rawUrl, rawReferrer) {
    const sanitizeLength = (val, maxLen) => {
      if (!val) return undefined;
      const trimmed = String(val).trim();
      if (!trimmed) return undefined;
      return trimmed.length > maxLen ? trimmed.slice(0, maxLen) : trimmed;
    };

    return {
      utm_source: sanitizeLength(rawParams.utm_source, MAX_UTM_LENGTH),
      utm_medium: sanitizeLength(rawParams.utm_medium, MAX_UTM_LENGTH),
      utm_campaign: sanitizeLength(rawParams.utm_campaign, MAX_UTM_LENGTH),
      utm_content: sanitizeLength(rawParams.utm_content, MAX_UTM_LENGTH),
      utm_term: sanitizeLength(rawParams.utm_term, MAX_UTM_LENGTH),
      landing_page: sanitizeLength(rawUrl, MAX_URL_LENGTH),
      referrer: sanitizeLength(rawReferrer, MAX_URL_LENGTH),
    };
  }

  test('caps oversized UTM parameters at 100 characters', () => {
    const longString = 'a'.repeat(250);
    const result = sanitizeAttribution({ utm_source: longString }, 'https://cleancareproservice.com', 'https://google.com');
    assert.equal(result.utm_source.length, 100);
    assert.equal(result.utm_source, 'a'.repeat(100));
  });

  test('caps oversized landing_page and referrer at 500 characters', () => {
    const longUrl = 'https://cleancareproservice.com/' + 'x'.repeat(600);
    const longRef = 'https://referrer.example.com/' + 'y'.repeat(600);
    const result = sanitizeAttribution({}, longUrl, longRef);
    assert.equal(result.landing_page.length, 500);
    assert.equal(result.referrer.length, 500);
  });

  test('preserves valid standard UTMs and ignores empty strings', () => {
    const result = sanitizeAttribution(
      { utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'summer_cleaning', utm_content: '', utm_term: '   ' },
      'https://cleancareproservice.com/service-areas/orange-county',
      'https://www.google.com'
    );
    assert.equal(result.utm_source, 'google');
    assert.equal(result.utm_medium, 'cpc');
    assert.equal(result.utm_campaign, 'summer_cleaning');
    assert.equal(result.utm_content, undefined);
    assert.equal(result.utm_term, undefined);
    assert.equal(result.landing_page, 'https://cleancareproservice.com/service-areas/orange-county');
    assert.equal(result.referrer, 'https://www.google.com');
  });
});

// ----------------------------------------------------
// 2. Reviews Serverless Endpoint Tests
// ----------------------------------------------------
describe('FOES Reviews Proxy Endpoint Contract', () => {
  let reviewsHandler;
  const originalEnv = { ...process.env };
  const originalFetch = globalThis.fetch;

  beforeEach(async () => {
    process.env.FOES_API_URL = 'https://app.foes.pro';
    process.env.FOES_PUBLIC_FORM_KEY = 'test_form_key_123';
    const mod = await import('../api/foes/reviews.ts');
    reviewsHandler = mod.default;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    globalThis.fetch = originalFetch;
  });

  test('Rejects unsupported HTTP methods with 405 and Allow header', async () => {
    const req = createMockReq({ method: 'DELETE' });
    const res = createMockRes();

    await reviewsHandler(req, res);
    assert.equal(res.statusCode, 405);
    assert.equal(res.headers['Allow'], 'GET, POST');
    assert.equal(res.headers['X-Content-Type-Options'], 'nosniff');
  });

  test('GET: Returns 503 if FOES_PUBLIC_FORM_KEY is missing without exposing config internals', async () => {
    delete process.env.FOES_PUBLIC_FORM_KEY;
    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();

    await reviewsHandler(req, res);
    assert.equal(res.statusCode, 503);
    assert.deepEqual(res.data, {
      error: 'Review service temporarily unavailable',
      reviews: [],
    });
    assert.equal(res.headers['X-Content-Type-Options'], 'nosniff');
  });

  test('GET: Strips private review fields and sorts featured reviews first', async () => {
    globalThis.fetch = async (url) => {
      assert.ok(url.includes('formKey=test_form_key_123'));
      return {
        ok: true,
        status: 200,
        json: async () => ({
          reviews: [
            {
              id: 'rev-1',
              reviewer_name: 'Alice W.',
              reviewer_email: 'secret_alice@example.com',
              reviewer_phone: '714-555-0100',
              rating: 5,
              message: 'Outstanding deep cleaning service!',
              service_type: 'Deep Cleaning',
              created_at: '2026-03-01T10:00:00Z',
              is_featured: false,
              organization_id: 'org_999',
              status: 'approved',
            },
            {
              id: 'rev-2',
              reviewer_name: 'Bob T.',
              rating: 5,
              message: 'Reliable weekly office cleaning.',
              service_type: 'Office Cleaning',
              created_at: '2026-03-05T12:00:00Z',
              is_featured: true,
            },
          ],
        }),
      };
    };

    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();

    await reviewsHandler(req, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['Cache-Control'], 'public, s-maxage=60, stale-while-revalidate=120');

    const reviews = res.data.reviews;
    assert.equal(reviews.length, 2);
    assert.equal(reviews[0].id, 'rev-2');
    assert.equal(reviews[0].is_featured, true);
    assert.equal(reviews[1].id, 'rev-1');

    assert.equal(reviews[1].reviewer_email, undefined);
    assert.equal(reviews[1].reviewer_phone, undefined);
    assert.equal(reviews[1].organization_id, undefined);
    assert.equal(reviews[1].status, undefined);
  });

  test('GET: Gracefully handles authentic zero-review response with 200 and empty array', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({ reviews: [] }),
    });

    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();

    await reviewsHandler(req, res);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.data, { reviews: [] });
  });

  test('POST: Reviewer name of 1 character is rejected (400), 2 characters accepted', async () => {
    // 1 char name -> REJECT
    let req = createMockReq({ method: 'POST', body: { reviewer_name: 'J', rating: 5, message: 'Great job cleaning!' } });
    let res = createMockRes();
    await reviewsHandler(req, res);
    assert.equal(res.statusCode, 400);

    // 2 char name -> ACCEPT
    globalThis.fetch = async () => ({ ok: true, status: 201, json: async () => ({}) });
    req = createMockReq({ method: 'POST', body: { reviewer_name: 'Jo', rating: 5, message: 'Great job cleaning!' } });
    res = createMockRes();
    await reviewsHandler(req, res);
    assert.equal(res.statusCode, 200);
  });

  test('POST: Reviewer phone < 3 characters is rejected', async () => {
    const req = createMockReq({
      method: 'POST',
      body: { reviewer_name: 'John', rating: 5, message: 'Great job cleaning house!', reviewer_phone: '12' },
    });
    const res = createMockRes();
    await reviewsHandler(req, res);
    assert.equal(res.statusCode, 400);
    assert.match(res.data.error, /phone/i);
  });

  test('POST: Honeypot triggers silent 200 success without forwarding to FOES', async () => {
    let foesCalled = false;
    globalThis.fetch = async () => {
      foesCalled = true;
      return { ok: true, status: 200, json: async () => ({}) };
    };

    const req = createMockReq({
      method: 'POST',
      body: {
        reviewer_name: 'Bot Spammer',
        rating: 5,
        message: 'Buy cheap shoes here at spam.com',
        website_url: 'http://spambot-link.com',
      },
    });
    const res = createMockRes();

    await reviewsHandler(req, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.data.success, true);
    assert.equal(foesCalled, false);
  });
});

// ----------------------------------------------------
// 3. Leads Serverless Endpoint & Notes Strategy Tests
// ----------------------------------------------------
describe('FOES Leads Proxy Endpoint & Notes Length Strategy', () => {
  let leadsHandler;
  const originalEnv = { ...process.env };
  const originalFetch = globalThis.fetch;

  beforeEach(async () => {
    process.env.FOES_API_URL = 'https://app.foes.pro';
    process.env.FOES_PUBLIC_FORM_KEY = 'test_leads_key_456';
    const mod = await import('../api/foes/leads.ts');
    leadsHandler = mod.default;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    globalThis.fetch = originalFetch;
  });

  test('Lead name of 1 character is rejected, 2 characters is accepted', async () => {
    // 1 char name -> REJECT
    let req = createMockReq({
      method: 'POST',
      body: { name: 'M', email: 'm@example.com', submission_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
    });
    let res = createMockRes();
    await leadsHandler(req, res);
    assert.equal(res.statusCode, 400);

    // 2 char name -> ACCEPT
    globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => ({}) });
    req = createMockReq({
      method: 'POST',
      body: { name: 'Mo', email: 'mo@example.com', submission_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
    });
    res = createMockRes();
    await leadsHandler(req, res);
    assert.equal(res.statusCode, 200);
  });

  test('Deterministic buildFoesNotes guarantees output <= 1000 characters with oversized messages', () => {
    const hugeMessage = 'This is an extremely long message about cleaning. '.repeat(50); // ~2500 chars
    const notes = buildFoesNotes({
      service: 'Residential Cleaning with Deep Sanitization',
      locale: 'es',
      submission_id: '123e4567-e89b-12d3-a456-426614174000',
      message: hugeMessage,
      landing_page: 'https://cleancareproservice.com/service-areas/orange-county?utm_source=google&extra=' + 'x'.repeat(200),
      referrer: 'https://www.google.com/search?q=cleaning+services+in+california&ref=' + 'y'.repeat(200),
      utm_source: 'google_ads_super_long_campaign_source_name',
      utm_medium: 'cpc_search_network',
      utm_campaign: 'summer_deep_clean_promo_2026',
      utm_content: 'banner_orange_county_discount_ad_variation_b',
      utm_term: 'best_cleaning_company_near_me',
    });

    assert.ok(notes.length <= 1000, `Notes length ${notes.length} exceeded 1000 characters`);
    assert.ok(notes.includes('Language: es'));
    assert.ok(notes.includes('Submission ID: 123e4567-e89b-12d3-a456-426614174000'));
    assert.ok(notes.includes('Message:'));
    assert.ok(notes.endsWith('...'));
  });

  test('Lead phone < 3 characters is rejected', async () => {
    const req = createMockReq({
      method: 'POST',
      body: {
        name: 'Maria',
        phone: '12', // Phone < 3 chars
        submission_id: '123e4567-e89b-12d3-a456-426614174000',
      },
    });
    const res = createMockRes();
    await leadsHandler(req, res);
    assert.equal(res.statusCode, 400);
    assert.match(res.data.error, /phone/i);
  });
});

// ----------------------------------------------------
// 4. Dual-Dispatch Logic Matrix Tests
// ----------------------------------------------------
describe('Quote Form Dual-Dispatch Logic Matrix', () => {
  async function simulateDualDispatch(emailJsFn, foesFn) {
    const [emailResult, foesResult] = await Promise.allSettled([emailJsFn(), foesFn()]);
    const emailSuccess = emailResult.status === 'fulfilled';
    const foesSuccess = foesResult.status === 'fulfilled';

    if (emailSuccess || foesSuccess) {
      return {
        status: 'success',
        partial: !emailSuccess || !foesSuccess,
        emailSuccess,
        foesSuccess,
      };
    }
    return {
      status: 'error',
      partial: false,
      emailSuccess: false,
      foesSuccess: false,
    };
  }

  test('Both EmailJS and FOES succeed -> Overall SUCCESS', async () => {
    const res = await simulateDualDispatch(
      async () => ({ status: 200, text: 'OK' }),
      async () => ({ success: true })
    );
    assert.equal(res.status, 'success');
    assert.equal(res.partial, false);
  });

  test('FOES succeeds, EmailJS fails -> Tolerant overall SUCCESS without customer error', async () => {
    const res = await simulateDualDispatch(
      async () => { throw new Error('EmailJS Network Timeout'); },
      async () => ({ success: true })
    );
    assert.equal(res.status, 'success');
    assert.equal(res.partial, true);
  });

  test('EmailJS succeeds, FOES fails -> Tolerant overall SUCCESS without customer error', async () => {
    const res = await simulateDualDispatch(
      async () => ({ status: 200, text: 'OK' }),
      async () => { throw new Error('FOES 503 Unavailable'); }
    );
    assert.equal(res.status, 'success');
    assert.equal(res.partial, true);
  });

  test('Both EmailJS and FOES fail -> Actionable ERROR', async () => {
    const res = await simulateDualDispatch(
      async () => { throw new Error('EmailJS Fail'); },
      async () => { throw new Error('FOES Fail'); }
    );
    assert.equal(res.status, 'error');
  });
});

// ----------------------------------------------------
// 5. Client Bundle Security Scan
// ----------------------------------------------------
describe('Frontend Bundle Security Verification', () => {
  test('Ensures client bundle has no FOES_PUBLIC_FORM_KEY or secret credentials', () => {
    const distPath = join(process.cwd(), 'dist');
    if (!existsSync(distPath)) {
      execSync('npm run build', { cwd: process.cwd(), stdio: 'pipe' });
    }

    const distAssets = join(distPath, 'assets');
    if (existsSync(distAssets)) {
      const files = readdirSync(distAssets);
      for (const file of files) {
        if (file.endsWith('.js')) {
          const content = readFileSync(join(distAssets, file), 'utf8');
          assert.equal(
            content.includes('FOES_PUBLIC_FORM_KEY'),
            false,
            `Found FOES_PUBLIC_FORM_KEY in client bundle asset ${file}`
          );
        }
      }
    }
  });
});

// ----------------------------------------------------
// 6. Vercel Configuration Verification
// ----------------------------------------------------
describe('Vercel Routing Configuration Verification', () => {
  test('Ensures vercel.json uses cleanUrls and serverless API routing without self-referential API rewrite', () => {
    const vercelConfigPath = join(process.cwd(), 'vercel.json');
    assert.ok(existsSync(vercelConfigPath), 'vercel.json must exist');

    const config = JSON.parse(readFileSync(vercelConfigPath, 'utf8'));
    assert.equal(config.cleanUrls, true, 'cleanUrls must be enabled');

    if (config.rewrites) {
      const hasSelfReferentialApi = config.rewrites.some((r) => r.source?.startsWith('/api') && r.destination?.startsWith('/api'));
      assert.equal(hasSelfReferentialApi, false, 'No self-referential /api rewrite should exist');
    }

    // Verify serverless files exist under frontend/api
    const leadsPath = join(process.cwd(), 'api/foes/leads.ts');
    const reviewsPath = join(process.cwd(), 'api/foes/reviews.ts');
    assert.ok(existsSync(leadsPath), 'frontend/api/foes/leads.ts must exist');
    assert.ok(existsSync(reviewsPath), 'frontend/api/foes/reviews.ts must exist');
  });
});
