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

export function findServiceAreaByPath(normalizedPath: string) {
  const matchServiceArea = normalizedPath.match(/^\/service-areas\/([^/]+)$/);
  if (matchServiceArea) {
    const slug = matchServiceArea[1];
    return serviceAreas[slug];
  }
  return Object.values(serviceAreas).find(area => area.canonicalPath === normalizedPath);
}

export function getRouteMetadata(path: string, lang: 'en' | 'es' = 'en'): RouteMetadata {
  const normalizedPath = path.replace(/\/$/, '') || '/';
  const robots = getRobotsForEnvironment(normalizedPath);

  if (normalizedPath === '/') {
    return {
      title: lang === 'en'
        ? 'Clean & Care PRO | House & Commercial Cleaning in Orange County & LA'
        : 'Clean & Care PRO | Limpieza Residencial y Comercial en Orange County y LA',
      description: lang === 'en'
        ? 'Clean & Care PRO provides professional house cleaning, deep cleaning, and commercial office cleaning across Orange County and the greater LA area. Get a free quote!'
        : 'Clean & Care PRO ofrece servicios profesionales de limpieza residencial, profunda y comercial en Orange County y el área de Los Ángeles. ¡Solicite su estimado gratis!',
      canonicalUrl: `${CANONICAL_ORIGIN}/`,
      ogImage: `${CANONICAL_ORIGIN}/images/cta-cleaning.jpg`,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      locale: lang === 'en' ? 'en_US' : 'es_US',
      robots,
    };
  }

  const data = findServiceAreaByPath(normalizedPath);
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

  if (normalizedPath === '/quote') {
    return {
      title: lang === 'en'
        ? 'Free Cleaning Estimate | Clean & Care PRO'
        : 'Estimado de Limpieza Gratis | Clean & Care PRO',
      description: lang === 'en'
        ? 'Request a free cleaning estimate from Clean & Care PRO for professional residential or commercial cleaning services in California.'
        : 'Solicite un estimado de limpieza gratuito de Clean & Care PRO para servicios profesionales de limpieza residencial o comercial en California.',
      canonicalUrl: `${CANONICAL_ORIGIN}/quote`,
      ogImage: `${CANONICAL_ORIGIN}/images/cta-cleaning.jpg`,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      locale: lang === 'en' ? 'en_US' : 'es_US',
      robots,
    };
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
      priceRange: '$$',
      sameAs: [
        'https://www.facebook.com/cleankarinaservices',
        'https://www.instagram.com/casitaslimpias2',
        'https://www.tiktok.com/@cleancare.resident',
        'https://maps.google.com/?cid=4307456130143080446',
      ],
      areaServed: Object.values(serviceAreas).map(area =>
        getServiceAreaSchemaEntity(area.slug, area.name)
      ),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: lang === 'en' ? 'Professional Cleaning Services' : 'Servicios de Limpieza Profesional',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: lang === 'en' ? 'Residential & House Cleaning' : 'Limpieza Residencial y de Casas',
              description: lang === 'en'
                ? 'Standard and recurring house cleaning, dusting, sanitization, and floor care for homes across Orange County and Southern California.'
                : 'Limpieza residencial recurrente y estándar, desempolvado, desinfección y cuidado de pisos en Orange County y el sur de California.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: lang === 'en' ? 'Deep Cleaning & Sanitization' : 'Limpieza Profunda y Desinfección',
              description: lang === 'en'
                ? 'Intensive top-to-bottom scrubbing of kitchens, bathrooms, tile grout, baseboards, and hard-to-reach areas.'
                : 'Desinfección intensiva de cocinas, baños, lechada de azulejos, rodapiés y áreas de difícil acceso.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: lang === 'en' ? 'Move-In / Move-Out Turnover Cleaning' : 'Limpieza de Mudanza (Move-In / Move-Out)',
              description: lang === 'en'
                ? 'Complete turnover and deposit-ready cleaning for tenants, homeowners, and realtors preparing properties for immediate occupancy.'
                : 'Limpieza completa para entrega de depósitos y mudanzas para inquilinos, propietarios y agentes inmobiliarios.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: lang === 'en' ? 'Commercial & Office Cleaning' : 'Limpieza Comercial y de Oficinas',
              description: lang === 'en'
                ? 'Reliable workplace, office, and small business janitorial maintenance tailored to commercial schedules.'
                : 'Mantenimiento y conserjería confiable para oficinas y pequeños negocios adaptado a horarios comerciales.',
            },
          },
        ],
      },
    };
  }

  const data = findServiceAreaByPath(normalizedPath);
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

  if (normalizedPath === '/quote') {
    return {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      '@id': `${CANONICAL_ORIGIN}/quote#webpage`,
      name: lang === 'en' ? 'Free Cleaning Estimate' : 'Estimado de Limpieza Gratis',
      url: `${CANONICAL_ORIGIN}/quote`,
      description: lang === 'en'
        ? 'Request a free cleaning estimate from Clean & Care PRO for residential and commercial cleaning services.'
        : 'Solicite un estimado de limpieza gratuito de Clean & Care PRO para servicios de limpieza residencial y comercial.',
      isPartOf: {
        '@id': BUSINESS_ID,
      },
    };
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
