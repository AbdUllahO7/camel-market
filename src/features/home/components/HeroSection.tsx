'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/i18n';

export const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative w-full min-h-[720px] lg:min-h-[860px] flex items-center overflow-hidden pt-28 pb-32 lg:pt-32 lg:pb-40">
      {/* صورة الإبل الأصيلة على رمال الصحراء الذهبية */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Camels/hero.png"
          alt={t.hero.title}
          fill
          priority
          className="object-cover object-left lg:object-left-center"
          quality={100}
        />
        {/* التدرج اللوني الصحراوي الفاخر للنصوص على الجانب الأيمن */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(270deg, rgba(18, 15, 12, 0.95) 0%, rgba(18, 15, 12, 0.78) 45%, rgba(18, 15, 12, 0.25) 100%)',
          }}
        />
      </div>

      {/* المحتوى النصي على الجانب الأيمن (Start في RTL) */}
      <div className="relative z-10 max-w-[1620px] mx-auto w-full px-6 sm:px-12 lg:px-16 flex flex-col justify-center items-start text-right">
        <div className="max-w-2xl flex flex-col gap-6 items-start text-right">
          
          {/* العناوين الرئيسية */}
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-bold text-white tracking-tight leading-[1.2]">
              {t.hero.title}
            </h1>
            <div className="text-3xl sm:text-4xl lg:text-[48px] font-black tracking-wide flex items-center gap-2.5">
              <span className="text-[#D2B48C]">{t.hero.tagline1}</span>
              <span className="text-[#C88F45]">.</span>
              <span className="text-white">{t.hero.tagline2}</span>
              <span className="text-[#C88F45]">.</span>
              <span className="text-[#D2B48C]">{t.hero.tagline3}</span>
            </div>
          </div>

          {/* الوصف */}
          <p className="text-lg sm:text-xl lg:text-[22px] text-[#F8F4EF] font-normal leading-[1.6] max-w-xl">
            {t.hero.description}
          </p>

          {/* زر معرفة المزيد والمزادات */}
          <div className="pt-3 flex items-center gap-4 flex-wrap">
            <a
              href="#about"
              className="inline-flex items-center justify-center px-10 py-3.5 rounded-[12px] font-bold text-base sm:text-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-xl cursor-pointer bg-gradient-to-r from-[#8B5E3C] to-[#C88F45] text-white hover:brightness-110 border border-[#D2B48C]/40"
            >
              {t.hero.learnMore}
            </a>
            <a
              href="/auctions"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-[12px] font-bold text-base sm:text-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-lg cursor-pointer bg-[#1E1712]/80 text-[#D2B48C] hover:text-white hover:bg-[#2A2019] border border-[#8B5E3C]/40"
            >
              مزادات الإبل الحية
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};
