import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ServiceAreaPage from './pages/ServiceAreaPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import QuotePage from './pages/QuotePage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quote" element={<QuotePage />} />

          {/* Target Canonical Local SEO Routes */}
          <Route path="/orange-county-cleaning-services" element={<ServiceAreaPage slug="orange-county" />} />
          <Route path="/glendale-cleaning-services" element={<ServiceAreaPage slug="glendale" />} />
          <Route path="/rosemead-cleaning-services" element={<ServiceAreaPage slug="rosemead" />} />

          {/* Legacy Service Area Redirects for Client Navigation */}
          <Route path="/service-areas/orange-county" element={<Navigate to="/orange-county-cleaning-services" replace />} />
          <Route path="/service-areas/glendale" element={<Navigate to="/glendale-cleaning-services" replace />} />
          <Route path="/service-areas/rosemead" element={<Navigate to="/rosemead-cleaning-services" replace />} />

          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
};

export default App;
