'use client';

import React, { useState } from 'react';
import { Mail, Phone, Moon, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/i18n';
import { FacebookIcon, SnapchatIcon, InstagramIcon } from '@/assets/icons/FigmaIcons';

export const TopBar = () => {
  const { t, locale, setLocale } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div
      dir="ltr"
      className="w-full bg-[#000000] text-white text-xs sm:text-sm h-12 sm:h-14 relative z-50 flex items-center justify-between overflow-visible border-b border-white/10 select-none"
    >
      {/* 1. الجانب الأيسر: محدد اللغة، الوضع الليلي، البريد، والهاتف بألوان هوية سوق الإبل */}
      <div className="flex items-center gap-3 sm:gap-5 pl-4 sm:pl-8 md:pl-12">
        
        {/* محدد اللغة (العلم + السهم) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 cursor-pointer hover:bg-white/10 transition-colors bg-white/5 px-2.5 py-1 rounded-md border border-[#8E8E8E]/40"
            title="اختيار اللغة / Language Selector"
          >
            <span className="text-base">{locale === 'ar' ? '🇸🇦' : '🇬🇧'}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#D1D1D1] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* القائمة المنسدلة لاختيار اللغة */}
          {isDropdownOpen && (
            <div
              className="absolute left-0 top-full mt-1.5 w-28 bg-[#1C1917] border border-[#616161] rounded-xl shadow-2xl py-1.5 z-50 flex flex-col gap-0.5"
            >
              <button
                type="button"
                onClick={() => {
                  setLocale('ar');
                  setIsDropdownOpen(false);
                }}
                className={`w-full px-3 py-1.5 flex items-center justify-between text-xs font-bold transition-colors ${
                  locale === 'ar' ? 'bg-white/15 text-white' : 'text-[#D1D1D1] hover:bg-white/5'
                }`}
              >
                <span>🇸🇦 العربية</span>
                {locale === 'ar' && <span className="text-xs">✓</span>}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLocale('en');
                  setIsDropdownOpen(false);
                }}
                className={`w-full px-3 py-1.5 flex items-center justify-between text-xs font-bold transition-colors ${
                  locale === 'en' ? 'bg-white/15 text-white' : 'text-[#D1D1D1] hover:bg-white/5'
                }`}
              >
                <span>🇬🇧 English</span>
                {locale === 'en' && <span className="text-xs">✓</span>}
              </button>
            </div>
          )}
        </div>

        {/* زر الوضع الليلي */}
        <button
          type="button"
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-[#D1D1D1]"
          aria-label={t.topBar.toggleTheme}
        >
          <Moon className="w-4 h-4" />
        </button>

        {/* البريد الإلكتروني */}
        <a
          href={`mailto:${t.topBar.email}`}
          className="hidden md:flex items-center gap-2 text-[#D1D1D1] hover:text-white transition-colors"
        >
          <Mail className="w-4 h-4 text-[#D1D1D1]" />
          <span className="font-mono text-xs">{t.topBar.email}</span>
        </a>

        {/* الفاصل الرأسي */}
        <div className="hidden md:block w-px h-4 bg-[#616161]" />

        {/* رقم الهاتف */}
        <a
          href={`tel:${t.topBar.phone}`}
          className="flex items-center gap-2 text-[#D1D1D1] hover:text-white transition-colors"
          dir="ltr"
        >
          <Phone className="w-4 h-4 text-[#D1D1D1]" />
          <span className="font-mono text-xs tracking-wider">{t.topBar.phone}</span>
        </a>
      </div>

      {/* 2. الجانب الأيمن: الشريط المائل بألوان الهوية الرسمية (#616161 إلى #8E8E8E) */}
      <div className="relative h-full flex items-center">
        <div
          className="h-full flex items-center pl-10 sm:pl-16 pr-4 sm:pr-8 md:pr-12"
          style={{
            background: 'linear-gradient(90deg, #616161 0%, #8E8E8E 100%)',
            clipPath: 'polygon(45px 0, 100% 0, 100% 100%, 0 100%)',
          }}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            {/* 1. Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="p-1 rounded-md hover:scale-110 text-[#000000] hover:text-white transition-all"
              aria-label="Facebook"
            >
              <FacebookIcon size={22} color="currentColor" />
            </a>

            {/* 2. Snapchat */}
            <a
              href="https://snapchat.com"
              target="_blank"
              rel="noreferrer"
              className="p-1 rounded-md hover:scale-110 text-[#000000] hover:text-white transition-all"
              aria-label="Snapchat"
            >
              <SnapchatIcon size={22} color="currentColor" />
            </a>

            {/* 3. Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="p-1 rounded-md hover:scale-110 text-[#000000] hover:text-white transition-all"
              aria-label="Instagram"
            >
              <InstagramIcon size={24} color="currentColor" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
