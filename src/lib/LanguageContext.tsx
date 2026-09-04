import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationSchema, translations } from './translations';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationSchema;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const readStoredLanguage = (): Language => {
  try {
    const saved = localStorage.getItem('preferred-language');
    if (saved === 'de' || saved === 'tr') return saved;
  } catch {
    // localStorage nicht verfuegbar (SSR, eingeschraenkter Modus) - Standard bleibt.
  }
  return 'de';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(readStoredLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('preferred-language', lang);
    } catch {
      // ignorieren
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
