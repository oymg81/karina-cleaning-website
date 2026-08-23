import { serviceAreas } from '../data/serviceAreas.ts';

export const CANONICAL_ORIGIN = 'https://cleancareproservice.com';
export const BUSINESS_ID = `${CANONICAL_ORIGIN}/#business`;

export interface RouteMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  locale: string;
  robots?: string;
}

export type ServiceAreaSchemaType = 'AdministrativeArea' | 'City';

export const SERVICE_AREA_SCHEMA_TYPES: Record<string, ServiceAreaSchemaType> = {
  'orange-county': 'AdministrativeArea',
  'glendale': 'City',
  'rosemead': 'City',
};

export function getServiceAreaSchemaEntity(slug: string, name: string) {
  const schemaType = SERVICE_AREA_SCHEMA_TYPES[slug] || 'AdministrativeArea';
  return {
    '@type': schemaType,
    name: `${name}, CA`,
  };
}

export function getCanonicalUrl(path: string): string {
  const cleanPath = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `${CANONICAL_ORIGIN}${cleanPath}`;
}

export function getRobotsForEnvironment(path: string): string {
  const normalizedPath = path.replace(/\/$/, '') || '/';
  if (normalizedPath === '/404') {
    return 'noindex, nofollow';
  }

  // 1. Browser runtime: allow indexing only on canonical production domains
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isProdHost = hostname === 'cleancareproservice.com' || hostname === 'www.cleancareproservice.com';
    return isProdHost ? 'index, follow' : 'noindex, nofollow';
  }

  // 2. Server/build runtime: allow indexing only on exact Vercel production build
  const isVercelProduction = typeof process !== 'undefined' && process.env?.VERCEL_ENV === 'production';
  return isVercelProduction ? 'index, follow' : 'noindex, nofollow';
}

export function getRouteMetadata(path: string, lang: 'en' | 'es' = 'en'): RouteMetadata {
  const normalizedPath = path.replace(/\/$/, '') || '/';
  const robots = getRobotsForEnvironment(normalizedPath);

  if (normalizedPath === '/') {
    return {
      title: lang === 'en'
        ? 'Clean & Care PRO | Professional Cleaning Services in California'
        : 'Clean & Care PRO | Servicios de Limpieza Profesional en California',
      description: lang === 'en'
        ? 'Clean & Care PRO provides residential and commercial cleaning services across its Southern California service areas. Request a free quote today.'
        : 'Clean & Care PRO ofrece servicios de limpieza residencial y comercial en sus áreas de servicio del sur de California. Solicite su estimado gratis.',
      canonicalUrl: `${CANONICAL_ORIGIN}/`,
      ogImage: `${CANONICAL_ORIGIN}/images/cta-cleaning.jpg`,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      locale: lang === 'en' ? 'en_US' : 'es_US',
      robots,
    };
  }

  const matchServiceArea = normalizedPath.match(/^\/service-areas\/([^/]+)$/);
  if (matchServiceArea) {
    const slug = matchServiceArea[1];
    const data = serviceAreas[slug];
    if (data) {
      const content = data[lang] || data.en;
      return {
        title: content.seoTitle,
        description: content.seoDescription,
        canonicalUrl: `${CANONICAL_ORIGIN}${data.canonicalPath}`,
        ogImage: data.heroImage.startsWith('http')
          ? data.heroImage
          : `${CANONICAL_ORIGIN}${data.heroImage.startsWith('/') ? data.heroImage : `/${data.heroImage}`}`,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        locale: lang === 'en' ? 'en_US' : 'es_US',
        robots,
      };
    }
  }

  if (normalizedPath === '/privacy') {
    return {
      title: lang === 'en'
        ? 'Privacy Policy | Clean & Care PRO'
        : 'Política de Privacidad | Clean & Care PRO',
      description: lang === 'en'
        ? 'Learn about how Clean & Care PRO collects, protects, and handles your personal information, quote requests, and communications.'
        : 'Conozca cómo Clean & Care PRO recopila, protege y maneja su información personal, solicitudes de cotización y comunicaciones.',
      canonicalUrl: `${CANONICAL_ORIGIN}/privacy`,
      ogImage: `${CANONICAL_ORIGIN}/images/cta-cleaning.jpg`,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      locale: lang === 'en' ? 'en_US' : 'es_US',
      robots,
    };
  }

  if (normalizedPath === '/terms') {
    return {
      title: lang === 'en'
        ? 'Terms of Service | Clean & Care PRO'
        : 'Términos de Servicio | Clean & Care PRO',
      description: lang === 'en'
        ? 'Read the Clean & Care PRO Terms of Service regarding service agreements, cleaning estimates, scheduling, and satisfaction guarantee.'
        : 'Lea los Términos de Servicio de Clean & Care PRO sobre acuerdos de servicio, presupuestos, programación y garantía de satisfacción.',
      canonicalUrl: `${CANONICAL_ORIGIN}/terms`,
      ogImage: `${CANONICAL_ORIGIN}/images/cta-cleaning.jpg`,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      locale: lang === 'en' ? 'en_US' : 'es_US',
      robots,
    };
  }

  return {
    title: 'Page Not Found | Clean & Care PRO',
    description: 'The requested page could not be found. Clean & Care PRO provides professional cleaning services across California.',
    canonicalUrl: `${CANONICAL_ORIGIN}/404`,
    ogImage: `${CANONICAL_ORIGIN}/images/cta-cleaning.jpg`,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    locale: lang === 'en' ? 'en_US' : 'es_US',
    robots: 'noindex, nofollow',
  };
}

