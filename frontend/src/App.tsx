import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ServiceAreaPage from './pages/ServiceAreaPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/service-areas/orange-county" element={<ServiceAreaPage slug="orange-county" />} />
          <Route path="/service-areas/glendale" element={<ServiceAreaPage slug="glendale" />} />
          <Route path="/service-areas/rosemead" element={<ServiceAreaPage slug="rosemead" />} />
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
