import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { useLanguage } from '../LanguageContext';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 text-center md:text-left">

          {/* Company Info */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <a href="#home" className="inline-block mb-2">
              {/* Ensure logo is visible on dark background. A white logo is ideal, but we will use the provided one and give it a slight background if needed, or rely on transparency. */}
              <div className="bg-white/10 p-2 rounded-lg inline-block backdrop-blur-sm">
                <img
                  src="/src/assets/logo/logo.png"
                  alt="Clean & Care PRO Logo"
                  className="h-10 w-auto object-contain brightness-0 invert"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>
            </a>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              {t.footer.desc}
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-all hover:text-white">
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-all hover:text-white">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-all hover:text-white">
                <FaLinkedinIn className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-bold text-lg mb-6">{t.footer.quickLinks}</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="hover:text-blue-500 transition-colors">{t.navbar.home}</a></li>
              <li><a href="#services" className="hover:text-blue-500 transition-colors">{t.navbar.services}</a></li>
              <li><a href="#about" className="hover:text-blue-500 transition-colors">{t.navbar.about}</a></li>
              <li><a href="#reviews" className="hover:text-blue-500 transition-colors">{t.navbar.reviews}</a></li>
              <li><a href="#contact" className="hover:text-blue-500 transition-colors">{t.navbar.contact}</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-bold text-lg mb-6">{t.footer.services}</h4>
            <ul className="space-y-3">
              <li><a href="#services" className="hover:text-blue-500 transition-colors">{t.services.list[0].title}</a></li>
              <li><a href="#services" className="hover:text-blue-500 transition-colors">{t.services.list[1].title}</a></li>
              <li><a href="#services" className="hover:text-blue-500 transition-colors">{t.services.list[2].title}</a></li>
              <li><a href="#services" className="hover:text-blue-500 transition-colors">{t.services.list[3].title}</a></li>
              <li><a href="#services" className="hover:text-blue-500 transition-colors">{t.services.list[5].title}</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-bold text-lg mb-6">{t.footer.contactInfo}</h4>
            <ul className="space-y-4">
              <li className="flex items-center md:items-start gap-3">
                <Phone className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span>714-473-1140</span>
              </li>
              <li className="flex items-center md:items-start gap-3">
                <Mail className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span>info@cleancarepro.com</span>
              </li>
              <li className="flex items-center md:items-start gap-3 text-center md:text-left">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span>{t.footer.serving}</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-900 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-sm text-slate-500">
            &copy; {currentYear} {t.footer.rights}
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">{t.footer.privacy}</a>
            <a href="#" className="hover:text-white transition-colors">{t.footer.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
