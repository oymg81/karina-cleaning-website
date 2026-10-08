import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Phone, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import SEOHead from '../components/SEOHead';
import QuoteForm from '../components/QuoteForm';
import { useLanguage } from '../hooks/useLanguage';
import { getRouteMetadata, getRouteJsonLd } from '../utils/seo';

const QuotePage: React.FC = () => {
  const { language, t } = useLanguage();

  const metadata = useMemo(() => getRouteMetadata('/quote', language), [language]);
  const jsonLd = useMemo(() => getRouteJsonLd('/quote', language), [language]);

  const qp = t.quotePage;

  const trustIcons = [
    <Sparkles key="fast" className="w-5 h-5 text-blue-600" />,
    <ShieldCheck key="licensed" className="w-5 h-5 text-green-600" />,
    <CheckCircle key="guarantee" className="w-5 h-5 text-emerald-600" />,
    <Clock key="flex" className="w-5 h-5 text-blue-600" />,
  ];

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

      <section className="min-h-[85vh] py-12 md:py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-800 font-semibold text-xs sm:text-sm mb-4 border border-green-200 shadow-sm"
            >
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>{qp.badge}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
            >
              {qp.title1} <span className="text-blue-600">{qp.title2}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed"
            >
              {qp.subtitle}
            </motion.p>
          </div>

          {/* Grid: Trust Column + Form Column */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
            
            {/* Left Column: Trust signals & Direct Contact */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-5 flex flex-col gap-6"
            >
              {/* Trust Box */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                  <span>{qp.trustTitle}</span>
                </h2>

                <div className="space-y-5">
                  {qp.trustItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                        {trustIcons[idx % trustIcons.length]}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                        <p className="text-sm text-slate-600 mt-0.5 leading-snug">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
                  {qp.servingNotice}
                </div>
              </div>

              {/* Direct Contact Card */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
                <h3 className="text-lg font-bold mb-2">{qp.directContactTitle}</h3>
                <p className="text-sm text-slate-300 mb-6">
                  {language === 'en'
                    ? 'Reach out immediately via phone or WhatsApp for quick inquiries.'
                    : 'Comuníquese de inmediato por teléfono o WhatsApp para consultas rápidas.'}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="tel:714-473-1140"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <Phone className="w-4 h-4" />
                    <span>714-473-1140</span>
                  </a>

                  <a
                    href="https://wa.me/17144731140"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Focused Lead Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xl"
            >
              <QuoteForm idPrefix="quote-page" />
            </motion.div>

          </div>

        </div>
      </section>
    </>
  );
};

export default QuotePage;
