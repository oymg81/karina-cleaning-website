import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Star } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const Reviews: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="reviews" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">{t.reviews.subtitle}</h2>
          <h3 className="text-4xl lg:text-5xl font-extrabold text-navy mb-4 tracking-tight">
            {t.reviews.title}
          </h3>
          <p className="text-lg text-slate-600 flex items-center justify-center gap-2">
            <span className="font-bold text-navy flex items-center gap-1">
              4.9 <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </span>
            {t.reviews.ratingText}
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          {t.reviews.list.map((review, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 flex flex-col h-full"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shadow-inner">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-navy text-lg">{review.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{review.location} • {review.date}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <div className="relative flex-grow">
                <p className="text-slate-600 leading-relaxed relative z-10 italic">
                  "{review.text}"
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <a href="#contact" className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold transition-all inline-block">
            {t.reviews.leaveReview}
          </a>
        </div>

      </div>
    </section>
  );
};

export default Reviews;
