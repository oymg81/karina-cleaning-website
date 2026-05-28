import React from 'react';
import { Clock, Calendar, Phone, Building2 } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { useLanguage } from '../LanguageContext';

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

const BusinessHours: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="hours" className="py-20 bg-white relative overflow-hidden border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium text-sm mb-4 border border-blue-100">
            <Building2 className="w-4 h-4" />
            <span>{t.schedule.subtitle}</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-navy mb-4 tracking-tight leading-tight">
            {t.schedule.title}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {t.schedule.desc}
          </p>
        </div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {/* Card 1: Residential Cleaning */}
          <motion.div
            variants={cardVariants}
            className="bg-slate-50 rounded-2xl p-8 border border-slate-100 flex flex-col items-center text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full"
          >
            <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-6 shadow-inner">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-4">{t.schedule.residentialTitle}</h3>
            <p className="text-blue-600 font-bold text-sm tracking-wide uppercase mb-1">{t.schedule.residentialDays}</p>
            <p className="text-slate-600 font-medium">{t.schedule.residentialHours}</p>
          </motion.div>

          {/* Card 2: Commercial Cleaning */}
          <motion.div
            variants={cardVariants}
            className="bg-slate-50 rounded-2xl p-8 border border-slate-100 flex flex-col items-center text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full justify-between"
          >
            <div className="flex flex-col items-center w-full">
              <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-6 shadow-inner">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-4">{t.schedule.commercialTitle}</h3>
            </div>
            <p className="text-slate-600 font-medium my-auto mt-4">{t.schedule.commercialHours}</p>
          </motion.div>

          {/* Card 3: Weekend Service */}
          <motion.div
            variants={cardVariants}
            className="bg-slate-50 rounded-2xl p-8 border border-slate-100 flex flex-col items-center text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full justify-between"
          >
            <div className="flex flex-col items-center w-full">
              <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-6 shadow-inner">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-4">{t.schedule.weekendTitle}</h3>
            </div>
            <p className="text-slate-600 font-medium my-auto mt-4">{t.schedule.weekendHours}</p>
          </motion.div>
        </motion.div>

        {/* Footer Accent Note */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center"
        >
          <a
            href="tel:714-473-1140"
            className="inline-flex items-center gap-3 bg-blue-50 text-blue-700 px-6 py-4 rounded-2xl border border-blue-100 hover:bg-blue-100/60 font-bold transition-all shadow-sm hover:shadow-md max-w-full text-center text-sm md:text-base cursor-pointer"
          >
            <Phone className="w-5 h-5 text-blue-600 shrink-0" />
            <span>{t.schedule.customPlans}</span>
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default BusinessHours;
