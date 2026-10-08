import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '..');
const distDir = path.resolve(frontendDir, 'dist');
const publicDir = path.resolve(frontendDir, 'public');

const { getRouteMetadata, getRouteJsonLd, CANONICAL_ORIGIN, BUSINESS_ID } = await import('../src/utils/seo.ts');
const { buildFoesNotes } = await import('../api/foes/leads.ts');

describe('Dedicated /quote Route & Conversion Architecture', () => {
  it('returns valid metadata for /quote in English', () => {
    const meta = getRouteMetadata('/quote', 'en');
    assert.strictEqual(meta.title, 'Free Cleaning Estimate | Clean & Care PRO');
    assert.ok(meta.description.includes('Request a free cleaning estimate from Clean & Care PRO'));
    assert.strictEqual(meta.canonicalUrl, `${CANONICAL_ORIGIN}/quote`);
    assert.strictEqual(meta.ogType, 'website');
    assert.strictEqual(meta.ogImage, `${CANONICAL_ORIGIN}/images/cta-cleaning.jpg`);
    assert.strictEqual(meta.locale, 'en_US');
  });

  it('returns valid metadata for /quote in Spanish', () => {
    const meta = getRouteMetadata('/quote', 'es');
    assert.strictEqual(meta.title, 'Estimado de Limpieza Gratis | Clean & Care PRO');
    assert.ok(meta.description.includes('Solicite un estimado de limpieza gratuito de Clean & Care PRO'));
    assert.strictEqual(meta.canonicalUrl, `${CANONICAL_ORIGIN}/quote`);
    assert.strictEqual(meta.locale, 'es_US');
  });

  it('returns valid ContactPage JSON-LD schema for /quote', () => {
    const jsonLd = getRouteJsonLd('/quote', 'en');
    assert.ok(jsonLd);
    assert.strictEqual(jsonLd['@context'], 'https://schema.org');
    assert.strictEqual(jsonLd['@type'], 'ContactPage');
    assert.strictEqual(jsonLd['@id'], `${CANONICAL_ORIGIN}/quote#webpage`);
    assert.strictEqual(jsonLd.url, `${CANONICAL_ORIGIN}/quote`);
    assert.deepStrictEqual(jsonLd.isPartOf, { '@id': BUSINESS_ID });
  });

  it('verifies prerendered dist/quote.html contains essential high-converting elements', () => {
    const quoteHtmlPath = path.resolve(distDir, 'quote.html');
    assert.ok(fs.existsSync(quoteHtmlPath), 'dist/quote.html must exist');

    const html = fs.readFileSync(quoteHtmlPath, 'utf-8');

    // 1. Single title & canonical
    assert.match(html, /<title>Free Cleaning Estimate \| Clean (&amp;|&) Care PRO<\/title>/i);
    assert.match(html, /<link rel="canonical" href="https:\/\/cleancareproservice\.com\/quote"\s*\/?>/i);

    // 2. Structured data
    assert.match(html, /"ContactPage"/);
    assert.match(html, /https:\/\/cleancareproservice\.com\/quote#webpage/);

    // 3. Form elements in prerendered HTML
    assert.match(html, /id="quote-page-name"/i);
    assert.match(html, /id="quote-page-email"/i);
    assert.match(html, /id="quote-page-phone"/i);
    assert.match(html, /id="quote-page-service"/i);
    assert.match(html, /id="quote-page-message"/i);

    // 4. Trust elements & contact options
    assert.match(html, /714-473-1140/);
    assert.match(html, /href="tel:714-473-1140"/);
    assert.match(html, /href="https:\/\/wa\.me\/17144731140"/);
  });

  it('verifies campaign UTM parameters format cleanly into FOES lead notes for /quote', () => {
    const notes = buildFoesNotes({
      service: 'Residential Cleaning',
      locale: 'en',
      submission_id: 'c56a4180-65aa-42ec-a945-5fd21dec0538',
      message: 'Need deep cleaning for 3 bedroom house before party.',
      landing_page: 'https://cleancareproservice.com/quote?utm_source=facebook&utm_medium=paid&utm_campaign=deep_cleaning_q4',
      referrer: 'https://l.facebook.com/',
      utm_source: 'facebook',
      utm_medium: 'paid',
      utm_campaign: 'deep_cleaning_q4',
      utm_content: 'video_ad_living_room',
      utm_term: 'cleaning_estimate',
    });

    assert.ok(notes.includes('Service: Residential Cleaning'));
    assert.ok(notes.includes('Language: en'));
    assert.ok(notes.includes('Submission ID: c56a4180-65aa-42ec-a945-5fd21dec0538'));
    assert.ok(notes.includes('UTM Source: facebook'));
    assert.ok(notes.includes('UTM Medium: paid'));
    assert.ok(notes.includes('UTM Campaign: deep_cleaning_q4'));
    assert.ok(notes.includes('UTM Content: video_ad_living_room'));
    assert.ok(notes.includes('UTM Term: cleaning_estimate'));
    assert.ok(notes.includes('Landing Page: https://cleancareproservice.com/quote'));
    assert.ok(notes.includes('Message:\nNeed deep cleaning for 3 bedroom house before party.'));
    assert.ok(notes.length <= 1000);
  });
});

describe('QuoteForm Success & Error UX Contract', () => {
  it('contains clear, unmistakable confirmation copy in English translations', async () => {
    const { translations } = await import('../src/translations.ts');
    assert.strictEqual(translations.en.cta.successTitle, 'Request Sent Successfully!');
    assert.strictEqual(
      translations.en.cta.successMessage,
      'Thank you! We received your request and will contact you shortly.'
    );
    assert.ok(translations.en.cta.successSubtext.length > 10);
    assert.ok(translations.en.cta.sendAnother.length > 3);
    assert.strictEqual(translations.en.cta.errorTitle, "We couldn't send your request");
    assert.ok(translations.en.cta.errorMessage.includes('(714) 473-1140'));
  });

  it('contains clear, unmistakable confirmation copy in Spanish translations', async () => {
    const { translations } = await import('../src/translations.ts');
    assert.strictEqual(translations.es.cta.successTitle, '¡Solicitud enviada correctamente!');
    assert.strictEqual(
      translations.es.cta.successMessage,
      'Gracias. Recibimos tu solicitud y nos pondremos en contacto contigo pronto.'
    );
    assert.ok(translations.es.cta.successSubtext.length > 10);
    assert.ok(translations.es.cta.sendAnother.length > 3);
    assert.strictEqual(translations.es.cta.errorTitle, 'No pudimos enviar su solicitud');
    assert.ok(translations.es.cta.errorMessage.includes('(714) 473-1140'));
  });
});
