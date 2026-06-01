import React from 'react';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
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
  const { t } = useLanguage();

  const emailSubject = encodeURIComponent("Cleaning Service Inquiry - Clean & Care PRO");
  const emailBody = encodeURIComponent(
    "Hello Clean & Care PRO,\n\nI would like more information about your cleaning services.\n\nThank you."
  );
  const emailHref = `mailto:cleancareproservices2@gmail.com?subject=${emailSubject}&body=${emailBody}`;

  return (
    <footer className="bg-[#ECFDF3] text-slate-800 pt-20 pb-8 border-t border-green-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.1fr_1.4fr] gap-10 mb-12 text-center md:text-left">

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
                <span className="text-slate-700 text-sm font-medium">cleancareproservices2@gmail.com</span>
              </li>
              <li className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
                <MapPin className="h-5 w-5 text-green-600 shrink-0" />
                <span className="text-slate-700 text-sm font-medium">{t.footer.servingAreas}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Premium Bottom Contact Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="tel:7144731140"
            className="group rounded-3xl bg-green-500 px-8 py-7 flex items-center justify-between shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 shrink-0">
                <Phone className="h-7 w-7 text-white" />
              </div>

              <div className="text-left">
                <p className="text-sm font-bold uppercase tracking-widest text-white/80">
                  {t.footer.callUsNow}
                </p>
                <p className="mt-2 text-2xl font-bold text-white">
                  714-473-1140
                </p>
              </div>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-green-600 group-hover:translate-x-1 transition-transform shrink-0">
              <ArrowRight className="h-5 w-5" />
            </div>
          </a>

          <a
            href={emailHref}
            className="group rounded-3xl bg-white px-8 py-7 flex items-center justify-between border border-green-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 shrink-0">
                <Mail className="h-7 w-7 text-green-600" />
              </div>

              <div className="text-left">
                <p className="text-sm font-bold uppercase tracking-widest text-green-700">
                  {t.footer.sendUsEmail}
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-700 break-all md:break-normal">
                  cleancareproservices2@gmail.com
                </p>
              </div>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500 text-white group-hover:translate-x-1 transition-transform shrink-0">
              <ArrowRight className="h-5 w-5" />
            </div>
          </a>
        </div>

        {/* Bottom Copyright Row */}
        <div className="mt-16 border-t border-green-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
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
