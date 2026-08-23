import React, { useMemo } from 'react';
import Hero from '../components/Hero';
import BusinessHours from '../components/BusinessHours';
import Services from '../components/Services';
import About from '../components/About';
import ReviewsSection from '../components/ReviewsSection';
import CtaSection from '../components/CtaSection';
import SEOHead from '../components/SEOHead';
import { useLanguage } from '../hooks/useLanguage';
import { getRouteMetadata, getRouteJsonLd } from '../utils/seo';

const HomePage: React.FC = () => {
  const { language } = useLanguage();

  const metadata = useMemo(() => getRouteMetadata('/', language), [language]);
  const jsonLd = useMemo(() => getRouteJsonLd('/', language), [language]);

  return (
    <>
      <SEOHead
        title={metadata.title}
        description={metadata.description}
        canonicalUrl={metadata.canonicalUrl}
        ogImage={metadata.ogImage}
        ogType={metadata.ogType}
        twitterCard={metadata.twitterCard}
        locale={metadata.locale}
        robots={metadata.robots}
        jsonLd={jsonLd}
      />
      <Hero />
      <BusinessHours />
      <Services />
      <About />
      <ReviewsSection />
      <CtaSection />
    </>
  );
};

export default HomePage;
