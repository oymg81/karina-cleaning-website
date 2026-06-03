import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Send } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import emailjs from '@emailjs/browser';

const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

const CtaSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'residential',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Validate EmailJS environment variables
    if (!serviceId || !templateId || !publicKey) {
      console.error(
        "EmailJS configuration error: Missing environment variable(s). " +
        "Please check that NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, " +
        "and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY are defined in .env.local or production settings."
      );
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    // Validate form inputs
    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const service = formData.service.trim();
    const message = formData.message.trim();

    if (!name) {
      console.warn("Validation failed: Name is required.");
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

    if (!phone) {
      console.warn("Validation failed: Phone is required.");
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

    // Temporary debug log before sending
    console.log("Sending EmailJS request with:", {
      serviceId,
      templateId,
      hasPublicKey: Boolean(publicKey),
      templateParams,
    });

    emailjs.send(serviceId, templateId, templateParams, { publicKey })
      .then((response) => {
        console.log('EmailJS Success:', response.status, response.text);
        setIsSubmitting(false);
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', service: 'residential', message: '' });
        // Auto-clear success message after 5 seconds
        setTimeout(() => setSubmitStatus('idle'), 5000);
      })
      .catch((err) => {
        console.error('EmailJS send failed:', err);
        setIsSubmitting(false);
        setSubmitStatus('error');
      });
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
                  ? 'Sorry, something went wrong. Please try again or contact us directly.' 
                  : 'Lo sentimos, algo salió mal. Por favor, inténtelo de nuevo o contáctenos directamente.'}
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">{t.cta.fullName}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
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
