import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { LanguageProvider } from './LanguageContext';
import { getRouteMetadata, getRouteJsonLd } from './utils/seo';

export function render(url: string, lang: 'en' | 'es' = 'en') {
  const html = renderToString(
    <LanguageProvider>
      <MemoryRouter initialEntries={[url]}>
        <App />
      </MemoryRouter>
    </LanguageProvider>
  );

  const metadata = getRouteMetadata(url, lang);
  const jsonLd = getRouteJsonLd(url, lang);

  return { html, metadata, jsonLd };
}
