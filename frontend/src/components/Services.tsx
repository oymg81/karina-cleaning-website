import React, { useState, useEffect } from 'react';
import { Home, Building2, Sparkles, Truck, Briefcase, Key, ArrowRight, X, Check } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';

const icons = [Home, Sparkles, Truck, Briefcase, Building2, Key];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const Services: React.FC = () => {
  const { t } = useLanguage();
  const [activeService, setActiveService] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveService(null);
      }
    };

    if (activeService !== null) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeService]);

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setActiveService(null);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const y = contactSection.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleLearnMoreClick = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    e.preventDefault();
    setActiveService(index);
  };

  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">{t.services.subtitle}</h2>
          <h3 className="text-4xl lg:text-5xl font-extrabold text-navy mb-4 tracking-tight">
            {t.services.title}
          </h3>
          <p className="text-lg text-slate-600 leading-relaxed">
            {t.services.desc}
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {t.services.list.map((service, index) => {
            const IconComponent = icons[index];
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="bg-[linear-gradient(135deg,#F4F6F8_0%,#B6BBC2_100%)] border border-[#B6BBC2]/55 rounded-2xl p-8 shadow-[0_12px_28px_rgba(15,23,42,0.10)] hover:shadow-[0_18px_36px_rgba(15,23,42,0.14)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                  <IconComponent className="w-7 h-7" />
                </div>
                
                <h4 className="text-xl font-bold text-navy mb-3">{service.title}</h4>
                <p className="text-slate-600 mb-6 flex-grow leading-relaxed">{service.description}</p>
                
                <a
                  href="#"
                  onClick={(e) => handleLearnMoreClick(e, index)}
                  className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors mt-auto"
                >
                  {t.services.learnMore} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            );
          })}
        </motion.div>

      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {activeService !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveService(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative z-10 border border-slate-100"
            >
              {/* Header with Close */}
              <div className="p-6 md:p-8 flex items-start justify-between border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
                    {React.createElement(icons[activeService], { className: "w-6 h-6" })}
                  </div>
                  <h3 className="text-2xl font-extrabold text-navy">
                    {t.services.list[activeService].title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveService(null)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer border border-transparent hover:border-slate-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-8 flex-grow">
                {/* Intro */}
                <div>
                  <p className="text-slate-600 leading-relaxed text-base md:text-lg">
                    {t.services.list[activeService].modal.intro}
                  </p>
                </div>

                {/* Grid for What's Included and Best For */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* What's Included */}
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-navy text-lg flex items-center gap-2">
                      <span className="w-1.5 h-6 rounded-full bg-blue-600" />
                      {t.services.list[activeService].modal.whatsIncludedTitle}
                    </h4>
                    <ul className="space-y-2.5">
                      {t.services.list[activeService].modal.whatsIncluded.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2.5 text-slate-600 text-sm md:text-base leading-relaxed">
                          <Check className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Best For / Businesses We Serve */}
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-navy text-lg flex items-center gap-2">
                      <span className="w-1.5 h-6 rounded-full bg-blue-600" />
                      {t.services.list[activeService].modal.bestForTitle}
                    </h4>
                    <ul className="space-y-2.5">
                      {t.services.list[activeService].modal.bestFor.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2.5 text-slate-600 text-sm md:text-base leading-relaxed">
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-2" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
                <a
                  href="#contact"
                  onClick={handleContactClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold transition-all text-center shadow-lg hover:shadow-xl hover:shadow-blue-600/20 w-full sm:w-auto"
                >
                  {t.navbar.quote}
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Services;
