import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Phone } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import SEOHead from '../components/SEOHead';

const NotFoundPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <>
      <SEOHead
        title={language === 'en' ? 'Page Not Found | Clean & Care PRO' : 'Página No Encontrada | Clean & Care PRO'}
        description={language === 'en' ? 'The requested page could not be found.' : 'La página solicitada no pudo ser encontrada.'}
        canonicalUrl="https://cleancareproservice.com/404"
        robots="noindex, nofollow"
      />

      <section className="py-32 bg-slate-50 flex items-center justify-center min-h-[70vh]">
        <div className="max-w-xl mx-auto px-6 text-center">
          <span className="text-6xl md:text-8xl font-extrabold text-blue-600 tracking-tight">404</span>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-4 mb-4">
            {language === 'en' ? 'Page Not Found' : 'Página No Encontrada'}
          </h1>

          <p className="text-slate-600 text-base md:text-lg mb-8 leading-relaxed">
            {language === 'en'
              ? 'Sorry, the page you are looking for does not exist or may have been moved. Return home or contact our team for assistance.'
              : 'Lo sentimos, la página que busca no existe o ha sido movida. Regrese al inicio o contáctenos si necesita ayuda.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-md w-full sm:w-auto justify-center"
            >
              <Home className="w-5 h-5" />
              <span>{language === 'en' ? 'Back to Home' : 'Volver al Inicio'}</span>
            </Link>

            <a
              href="tel:7144731140"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 px-6 py-3.5 rounded-2xl font-bold transition-all w-full sm:w-auto justify-center"
            >
              <Phone className="w-5 h-5 text-blue-600" />
              <span>(714) 473-1140</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFoundPage;
