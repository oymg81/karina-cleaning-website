import { useEffect } from 'react';

export interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
  robots?: string;
  ogType?: string;
}

const CANONICAL_ORIGIN = 'https://cleancareproservice.com';

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalUrl,
  robots = 'index, follow',
  ogType = 'website',
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

    // 2. Meta description & robots
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'robots', robots);

    // 3. Open Graph Tags
    const fullCanonical = canonicalUrl.startsWith('http')
      ? canonicalUrl
      : `${CANONICAL_ORIGIN}${canonicalUrl.startsWith('/') ? canonicalUrl : `/${canonicalUrl}`}`;

    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:url', fullCanonical);
    updateMetaTag('property', 'og:type', ogType);

    // 4. Canonical Link Tag
    let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', fullCanonical);

  }, [title, description, canonicalUrl, robots, ogType]);

  return null;
};

export default SEOHead;
