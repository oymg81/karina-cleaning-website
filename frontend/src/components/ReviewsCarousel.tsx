import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, ExternalLink } from 'lucide-react';
import type { PublicGoogleReview } from '../types/googleReviews';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../translations';

interface ReviewsCarouselProps {
  reviews: PublicGoogleReview[];
}

export const ReviewsCarousel: React.FC<ReviewsCarouselProps> = ({ reviews }) => {
  const { language } = useLanguage();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const t = translations[language].reviews;
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

  return (
    <div className="relative w-full">
      {/* Controls Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-xs font-normal text-slate-600">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>{isEn ? `${reviews.length} Verified Reviews from ` : `${reviews.length} Reseñas Verificadas de `}</span>
          <span translate="no" className="font-normal text-slate-800">Google Maps</span>
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
        aria-label={isEn ? 'Google Maps customer reviews carousel' : 'Carrusel de reseñas de clientes de Google Maps'}
        onKeyDown={handleKeyDown}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 px-1 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-3xl"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {reviews.map((review, idx) => {
          const individualReviewLink = review.googleMapsUri || review.authorUri || null;
          const accessibleRatingText = isEn
            ? `${review.rating} out of 5 stars`
            : `${review.rating} de 5 estrellas`;

          return (
            <div
              key={review.id || idx}
              className="snap-start shrink-0 w-[300px] sm:w-[350px] md:w-[380px] bg-white rounded-3xl p-7 shadow-lg border border-slate-100/90 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {/* Exact Google Maps Text Attribution Badge with translate="no" */}
              <div className="absolute top-0 right-0 bg-slate-100 text-slate-700 text-xs font-normal px-3 py-1 rounded-bl-xl border-l border-b border-slate-200/80 flex items-center gap-1.5 select-none">
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span translate="no" className="font-normal text-xs text-slate-700 whitespace-nowrap">Google Maps</span>
              </div>

              <div>
                {/* Header info */}
                <div className="flex items-center gap-3.5 mb-4 pr-24">
                  {review.authorUri ? (
                    <a
                      href={review.authorUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 group"
                      aria-label={`${review.authorName} Google Maps profile`}
                    >
                      {review.authorPhoto ? (
                        <img
                          src={review.authorPhoto}
                          alt={review.authorName}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm group-hover:opacity-90 transition-opacity"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-extrabold text-lg flex items-center justify-center shadow-md group-hover:opacity-90 transition-opacity">
                          {review.authorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </a>
                  ) : (
                    <div className="shrink-0">
                      {review.authorPhoto ? (
                        <img
                          src={review.authorPhoto}
                          alt={review.authorName}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-extrabold text-lg flex items-center justify-center shadow-md">
                          {review.authorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-base truncate">
                      {review.authorUri ? (
                        <a
                          href={review.authorUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline hover:text-blue-600 transition-colors"
                        >
                          {review.authorName}
                        </a>
                      ) : (
                        review.authorName
                      )}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      {review.relativePublishTime && <span>{review.relativePublishTime}</span>}
                    </div>
                  </div>
                </div>

                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-4" aria-label={accessibleRatingText}>
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
                  <span className="sr-only">{accessibleRatingText}</span>
                </div>

                {/* Message Body */}
                <div className="relative">
                  <Quote className="w-8 h-8 text-blue-100/80 absolute -top-2 -left-2 -z-0 pointer-events-none" />
                  <p className="text-slate-700 text-sm leading-relaxed relative z-10 line-clamp-6 italic font-normal">
                    "{review.text}"
                  </p>
                </div>
              </div>

              {/* Card Footer with mandatory individual review link */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold">Clean & Care PRO</span>
                {individualReviewLink ? (
                  <a
                    href={individualReviewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span>{t.viewOnGoogle}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="font-semibold text-slate-400">{review.rating}.0 / 5.0</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mandatory Google Reviews relevance and ordering notice */}
      <p className="text-xs text-slate-500 text-center mt-6 font-medium">
        {t.relevanceNotice}
      </p>
    </div>
  );
};

export default ReviewsCarousel;
