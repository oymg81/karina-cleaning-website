import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Quote } from 'lucide-react';
import type { PublicReview } from '../types/foes';
import { useLanguage } from '../hooks/useLanguage';

interface ReviewsCarouselProps {
  reviews: PublicReview[];
}

export const ReviewsCarousel: React.FC<ReviewsCarouselProps> = ({ reviews }) => {
  const { language } = useLanguage();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const isEn = language === 'en';

  const checkScrollability = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    checkScrollability();
    el.addEventListener('scroll', checkScrollability, { passive: true });
    window.addEventListener('resize', checkScrollability);

    return () => {
      el.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [checkScrollability, reviews]);

  const scrollByAmount = (direction: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;

    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 24 : 340;
    const targetScroll = direction === 'left' ? el.scrollLeft - cardWidth : el.scrollLeft + cardWidth;

    el.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollByAmount('left');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollByAmount('right');
    }
  };

  // Format date nicely
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString(isEn ? 'en-US' : 'es-US', {
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  // Format service type label
  const formatServiceType = (service?: string | null) => {
    if (!service) return null;
    const lower = service.toLowerCase();
    if (lower.includes('resident')) return isEn ? 'Residential' : 'Residencial';
    if (lower.includes('deep')) return isEn ? 'Deep Cleaning' : 'Limpieza Profunda';
    if (lower.includes('move')) return isEn ? 'Move In/Out' : 'Mudanza';
    if (lower.includes('commerc')) return isEn ? 'Commercial' : 'Comercial';
    if (lower.includes('office')) return isEn ? 'Office' : 'Oficina';
    if (lower.includes('airbnb')) return isEn ? 'Airbnb' : 'Airbnb';
    return service;
  };

  return (
    <div className="relative w-full">
      {/* Controls Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>{isEn ? `${reviews.length} Verified Customer Reviews` : `${reviews.length} Reseñas Verificadas`}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByAmount('left')}
            disabled={!canScrollLeft}
            aria-label={isEn ? 'Previous review' : 'Reseña anterior'}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => scrollByAmount('right')}
            disabled={!canScrollRight}
            aria-label={isEn ? 'Next review' : 'Siguiente reseña'}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable Track */}
      <div
        ref={carouselRef}
        tabIndex={0}
        role="region"
        aria-label={isEn ? 'Customer reviews carousel' : 'Carrusel de reseñas de clientes'}
        onKeyDown={handleKeyDown}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 px-1 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-3xl"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {reviews.map((review, idx) => {
          const serviceLabel = formatServiceType(review.service_type);
          const dateStr = formatDate(review.created_at);

          return (
            <div
              key={review.id || idx}
              className="snap-start shrink-0 w-[300px] sm:w-[350px] md:w-[380px] bg-white rounded-3xl p-7 shadow-lg border border-slate-100/90 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {review.is_featured && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] uppercase font-extrabold tracking-wider px-3 py-1 rounded-bl-xl shadow-sm">
                  {isEn ? 'Featured' : 'Destacada'}
                </div>
              )}

              <div>
                {/* Header info */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-extrabold text-lg flex items-center justify-center shadow-md shrink-0">
                    {review.reviewer_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-base truncate">
                      {review.reviewer_name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1 text-green-600 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isEn ? 'Verified' : 'Verificado'}
                      </span>
                      {dateStr && <span>• {dateStr}</span>}
                    </div>
                  </div>
                </div>

                {/* Rating stars & service */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400 drop-shadow-xs'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  {serviceLabel && (
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-bold tracking-wide border border-blue-100">
                      {serviceLabel}
                    </span>
                  )}
                </div>

                {/* Message Body */}
                <div className="relative">
                  <Quote className="w-8 h-8 text-blue-100/80 absolute -top-2 -left-2 -z-0 pointer-events-none" />
                  <p className="text-slate-700 text-sm leading-relaxed relative z-10 line-clamp-6 italic font-normal">
                    "{review.message}"
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Clean & Care PRO</span>
                <span className="font-semibold text-slate-500">{review.rating}.0 / 5.0</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewsCarousel;
