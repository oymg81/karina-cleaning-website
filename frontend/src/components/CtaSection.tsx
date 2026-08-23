import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Send } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import emailjs from '@emailjs/browser';
import { getAttribution } from '../utils/attribution';
import { trackLeadConversion } from '../utils/analytics';

const serviceId = (import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined)?.trim();
const templateId = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined)?.trim();
const publicKey = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined)?.trim();

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const CtaSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'residential',
    message: '',
    website_url: '' // Honeypot
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Honeypot check: If filled by bot, silently succeed
    if (formData.website_url.trim()) {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', service: 'residential', message: '', website_url: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
      return;
    }

    // Validate form inputs
    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const service = formData.service.trim();
    const message = formData.message.trim();

    if (!name || name.length < 2 || name.length > 120) {
      console.warn("Validation failed: Name is required and must be 2-120 characters.");
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      console.warn("Validation failed: Email is required and must be valid.");
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    if (!phone || phone.length < 3) {
      console.warn("Validation failed: Phone is required (min 3 characters).");
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    if (!service && !message) {
      console.warn("Validation failed: Service details or message must not be empty.");
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    // Capture submission id and attribution
    const submissionId = generateUUID();
    const attribution = getAttribution();

    // 1. EmailJS Dispatch Promise
    const emailJsPromise = (async () => {
      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS environment configuration missing');
      }
      emailjs.init(publicKey);
      const templateParams = {
        name: name || "N/A",
        email: email || "N/A",
        phone: phone || "N/A",
        service: service || "N/A",
        property_type: "N/A",
        bedrooms: "N/A",
        bathrooms: "N/A",
        frequency: "N/A",
        message: message || "N/A",
      };
      return emailjs.send(serviceId, templateId, templateParams);
    })();

    // 2. FOES Leads Proxy Dispatch Promise
    const foesPromise = (async () => {
      const payload = {
        name,
        email: email || undefined,
        phone: phone || undefined,
        service: service || undefined,
        message: message || undefined,
        locale: language === 'es' ? ('es' as const) : ('en' as const),
        landing_page: attribution.landing_page,
        referrer: attribution.referrer,
        utm_source: attribution.utm_source,
        utm_medium: attribution.utm_medium,
        utm_campaign: attribution.utm_campaign,
        utm_content: attribution.utm_content,
        utm_term: attribution.utm_term,
        submission_id: submissionId,
        website_url: formData.website_url || undefined,
      };

      const res = await fetch('/api/foes/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP ${res.status}`);
      }

      return res.json();
    })();

    try {
      // Execute both dispatches in parallel
      const [emailResult, foesResult] = await Promise.allSettled([emailJsPromise, foesPromise]);

      const emailSucceeded = emailResult.status === 'fulfilled';
      const foesSucceeded = foesResult.status === 'fulfilled';

      if (emailSucceeded || foesSucceeded) {
        // Tolerant dual-dispatch: At least one succeeded
        if (!emailSucceeded) {
          console.warn('[Dual-Dispatch] EmailJS delivery failed; lead captured successfully via FOES.');
        }
        if (!foesSucceeded) {
          console.warn('[Dual-Dispatch] FOES proxy dispatch failed; notification delivered successfully via EmailJS.');
        }

        // Fire analytics conversion event (deduplicated & zero PII)
        trackLeadConversion({
          service,
          locale: language,
        });

        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', service: 'residential', message: '', website_url: '' });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        // Both destinations failed
        console.error('[Dual-Dispatch] Both EmailJS and FOES submission failed.');
        setSubmitStatus('error');
      }
    } catch {
      console.error('[Dual-Dispatch] Unexpected failure in dispatch runner.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#5FE873] text-[#0F172A] relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/about-team.jpg"
          alt="Cleaning service professional"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#5FE873]/90 backdrop-blur-sm" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-[#0F172A]"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-[#0F172A] tracking-tight">
              {t.cta.title1} <span className="text-blue-700">{t.cta.title2}</span>
            </h2>
            <p className="text-lg text-[#0F172A]/85 mb-8 max-w-lg leading-relaxed font-normal">
              {t.cta.desc}
            </p>
            
            <div className="mt-12 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0F172A]/10 flex items-center justify-center shrink-0 border border-[#0F172A]/20">
                  <div className="w-4 h-4 rounded-full bg-blue-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#0F172A]">{t.cta.fastQuotes}</h4>
                  <p className="text-[#0F172A]/75 text-sm mt-1">Get your personalized quote quickly and easily.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0F172A]/10 flex items-center justify-center shrink-0 border border-[#0F172A]/20">
                  <div className="w-4 h-4 rounded-full bg-blue-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#0F172A]">{t.cta.flexible}</h4>
                  <p className="text-[#0F172A]/75 text-sm mt-1">We work around your schedule, not the other way around.</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <a href="tel:714-473-1140" className="bg-[#0F172A] text-white hover:bg-slate-900 px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl w-full sm:w-auto">
                <Phone className="w-6 h-6 text-white" />
                {t.cta.call} 714-473-1140
              </a>
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-2xl text-slate-900 relative"
          >
            <h3 className="text-2xl font-bold text-navy mb-6">{t.cta.formTitle}</h3>

            {submitStatus === 'success' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 mb-4 rounded-xl bg-green-50 text-green-800 border border-green-200 text-sm font-semibold"
              >
                {language === 'en' 
                  ? 'Thank you! Your request has been sent successfully. We will contact you soon.' 
                  : '¡Gracias! Su solicitud ha sido enviada con éxito. Nos pondremos en contacto con usted pronto.'}
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 mb-4 rounded-xl bg-red-50 text-red-800 border border-red-200 text-sm font-semibold"
              >
                {language === 'en'
                  ? 'Sorry, something went wrong. Please try again or contact us directly at (714) 473-1140.'
                  : 'Lo sentimos, algo salió mal. Por favor, inténtelo de nuevo o contáctenos directamente al (714) 473-1140.'}
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot Field */}
              <div style={{ display: 'none', position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true">
                <label htmlFor="cta_website_url">Website</label>
                <input
                  type="text"
                  id="cta_website_url"
                  name="website_url"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website_url}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">{t.cta.fullName}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  maxLength={120}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-[#5FE873] outline-none"
                  placeholder="John Doe"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">{t.cta.email}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength={255}
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-[#5FE873] outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">{t.cta.phone}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={30}
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-[#5FE873] outline-none"
                    placeholder="(714) 473-1140"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-slate-700 mb-1">{t.cta.serviceType}</label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-[#5FE873] outline-none bg-white"
                >
                  <option value="residential">{t.services.list[0].title}</option>
                  <option value="commercial">{t.services.list[1].title}</option>
                  <option value="deep">{t.services.list[2].title}</option>
                  <option value="move">{t.services.list[3].title}</option>
                  <option value="office">{t.services.list[4].title}</option>
                  <option value="airbnb">{t.services.list[5].title}</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">{t.cta.message}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  maxLength={600}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-[#5FE873] outline-none resize-none"
                  placeholder={t.cta.messagePlaceholder}
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#5FE873] hover:bg-[#4cd260] text-[#0F172A] px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-[#0F172A]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>{language === 'en' ? 'Sending...' : 'Enviando...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 text-[#0F172A]" />
                    {t.cta.sendRequest}
                  </>
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default CtaSection;
