import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, CheckCircle, Sparkles, Building2, Home } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export const HomeServiceAreas: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const areas = [
    {
      title: isEn ? 'Orange County, CA' : 'Orange County, CA',
      link: '/orange-county-cleaning-services',
      anchor: isEn ? 'cleaning services in Orange County' : 'servicios de limpieza en Orange County',
      icon: Home,
      desc: isEn
        ? 'Professional house cleaning, deep sanitization, move-in/move-out turnovers, and commercial janitorial care across all Orange County communities.'
        : 'Limpieza profesional de casas, desinfección profunda, entregas de mudanza y conserjería comercial en comunidades de Orange County.',
      communities: isEn
        ? ['Irvine', 'Anaheim', 'Santa Ana', 'Huntington Beach', 'Fullerton']
        : ['Irvine', 'Anaheim', 'Santa Ana', 'Huntington Beach', 'Fullerton'],
    },
    {
      title: isEn ? 'Glendale & Surrounding Area' : 'Glendale y Áreas Cercanas',
      link: '/glendale-cleaning-services',
      anchor: isEn ? 'cleaning services in Glendale' : 'servicios de limpieza en Glendale',
      icon: Sparkles,
      desc: isEn
        ? 'Trusted residential maid services, apartment turnovers, and customized office cleaning throughout Glendale, Burbank, and Pasadena areas.'
        : 'Servicios de limpieza residencial de confianza, preparación de apartamentos y limpieza de oficinas en Glendale, Burbank y Pasadena.',
      communities: isEn
        ? ['Glendale', 'Burbank', 'Pasadena', 'La Crescenta']
        : ['Glendale', 'Burbank', 'Pasadena', 'La Crescenta'],
    },
    {
      title: isEn ? 'Rosemead & San Gabriel Valley' : 'Rosemead y San Gabriel Valley',
      link: '/rosemead-cleaning-services',
      anchor: isEn ? 'cleaning services in Rosemead' : 'servicios de limpieza en Rosemead',
      icon: Building2,
      desc: isEn
        ? 'Dedicated residential and small business cleaning teams serving Rosemead, El Monte, Arcadia, and San Gabriel Valley neighborhoods.'
        : 'Equipos dedicados de limpieza residencial y comercial en vecindarios de Rosemead, El Monte, Arcadia y el Valle de San Gabriel.',
      communities: isEn
        ? ['Rosemead', 'El Monte', 'Arcadia', 'Temple City', 'Alhambra']
        : ['Rosemead', 'El Monte', 'Arcadia', 'Temple City', 'Alhambra'],
    },
  ];

  return (
    <section id="service-areas" className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/70 text-blue-700 font-semibold text-xs sm:text-sm mb-4 border border-blue-200 shadow-xs">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>{isEn ? 'Local Service Coverage' : 'Cobertura de Servicio Local'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            {isEn
              ? 'Dedicated Cleaning Teams Across Southern California'
              : 'Equipos de Limpieza Dedicados en el Sur de California'}
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            {isEn
              ? 'Clean & Care PRO provides dependable house cleaning, deep cleaning, and commercial janitorial solutions across our primary regional service hubs. Explore our localized cleaning teams below:'
              : 'Clean & Care PRO ofrece soluciones confiables de limpieza residencial, profunda y comercial en nuestros centros de servicio regionales:'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {areas.map((area, idx) => {
            const Icon = area.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {area.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-5">
                    {area.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {area.communities.map((comm, cIdx) => (
                      <span
                        key={cIdx}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium"
                      >
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        {comm}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to={area.link}
                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <span>{isEn ? `Explore ${area.anchor}` : `Ver ${area.anchor}`}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              {isEn ? 'Need cleaning services outside these specific zones?' : '¿Necesita servicio de limpieza en otra zona?'}
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {isEn
                ? 'We also accommodate requests across Los Angeles, Upland, Fontana, and Corona. Contact us directly to confirm availability.'
                : 'También atendemos solicitudes en Los Ángeles, Upland, Fontana y Corona. Contáctenos para confirmar disponibilidad.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 shrink-0 w-full md:w-auto">
            <Link
              to="/quote"
              className="bg-[#5FE873] hover:bg-[#4cd260] text-slate-950 px-6 py-3.5 rounded-xl font-bold text-sm text-center shadow-md hover:shadow-lg transition-all"
            >
              {isEn ? 'Request a Free Cleaning Estimate' : 'Solicitar un Estimado Gratis'}
            </Link>
            <a
              href="tel:+17144731140"
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-3.5 rounded-xl font-semibold text-sm text-center border border-white/20 transition-all"
            >
              (714) 473-1140
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeServiceAreas;
