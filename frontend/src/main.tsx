import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { LanguageProvider } from './LanguageContext.tsx';
import { initAttributionCapture } from './utils/attribution.ts';
import { initAnalytics } from './utils/analytics.ts';

// Initialize attribution capture & analytics on initial page load
initAttributionCapture();
initAnalytics();

const rootElement = document.getElementById('root')!;

const appNode = (
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, appNode);
} else {
  createRoot(rootElement).render(appNode);
}
