import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '..');
const distDir = path.resolve(frontendDir, 'dist');

const { translations } = await import('../src/translations.ts');

describe('Footer Contact & Service Area Navigation - Canonical Data Contracts', () => {
  it('defines the 7 service areas in correct order for English and Spanish', () => {
    assert.deepStrictEqual(translations.en.footer.locationsList, [
      'Orange County',
      'Glendale and surrounding areas',
      'Rosemead and surrounding areas',
      'Los Angeles',
      'Upland',
      'Fontana',
      'Corona',
    ]);

    assert.deepStrictEqual(translations.es.footer.locationsList, [
      'Orange County',
      'Glendale y áreas cercanas',
      'Rosemead y áreas cercanas',
      'Los Angeles',
      'Upland',
      'Fontana',
      'Corona',
    ]);
  });
});

describe('Footer Contact & Service Area Navigation - Rendered DOM & Attribute Verification', () => {
  const routes = [
    { name: 'Home Page', file: path.resolve(distDir, 'index.html') },
    { name: 'Privacy Policy', file: path.resolve(distDir, 'privacy.html') },
    { name: 'Terms of Service', file: path.resolve(distDir, 'terms.html') },
    { name: 'Orange County Area', file: path.resolve(distDir, 'service-areas/orange-county.html') },
    { name: 'Glendale Area', file: path.resolve(distDir, 'service-areas/glendale.html') },
    { name: 'Rosemead Area', file: path.resolve(distDir, 'service-areas/rosemead.html') },
  ];

  for (const { name, file } of routes) {
    describe(`${name} (${path.basename(file)})`, () => {
      it('renders phone in Contact Info as an interactive link with exact destination, accessible label, and visible text', () => {
        assert.ok(fs.existsSync(file), `File ${file} must exist`);
        const content = fs.readFileSync(file, 'utf-8');

        // Verify native tel: link exists in Contact Info with exact destination and aria-label
        const phoneLinkRegex = /<a[^>]*href="tel:\+17144731140"[^>]*aria-label="Call Clean &amp; Care PRO at 714-473-1140"[^>]*>([\s\S]*?)<\/a>/;
        assert.match(content, phoneLinkRegex, 'Must contain phone link with href="tel:+17144731140" and aria-label');

        const match = content.match(phoneLinkRegex);
        assert.ok(match[1].includes('714-473-1140'), 'Phone link must contain visible text 714-473-1140');
        assert.ok(match[0].includes('focus-visible:ring-2'), 'Phone link must have focus-visible styling');
      });

      it('renders email in Contact Info as an interactive link with exact mailto: destination, accessible label, and no target="_blank"', () => {
        assert.ok(fs.existsSync(file), `File ${file} must exist`);
        const content = fs.readFileSync(file, 'utf-8');

        // Verify native mailto: link exists in Contact Info with exact destination and aria-label
        const emailLinkRegex = /<a[^>]*href="mailto:cleancareproservices2@gmail\.com"[^>]*aria-label="Email Clean &amp; Care PRO"[^>]*>([\s\S]*?)<\/a>/;
        assert.match(content, emailLinkRegex, 'Must contain email link with href="mailto:cleancareproservices2@gmail.com" and aria-label');

        const match = content.match(emailLinkRegex);
        assert.ok(match[1].includes('cleancareproservices2@gmail.com'), 'Email link must contain visible text cleancareproservices2@gmail.com');
        assert.strictEqual(match[0].includes('target='), false, 'Contact email link must not have target="_blank"');
        assert.ok(match[0].includes('break-all'), 'Email link must have break-all class for responsive safety');
        assert.ok(match[0].includes('focus-visible:ring-2'), 'Email link must have focus-visible styling');
      });

      it('renders only the 3 SEO locations as internal links and keeps the other 4 as non-clickable text', () => {
        assert.ok(fs.existsSync(file), `File ${file} must exist`);
        const content = fs.readFileSync(file, 'utf-8');

        // 1. Orange County is linked to /service-areas/orange-county
        assert.match(
          content,
          /<a[^>]*href="\/service-areas\/orange-county"[^>]*>Orange County<\/a>/,
          'Orange County must be linked to /service-areas/orange-county'
        );

        // 2. Glendale is linked to /service-areas/glendale
        assert.match(
          content,
          /<a[^>]*href="\/service-areas\/glendale"[^>]*>(?:Glendale and surrounding areas|Glendale y áreas cercanas)<\/a>/,
          'Glendale must be linked to /service-areas/glendale'
        );

        // 3. Rosemead is linked to /service-areas/rosemead
        assert.match(
          content,
          /<a[^>]*href="\/service-areas\/rosemead"[^>]*>(?:Rosemead and surrounding areas|Rosemead y áreas cercanas)<\/a>/,
          'Rosemead must be linked to /service-areas/rosemead'
        );

        // 4. The other 4 locations must be rendered as <span> and NEVER as <a> links
        const staticLocations = ['Los Angeles', 'Upland', 'Fontana', 'Corona'];
        for (const loc of staticLocations) {
          assert.match(
            content,
            new RegExp(`<span>${loc}</span>`),
            `Location "${loc}" must be rendered inside a <span> (non-clickable)`
          );
          assert.doesNotMatch(
            content,
            new RegExp(`<a[^>]*>${loc}</a>`),
            `Location "${loc}" must NOT be rendered inside an <a> tag`
          );

          // Must not link to non-existent pages
          const slug = loc.toLowerCase().replace(/\s+/g, '-');
          assert.doesNotMatch(
            content,
            new RegExp(`href="[^"]*${slug}[^"]*"`),
            `Must not generate non-existent route for ${loc}`
          );
        }
      });
    });
  }
});
