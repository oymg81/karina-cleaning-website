import React from 'react';
import Hero from '../components/Hero';
import BusinessHours from '../components/BusinessHours';
import Services from '../components/Services';
import About from '../components/About';
import ReviewsSection from '../components/ReviewsSection';
import CtaSection from '../components/CtaSection';
import SEOHead from '../components/SEOHead';
import { useLanguage } from '../hooks/useLanguage';

const HomePage: React.FC = () => {
  const { language } = useLanguage();

  const seoTitle = language === 'en'
    ? 'Clean & Care PRO | Professional Cleaning Services in California'
    : 'Clean & Care PRO | Servicios de Limpieza Profesional en California';

  const seoDescription = language === 'en'
    ? 'Clean & Care PRO provides top-quality residential and commercial cleaning services across California. Licensed, insured, and satisfaction guaranteed. Request a free quote today.'
    : 'Clean & Care PRO ofrece servicios de limpieza residencial y comercial de alta calidad en California. Con licencia, seguro y satisfacción garantizada. Solicite su estimado gratis.';

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonicalUrl="https://cleancareproservice.com/"
        robots="index, follow"
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
