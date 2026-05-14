import React from 'react';
import { Home, Building2, Sparkles, Truck, Briefcase, Key, ArrowRight } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { useLanguage } from '../LanguageContext';

const icons = [Home, Building2, Sparkles, Truck, Briefcase, Key];

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
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col h-full group"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                  <IconComponent className="w-7 h-7" />
                </div>
                
                <h4 className="text-xl font-bold text-navy mb-3">{service.title}</h4>
                <p className="text-slate-600 mb-6 flex-grow leading-relaxed">{service.description}</p>
                
                <a href="#contact" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors mt-auto">
                  {t.services.learnMore} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default Services;
