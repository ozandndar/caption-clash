'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const LanguageContext = createContext();

export const SUPPORTED_LANGUAGES = ['en', 'tr', 'es', 'zh', 'ru', 'hi', 'fr'];

// Language metadata object
export const LANGUAGE_METADATA = {
  en: { name: 'English', flag: '🇺🇸' },
  tr: { name: 'Türkçe', flag: '🇹🇷' },
  es: { name: 'Español', flag: '🇪🇸' },
  zh: { name: '中文', flag: '🇨🇳' },
  ru: { name: 'Русский', flag: '🇷🇺' },
  hi: { name: 'हिंदी', flag: '🇮🇳' },
  fr: { name: 'Français', flag: '🇫🇷' }
};

function getBrowserLanguage() {
  // Check if we're on the client side
  if (typeof window === 'undefined') return 'en';

  // Get browser language (e.g., 'en-US' or 'tr-TR')
  const browserLang = navigator.language.split('-')[0];

  // Check if we support this language
  return SUPPORTED_LANGUAGES.includes(browserLang) ? browserLang : 'en';
}

export function LanguageProvider({ children, initialLocale }) {
  // Use cookie first, then browser preference, then fallback to 'en'
  const [locale, setLocale] = useState(
    initialLocale || Cookies.get('locale') || getBrowserLanguage()
  );

  // Set initial cookie if it doesn't exist
  useEffect(() => {
    if (!Cookies.get('locale')) {
      Cookies.set('locale', locale);
    }
  }, []);

  const changeLocale = (newLocale) => {
    Cookies.set('locale', newLocale);
    setLocale(newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext); 