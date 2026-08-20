import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { translations, type Language } from './translations';
import { LanguageContext } from './context/languageContext';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
