'use client';

import React, { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '@/i18n';

export const AuthLanguageSwitch: React.FC = () => {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left z-30">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-[#D1D1D1]/30 hover:border-white text-xs font-semibold text-white transition-all cursor-pointer shadow-sm"
        title="تغيير اللغة / Change Language"
      >
        <span className="text-sm">{locale === 'ar' ? '🇸🇦' : '🇬🇧'}</span>
        <span>{locale === 'ar' ? 'العربية' : 'English'}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#D1D1D1] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            locale === 'ar' ? 'left-0' : 'right-0'
          } mt-2 w-32 rounded-xl bg-[#141414] border border-[#2B2B2B] shadow-2xl p-1 z-50 flex flex-col gap-0.5 animate-fade-in`}
        >
          <button
            type="button"
            onClick={() => {
              setLocale('ar');
              setIsOpen(false);
            }}
            className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
              locale === 'ar' ? 'bg-white/15 text-white' : 'text-[#D1D1D1] hover:bg-white/5'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span>🇸🇦</span>
              <span>العربية</span>
            </span>
            {locale === 'ar' && <span className="text-emerald-400">✓</span>}
          </button>

          <button
            type="button"
            onClick={() => {
              setLocale('en');
              setIsOpen(false);
            }}
            className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
              locale === 'en' ? 'bg-white/15 text-white' : 'text-[#D1D1D1] hover:bg-white/5'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span>🇬🇧</span>
              <span>English</span>
            </span>
            {locale === 'en' && <span className="text-emerald-400">✓</span>}
          </button>
        </div>
      )}
    </div>
  );
};
