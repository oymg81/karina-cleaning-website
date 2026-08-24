import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(frontendDir, 'public');
const distDir = path.resolve(frontendDir, 'dist');

// Import shared SEO utility
const { getRouteMetadata, getRouteJsonLd, getRobotsForEnvironment, CANONICAL_ORIGIN, BUSINESS_ID, SERVICE_AREA_SCHEMA_TYPES } = await import('../src/utils/seo.ts');
const { serviceAreas } = await import('../src/data/serviceAreas.ts');

describe('Search Engine Assets: robots.txt and sitemap.xml', () => {
  it('robots.txt has valid crawler directives and points to sitemap.xml', () => {
    const robotsPath = path.resolve(publicDir, 'robots.txt');
    assert.ok(fs.existsSync(robotsPath), 'robots.txt must exist in public directory');

    const content = fs.readFileSync(robotsPath, 'utf-8');
    assert.match(content, /User-agent:\s*\*/i, 'robots.txt must specify User-agent: *');
    assert.match(content, /Allow:\s*\//i, 'robots.txt must allow root path');
    assert.match(content, /Disallow:\s*\/api\//i, 'robots.txt must disallow /api/');
    assert.match(content, /Sitemap:\s*https:\/\/cleancareproservice\.com\/sitemap\.xml/i, 'robots.txt must declare absolute sitemap URL');
  });

  it('sitemap.xml contains all canonical routes and is well-formed XML', () => {
    const sitemapPath = path.resolve(publicDir, 'sitemap.xml');
    assert.ok(fs.existsSync(sitemapPath), 'sitemap.xml must exist in public directory');

    const content = fs.readFileSync(sitemapPath, 'utf-8');
    assert.match(content, /<\?xml\s+version=["']1\.0["']\s+encoding=["']UTF-8["']\?>/i, 'sitemap.xml must have XML declaration');
    assert.match(content, /<urlset\s+xmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']>/i, 'sitemap.xml must have urlset schema');

    const expectedUrls = [
      'https://cleancareproservice.com/',
      'https://cleancareproservice.com/service-areas/orange-county',
      'https://cleancareproservice.com/service-areas/glendale',
      'https://cleancareproservice.com/service-areas/rosemead',
      'https://cleancareproservice.com/privacy',
      'https://cleancareproservice.com/terms',
    ];

    for (const url of expectedUrls) {
      assert.ok(content.includes(`<loc>${url}</loc>`), `sitemap.xml must include <loc>${url}</loc>`);
    }
  });
});

describe('Shared SEO Utility & Metadata Matrix', () => {
  it('derives service area metadata directly from serviceAreas.ts canonical source', () => {
    for (const slug of Object.keys(serviceAreas)) {
      const enMeta = getRouteMetadata(`/service-areas/${slug}`, 'en');
      const esMeta = getRouteMetadata(`/service-areas/${slug}`, 'es');
      const data = serviceAreas[slug];

      assert.strictEqual(enMeta.title, data.en.seoTitle);
      assert.strictEqual(enMeta.description, data.en.seoDescription);
      assert.strictEqual(enMeta.canonicalUrl, `https://cleancareproservice.com${data.canonicalPath}`);

      assert.strictEqual(esMeta.title, data.es.seoTitle);
      assert.strictEqual(esMeta.description, data.es.seoDescription);
    }
  });

  it('generates conservative JSON-LD with verified business data and correct schema types', () => {
    const homeJsonLd = getRouteJsonLd('/', 'en');
    assert.strictEqual(homeJsonLd['@context'], 'https://schema.org');
    assert.strictEqual(homeJsonLd['@type'], 'LocalBusiness');
    assert.strictEqual(homeJsonLd['@id'], BUSINESS_ID);
    assert.strictEqual(homeJsonLd.name, 'Clean & Care PRO');
    assert.strictEqual(homeJsonLd.telephone, '+1-714-473-1140');
    assert.strictEqual(homeJsonLd.email, 'cleancareproservices2@gmail.com');

    // Schema service-area types
    assert.strictEqual(SERVICE_AREA_SCHEMA_TYPES['orange-county'], 'AdministrativeArea');
    assert.strictEqual(SERVICE_AREA_SCHEMA_TYPES['glendale'], 'City');
    assert.strictEqual(SERVICE_AREA_SCHEMA_TYPES['rosemead'], 'City');

    for (const slug of Object.keys(serviceAreas)) {
      const data = serviceAreas[slug];
      const serviceJsonLd = getRouteJsonLd(`/service-areas/${slug}`, 'en');
      assert.ok(serviceJsonLd, `JSON-LD must exist for ${slug}`);
      assert.strictEqual(serviceJsonLd['@type'], 'Service');
      assert.strictEqual(serviceJsonLd['@id'], `https://cleancareproservice.com${data.canonicalPath}#service`);
      assert.deepStrictEqual(serviceJsonLd.provider, { '@id': BUSINESS_ID });
      assert.strictEqual(serviceJsonLd.areaServed['@type'], SERVICE_AREA_SCHEMA_TYPES[slug]);
      assert.strictEqual(serviceJsonLd.areaServed.name, `${data.name}, CA`);
    }
  });

  it('verifies active service-area messaging and zero in-preparation copy across all locations', () => {
    const forbiddenPhrases = [
      /in preparation/i,
      /en preparación/i,
      /currently in preparation/i,
      /actualmente en preparación/i,
      /coming soon/i,
      /próximamente/i,
      /under construction/i,
    ];

    const expectedCopy = {
      'orange-county': {
        en: {
          heroBadge: 'Proudly Serving Orange County, CA',
          statusNotice: 'Professional residential and commercial cleaning services are available throughout Orange County and surrounding communities. Contact us to schedule your service and receive a free estimate.',
        },
        es: {
          heroBadge: 'Atendemos con orgullo en Orange County, CA',
          statusNotice: 'Ofrecemos servicios profesionales de limpieza residencial y comercial en Orange County y comunidades cercanas. Contáctenos para programar su servicio y recibir un estimado gratuito.',
        },
      },
      'glendale': {
        en: {
          heroBadge: 'Proudly Serving Glendale, CA',
          statusNotice: 'Professional residential and commercial cleaning services are available in Glendale and surrounding areas. Contact us to schedule your service and receive a free estimate.',
        },
        es: {
          heroBadge: 'Atendemos con orgullo en Glendale, CA',
          statusNotice: 'Ofrecemos servicios profesionales de limpieza residencial y comercial en Glendale y áreas cercanas. Contáctenos para programar su servicio y recibir un estimado gratuito.',
        },
      },
      'rosemead': {
        en: {
          heroBadge: 'Proudly Serving Rosemead, CA',
          statusNotice: 'Professional residential and commercial cleaning services are available in Rosemead and surrounding areas. Contact us to schedule your service and receive a free estimate.',
        },
        es: {
          heroBadge: 'Atendemos con orgullo en Rosemead, CA',
          statusNotice: 'Ofrecemos servicios profesionales de limpieza residencial y comercial en Rosemead y áreas cercanas. Contáctenos para programar su servicio y recibir un estimado gratuito.',
        },
      },
    };

    for (const [slug, expected] of Object.entries(expectedCopy)) {
      const data = serviceAreas[slug];
      assert.ok(data, `Service area data must exist for ${slug}`);

      // English assertions
      assert.strictEqual(data.en.heroBadge, expected.en.heroBadge);
      assert.strictEqual(data.en.statusNotice, expected.en.statusNotice);

      // Spanish assertions
      assert.strictEqual(data.es.heroBadge, expected.es.heroBadge);
      assert.strictEqual(data.es.statusNotice, expected.es.statusNotice);

      // Verify no forbidden phrases in entire data object
      const serialized = JSON.stringify(data);
      for (const pattern of forbiddenPhrases) {
        assert.strictEqual(
          pattern.test(serialized),
          false,
          `Service area ${slug} must not contain forbidden pattern ${pattern} in data: ${serialized}`
        );
      }
    }
  });
});

describe('Indexing Environment & Preview Protection', () => {
  it('evaluates indexing directives correctly across build and browser environments', () => {
    // 404 is always noindex
    assert.strictEqual(getRobotsForEnvironment('/404'), 'noindex, nofollow');

    // Server build: only VERCEL_ENV === "production" is indexable
    const originalVercelEnv = process.env.VERCEL_ENV;

    process.env.VERCEL_ENV = 'production';
    assert.strictEqual(getRobotsForEnvironment('/'), 'index, follow');
    assert.strictEqual(getRobotsForEnvironment('/service-areas/orange-county'), 'index, follow');

    process.env.VERCEL_ENV = 'preview';
    assert.strictEqual(getRobotsForEnvironment('/'), 'noindex, nofollow');
    assert.strictEqual(getRobotsForEnvironment('/service-areas/orange-county'), 'noindex, nofollow');

    delete process.env.VERCEL_ENV;
    assert.strictEqual(getRobotsForEnvironment('/'), 'noindex, nofollow');

    if (originalVercelEnv) {
      process.env.VERCEL_ENV = originalVercelEnv;
    }
  });

  it('guarantees production browser hostname cannot be downgraded to noindex', () => {
    const originalWindow = global.window;
    try {
      global.window = { location: { hostname: 'cleancareproservice.com' } };
      assert.strictEqual(getRobotsForEnvironment('/'), 'index, follow');
      assert.strictEqual(getRobotsForEnvironment('/service-areas/glendale'), 'index, follow');

      global.window = { location: { hostname: 'www.cleancareproservice.com' } };
      assert.strictEqual(getRobotsForEnvironment('/'), 'index, follow');

      // Staging / Preview domain in browser
      global.window = { location: { hostname: 'clean-care-pro-preview.vercel.app' } };
      assert.strictEqual(getRobotsForEnvironment('/'), 'noindex, nofollow');
    } finally {
      if (originalWindow) {
        global.window = originalWindow;
      } else {
        delete global.window;
      }
    }
  });
});

describe('Single Flat-File Prerendered HTML & Artifact Strategy', () => {
  const routes = [
    { url: '/', file: path.resolve(distDir, 'index.html'), expectedH1: 'Professional Cleaning Services in California' },
    { url: '/service-areas/orange-county', file: path.resolve(distDir, 'service-areas/orange-county.html'), expectedH1: 'Professional Cleaning Services in Orange County' },
    { url: '/service-areas/glendale', file: path.resolve(distDir, 'service-areas/glendale.html'), expectedH1: 'Professional Cleaning Services in Glendale' },
    { url: '/service-areas/rosemead', file: path.resolve(distDir, 'service-areas/rosemead.html'), expectedH1: 'Professional Cleaning Services in Rosemead' },
    { url: '/privacy', file: path.resolve(distDir, 'privacy.html'), expectedH1: 'Privacy Policy' },
    { url: '/terms', file: path.resolve(distDir, 'terms.html'), expectedH1: 'Terms of Service' },
    { url: '/404', file: path.resolve(distDir, '404.html'), expectedH1: 'Page Not Found' },
  ];

  it('confirms no duplicate nested directory index.html outputs exist after build', () => {
    const legacyDirs = [
      path.resolve(distDir, 'service-areas/orange-county/index.html'),
      path.resolve(distDir, 'service-areas/glendale/index.html'),
      path.resolve(distDir, 'service-areas/rosemead/index.html'),
    ];

    for (const legacyPath of legacyDirs) {
      assert.strictEqual(
        fs.existsSync(legacyPath),
        false,
        `Duplicate directory index file must not exist: ${legacyPath}`
      );
    }
  });

  for (const { url, file, expectedH1 } of routes) {
    it(`verifies single flat prerendered HTML file for ${url}`, () => {
      assert.ok(fs.existsSync(file), `Flat prerendered file must exist: ${file}`);
      const content = fs.readFileSync(file, 'utf-8');

      // 1. Single title tag
      const titles = content.match(/<title>.*?<\/title>/gi);
      assert.strictEqual(titles?.length, 1, `Must contain exactly 1 title tag for ${url}`);

      // 2. Single canonical link
      const canonicals = content.match(/<link\s+rel=["']canonical["']/gi);
      assert.strictEqual(canonicals?.length, 1, `Must contain exactly 1 canonical tag for ${url}`);

      // 3. Single meta description
      const descriptions = content.match(/<meta\s+name=["']description["']/gi);
      assert.strictEqual(descriptions?.length, 1, `Must contain exactly 1 description tag for ${url}`);

      // 4. Single robots tag
      const robots = content.match(/<meta\s+name=["']robots["']/gi);
      assert.strictEqual(robots?.length, 1, `Must contain exactly 1 robots tag for ${url}`);

      // 5. Open Graph and Twitter tags
      assert.ok(content.includes('property="og:title"'), `Must contain og:title for ${url}`);
      assert.ok(content.includes('property="og:description"'), `Must contain og:description for ${url}`);
      assert.ok(content.includes('property="og:url"'), `Must contain og:url for ${url}`);
      assert.ok(content.includes('property="og:image"'), `Must contain og:image for ${url}`);
      assert.ok(content.includes('name="twitter:card"'), `Must contain twitter:card for ${url}`);

      // 6. Crawlable semantic content
      assert.ok(content.includes(expectedH1), `Must contain expected H1: "${expectedH1}" for ${url}`);
      assert.ok(content.includes('<div id="root">'), 'Must contain root container');
      assert.ok(!content.includes('<div id="root"></div>'), `Root container must not be empty for ${url}`);

      // 7. JSON-LD for non-404 routes
      if (url !== '/404') {
        const jsonLdMatch = content.match(/<script\s+type=["']application\/ld\+json["']\s+id=["']seo-json-ld["']>([\s\S]*?)<\/script>/i);
        assert.ok(jsonLdMatch, `Must contain JSON-LD script for ${url}`);
        const parsed = JSON.parse(jsonLdMatch[1]);
        assert.ok(parsed['@context'] === 'https://schema.org', 'JSON-LD context must be schema.org');
      }

      // 8. Verify no temporary "in preparation" wording in HTML
      assert.strictEqual(/in preparation/i.test(content), false, `Must not contain "in preparation" in ${url}`);
      assert.strictEqual(/en preparación/i.test(content), false, `Must not contain "en preparación" in ${url}`);
    });
  }
});
