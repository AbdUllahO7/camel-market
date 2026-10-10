'use client';

import React from 'react';
import Image from 'next/image';
import { Mail, Target } from 'lucide-react';
import { useLanguage } from '@/i18n';
import { SectionDivider } from './SectionDivider';


export const AboutSection = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="w-full py-12 sm:py-16 lg:py-24 px-4 sm:px-8 md:px-12 bg-[#0E0C0A] text-white relative overflow-hidden">
      {/* تعريف قناع Vector 2 المتجاوب بدقة هندسية 100% مطابقة للحدود */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="vector2ResponsiveMask" clipPathUnits="objectBoundingBox">
            <path d="
              M 0.04 0
              L 0.52 0
              A 0.04 0.0418 0 0 1 0.56 0.0418
              L 0.56 0.22
              A 0.04 0.0418 0 0 0 0.60 0.26
              L 0.96 0.26
              A 0.04 0.0418 0 0 1 1.0 0.30
              L 1.0 0.96
              A 0.04 0.0418 0 0 1 0.96 1.0
              L 0.473 1.0
              A 0.04 0.0418 0 0 1 0.433 0.96
              L 0.433 0.728
              A 0.04 0.0418 0 0 0 0.393 0.686
              L 0.04 0.686
              A 0.04 0.0418 0 0 1 0 0.644
              L 0 0.0418
              A 0.04 0.0418 0 0 1 0.04 0
              Z
            " />
          </clipPath>
        </defs>
      </svg>

      <div className="max-w-[1450px] mx-auto flex flex-col gap-10 sm:gap-14 lg:gap-16">
        
        {/* 1. رأس القسم المركزي */}
        <div className="flex flex-col items-center justify-center text-center gap-2.5 sm:gap-3">
          <span className="text-xl sm:text-2xl lg:text-3xl font-normal text-[#D2B48C]">
            {t.about.badge}
          </span>
          
          {/* الخط الزخرفي */}
          <SectionDivider />

          <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-white leading-tight max-w-2xl sm:max-w-none">
            {t.about.heading}
          </h2>
        </div>

        {/* 2. المحتوى الرئيسي */}
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-10 xl:gap-16">

          {/* العمود الأيمن في RTL: مجمع الصور والبطاقة */}
          <div className="w-full max-w-[624px] lg:w-[624px] shrink-0 flex items-start justify-center">
            <div className="relative w-full aspect-[624/598] max-h-[598px] select-none">
              
              {/* 1. الصورة الرئيسية المتصلة aboutUs.jpg */}
              <div
                className="absolute inset-0 w-full h-full shadow-2xl "
                style={{
                  clipPath: 'url(#vector2ResponsiveMask)',
                  WebkitClipPath: 'url(#vector2ResponsiveMask)',
                }}
              >
                <div className="relative w-[114%] right-[-10px] h-[112%] -left-[4%] -top-[3%]">
                  <Image
                    src="/Camels/aboutUs.jpg"
                    alt="عن سوق الإبل"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </div>

              {/* 2. بطاقة 10+ سنوات من الثقة */}
              <div
                className="absolute top-0 right-[10px] w-[40%] h-[23%] rounded-[12px] sm:rounded-[17px] bg-gradient-to-br from-[#8B5E3C] to-[#C88F45] border border-[#D2B48C]/40 p-2 sm:p-4 flex flex-col items-center justify-center text-center shadow-2xl z-20"
              >
                <span className="text-2xl sm:text-4xl lg:text-[48px] font-bold text-white leading-none tracking-tight font-sans">
                  {t.about.experienceYears}
                </span>
                <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-[#F8F4EF] mt-1 sm:mt-1.5">
                  {t.about.experienceLabel}
                </span>
              </div>

              {/* 3. الصورة الثانية الصغيرة في الزاوية السفلية اليسرى */}
              <div
                className="absolute bottom-0 left-0 w-[41.5%] h-[28.5%] rounded-[12px] sm:rounded-[17px] overflow-hidden shadow-2xl z-20 border border-[#8B5E3C]/30"
              >
                <Image
                  src="/Camels/aboutUsSmall.jpg"
                  alt="أصالة الإبل العربية"
                  fill
                  className="object-cover"
                />
              </div>

            </div>
          </div>
          
          {/* العمود الأيسر في RTL: عمود النصوص */}
          <div className="w-full lg:flex-1 max-w-[650px] flex flex-col justify-between h-auto lg:h-[598px] text-right py-1">
            
            {/* الجزء العلوي: العنوان الرئيسي والفقرة */}
            <div className="flex flex-col gap-3 sm:gap-5">
              <h3 className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-[#D2B48C] leading-[1.25]">
                {t.about.subheading}
              </h3>
              <p className="text-base sm:text-lg lg:text-[22px] text-[#D9D9D9] font-normal leading-[1.8] max-w-[580px]">
                {t.about.description}
              </p>
            </div>

            {/* الجزء السفلي: بطاقتا رسالتنا وأهدافنا */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 pt-4">
              
              {/* رسالتنا */}
              <div className="flex flex-col gap-2.5 sm:gap-3 text-right">
                <div className="flex items-center gap-3 sm:gap-3.5">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#8B5E3C]/20 border border-[#C88F45]/50 flex items-center justify-center shrink-0 shadow-lg">
                    <Mail className="w-5 h-5 sm:w-7 sm:h-7 text-[#C88F45]" />
                  </div>
                  <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                    {t.about.missionTitle}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm lg:text-base text-[#D9D9D9] leading-relaxed max-w-[240px]">
                  {t.about.missionDesc}
                </p>
              </div>
              
              {/* أهدافنا */}
              <div className="flex flex-col gap-2.5 sm:gap-3 text-right">
                <div className="flex items-center gap-3 sm:gap-3.5">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#8B5E3C]/20 border border-[#C88F45]/50 flex items-center justify-center shrink-0 shadow-lg">
                    <Target className="w-7 h-7 sm:w-8 sm:h-8 text-[#C88F45]" />
                  </div>
                  <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                    {t.about.goalsTitle}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm lg:text-base text-[#D9D9D9] leading-relaxed max-w-[240px]">
                  {t.about.goalsDesc}
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
