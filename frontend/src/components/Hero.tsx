import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

const Hero: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section id="home" className="pt-32 pb-24 bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white -z-10" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium text-sm mb-6 border border-blue-100">
            <CheckCircle className="w-4 h-4" />
            <span>{t.hero.topRated}</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-slate-900 mb-6">
            {t.hero.title1} <span className="text-blue-600">{t.hero.title2}</span> {t.hero.title3}
          </h1>

          <p className="text-slate-600 leading-relaxed text-lg sm:text-xl mb-8 max-w-xl">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link
              to="/quote"
              className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-bold transition-all text-center shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2"
            >
              <span>{t.navbar.quote}</span>
            </Link>
            <a
              href="#service-areas"
              className="border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 px-6 py-3.5 rounded-xl font-semibold transition-all text-center"
            >
              {language === 'en' ? 'View Service Areas' : 'Ver Áreas de Servicio'}
            </a>
          </div>

          <div className="flex items-center gap-2 text-slate-500 font-medium text-sm sm:text-base">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>{t.hero.trustText}</span>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative">
            <img
              src="/images/cta-cleaning.jpg"
              alt="Professional cleaner in a modern living room"
              className="w-full max-w-[550px] h-[500px] object-cover rounded-3xl shadow-2xl"
            />

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 hidden md:flex"
            >
              <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <p className="font-extrabold text-navy text-lg">100%</p>
                <p className="text-slate-500 text-sm font-medium">{t.hero.guaranteed}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
