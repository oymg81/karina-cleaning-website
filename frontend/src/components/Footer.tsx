import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { useLanguage } from '../LanguageContext';

const locations = [
  'Los Angeles',
  'Beverly Hills',
  'Bel Air',
  'Brentwood',
  'Culver City',
  'Glendale',
  'Hollywood',
  'Malibu',
  'Manhattan Beach',
  'Pasadena'
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { language, t } = useLanguage();

  const emailSubject = encodeURIComponent("Cleaning Service Inquiry - Clean & Care PRO");
  const emailBody = encodeURIComponent(
    "Hello Clean & Care PRO,\n\nI would like more information about your cleaning services.\n\nThank you."
  );
  const emailHref = `mailto:cleancareproservices2@gmail.com?subject=${emailSubject}&body=${emailBody}`;

  return (
    <footer className="bg-[#ECFDF3] text-slate-800 border-t border-green-200">
      
      {/* 1. Main Footer Columns */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr_1fr_1.2fr] text-center md:text-left">

        {/* Column 1: Brand / Logo */}
        <div className="space-y-6 flex flex-col items-center md:items-start">
          <a href="#home" className="inline-block">
            <img
              src="/images/logo1.png"
              alt="Clean & Care PRO Cleaning Services"
              className="h-16 md:h-20 w-auto object-contain"
            />
          </a>
          <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
            {t.footer.desc}
          </p>
          <div className="flex gap-4 pt-2">
            <a 
              href="https://www.facebook.com/cleankarinaservices" 
              target="_blank"
              rel="noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white border border-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-colors shadow-sm"
              aria-label="Facebook"
            >
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a 
              href="https://www.instagram.com/casitaslimpias2?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
              target="_blank"
              rel="noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white border border-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-colors shadow-sm"
              aria-label="Instagram"
            >
              <FaInstagram className="w-4 h-4" />
            </a>
            <a 
              href="https://www.tiktok.com/@cleancare.resident" 
              target="_blank"
              rel="noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white border border-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-colors shadow-sm"
              aria-label="TikTok"
            >
              <FaTiktok className="w-4 h-4" />
            </a>
          </div>
          
          {/* Call CTA Button */}
          <a
            href="tel:7144731140"
            className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-[#5FE873] hover:bg-[#4cd260] px-5 py-3 text-slate-950 font-bold text-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <Phone className="w-4 h-4 shrink-0 text-slate-950" />
            <span>{language === 'en' ? 'Call 714-473-1140' : 'Llamar 714-473-1140'}</span>
          </a>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-xl font-bold text-slate-900 mb-6">{t.footer.quickLinks}</h4>
          <ul className="space-y-3">
            <li><a href="#home" className="text-slate-700 hover:text-green-600 transition-colors font-medium text-sm">{t.navbar.home}</a></li>
            <li><a href="#services" className="text-slate-700 hover:text-green-600 transition-colors font-medium text-sm">{t.navbar.services}</a></li>
            <li><a href="#about" className="text-slate-700 hover:text-green-600 transition-colors font-medium text-sm">{t.navbar.about}</a></li>
            <li><a href="#contact" className="text-slate-700 hover:text-green-600 transition-colors font-medium text-sm">{t.navbar.contact}</a></li>
          </ul>

          {/* WhatsApp CTA Button */}
          <a
            href="https://wa.me/message/NZGNL4QE5S6OD1"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-[#5FE873] hover:bg-[#4cd260] px-5 py-3 text-slate-950 font-bold text-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <FaWhatsapp className="w-4 h-4 shrink-0 text-slate-950" />
            <span>{language === 'en' ? 'Message on WhatsApp' : 'Mensaje por WhatsApp'}</span>
          </a>
        </div>

        {/* Column 3: Services */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-xl font-bold text-slate-900 mb-6">{t.footer.services}</h4>
          <ul className="space-y-3">
            <li><a href="#services" className="text-slate-700 hover:text-green-600 transition-colors font-medium text-sm">{t.services.list[0].title}</a></li>
            <li><a href="#services" className="text-slate-700 hover:text-green-600 transition-colors font-medium text-sm">{t.services.list[1].title}</a></li>
            <li><a href="#services" className="text-slate-700 hover:text-green-600 transition-colors font-medium text-sm">{t.services.list[2].title}</a></li>
            <li><a href="#services" className="text-slate-700 hover:text-green-600 transition-colors font-medium text-sm">{t.services.list[3].title}</a></li>
            <li><a href="#services" className="text-slate-700 hover:text-green-600 transition-colors font-medium text-sm">{t.services.list[5].title}</a></li>
          </ul>

          {/* Email CTA Button */}
          <a
            href={emailHref}
            className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-[#5FE873] hover:bg-[#4cd260] px-5 py-3 text-slate-950 font-bold text-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <Mail className="w-4 h-4 shrink-0 text-slate-950" />
            <span>{language === 'en' ? 'Send Email' : 'Enviar Correo'}</span>
          </a>
        </div>

        {/* Column 4: Locations */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-xl font-bold text-slate-900 mb-6">{t.footer.locations}</h4>
          <ul className="space-y-3 text-center md:text-left">
            {locations.map((loc, idx) => (
              <li key={idx} className="text-slate-700 text-sm font-medium">{loc}</li>
            ))}
            <li className="pt-2">
              <a href="#contact" className="font-semibold text-green-600 hover:text-green-700 text-sm transition-colors">
                {t.footer.seeAllLocations}
              </a>
            </li>
          </ul>
        </div>

        {/* Column 5: Contact Info */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-xl font-bold text-slate-900 mb-6">{t.footer.contactInfo}</h4>
          <ul className="space-y-4">
            <li className="flex flex-col md:flex-row items-center gap-3">
              <Phone className="h-5 w-5 text-green-600 shrink-0" />
              <span className="text-slate-700 text-sm font-medium">714-473-1140</span>
            </li>
            <li className="flex flex-col md:flex-row items-center gap-3">
              <Mail className="h-5 w-5 text-green-600 shrink-0" />
              <span className="text-slate-700 text-sm font-medium break-all text-center md:text-left">cleancareproservices2@gmail.com</span>
            </li>
            <li className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
              <MapPin className="h-5 w-5 text-green-600 shrink-0" />
              <span className="text-slate-700 text-sm font-medium">{t.footer.servingAreas}</span>
            </li>
          </ul>
        </div>

      </div>

      {/* 3. Bottom Copyright / Legal Area */}
      <div className="border-t border-green-200 py-8 bg-[#ECFDF3]">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <p className="text-sm text-slate-500 font-medium">
            &copy; {currentYear} {t.footer.rights}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-medium">
            <span>{t.footer.designedBy}</span>
            <a 
              href="https://www.codingsoft.tech/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 text-green-600 hover:text-green-700 font-bold transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
              CodingSoft
            </a>
          </div>
          <div className="flex gap-6 text-sm text-slate-500 font-medium">
            <a href="#" className="hover:text-slate-800 transition-colors">{t.footer.privacyPolicy}</a>
            <a href="#" className="hover:text-slate-800 transition-colors">{t.footer.termsOfService}</a>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
