import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, ThumbsUp, Leaf } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const icons = [Users, ShieldCheck, ThumbsUp, Leaf];

const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative w-full">
              <img
                src="/images/hero-cleaning.jpg"
                alt="Clean & Care PRO professional cleaning team"
                className="w-full h-[500px] object-cover rounded-3xl shadow-xl"
              />
            </div>
            
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-50 rounded-full -z-10 hidden md:block" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-slate-50 rounded-full -z-10 hidden md:block" />
          </motion.div>

          {/* Right Content */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">{t.about.subtitle}</h2>
              <h3 className="text-4xl lg:text-5xl font-extrabold text-navy mb-6 leading-tight tracking-tight">
                {t.about.title}
              </h3>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                {t.about.desc}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-6 mt-10">
              {t.about.list.map((item, index) => {
                const IconComponent = icons[index];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex flex-col gap-3"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-navy">{item.title}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
