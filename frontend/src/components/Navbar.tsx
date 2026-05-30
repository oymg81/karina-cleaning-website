import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../LanguageContext';

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { name: t.navbar.home, href: '#home' },
    { name: t.navbar.services, href: '#services' },
    { name: t.navbar.about, href: '#about' },
    { name: t.navbar.contact, href: '#contact' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };


  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleScrollTo(e, '#home')}
          className="flex items-center"
        >
          <img
            src="/images/logo1.png"
            alt="Clean & Care PRO Cleaning Services"
            className="h-16 md:h-20 w-auto object-contain"
          />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-6 border-l border-slate-200 pl-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLanguage('en')}
                className={`text-xl transition-all ${language === 'en' ? 'border-b-2 border-blue-600 pb-1' : 'opacity-50 hover:opacity-100 pb-1'}`}
                title="English"
              >
                🇺🇸 EN
              </button>
              <button
                onClick={() => setLanguage('es')}
                className={`text-xl transition-all ${language === 'es' ? 'border-b-2 border-blue-600 pb-1' : 'opacity-50 hover:opacity-100 pb-1'}`}
                title="Español"
              >
                🇪🇸 ES
              </button>
            </div>
            <a
              href="#contact"
              onClick={(e) => handleScrollTo(e, '#contact')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all text-sm"
            >
              {t.navbar.quote}
            </a>
          </div>
        </div>

        {/* Mobile Menu Toggle & Lang */}
        <div className="flex items-center gap-4 lg:hidden">
          <div className="flex items-center gap-2 mr-2">
            <button
              onClick={() => setLanguage('en')}
              className={`text-lg transition-all ${language === 'en' ? 'border-b-2 border-blue-600 pb-0.5' : 'opacity-50 hover:opacity-100 pb-0.5'}`}
            >
              🇺🇸
            </button>
            <button
              onClick={() => setLanguage('es')}
              className={`text-lg transition-all ${language === 'es' ? 'border-b-2 border-blue-600 pb-0.5' : 'opacity-50 hover:opacity-100 pb-0.5'}`}
            >
              🇪🇸
            </button>
          </div>
          <button
            className="text-navy p-1 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              <ul className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      onClick={(e) => handleScrollTo(e, link.href)}
                      className="block text-lg text-navy font-medium"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-slate-100">
                <a
                  href="#contact"
                  onClick={(e) => handleScrollTo(e, '#contact')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all text-center"
                >
                  {t.navbar.quote}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
