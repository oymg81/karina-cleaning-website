export interface ServiceAreaFaq {
  question: string;
  answer: string;
}

export interface ServiceAreaHighlight {
  title: string;
  description: string;
}

export interface ServiceAreaContent {
  seoTitle: string;
  seoDescription: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  introHeading: string;
  introText: string;
  highlightsHeading: string;
  highlights: ServiceAreaHighlight[];
  coverageHeading: string;
  coverageText: string;
  trustPointsHeading: string;
  trustPoints: string[];
  faqHeading: string;
  faqs: ServiceAreaFaq[];
  statusNotice: string;
}

export interface ServiceAreaData {
  slug: 'orange-county' | 'glendale' | 'rosemead';
  name: string;
  canonicalPath: string;
  heroImage: string;
  en: ServiceAreaContent;
  es: ServiceAreaContent;
}
