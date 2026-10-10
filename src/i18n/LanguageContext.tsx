'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Locale, Direction, Translations } from './types';
import { translations } from './translations';

interface LanguageContextType {
  locale: Locale;
  direction: Direction;
  t: Translations;
  setLocale: (locale: Locale) => void;
  toggleLanguage: () => void;
  isRtl: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export interface LanguageProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export const LanguageProvider = ({
  children,
  initialLocale = 'ar',
}: LanguageProviderProps) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_locale') as Locale;
      if (saved === 'ar' || saved === 'en') return saved;
    }
    return initialLocale;
  });

  // الاتجاه ثابت دائماً من اليمين لليسار RTL بناء على طلب المستخدم
  const direction: Direction = 'rtl';
  const isRtl = true;
  const t = translations[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = 'rtl';
    localStorage.setItem('app_locale', locale);
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const toggleLanguage = () => {
    setLocaleState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        direction,
        t,
        setLocale,
        toggleLanguage,
        isRtl,
      }}
    >
      <div dir="rtl" className="rtl" key={locale}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
