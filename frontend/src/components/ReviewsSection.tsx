import React, { useState, useEffect, useRef } from 'react';
import { Star, Sparkles, ExternalLink, MessageSquarePlus } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../translations';
import type { PublicGoogleReview, GoogleReviewsData } from '../types/googleReviews';
import ReviewsCarousel from './ReviewsCarousel';

const LEAVE_REVIEW_URL = 'https://g.page/r/Cf7PwUqHKMc7EBM/review';
const FALLBACK_REVIEWS_URL = 'https://share.google/PCz0f74BtOPSLcESV';

export const ReviewsSection: React.FC = () => {
  const { language } = useLanguage();
  const [reviewsData, setReviewsData] = useState<GoogleReviewsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasFetchedRef = useRef(false);

  const t = translations[language].reviews;
  const isEn = language === 'en';

  useEffect(() => {
    let ignore = false;

    async function loadGoogleReviews() {
      if (hasFetchedRef.current) return;
      hasFetchedRef.current = true;

      try {
        const res = await fetch('/api/google-reviews');
        if (!ignore) {
          if (res.ok) {
            const data: GoogleReviewsData = await res.json();
            setReviewsData(data);
            setHasError(false);
          } else {
            setHasError(true);
          }
        }
      } catch {
        if (!ignore) {
          setHasError(true);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    // Lazy load reviews when section approaches viewport
    if (typeof IntersectionObserver !== 'undefined' && sectionRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadGoogleReviews();
            observer.disconnect();
          }
        },
        { rootMargin: '200px' }
      );
      observer.observe(sectionRef.current);

      return () => {
        ignore = true;
        observer.disconnect();
      };
    } else {
      // Fallback load immediately if IntersectionObserver is unavailable
      loadGoogleReviews();
      return () => {
        ignore = true;
      };
    }
  }, []);

  const rating = reviewsData?.rating ?? 5.0;
  const userRatingCount = reviewsData?.userRatingCount ?? 0;
  const reviews: PublicGoogleReview[] = reviewsData?.reviews ?? [];
  const reviewsUri = reviewsData?.reviewsUri || FALLBACK_REVIEWS_URL;

  return (
    <section ref={sectionRef} id="reviews" className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-200/60">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#5FE873]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider mb-4 border border-blue-100">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>{t.sectionBadge}</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {t.title}
          </h2>

          <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6">
            {isEn
              ? 'Real feedback from homeowners, property managers, and businesses across California.'
              : 'Comentarios reales de propietarios y empresas en California.'}
          </p>

          {/* Exact Google Maps Rating Badge Header */}
          {!isLoading && !hasError && userRatingCount > 0 && (
            <div className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-200/80">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>

              <span className="font-extrabold text-slate-900 text-lg flex items-center gap-1.5">
                {rating.toFixed(1)} <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 text-sm font-normal">
                {userRatingCount} {t.reviewsCountLabel}
              </span>
              <span className="text-slate-300">|</span>
              <span translate="no" className="text-sm font-normal text-slate-800 whitespace-nowrap">Google Maps</span>
            </div>
          )}
        </div>

        {/* Content Area */}
        {isLoading ? (
          /* Accessible Skeleton Loading State */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse py-6" aria-busy="true" aria-label={isEn ? 'Loading reviews' : 'Cargando reseñas'}>
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-7 border border-slate-100 h-64 flex flex-col justify-between shadow-sm">
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
        ) : !hasError && reviews.length > 0 ? (
          /* Populated Reviews Carousel */
          <div>
            <ReviewsCarousel reviews={reviews} />

            {/* Google CTAs */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={reviewsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-7 py-3.5 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all text-base"
              >
                <span>{t.readAllReviews}</span>
                <ExternalLink className="w-4 h-4 text-slate-600" />
              </a>

              <a
                href={LEAVE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:shadow-blue-600/20 transition-all text-base"
              >
                <MessageSquarePlus className="w-5 h-5" />
                <span>{t.leaveReview}</span>
              </a>
            </div>
          </div>
        ) : (
          /* Resilient Fallback UI */
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 md:p-12 text-center border border-slate-200/80 shadow-md">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-blue-100">
              <svg className="w-8 h-8" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>

            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
              {t.fallbackTitle}
            </h3>

            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8 max-w-lg mx-auto">
              {t.fallbackDesc}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={reviewsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-7 py-3.5 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all text-base"
              >
                <span>{t.readAllReviews}</span>
                <ExternalLink className="w-4 h-4 text-slate-600" />
              </a>

              <a
                href={LEAVE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:shadow-blue-600/20 transition-all text-base"
              >
                <MessageSquarePlus className="w-5 h-5" />
                <span>{t.leaveReview}</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
