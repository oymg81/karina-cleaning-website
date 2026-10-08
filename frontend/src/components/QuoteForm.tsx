import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Phone, RefreshCw } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
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

export interface QuoteFormProps {
  idPrefix?: string;
  className?: string;
  showTitle?: boolean;
  title?: string;
  onSuccess?: () => void;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({
  idPrefix = 'quote',
  className = '',
  showTitle = true,
  title,
  onSuccess,
}) => {
  const { language, t } = useLanguage();
  const formContainerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'residential',
    message: '',
    website_url: '', // Honeypot
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Smoothly ensure confirmation is in view when status changes to success or error
  useEffect(() => {
    if (submitStatus === 'success' || submitStatus === 'error') {
      if (formContainerRef.current) {
        formContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [submitStatus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleResetForNewSubmission = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: 'residential',
      message: '',
      website_url: '',
    });
    setSubmitStatus('idle');
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
      onSuccess?.();
      return;
    }

    // Validate form inputs
    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const service = formData.service.trim();
    const message = formData.message.trim();

    if (!name || name.length < 2 || name.length > 120) {
      console.warn('Validation failed: Name is required and must be 2-120 characters.');
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      console.warn('Validation failed: Email is required and must be valid.');
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    if (!phone || phone.length < 3) {
      console.warn('Validation failed: Phone is required (min 3 characters).');
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    if (!service && !message) {
      console.warn('Validation failed: Service details or message must not be empty.');
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
        name: name || 'N/A',
        email: email || 'N/A',
        phone: phone || 'N/A',
        service: service || 'N/A',
        property_type: 'N/A',
        bedrooms: 'N/A',
        bathrooms: 'N/A',
        frequency: 'N/A',
        message: message || 'N/A',
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

        // Fire analytics conversion event strictly once per successful submit (deduplicated & zero PII)
        trackLeadConversion({
          service,
          locale: language,
        });

        // Set persistent success state & clear form fields
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', service: 'residential', message: '', website_url: '' });
        onSuccess?.();
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

  const nameInputId = `${idPrefix}-name`;
  const emailInputId = `${idPrefix}-email`;
  const phoneInputId = `${idPrefix}-phone`;
  const serviceInputId = `${idPrefix}-service`;
  const messageInputId = `${idPrefix}-message`;
  const honeypotInputId = `${idPrefix}-website-url`;

  return (
    <div ref={formContainerRef} className={`text-slate-900 ${className}`}>
      {showTitle && (
        <h3 className="text-2xl font-bold text-navy mb-6">
          {title || t.cta.formTitle}
        </h3>
      )}

      <AnimatePresence mode="wait">
        {submitStatus === 'success' ? (
          /* ===================================================
             HIGH-VISIBILITY PERSISTENT SUCCESS CONFIRMATION
             =================================================== */
          <motion.div
            key="success-confirmation"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl bg-green-50/90 border-2 border-green-300 p-6 sm:p-8 text-center shadow-lg"
            role="status"
            aria-live="polite"
          >
            {/* Visual Checkmark Icon Badge */}
            <div className="w-16 h-16 mx-auto rounded-2xl bg-green-500 text-white flex items-center justify-center shadow-md shadow-green-200 mb-5">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            {/* Headline */}
            <h4 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">
              {t.cta.successTitle}
            </h4>

            {/* Message Body */}
            <p className="text-base sm:text-lg text-slate-700 font-medium max-w-md mx-auto leading-relaxed mb-3">
              {t.cta.successMessage}
            </p>

            {/* Response Time Reassurance */}
            <p className="text-xs sm:text-sm text-green-800 bg-green-100/80 rounded-xl px-4 py-2 max-w-sm mx-auto font-medium border border-green-200/60 mb-6">
              {t.cta.successSubtext}
            </p>

            {/* Urgent Direct Contact Options */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 pt-2 border-t border-green-200/70">
              <a
                href="tel:714-473-1140"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 hover:text-blue-700 transition-colors py-1.5 px-3 rounded-lg hover:bg-green-100"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                <span>(714) 473-1140</span>
              </a>
              <span className="hidden sm:inline text-green-300">•</span>
              <a
                href="https://wa.me/17144731140"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 hover:text-green-700 transition-colors py-1.5 px-3 rounded-lg hover:bg-green-100"
              >
                <FaWhatsapp className="w-4 h-4 text-green-600" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Button to Submit Another Request */}
            <button
              type="button"
              onClick={handleResetForNewSubmission}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl border border-slate-300 shadow-sm transition-all active:scale-[0.98]"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.cta.sendAnother}</span>
            </button>
          </motion.div>
        ) : (
          /* ===================================================
             STANDARD FORM INTERFACE WITH INLINE ERROR SUPPORT
             =================================================== */
          <motion.form
            key="quote-form-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Error Banner if submission failed */}
            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm shadow-sm"
                role="alert"
                aria-live="assertive"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-red-900">{t.cta.errorTitle}</h5>
                    <p className="text-xs sm:text-sm text-red-800 mt-0.5 leading-relaxed">
                      {t.cta.errorMessage}
                    </p>
                    <div className="flex gap-3 mt-3">
                      <a
                        href="tel:714-473-1140"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>(714) 473-1140</span>
                      </a>
                      <a
                        href="https://wa.me/17144731140"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <FaWhatsapp className="w-3.5 h-3.5 text-green-700" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Honeypot Field */}
            <div style={{ display: 'none', position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true">
              <label htmlFor={honeypotInputId}>Website</label>
              <input
                type="text"
                id={honeypotInputId}
                name="website_url"
                tabIndex={-1}
                autoComplete="off"
                value={formData.website_url}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor={nameInputId} className="block text-sm font-medium text-slate-700 mb-1">
                {t.cta.fullName}
              </label>
              <input
                type="text"
                id={nameInputId}
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength={120}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-[#5FE873] outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={emailInputId} className="block text-sm font-medium text-slate-700 mb-1">
                  {t.cta.email}
                </label>
                <input
                  type="email"
                  id={emailInputId}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  maxLength={255}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-[#5FE873] outline-none transition-colors"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor={phoneInputId} className="block text-sm font-medium text-slate-700 mb-1">
                  {t.cta.phone}
                </label>
                <input
                  type="tel"
                  id={phoneInputId}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={30}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-[#5FE873] outline-none transition-colors"
                  placeholder="(714) 473-1140"
                />
              </div>
            </div>

            <div>
              <label htmlFor={serviceInputId} className="block text-sm font-medium text-slate-700 mb-1">
                {t.cta.serviceType}
              </label>
              <select
                id={serviceInputId}
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-[#5FE873] outline-none bg-white transition-colors"
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
              <label htmlFor={messageInputId} className="block text-sm font-medium text-slate-700 mb-1">
                {t.cta.message}
              </label>
              <textarea
                id={messageInputId}
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                maxLength={600}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-[#5FE873] outline-none resize-none transition-colors"
                placeholder={t.cta.messagePlaceholder}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#5FE873] hover:bg-[#4cd260] text-[#0F172A] px-6 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-[#0F172A]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>{t.cta.sending || (language === 'en' ? 'Sending...' : 'Enviando...')}</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 text-[#0F172A]" />
                  <span>{t.cta.sendRequest}</span>
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuoteForm;
