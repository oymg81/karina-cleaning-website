export interface ServiceAreaFaq {
  question: string;
  answer: string;
}

export interface ServiceAreaServiceItem {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  badge?: string;
  features: string[];
}

export interface ServiceAreaProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface ServiceAreaWhyChooseItem {
  title: string;
  description: string;
  icon: 'shield' | 'sparkles' | 'calendar' | 'leaf' | 'check' | 'clock';
}

export interface ServiceAreaContent {
  seoTitle: string;
  seoDescription: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageAlt: string;
  introHeading: string;
  introText: string;
  servicesHeading: string;
  servicesSubtitle: string;
  servicesList: ServiceAreaServiceItem[];
  whyChooseHeading: string;
  whyChooseSubtitle: string;
  whyChooseItems: ServiceAreaWhyChooseItem[];
  processHeading: string;
  processSubtitle: string;
  processSteps: ServiceAreaProcessStep[];
  coverageHeading: string;
  coverageText: string;
  communitiesList: string[];
  otherAreasHeading: string;
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
  heroImageAlt: string;
  en: ServiceAreaContent;
  es: ServiceAreaContent;
}
