'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/i18n';
import { SectionDivider } from './SectionDivider';

export const WhyUsSection = () => {
  const { t } = useLanguage();

  const leftFeatures = [
    {
      id: 'pro_display',
      title: t.whyUs.proDisplayTitle,
      description: t.whyUs.proDisplayDesc,
      imgSrc: '/Camels/why-us-camel.png',
    },
    {
      id: 'integrated_services',
      title: t.whyUs.integratedServicesTitle,
      description: t.whyUs.integratedServicesDesc,
      imgSrc: '/Camels/settings.png',
    },
    {
      id: 'digital_exp',
      title: t.whyUs.digitalExperienceTitle,
      description: t.whyUs.digitalExperienceDesc,
      imgSrc: '/Camels/uidesign.png',
    },
  ];

  const rightFeatures = [
    {
      id: 'trusted',
      title: t.whyUs.trustedPlatformTitle,
      description: t.whyUs.trustedPlatformDesc,
      imgSrc: '/Camels/security.png',
    },
    {
      id: 'auctions',
      title: t.whyUs.onlineAuctionsTitle,
      description: t.whyUs.onlineAuctionsDesc,
      imgSrc: '/Camels/gavel.png',
    },
    {
      id: 'direct_chat',
      title: t.whyUs.directContactTitle,
      description: t.whyUs.directContactDesc,
      imgSrc: '/Camels/why-us-camel-1.png',
    },
  ];

  return (
    <section id="why-us" className="w-full py-16 sm:py-20 lg:py-28 px-4 sm:px-8 md:px-12 bg-[#0E0C0A] text-white relative overflow-hidden">
      <div className="max-w-[1550px] mx-auto flex flex-col gap-10 sm:gap-14 lg:gap-18">
        
        {/* 1. رأس القسم المركزي */}
        <div className="flex flex-col items-center justify-center text-center gap-2.5 sm:gap-3">
          <span className="text-xl sm:text-2xl lg:text-3xl font-normal text-[#D2B48C]">
            {t.whyUs.badge}
          </span>
          
          {/* الخط الزخرفي */}
          <SectionDivider />

          <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-white leading-tight max-w-4xl px-2">
            {t.whyUs.heading}
          </h2>
        </div>

        {/* 2. المحتوى الرئيسي */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-8 xl:gap-12 w-full">
          
          {/* العمود الأيمن */}
          <div className="w-full lg:w-[380px] flex flex-col items-center lg:items-start justify-between gap-6 sm:gap-8 lg:gap-0 lg:h-[560px] py-4">
            {rightFeatures.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-start gap-3.5 sm:gap-4 text-right w-full max-w-[340px] group transition-all duration-300"
              >
                <div className="w-13 h-13 sm:w-15 sm:h-15 lg:w-16 lg:h-16 rounded-full bg-gradient-to-b from-[#FAF7F2] via-[#EED9C4] to-[#D2B48C] border-2 border-[#8B5E3C]/40 group-hover:border-[#C88F45] group-hover:scale-105 flex items-center justify-center shrink-0 shadow-xl transition-all duration-300 relative overflow-hidden p-2.5">
                  <Image
                    src={item.imgSrc}
                    alt={item.title}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                
                {/* النصوص */}
                <div className="flex flex-col gap-0.5 text-right flex-1">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white group-hover:text-[#D2B48C] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#D9D9D9] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* العمود الأوسط: الصورة المقوسة البيضاوية */}
          <div className="w-[280px] sm:w-[340px] md:w-[380px] lg:w-[420px] h-[380px] sm:h-[480px] md:h-[540px] lg:h-[640px] rounded-[160px] sm:rounded-[200px] lg:rounded-[220px] overflow-hidden border-[3px] border-[#8B5E3C]/60 shadow-2xl relative shrink-0 select-none my-2 lg:my-0">
            <Image
              src="/Camels/WhyUs.png"
              alt="لماذا تختار منصة سوق الإبل"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* العمود الأيسر */}
          <div className="w-full lg:w-[380px] flex flex-col items-center lg:items-end justify-between gap-6 sm:gap-8 lg:gap-0 lg:h-[560px] py-4">
            {leftFeatures.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-end gap-3.5 sm:gap-4 text-right w-full max-w-[340px] group transition-all duration-300"
              >
                <div className="w-13 h-13 sm:w-15 sm:h-15 lg:w-16 lg:h-16 rounded-full bg-gradient-to-b from-[#FAF7F2] via-[#EED9C4] to-[#D2B48C] border-2 border-[#8B5E3C]/40 group-hover:border-[#C88F45] group-hover:scale-105 flex items-center justify-center shrink-0 shadow-xl transition-all duration-300 relative overflow-hidden p-2.5">
                  <Image
                    src={item.imgSrc}
                    alt={item.title}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                {/* النصوص */}
                <div className="flex flex-col gap-0.5 text-right flex-1">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white group-hover:text-[#D2B48C] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#D9D9D9] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
