import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Phone, CheckCircle, HelpCircle, ChevronDown, MapPin, Sparkles } from 'lucide-react';
import { serviceAreas } from '../data/serviceAreas';
import { useLanguage } from '../hooks/useLanguage';
import SEOHead from '../components/SEOHead';
import ReviewsSection from '../components/ReviewsSection';
import CtaSection from '../components/CtaSection';

interface ServiceAreaPageProps {
  slug?: string;
}

const ServiceAreaPage: React.FC<ServiceAreaPageProps> = ({ slug: propSlug }) => {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const activeSlug = propSlug || paramSlug;
  const { language } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  if (!activeSlug || !serviceAreas[activeSlug]) {
    return <Navigate to="/404" replace />;
  }

  const data = serviceAreas[activeSlug];
  const content = data[language] || data.en;

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <>
      <SEOHead
        title={content.seoTitle}
        description={content.seoDescription}
        canonicalUrl={data.canonicalPath}
        robots="noindex, nofollow"
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-white relative overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Preparation Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs md:text-sm mb-6 border border-blue-100 shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>{content.heroBadge}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              {content.heroTitle}
            </h1>

            <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-8">
              {content.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href="#contact"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl hover:shadow-blue-600/20 text-center text-base"
              >
                {language === 'en' ? 'Request a Free Quote' : 'Solicitar Cotización Gratis'}
              </a>
              <a
                href="tel:7144731140"
                className="inline-flex items-center justify-center gap-3 bg-slate-100 hover:bg-slate-200 text-slate-900 px-8 py-4 rounded-2xl font-bold transition-all text-base"
              >
                <Phone className="w-5 h-5 text-blue-600" />
                <span>(714) 473-1140</span>
              </a>
            </div>

            <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <span>{language === 'en' ? 'Licensed • Insured • Free Estimates' : 'Con Licencia • Asegurados • Estimados Gratis'}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[540px]">
              <img
                src={data.heroImage}
                alt={`${data.name} Cleaning Services`}
                className="w-full h-[440px] object-cover rounded-3xl shadow-2xl border border-slate-100"
              />
              <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 hidden sm:flex">
                <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold text-xl">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-base">{data.name}, CA</p>
                  <p className="text-slate-500 text-xs font-medium">Clean & Care PRO</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Notice Banner */}
      <section className="py-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="p-4 md:p-6 rounded-2xl bg-white border border-blue-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-slate-700 text-sm md:text-base leading-relaxed">
                {content.statusNotice}
              </p>
            </div>
            <a
              href="tel:7144731140"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-sm shrink-0 whitespace-nowrap"
            >
              <span>{language === 'en' ? 'Call Now' : 'Llamar Ahora'}</span>
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Introduction & Highlights Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-14">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">
              {content.coverageHeading}
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {content.introHeading}
            </h3>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              {content.introText}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {content.highlights.map((highlight, idx) => (
              <div
                key={idx}
                className="bg-[linear-gradient(135deg,#F4F6F8_0%,#B6BBC2_100%)] border border-[#B6BBC2]/55 rounded-2xl p-8 shadow-[0_12px_28px_rgba(15,23,42,0.10)] hover:shadow-[0_18px_36px_rgba(15,23,42,0.14)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 shadow-inner">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{highlight.title}</h4>
                <p className="text-slate-700 text-sm md:text-base leading-relaxed flex-grow">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Points */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-10">
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              {content.trustPointsHeading}
            </h3>
            <p className="text-slate-600 text-sm md:text-base">
              {content.coverageText}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {content.trustPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-slate-800 text-sm md:text-base font-medium">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 font-semibold text-xs mb-3">
              <HelpCircle className="w-4 h-4" />
              <span>FAQ</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {content.faqHeading}
            </h3>
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
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-blue-600 transition-colors"
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

      {/* Customer Reviews Section */}
      <ReviewsSection />

      {/* Embedded Quote Form Section */}
      <CtaSection />
    </>
  );
};

export default ServiceAreaPage;
