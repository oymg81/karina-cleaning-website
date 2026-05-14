import React, { useState } from 'react';
import { Menu, X, Phone, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../LanguageContext';

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { name: t.navbar.home, href: '#home' },
    { name: t.navbar.services, href: '#services' },
    { name: t.navbar.about, href: '#about' },
    { name: t.navbar.reviews, href: '#reviews' },
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

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleScrollTo(e, '#home')}
          className="flex items-center gap-2"
        >
          <img
            src="/images/logo.png"
            alt="Clean & Care PRO Logo"
            className="h-16 w-auto object-contain"
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
          
          <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-slate-600 hover:text-blue-600 font-medium transition-colors bg-slate-100 px-3 py-1.5 rounded-full"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'en' ? '🇺🇸 EN' : '🇪🇸 ES'}</span>
            </button>
            <a
              href="tel:714-473-1140"
              className="flex items-center gap-2 text-navy font-semibold hover:text-blue-600 transition-colors"
            >
              <Phone className="w-4 h-4 text-blue-600" />
              714-473-1140
            </a>
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
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-slate-600 font-medium bg-slate-100 px-2 py-1 rounded-full text-sm"
          >
            <Globe className="w-3 h-3" />
            <span>{language === 'en' ? 'EN' : 'ES'}</span>
          </button>
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
                  href="tel:714-473-1140"
                  className="flex items-center justify-center gap-2 text-navy font-semibold py-3 bg-slate-50 rounded-lg"
                >
                  <Phone className="w-5 h-5 text-blue-600" />
                  714-473-1140
                </a>
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