export function getRouteJsonLd(path: string, lang: 'en' | 'es' = 'en'): Record<string, unknown> | null {
  const normalizedPath = path.replace(/\/$/, '') || '/';

  if (normalizedPath === '/') {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': BUSINESS_ID,
      name: 'Clean & Care PRO',
      url: `${CANONICAL_ORIGIN}/`,
      telephone: '+1-714-473-1140',
      email: 'cleancareproservices2@gmail.com',
      image: `${CANONICAL_ORIGIN}/images/cta-cleaning.jpg`,
      areaServed: Object.values(serviceAreas).map(area =>
        getServiceAreaSchemaEntity(area.slug, area.name)
      ),
    };
  }

  const matchServiceArea = normalizedPath.match(/^\/service-areas\/([^/]+)$/);
  if (matchServiceArea) {
    const slug = matchServiceArea[1];
    const data = serviceAreas[slug];
    if (data) {
      const content = data[lang] || data.en;
      const canonicalUrl = `${CANONICAL_ORIGIN}${data.canonicalPath}`;
      const serviceDescription = lang === 'en'
        ? `Residential and commercial cleaning services serving ${data.name}, California.`
        : `Servicios de limpieza residencial y comercial para ${data.name}, California.`;

      return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${canonicalUrl}#service`,
        name: content.heroTitle,
        description: serviceDescription,
        provider: {
          '@id': BUSINESS_ID,
        },
        areaServed: getServiceAreaSchemaEntity(data.slug, data.name),
      };
    }
  }

  if (normalizedPath === '/privacy') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${CANONICAL_ORIGIN}/privacy#webpage`,
      name: lang === 'en' ? 'Privacy Policy' : 'Política de Privacidad',
      url: `${CANONICAL_ORIGIN}/privacy`,
      isPartOf: {
        '@id': BUSINESS_ID,
      },
    };
  }

  if (normalizedPath === '/terms') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${CANONICAL_ORIGIN}/terms#webpage`,
      name: lang === 'en' ? 'Terms of Service' : 'Términos de Servicio',
      url: `${CANONICAL_ORIGIN}/terms`,
      isPartOf: {
        '@id': BUSINESS_ID,
      },
    };
  }

  return null;
}
