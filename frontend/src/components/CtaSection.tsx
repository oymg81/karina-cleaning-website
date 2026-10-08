import React from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import QuoteForm from './QuoteForm';

const CtaSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-24 bg-[#5FE873] text-[#0F172A] relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/about-team.jpg"
          alt="Cleaning service professional"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#5FE873]/90 backdrop-blur-sm" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-[#0F172A]"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-[#0F172A] tracking-tight">
              {t.cta.title1} <span className="text-blue-700">{t.cta.title2}</span>
            </h2>
            <p className="text-lg text-[#0F172A]/85 mb-8 max-w-lg leading-relaxed font-normal">
              {t.cta.desc}
            </p>
            
            <div className="mt-12 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0F172A]/10 flex items-center justify-center shrink-0 border border-[#0F172A]/20">
                  <div className="w-4 h-4 rounded-full bg-blue-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#0F172A]">{t.cta.fastQuotes}</h4>
                  <p className="text-[#0F172A]/75 text-sm mt-1">Get your personalized quote quickly and easily.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0F172A]/10 flex items-center justify-center shrink-0 border border-[#0F172A]/20">
                  <div className="w-4 h-4 rounded-full bg-blue-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#0F172A]">{t.cta.flexible}</h4>
                  <p className="text-[#0F172A]/75 text-sm mt-1">We work around your schedule, not the other way around.</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <a href="tel:714-473-1140" className="bg-[#0F172A] text-white hover:bg-slate-900 px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl w-full sm:w-auto">
                <Phone className="w-6 h-6 text-white" />
                {t.cta.call} 714-473-1140
              </a>
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-2xl text-slate-900 relative"
          >
            <QuoteForm idPrefix="cta" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default CtaSection;
