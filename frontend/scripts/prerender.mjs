import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '..');
const distDir = path.resolve(frontendDir, 'dist');
const templatePath = path.resolve(distDir, 'index.html');
const serverEntryPath = path.resolve(distDir, 'server/entry-server.js');

if (!fs.existsSync(templatePath)) {
  console.error(`[Prerender Error] Client template file not found: ${templatePath}`);
  process.exit(1);
}

if (!fs.existsSync(serverEntryPath)) {
  console.error(`[Prerender Error] SSR server entry not found: ${serverEntryPath}`);
  process.exit(1);
}

const templateHtml = fs.readFileSync(templatePath, 'utf-8');

if (!templateHtml.includes('<!--app-head-->')) {
  console.error('[Prerender Error] Missing <!--app-head--> placeholder in dist/index.html template.');
  process.exit(1);
}

if (!templateHtml.includes('<div id="root"></div>')) {
  console.error('[Prerender Error] Missing <div id="root"></div> mount container in dist/index.html template.');
  process.exit(1);
}

const { render } = await import(pathToFileURL(serverEntryPath).href);

// Clean single flat-file strategy for Vercel cleanUrls
const routes = [
  { url: '/', outputPath: path.resolve(distDir, 'index.html') },
  { url: '/service-areas/orange-county', outputPath: path.resolve(distDir, 'service-areas/orange-county.html') },
  { url: '/service-areas/glendale', outputPath: path.resolve(distDir, 'service-areas/glendale.html') },
  { url: '/service-areas/rosemead', outputPath: path.resolve(distDir, 'service-areas/rosemead.html') },
  { url: '/privacy', outputPath: path.resolve(distDir, 'privacy.html') },
  { url: '/terms', outputPath: path.resolve(distDir, 'terms.html') },
  { url: '/404', outputPath: path.resolve(distDir, '404.html') },
];

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function countOccurrences(content, regex) {
  const matches = content.match(regex);
  return matches ? matches.length : 0;
}

for (const route of routes) {
  const dir = path.dirname(route.outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const { html: renderedBody, metadata, jsonLd } = render(route.url, 'en');

  // Exact indexing environment rule:
  // ONLY process.env.VERCEL_ENV === "production" receives "index, follow" (except /404 which is always noindex)
  // Preview, development, local builds, or any other environment receive "noindex, nofollow"
  const isVercelProduction = process.env.VERCEL_ENV === 'production';
  const robots = (isVercelProduction && route.url !== '/404')
    ? 'index, follow'
    : 'noindex, nofollow';

  const headElements = [
    `<title>${escapeHtml(metadata.title)}</title>`,
    `<meta name="description" content="${escapeHtml(metadata.description)}" />`,
    `<link rel="canonical" href="${escapeHtml(metadata.canonicalUrl)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(metadata.canonicalUrl)}" />`,
    `<meta property="og:type" content="${escapeHtml(metadata.ogType)}" />`,
    `<meta property="og:image" content="${escapeHtml(metadata.ogImage)}" />`,
    `<meta property="og:site_name" content="Clean & Care PRO" />`,
    `<meta property="og:locale" content="${escapeHtml(metadata.locale)}" />`,
    `<meta name="twitter:card" content="${escapeHtml(metadata.twitterCard)}" />`,
    `<meta name="twitter:title" content="${escapeHtml(metadata.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(metadata.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(metadata.ogImage)}" />`,
  ];

  if (jsonLd) {
    headElements.push(`<script type="application/ld+json" id="seo-json-ld">${JSON.stringify(jsonLd)}</script>`);
  }

  const headBlock = headElements.join('\n    ');

  // 1. Replace <!--app-head--> exactly once
  let html = templateHtml.replace('<!--app-head-->', headBlock);

  // 2. Replace <div id="root"></div> with rendered body
  html = html.replace('<div id="root"></div>', `<div id="root">${renderedBody}</div>`);

  // 3. Strict Validation: Fail build if duplicates or missing tags exist
  const titleCount = countOccurrences(html, /<title>.*?<\/title>/gis);
  const descCount = countOccurrences(html, /<meta\s+name=["']description["']/gi);
  const robotsCount = countOccurrences(html, /<meta\s+name=["']robots["']/gi);
  const canonicalCount = countOccurrences(html, /<link\s+rel=["']canonical["']/gi);
  const jsonLdCount = countOccurrences(html, /<script\s+type=["']application\/ld\+json["']\s+id=["']seo-json-ld["']/gi);

  if (titleCount !== 1) {
    console.error(`[Prerender Error] Route ${route.url} must contain exactly 1 <title>, found ${titleCount}`);
    process.exit(1);
  }
  if (descCount !== 1) {
    console.error(`[Prerender Error] Route ${route.url} must contain exactly 1 meta description, found ${descCount}`);
    process.exit(1);
  }
  if (robotsCount !== 1) {
    console.error(`[Prerender Error] Route ${route.url} must contain exactly 1 meta robots, found ${robotsCount}`);
    process.exit(1);
  }
  if (canonicalCount !== 1) {
    console.error(`[Prerender Error] Route ${route.url} must contain exactly 1 link canonical, found ${canonicalCount}`);
    process.exit(1);
  }
  if (jsonLd && jsonLdCount !== 1) {
    console.error(`[Prerender Error] Route ${route.url} must contain exactly 1 JSON-LD script, found ${jsonLdCount}`);
    process.exit(1);
  }

  fs.writeFileSync(route.outputPath, html, 'utf-8');
  console.log(`[Prerender Success] Generated ${route.url} -> ${path.relative(frontendDir, route.outputPath)} (robots: ${robots})`);
}

// Clean up any old nested directories if present
const legacyDirs = [
  path.resolve(distDir, 'service-areas/orange-county'),
  path.resolve(distDir, 'service-areas/glendale'),
  path.resolve(distDir, 'service-areas/rosemead'),
];
for (const dir of legacyDirs) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

console.log('[Prerender Complete] All flat crawlable routes successfully validated and prerendered.');
