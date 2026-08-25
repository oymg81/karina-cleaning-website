import React, { useState, useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Phone,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  MapPin,
  Sparkles,
  ArrowRight,
  Check,
  Calendar,
  Clock,
  Leaf,
  ChevronRight
} from 'lucide-react';
import { serviceAreas } from '../data/serviceAreas';
import { useLanguage } from '../hooks/useLanguage';
import SEOHead from '../components/SEOHead';
import ReviewsSection from '../components/ReviewsSection';
import CtaSection from '../components/CtaSection';
import { getRouteMetadata, getRouteJsonLd } from '../utils/seo';

interface ServiceAreaPageProps {
  slug?: string;
}

const ServiceAreaPage: React.FC<ServiceAreaPageProps> = ({ slug: propSlug }) => {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const activeSlug = propSlug || paramSlug;
  const { language } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const data = activeSlug ? serviceAreas[activeSlug] : undefined;
  const content = data ? (data[language] || data.en) : undefined;
  const currentPath = data ? `/service-areas/${data.slug}` : '';

  const metadata = useMemo(() => {
    if (!data) return undefined;
    return getRouteMetadata(currentPath, language);
  }, [data, currentPath, language]);

  const jsonLd = useMemo(() => {
    if (!data) return undefined;
    return getRouteJsonLd(currentPath, language);
  }, [data, currentPath, language]);

  if (!activeSlug || !serviceAreas[activeSlug] || !data || !content || !metadata) {
    return <Navigate to="/404" replace />;
  }

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleScrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const y = contactSection.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const getWhyChooseIcon = (iconName: string) => {
    switch (iconName) {
      case 'shield':
        return <ShieldCheck className="w-6 h-6 text-blue-600" />;
      case 'leaf':
        return <Leaf className="w-6 h-6 text-green-600" />;
      case 'calendar':
        return <Calendar className="w-6 h-6 text-blue-600" />;
      case 'clock':
        return <Clock className="w-6 h-6 text-blue-600" />;
      case 'sparkles':
        return <Sparkles className="w-6 h-6 text-yellow-500" />;
      case 'check':
      default:
        return <CheckCircle className="w-6 h-6 text-green-600" />;
    }
  };

  const otherAreaSlugs = (['orange-county', 'glendale', 'rosemead'] as const).filter(
    (s) => s !== data.slug
  );

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

      {/* Breadcrumbs Navigation */}
      <nav aria-label="Breadcrumb" className="bg-slate-50 border-b border-slate-200/70 py-3">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-xs md:text-sm text-slate-500 font-medium overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            {language === 'en' ? 'Home' : 'Inicio'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-600">
            {language === 'en' ? 'Service Areas' : 'Áreas de Servicio'}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-blue-700 font-semibold">{data.name}, CA</span>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-white pt-10 pb-16 lg:pt-14 lg:pb-24">
        {/* Subtle background ambient circles */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none -ml-24 -mb-24" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-14 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/90 text-blue-900 font-semibold text-xs tracking-wide shadow-sm border border-blue-200/60">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{content.heroBadge}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              {content.heroTitle}
            </h1>

            <p className="text-lg md:text-xl text-slate-600 font-normal leading-relaxed max-w-xl">
              {content.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href="#contact"
                onClick={handleScrollToContact}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl hover:shadow-blue-600/25 text-center text-base inline-flex items-center justify-center gap-2"
              >
                <span>{language === 'en' ? 'Request a Free Quote' : 'Solicitar Cotización Gratis'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="tel:7144731140"
                className="inline-flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-bold transition-all shadow-sm hover:shadow-md text-base"
              >
                <Phone className="w-5 h-5 text-blue-600" />
                <span>(714) 473-1140</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-slate-600 font-medium text-sm">
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-full border border-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{language === 'en' ? 'Licensed & Insured' : 'Con Licencia y Seguro'}</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3.5 py-1.5 rounded-full border border-blue-200">
                <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{language === 'en' ? 'Free No-Obligation Quotes' : 'Estimados Sin Compromiso'}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[560px]">
              <div className="overflow-hidden rounded-3xl shadow-2xl border border-slate-100 bg-slate-100 aspect-[4/3]">
                <img
                  src={data.heroImage}
                  alt={content.heroImageAlt || `${data.name} Cleaning Services`}
                  width="800"
                  height="600"
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Floating Local Credential Badge */}
              <div className="absolute -bottom-6 -left-4 sm:left-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-200/80 flex items-center gap-3.5 z-20">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl shrink-0 shadow-inner">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-base">{data.name}, CA</p>
                  <p className="text-slate-500 text-xs font-semibold">
                    {language === 'en' ? 'Clean & Care PRO Service Area' : 'Área de Servicio Clean & Care PRO'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Active Service Notice Banner */}
      <section className="py-6 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="p-4 md:p-6 rounded-2xl bg-white border border-blue-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-slate-700 text-sm md:text-base leading-relaxed font-normal">
                {content.statusNotice}
              </p>
            </div>
            <a
              href="tel:7144731140"
              className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-5 py-2.5 rounded-xl font-bold text-sm shrink-0 whitespace-nowrap transition-colors border border-blue-200"
            >
              <Phone className="w-4 h-4 text-blue-600" />
              <span>(714) 473-1140</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. Introduction & Coverage Focus */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider mb-3 border border-blue-100">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>{content.coverageHeading}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {content.introHeading}
            </h2>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed font-normal">
              {content.introText}
            </p>
          </div>

          {/* 4. Dedicated Services Grid with Real Assigned Images */}
          <div className="mt-8">
            <div className="mb-10">
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                {content.servicesHeading}
              </h3>
              <p className="text-slate-600 text-sm md:text-base mt-2">
                {content.servicesSubtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.servicesList.map((service, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={service.image}
                      alt={service.imageAlt}
                      width="600"
                      height="375"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {service.badge && (
                      <span className="absolute top-4 right-4 bg-blue-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-6 md:p-7 flex flex-col flex-grow">
                    <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h4>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
                      {service.description}
                    </p>

                    <div className="mt-auto space-y-2.5 pt-4 border-t border-slate-100">
                      {service.features.map((feat, featIdx) => (
                        <div key={featIdx} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 mt-4">
                      <a
                        href="#contact"
                        onClick={handleScrollToContact}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-sm transition-colors"
                      >
                        <span>{language === 'en' ? 'Get Quote for This Service' : 'Cotizar Este Servicio'}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Clean & Care PRO */}
      <section className="py-16 lg:py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              {content.whyChooseHeading}
            </h2>
            <p className="text-slate-600 text-base md:text-lg">
              {content.whyChooseSubtitle}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.whyChooseItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-5 border border-blue-100">
                  {getWhyChooseIcon(item.icon)}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. How It Works (4 Steps) */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider mb-3 border border-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === 'en' ? 'Simple Process' : 'Proceso Sencillo'}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              {content.processHeading}
            </h2>
            <p className="text-slate-600 text-base md:text-lg">
              {content.processSubtitle}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {content.processSteps.map((stepItem, idx) => (
              <div key={idx} className="relative flex flex-col items-start bg-slate-50/80 p-7 rounded-3xl border border-slate-200/80">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center mb-5 shadow-md shadow-blue-600/20">
                  {stepItem.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{stepItem.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{stepItem.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="#contact"
              onClick={handleScrollToContact}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:shadow-blue-600/20 transition-all text-base"
            >
              <span>{language === 'en' ? 'Start With a Free Estimate' : 'Comience con un Estimado Gratis'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 7. Local Communities & Inter-area Navigation */}
      <section className="py-14 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>{content.coverageHeading}</span>
              </h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                {content.coverageText}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {content.communitiesList.map((comm, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs md:text-sm font-medium shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    {comm}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h4 className="text-base font-bold text-slate-900 mb-3">
                {content.otherAreasHeading}
              </h4>
              <p className="text-slate-500 text-xs mb-4">
                {language === 'en'
                  ? 'Clean & Care PRO proudly provides dedicated cleaning services in multiple California zones:'
                  : 'Clean & Care PRO ofrece servicios profesionales en múltiples zonas de California:'}
              </p>
              <div className="space-y-2.5">
                {otherAreaSlugs.map((otherSlug) => {
                  const otherArea = serviceAreas[otherSlug];
                  return (
                    <Link
                      key={otherSlug}
                      to={otherArea.canonicalPath}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-700 border border-slate-200/80 transition-colors font-semibold text-sm group"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        {otherArea.name}, CA
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Verified Customer Reviews */}
      <ReviewsSection />

      {/* 9. Local Frequently Asked Questions */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider mb-3 border border-blue-100">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>FAQ</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {content.faqHeading}
            </h2>
          </div>

          <div className="space-y-4">
            {content.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-colors bg-slate-50/50"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  >
                    <span className="text-base md:text-lg">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-500 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-100 bg-white">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. Embedded Real Quote Form & Direct Call */}
      <CtaSection />
    </>
  );
};

export default ServiceAreaPage;
