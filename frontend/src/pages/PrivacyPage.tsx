import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import SEOHead from '../components/SEOHead';
import { getRouteMetadata, getRouteJsonLd } from '../utils/seo';

const PrivacyPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const metadata = useMemo(() => getRouteMetadata('/privacy', language), [language]);
  const jsonLd = useMemo(() => getRouteJsonLd('/privacy', language), [language]);

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
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>{isEn ? 'Legal & Transparency' : 'Legal y Transparencia'}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              {isEn ? 'Privacy Policy' : 'Política de Privacidad'}
            </h1>

            <p className="text-slate-500 text-sm font-medium">
              {isEn ? 'Last Updated: August 2026' : 'Última actualización: Agosto de 2026'}
            </p>
          </div>

          {/* Content Body */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200/80 space-y-10 text-slate-700 leading-relaxed">
            
            {/* 1. Introduction */}
            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <FileText className="w-6 h-6 text-blue-600 shrink-0" />
                <span>{isEn ? '1. Introduction' : '1. Introducción'}</span>
              </h2>
              <p>
                {isEn
                  ? 'Clean & Care PRO ("we," "our," or "us") values your privacy and is dedicated to protecting the personal information you share with us. This Privacy Policy details how we collect, handle, store, and disclose information when you visit our website (cleancareproservice.com), submit a quote request, or communicate with our team.'
                  : 'Clean & Care PRO ("nosotros", "nuestro") valora su privacidad y se compromete a proteger la información personal que comparte con nosotros. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y divulgamos la información cuando visita nuestro sitio web (cleancareproservice.com), solicita una cotización o se comunica con nuestro equipo.'}
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <Eye className="w-6 h-6 text-blue-600 shrink-0" />
                <span>{isEn ? '2. Information We Collect' : '2. Información que Recopilamos'}</span>
              </h2>
              <p>
                {isEn
                  ? 'We collect information directly provided by you through our online forms, direct calls, emails, and messaging services, including:'
                  : 'Recopilamos información proporcionada directamente por usted a través de nuestros formularios en línea, llamadas, correos y mensajes, incluyendo:'}
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
                <li><strong>{isEn ? 'Contact Details:' : 'Datos de contacto:'}</strong> {isEn ? 'Full name, email address, and telephone number.' : 'Nombre completo, correo electrónico y número de teléfono.'}</li>
                <li><strong>{isEn ? 'Service Requirements:' : 'Requerimientos de servicio:'}</strong> {isEn ? 'Service type (residential, deep cleaning, commercial, move in/out), property details, schedule preferences, and specific instructions.' : 'Tipo de servicio (residencial, limpieza profunda, comercial, mudanza), detalles de la propiedad, preferencias de horario e instrucciones específicas.'}</li>
                <li><strong>{isEn ? 'Customer Feedback:' : 'Comentarios y opiniones:'}</strong> {isEn ? 'Star ratings, review text, and optional service testimonials submitted through our review system.' : 'Calificaciones en estrellas, texto de reseñas y testimonios enviados mediante nuestro sistema de opiniones.'}</li>
                <li><strong>{isEn ? 'Technical & Attribution Data:' : 'Datos técnicos y de atribución:'}</strong> {isEn ? 'Non-personally identifiable session metrics such as campaign parameters (UTM tags), landing pages, and referral URLs to analyze lead generation sources.' : 'Métricas de sesión no identificables personalmente como parámetros de campaña (etiquetas UTM), páginas de destino y URLs de referencia.'}</li>
              </ul>
            </section>

            {/* 3. How We Use and Process Information */}
            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <Lock className="w-6 h-6 text-blue-600 shrink-0" />
                <span>{isEn ? '3. How We Use and Deliver Your Information' : '3. Uso y Entrega de su Información'}</span>
              </h2>
              <p>
                {isEn
                  ? 'We use the collected information strictly for legitimate business purposes:'
                  : 'Utilizamos la información recopilada estrictamente para propósitos comerciales legítimos:'}
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
                <li>{isEn ? 'Preparing customized, free cleaning estimates and quotes.' : 'Preparar presupuestos y cotizaciones personalizadas y gratuitas.'}</li>
                <li>{isEn ? 'Coordinating cleaning appointments and confirming team arrival schedules.' : 'Coordinar citas de limpieza y confirmar horarios de llegada del equipo.'}</li>
                <li>{isEn ? 'Fulfilling lead delivery reliably through dual-dispatch systems (FOES Platform CRM and EmailJS notification services).' : 'Garantizar la entrega segura de solicitudes mediante sistemas duales (CRM FOES Platform y notificaciones EmailJS).'}</li>
                <li>{isEn ? 'Publishing verified customer feedback to assist future clients.' : 'Publicar comentarios verificados para orientar a futuros clientes.'}</li>
                <li>{isEn ? 'Responding to direct customer inquiries via phone, email, or WhatsApp.' : 'Responder a consultas directas por teléfono, correo o WhatsApp.'}</li>
              </ul>
            </section>

            {/* 4. Third-Party Integrations & Analytics */}
            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0" />
                <span>{isEn ? '4. Third-Party Services & Analytics' : '4. Servicios de Terceros y Analítica'}</span>
              </h2>
              <p>
                {isEn
                  ? 'We work with trusted third-party providers to operate our business infrastructure:'
                  : 'Trabajamos con proveedores de confianza para operar nuestra infraestructura:'}
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
                <li><strong>FOES Platform:</strong> {isEn ? 'Our enterprise CRM partner for lead routing, customer relationship management, and review verification.' : 'Nuestro CRM para enrutamiento de prospectos, gestión de clientes y verificación de reseñas.'}</li>
                <li><strong>EmailJS:</strong> {isEn ? 'Used for rapid, secure email notifications to dispatch cleaning requests directly to our management.' : 'Utilizado para notificaciones rápidas y seguras por correo hacia nuestra administración.'}</li>
                <li><strong>Google Analytics 4 & Meta Pixel:</strong> {isEn ? 'When configured, these tools measure website traffic and aggregate conversion performance. No personally identifiable information (PII) such as customer names, phone numbers, or emails is ever sent to analytics platforms.' : 'Cuando están configuradas, estas herramientas miden el tráfico web y conversiones agregadas. Nunca se envía información personal identificable (PII) como nombres, teléfonos o correos a plataformas analíticas.'}</li>
                <li><strong>WhatsApp / Meta:</strong> {isEn ? 'Direct customer messaging is handled under WhatsApp’s standard end-to-end encrypted communication protocols.' : 'La mensajería directa se procesa bajo los protocolos estándar de comunicación cifrada de WhatsApp.'}</li>
              </ul>
            </section>

            {/* 5. Data Security & Retention */}
            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <Lock className="w-6 h-6 text-blue-600 shrink-0" />
                <span>{isEn ? '5. Data Retention & Security' : '5. Retención y Seguridad de Datos'}</span>
              </h2>
              <p>
                {isEn
                  ? 'We implement administrative, technical, and physical security measures to safeguard your personal data. We do not sell, rent, or trade your personal information to third parties for marketing purposes. Your information is retained only as long as necessary to provide requested services and fulfill business compliance requirements.'
                  : 'Implementamos medidas administrativas, técnicas y físicas para proteger sus datos. No vendemos, alquilamos ni comercializamos su información personal a terceros para fines de mercadeo. Su información se conserva únicamente durante el tiempo necesario para prestar los servicios solicitados y cumplir con requisitos legales.'}
              </p>
            </section>

            {/* 6. Your Rights & Inquiries */}
            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <Mail className="w-6 h-6 text-blue-600 shrink-0" />
                <span>{isEn ? '6. Your Rights & Contact Information' : '6. Sus Derechos y Contacto'}</span>
              </h2>
              <p>
                {isEn
                  ? 'You have the right to request access to, correction of, or deletion of your personal data at any time. For any privacy-related questions or data requests, please contact us:'
                  : 'Tiene derecho a solicitar el acceso, corrección o eliminación de sus datos personales en cualquier momento. Para cualquier consulta de privacidad, contáctenos:'}
              </p>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 mt-4 space-y-2 text-sm font-medium text-slate-800">
                <p><strong>Clean & Care PRO</strong></p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <a href="tel:7144731140" className="hover:text-blue-600 transition-colors">(714) 473-1140</a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <a href="mailto:cleancareproservices2@gmail.com" className="hover:text-blue-600 transition-colors">cleancareproservices2@gmail.com</a>
                </p>
                <p>{isEn ? 'Serving Orange County, Los Angeles, and Southern California communities.' : 'Atendiendo Orange County, Los Ángeles y comunidades del sur de California.'}</p>
              </div>
            </section>

          </div>

        </div>
      </div>
    </>
  );
};

export default PrivacyPage;
