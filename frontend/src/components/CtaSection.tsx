import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Send } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const CtaSection: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'residential',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In the future, this will connect to the backend API
    alert(t.cta.successMessage);
    setFormData({ name: '', email: '', phone: '', service: 'residential', message: '' });
  };

  return (
    <section id="contact" className="py-24 bg-blue-600 text-white relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/about-team.jpg"
          alt="Cleaning service professional"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-600/95 backdrop-blur-sm" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-white tracking-tight">
              {t.cta.title1} <span className="text-blue-500">{t.cta.title2}</span>
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-lg leading-relaxed">
              {t.cta.desc}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:714-473-1140" className="bg-white text-blue-600 hover:bg-slate-50 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                {t.cta.call} 714-473-1140
              </a>
            </div>
            
            <div className="mt-12 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                </div>
                <p className="text-slate-200">{t.cta.fastQuotes}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                </div>
                <p className="text-white">{t.cta.flexible}</p>
              </div>
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
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
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
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
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder={t.cta.messagePlaceholder}
                ></textarea>
              </div>
              
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 mt-2">
                <Send className="w-5 h-5" />
                {t.cta.sendRequest}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default CtaSection;
