import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquarePlus, Sparkles, X, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import type { PublicReview } from '../types/foes';
import ReviewsCarousel from './ReviewsCarousel';
import LeaveReviewForm from './LeaveReviewForm';

export const ReviewsSection: React.FC = () => {
  const { language } = useLanguage();
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isEn = language === 'en';
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const modalContentRef = useRef<HTMLDivElement | null>(null);

  const loadReviews = useCallback(async () => {
    try {
      const res = await fetch('/api/foes/reviews');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.reviews)) {
          setReviews(data.reviews);
          setHasError(false);
        } else {
          setReviews([]);
        }
      } else {
        setHasError(true);
        setReviews([]);
      }
    } catch {
      setHasError(true);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function execute() {
      try {
        const res = await fetch('/api/foes/reviews');
        if (!ignore) {
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.reviews)) {
              setReviews(data.reviews);
              setHasError(false);
            } else {
              setReviews([]);
            }
          } else {
            setHasError(true);
            setReviews([]);
          }
        }
      } catch {
        if (!ignore) {
          setHasError(true);
          setReviews([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    execute();

    return () => {
      ignore = true;
    };
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    loadReviews();
  };

  // Manage modal accessibility: focus trapping, body scroll lock, and trigger restoration
  useEffect(() => {
    if (!isModalOpen) return;

    // Lock body scroll safely
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus initial interactive element inside modal
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = modalContentRef.current?.querySelectorAll<HTMLElement>(focusableSelectors);
    if (focusableElements && focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        return;
      }

      if (e.key === 'Tab' && modalContentRef.current) {
        const focusables = modalContentRef.current.querySelectorAll<HTMLElement>(focusableSelectors);
        if (!focusables || focusables.length === 0) return;

        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      // Restore focus to trigger
      triggerRef.current?.focus();
    };
  }, [isModalOpen]);

  const openModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerRef.current = e.currentTarget;
    setIsModalOpen(true);
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const strings = {
    sectionBadge: isEn ? 'Verified Client Feedback' : 'Opiniones Verificadas',
    title: isEn ? 'What Our Clients Say' : 'Lo Que Dicen Nuestros Clientes',
    subtitle: isEn
      ? 'Real feedback from homeowners, property managers, and businesses across California.'
      : 'Comentarios reales de propietarios y empresas en California.',
    leaveReviewBtn: isEn ? 'Leave a Review' : 'Dejar una Reseña',
    emptyTitle: isEn ? 'Have you worked with Clean & Care PRO?' : '¿Ha trabajado con Clean & Care PRO?',
    emptyDesc: isEn
      ? 'Share your experience with our team. Reviews are verified and published to help our community.'
      : 'Comparta su experiencia con nuestro equipo. Las reseñas son verificadas y publicadas para ayudar a nuestra comunidad.',
    emptyAction: isEn ? 'Share Your Experience' : 'Comparta Su Experiencia',
    verifiedNote: isEn ? 'Authentic Client Reviews' : 'Reseñas Auténticas de Clientes',
    errorTitle: isEn ? 'Reviews Temporarily Unavailable' : 'Reseñas Temporalmente No Disponibles',
    errorDesc: isEn
      ? 'We are temporarily unable to load client reviews. Please try again shortly or leave a review below.'
      : 'No podemos cargar las reseñas en este momento. Por favor, inténtelo de nuevo o deje una reseña.',
    retryBtn: isEn ? 'Retry' : 'Reintentar',
  };

  return (
    <section id="reviews" className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-200/60">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#5FE873]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider mb-4 border border-blue-100">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>{strings.sectionBadge}</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {strings.title}
          </h2>

          <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6">
            {strings.subtitle}
          </p>

          {/* Average rating indicator if reviews exist */}
          {reviews.length > 0 && !hasError && (
            <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-200/80">
              <span className="font-extrabold text-slate-900 text-lg flex items-center gap-1.5">
                {avgRating} <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 text-sm font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                {strings.verifiedNote}
              </span>
            </div>
          )}
        </div>

        {/* Content Area */}
        {isLoading ? (
          /* Loading Skeleton */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse py-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-7 border border-slate-100 h-64 flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-2xl"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                  </div>
                </div>
                <div className="space-y-2 my-4">
                  <div className="h-3 bg-slate-100 rounded w-full"></div>
                  <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                  <div className="h-3 bg-slate-100 rounded w-4/6"></div>
                </div>
                <div className="h-3 bg-slate-100 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : hasError ? (
          /* Temporary Service Failure State (Distinguished from authentic empty state) */
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 md:p-10 text-center border border-slate-200/80 shadow-md">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-100">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
              {strings.errorTitle}
            </h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6 max-w-md mx-auto">
              {strings.errorDesc}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-3 rounded-xl font-bold transition-all text-sm"
              >
                <RefreshCw className="w-4 h-4 text-slate-600" />
                <span>{strings.retryBtn}</span>
              </button>
              <button
                type="button"
                onClick={openModal}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all text-sm"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>{strings.leaveReviewBtn}</span>
              </button>
            </div>
          </div>
        ) : reviews.length > 0 ? (
          /* Populated Carousel State */
          <div>
            <ReviewsCarousel reviews={reviews} />
            <div className="mt-12 text-center">
              <button
                type="button"
                onClick={openModal}
                className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:shadow-blue-600/20 transition-all text-base"
              >
                <MessageSquarePlus className="w-5 h-5" />
                <span>{strings.leaveReviewBtn}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Authentic Empty State (200 OK with 0 reviews) */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto bg-white rounded-3xl p-8 md:p-12 text-center border border-slate-200/80 shadow-xl relative overflow-hidden"
          >
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-blue-100">
              <Sparkles className="w-8 h-8" />
            </div>

            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
              {strings.emptyTitle}
            </h3>

            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8 max-w-lg mx-auto">
              {strings.emptyDesc}
            </p>

            <button
              type="button"
              onClick={openModal}
              className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:shadow-blue-600/20 transition-all text-base"
            >
              <MessageSquarePlus className="w-5 h-5" />
              <span>{strings.emptyAction}</span>
            </button>
          </motion.div>
        )}

      </div>

      {/* Accessible Review Submission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Dialog Content with Focus Trap */}
            <motion.div
              ref={modalContentRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative z-10 w-full max-w-xl my-8 focus:outline-none"
              tabIndex={-1}
            >
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  aria-label={isEn ? 'Close review dialog' : 'Cerrar diálogo de reseña'}
                  className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <X className="w-5 h-5" />
                </button>
                <LeaveReviewForm
                  onSuccess={() => {
                    loadReviews();
                  }}
                  onCancel={() => setIsModalOpen(false)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ReviewsSection;
