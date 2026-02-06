"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('es');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Cargar idioma guardado
    const savedLang = localStorage.getItem('app_language');
    if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
      setLanguage(savedLang);
    }
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'es' ? 'en' : 'es';
    setLanguage(newLang);
    localStorage.setItem('app_language', newLang);
  };

  const setLang = (lang) => {
    if (lang === 'es' || lang === 'en') {
      setLanguage(lang);
      localStorage.setItem('app_language', lang);
    }
  };

  const t = translations[language];

  // Evitar hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback para cuando no está dentro del provider
    return {
      language: 'es',
      toggleLanguage: () => {},
      setLang: () => {},
      t: translations.es,
    };
  }
  return context;
}
