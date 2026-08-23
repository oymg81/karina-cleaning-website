import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, Mail, Phone, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import SEOHead from '../components/SEOHead';
import { getRouteMetadata, getRouteJsonLd } from '../utils/seo';

const TermsPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const metadata = useMemo(() => getRouteMetadata('/terms', language), [language]);
  const jsonLd = useMemo(() => getRouteJsonLd('/terms', language), [language]);

  return (
    <>
      <SEOHead
        title={metadata.title}
        description={metadata.description}
        canonicalUrl={metadata.canonicalUrl}
        ogImage={metadata.ogImage}
        ogType={metadata.ogType}
        twitterCard={metadata.twitterCard}
        locale={metadata.locale}
        robots={metadata.robots}
        jsonLd={jsonLd}
      />

      <div className="bg-slate-50 min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Breadcrumb / Back */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isEn ? 'Back to Home' : 'Volver al Inicio'}</span>
            </Link>
          </div>

          {/* Header Card */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200/80 mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider mb-4 border border-blue-100">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span>{isEn ? 'Terms & Conditions' : 'Términos y Condiciones'}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              {isEn ? 'Terms of Service' : 'Términos de Servicio'}
            </h1>

            <p className="text-slate-500 text-sm font-medium">
              {isEn ? 'Last Updated: August 2026' : 'Última actualización: Agosto de 2026'}
            </p>
          </div>

          {/* Content Body */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200/80 space-y-10 text-slate-700 leading-relaxed">
            
            {/* 1. Overview */}
            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                {isEn ? '1. Service Agreement' : '1. Acuerdo de Servicio'}
              </h2>
              <p>
                {isEn
                  ? 'By requesting, scheduling, or receiving cleaning services from Clean & Care PRO, you agree to these Terms of Service. Clean & Care PRO provides professional residential, commercial, deep cleaning, and move in/out turnover services in Southern California.'
                  : 'Al solicitar, programar o recibir servicios de limpieza de Clean & Care PRO, usted acepta estos Términos de Servicio. Clean & Care PRO ofrece servicios profesionales de limpieza residencial, comercial, profunda y de mudanza en el sur de California.'}
              </p>
            </section>

            {/* 2. Estimates & Pricing */}
            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                {isEn ? '2. Quotes & Service Estimates' : '2. Cotizaciones y Presupuestos'}
              </h2>
              <p>
                {isEn
                  ? 'Online and telephone quotes are estimates based on the property information and specifications provided. Final pricing may be adjusted if the on-site property condition or scope differs significantly from the initial request.'
                  : 'Las cotizaciones en línea o telefónicas son presupuestos basados en la información proporcionada. El precio final puede ajustarse si las condiciones del inmueble o el alcance real difieren significativamente de la solicitud inicial.'}
              </p>
            </section>

            {/* 3. Scheduling & Cancellations */}
            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                {isEn ? '3. Scheduling, Access & Cancellations' : '3. Programación, Acceso y Cancelaciones'}
              </h2>
              <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
                <li><strong>{isEn ? 'Property Access:' : 'Acceso a la propiedad:'}</strong> {isEn ? 'Clients must ensure safe and timely access to the property at the agreed appointment time.' : 'El cliente debe garantizar el acceso seguro y oportuno a la propiedad a la hora acordada.'}</li>
                <li><strong>{isEn ? 'Rescheduling:' : 'Reprogramaciones:'}</strong> {isEn ? 'We kindly request at least 24 hours advance notice for cancellations or appointment rescheduling.' : 'Agradecemos notificar con al menos 24 horas de anticipación cualquier cancelación o cambio de cita.'}</li>
              </ul>
            </section>

            {/* 4. Satisfaction Commitment */}
            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                {isEn ? '4. Satisfaction & Quality Guarantee' : '4. Garantía de Calidad y Satisfacción'}
              </h2>
              <p>
                {isEn
                  ? 'Your satisfaction is our priority. If any area included in your service package does not meet our high standards, please notify us within 24 hours of service completion, and our team will promptly inspect and re-clean the designated area.'
                  : 'Su satisfacción es nuestra prioridad. Si algún área incluida en su paquete de servicio no cumple con nuestros estándares, notifíquenos dentro de las 24 horas posteriores a la finalización y nuestro equipo revisará y repasará el área indicada sin costo adicional.'}
              </p>
            </section>

            {/* 5. Insurance & Liability */}
            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                {isEn ? '5. Insurance & Safety Standards' : '5. Seguro y Estándares de Seguridad'}
              </h2>
              <p>
                {isEn
                  ? 'Clean & Care PRO is fully licensed and insured. Our cleaning professionals follow strict safety protocols. Clients are encouraged to secure valuable personal belongings and fragile items prior to service.'
                  : 'Clean & Care PRO cuenta con licencia y seguro completos. Nuestros profesionales siguen estrictos protocolos de seguridad. Se recomienda a los clientes resguardar objetos de alto valor y artículos frágiles antes del servicio.'}
              </p>
            </section>

            {/* 6. Contact */}
            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                {isEn ? '6. Contact Clean & Care PRO' : '6. Contacto Clean & Care PRO'}
              </h2>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 mt-2 space-y-2 text-sm font-medium text-slate-800">
                <p><strong>Clean & Care PRO</strong></p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <a href="tel:7144731140" className="hover:text-blue-600 transition-colors">(714) 473-1140</a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <a href="mailto:cleancareproservices2@gmail.com" className="hover:text-blue-600 transition-colors">cleancareproservices2@gmail.com</a>
                </p>
              </div>
            </section>

          </div>

        </div>
      </div>
    </>
  );
};

export default TermsPage;
