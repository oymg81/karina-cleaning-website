import React, { useEffect } from 'react';

export interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
  robots?: string;
  ogType?: string;
  ogImage?: string;
  twitterCard?: string;
  locale?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>> | null;
}

const CANONICAL_ORIGIN = 'https://cleancareproservice.com';
const DEFAULT_OG_IMAGE = `${CANONICAL_ORIGIN}/images/cta-cleaning.jpg`;

const isProductionHost = (): boolean => {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return hostname === 'cleancareproservice.com' || hostname === 'www.cleancareproservice.com';
};

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalUrl,
  robots,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  twitterCard = 'summary_large_image',
  locale = 'en_US',
  jsonLd,
}) => {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // Helper to update or create a meta tag by name or property
    const updateMetaTag = (attribute: 'name' | 'property', key: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Staging / Preview Indexing Protection:
    // If not running on the exact production domain, ensure robots is noindex, nofollow
    const effectiveRobots = isProductionHost() ? (robots || 'index, follow') : 'noindex, nofollow';

    // 2. Meta description & robots
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'robots', effectiveRobots);

    // 3. Open Graph Tags
    const fullCanonical = canonicalUrl.startsWith('http')
      ? canonicalUrl
      : `${CANONICAL_ORIGIN}${canonicalUrl.startsWith('/') ? canonicalUrl : `/${canonicalUrl}`}`;

    const fullOgImage = ogImage.startsWith('http')
      ? ogImage
      : `${CANONICAL_ORIGIN}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`;

    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:url', fullCanonical);
    updateMetaTag('property', 'og:type', ogType);
    updateMetaTag('property', 'og:image', fullOgImage);
    updateMetaTag('property', 'og:site_name', 'Clean & Care PRO');
    updateMetaTag('property', 'og:locale', locale);

    // 4. Twitter Card Tags
    updateMetaTag('name', 'twitter:card', twitterCard);
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', fullOgImage);

    // 5. Canonical Link Tag
    let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', fullCanonical);

    // 6. JSON-LD Structured Data
    let scriptElement = document.querySelector('script#seo-json-ld') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.setAttribute('type', 'application/ld+json');
        scriptElement.setAttribute('id', 'seo-json-ld');
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(jsonLd);
    } else if (scriptElement) {
      scriptElement.remove();
    }
  }, [title, description, canonicalUrl, robots, ogType, ogImage, twitterCard, locale, jsonLd]);

  return null;
};

export default SEOHead;
