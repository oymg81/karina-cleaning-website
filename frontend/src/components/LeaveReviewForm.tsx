import React, { useState, useRef } from 'react';
import { Star, Send, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface LeaveReviewFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const LeaveReviewForm: React.FC<LeaveReviewFormProps> = ({ onSuccess, onCancel }) => {
  const { language, t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [serviceType, setServiceType] = useState('residential');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'validation_error' | 'rate_limit' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const starGroupRef = useRef<HTMLDivElement>(null);

  const isEn = language === 'en';

  const strings = {
    title: isEn ? 'Share Your Experience' : 'Comparta Su Experiencia',
    subtitle: isEn
      ? 'Help others discover our cleaning services. Reviews are published after verification.'
      : 'Ayude a otros a conocer nuestros servicios. Las reseñas se publican tras su verificación.',
    nameLabel: isEn ? 'Your Name *' : 'Su Nombre *',
    namePlaceholder: isEn ? 'e.g. Sarah M.' : 'ej. María G.',
    emailLabel: isEn ? 'Email (Optional - not published)' : 'Correo (Opcional - no publicado)',
    emailPlaceholder: isEn ? 'sarah@example.com' : 'maria@ejemplo.com',
    phoneLabel: isEn ? 'Phone (Optional - not published)' : 'Teléfono (Opcional - no publicado)',
    phonePlaceholder: isEn ? '(714) 000-0000' : '(714) 000-0000',
    ratingLabel: isEn ? 'Rating *' : 'Calificación *',
    ratingHelp: isEn ? 'Select 1 to 5 stars' : 'Seleccione de 1 a 5 estrellas',
    serviceLabel: isEn ? 'Service Received' : 'Servicio Recibido',
    messageLabel: isEn ? 'Review Message *' : 'Mensaje de la Reseña *',
    messagePlaceholder: isEn
      ? 'Tell us about your experience with our team (minimum 10 characters)...'
      : 'Cuéntenos sobre su experiencia con nuestro equipo (mínimo 10 caracteres)...',
    moderationNote: isEn
      ? 'Note: All reviews are verified by our team prior to publication to maintain authenticity.'
      : 'Nota: Todas las reseñas son verificadas por nuestro equipo antes de publicarse para garantizar su autenticidad.',
    submitButton: isEn ? 'Submit Review' : 'Enviar Reseña',
    submitting: isEn ? 'Submitting...' : 'Enviando...',
    cancelButton: isEn ? 'Cancel' : 'Cancelar',
    successTitle: isEn ? 'Thank You!' : '¡Muchas Gracias!',
    successDesc: isEn
      ? 'Your review has been submitted successfully and will appear on our page once verified.'
      : 'Su reseña ha sido enviada con éxito y aparecerá en nuestra página una vez verificada.',
    rateLimitError: isEn
      ? 'You have submitted too many requests recently. Please try again later.'
      : 'Ha enviado demasiadas solicitudes recientemente. Por favor, inténtelo de nuevo más tarde.',
    serviceUnavailable: isEn
      ? 'Review submission is temporarily unavailable. Please try again later.'
      : 'El servicio de reseñas no está disponible temporalmente. Por favor, inténtelo más tarde.',
    valNameRequired: isEn ? 'Please enter your name (at least 2 characters).' : 'Por favor ingrese su nombre (al menos 2 caracteres).',
    valRatingRequired: isEn ? 'Please select a star rating.' : 'Por favor seleccione una calificación.',
    valMessageMin: isEn ? 'Message must be between 10 and 1000 characters.' : 'El mensaje debe tener entre 10 y 1000 caracteres.',
    valEmailInvalid: isEn ? 'Please enter a valid email address.' : 'Por favor ingrese un correo válido.',
    valPhoneInvalid: isEn ? 'Phone number must be at least 3 characters.' : 'El número de teléfono debe tener al menos 3 caracteres.',
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleStarKeyDown = (e: React.KeyboardEvent, starVal: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(starVal + 1, 5);
      setRating(next);
      const target = starGroupRef.current?.querySelector<HTMLButtonElement>(`[data-star="${next}"]`);
      target?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      const prev = Math.max(starVal - 1, 1);
      setRating(prev);
      const target = starGroupRef.current?.querySelector<HTMLButtonElement>(`[data-star="${prev}"]`);
      target?.focus();
    } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
      e.preventDefault();
      const num = parseInt(e.key, 10);
      setRating(num);
      const target = starGroupRef.current?.querySelector<HTMLButtonElement>(`[data-star="${num}"]`);
      target?.focus();
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setRating(starVal);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setTouched({ name: true, message: true, rating: true, phone: true });
    setStatus('idle');
    setErrorMessage('');

    // Honeypot check
    if (honeypot.trim()) {
      setStatus('success');
      return;
    }

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 120) {
      setStatus('validation_error');
      setErrorMessage(strings.valNameRequired);
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      setStatus('validation_error');
      setErrorMessage(strings.valRatingRequired);
      return;
    }

    if (trimmedMessage.length < 10 || trimmedMessage.length > 1000) {
      setStatus('validation_error');
      setErrorMessage(strings.valMessageMin);
      return;
    }

    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setStatus('validation_error');
      setErrorMessage(strings.valEmailInvalid);
      return;
    }

    if (trimmedPhone && (trimmedPhone.length < 3 || trimmedPhone.length > 30)) {
      setStatus('validation_error');
      setErrorMessage(strings.valPhoneInvalid);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        reviewer_name: trimmedName,
        rating,
        message: trimmedMessage,
        ...(trimmedEmail ? { reviewer_email: trimmedEmail } : {}),
        ...(trimmedPhone ? { reviewer_phone: trimmedPhone } : {}),
        service_type: serviceType,
        website_url: honeypot,
      };

      const res = await fetch('/api/foes/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 200 || res.status === 201) {
        setStatus('success');
        setName('');
        setMessage('');
        setEmail('');
        setPhone('');
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 3000);
        }
      } else if (res.status === 400) {
        const data = await res.json().catch(() => ({}));
        setStatus('validation_error');
        setErrorMessage(data.error || strings.valMessageMin);
      } else if (res.status === 429) {
        setStatus('rate_limit');
        setErrorMessage(strings.rateLimitError);
      } else {
        setStatus('error');
        setErrorMessage(strings.serviceUnavailable);
      }
    } catch {
      setStatus('error');
      setErrorMessage(strings.serviceUnavailable);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-xl max-w-lg mx-auto">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900 mb-2">{strings.successTitle}</h3>
        <p className="text-slate-600 leading-relaxed mb-6">{strings.successDesc}</p>
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 mb-6">
          <Sparkles className="w-4 h-4 text-blue-600 inline mr-1.5" />
          {strings.moderationNote}
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all text-sm"
          >
            {isEn ? 'Close' : 'Cerrar'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-2xl max-w-xl mx-auto text-slate-900">
      <div className="mb-6">
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          {strings.title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed">{strings.subtitle}</p>
      </div>

      {(status === 'validation_error' || status === 'rate_limit' || status === 'error') && (
        <div className="p-4 mb-6 rounded-2xl bg-red-50 text-red-800 border border-red-200 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{errorMessage || strings.serviceUnavailable}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Honeypot field */}
        <div style={{ display: 'none', position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true">
          <label htmlFor="website_url">Website URL</label>
          <input
            type="text"
            id="website_url"
            name="website_url"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        {/* Rating selection */}
        <div>
          <label id="rating-label" className="block text-sm font-bold text-slate-800 mb-2">
            {strings.ratingLabel}
          </label>
          <div
            ref={starGroupRef}
            role="radiogroup"
            aria-labelledby="rating-label"
            className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200"
          >
            {[1, 2, 3, 4, 5].map((starVal) => {
              const isFilled = (hoverRating !== null ? hoverRating : rating) >= starVal;
              const isSelected = rating === starVal;
              return (
                <button
                  key={starVal}
                  type="button"
                  data-star={starVal}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${starVal} ${isEn ? (starVal === 1 ? 'star' : 'stars') : (starVal === 1 ? 'estrella' : 'estrellas')}`}
                  tabIndex={isSelected ? 0 : -1}
                  onMouseEnter={() => setHoverRating(starVal)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => setRating(starVal)}
                  onKeyDown={(e) => handleStarKeyDown(e, starVal)}
                  className="p-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      isFilled
                        ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              );
            })}
            <span className="ml-3 text-xs font-semibold text-slate-500">
              {rating} / 5 {isEn ? 'Stars' : 'Estrellas'}
            </span>
          </div>
        </div>

        {/* Reviewer Name */}
        <div>
          <label htmlFor="reviewer_name" className="block text-sm font-bold text-slate-800 mb-1.5">
            {strings.nameLabel}
          </label>
          <input
            type="text"
            id="reviewer_name"
            name="reviewer_name"
            value={name}
            maxLength={100}
            required
            onChange={(e) => setName(e.target.value)}
            onBlur={() => handleBlur('name')}
            placeholder={strings.namePlaceholder}
            className={`w-full rounded-xl border px-4 py-3 text-slate-900 bg-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
              touched.name && !name.trim() ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
            }`}
          />
          {touched.name && !name.trim() && (
            <p className="text-xs text-red-600 mt-1 font-medium">{strings.valNameRequired}</p>
          )}
        </div>

        {/* Service Type */}
        <div>
          <label htmlFor="service_type" className="block text-sm font-bold text-slate-800 mb-1.5">
            {strings.serviceLabel}
          </label>
          <select
            id="service_type"
            name="service_type"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          >
            <option value="residential">{t.services.list[0]?.title || 'Residential Cleaning'}</option>
            <option value="deep">{t.services.list[1]?.title || 'Deep Cleaning'}</option>
            <option value="move">{t.services.list[2]?.title || 'Move In / Out Cleaning'}</option>
            <option value="commercial">{t.services.list[3]?.title || 'Commercial Cleaning'}</option>
            <option value="office">{t.services.list[4]?.title || 'Office Cleaning'}</option>
            <option value="airbnb">{t.services.list[5]?.title || 'Airbnb & Vacation Rental'}</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="review_message" className="block text-sm font-bold text-slate-800">
              {strings.messageLabel}
            </label>
            <span className="text-xs text-slate-400 font-medium">
              {message.length} / 1000
            </span>
          </div>
          <textarea
            id="review_message"
            name="message"
            rows={4}
            maxLength={1000}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onBlur={() => handleBlur('message')}
            placeholder={strings.messagePlaceholder}
            className={`w-full rounded-xl border px-4 py-3 text-slate-900 bg-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none ${
              touched.message && message.trim().length < 10 ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
            }`}
          />
          {touched.message && message.trim().length < 10 && (
            <p className="text-xs text-red-600 mt-1 font-medium">{strings.valMessageMin}</p>
          )}
        </div>

        {/* Optional Contact Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="reviewer_email" className="block text-xs font-semibold text-slate-600 mb-1">
              {strings.emailLabel}
            </label>
            <input
              type="email"
              id="reviewer_email"
              name="reviewer_email"
              value={email}
              maxLength={255}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={strings.emailPlaceholder}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="reviewer_phone" className="block text-xs font-semibold text-slate-600 mb-1">
              {strings.phoneLabel}
            </label>
            <input
              type="tel"
              id="reviewer_phone"
              name="reviewer_phone"
              value={phone}
              maxLength={30}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={strings.phonePlaceholder}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Moderation notice */}
        <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p>{strings.moderationNote}</p>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>{strings.submitting}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-white" />
                <span>{strings.submitButton}</span>
              </>
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-3.5 rounded-xl transition-all text-sm"
            >
              {strings.cancelButton}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default LeaveReviewForm;
