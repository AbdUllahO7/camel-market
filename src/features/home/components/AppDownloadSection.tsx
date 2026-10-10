'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/i18n';

export const AppDownloadSection = () => {
  const { t } = useLanguage();

  return (
    <section id="download-app" className="w-full py-12 sm:py-16 lg:py-24 px-4 sm:px-8 md:px-12 bg-[#0E0C0A] text-white relative overflow-hidden">
      <div className="max-w-[1618px] mx-auto">
        
        {/* بطاقة البانر الرئيسية */}
        <div
          className="relative w-full rounded-[24px] sm:rounded-[36px] overflow-hidden border border-[#8B5E3C]/40 shadow-2xl bg-[#120E0A] flex flex-col lg:flex-row lg:items-center select-none lg:aspect-[1618/666] lg:min-h-[560px]"
          style={{
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.95)',
          }}
        >
          {/* صورة الخلفية الكاملة للشاشات الكبيرة (تحتوي الإبل والجوالات والأجواء الصحراوية بدقة عالية) */}
          <div className="hidden lg:block absolute inset-0 w-full h-full">
            <Image
              src="/Camels/downloadOurApp.png"
              alt="تطبيق سوق الإبل"
              fill
              priority
              className="object-cover object-center"
            />
            {/* طبقة تظليل خفيفة على اليسار لضمان وضوح النصوص بشكل ممتاز */}
            <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
          </div>

          {/* 1. جانب النصوص وأزرار المتاجر (مثبتة بدقة على اليسار كما في التصميم الأصلي) */}
          <div
            className="relative lg:absolute left-0 lg:left-[5%] xl:left-[8%] top-auto lg:top-1/2 lg:-translate-y-1/2 z-20 p-6 sm:p-10 lg:p-0 max-w-full lg:max-w-[480px] flex flex-col items-center lg:items-start text-center lg:text-right gap-3 sm:gap-4 w-full"
            dir="rtl"
          >
            {/* قم بتنزيل / تطبيقنا الان */}
            <div className="flex flex-col text-center lg:text-right w-full">
              <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-normal text-white leading-tight font-sans">
                {t.appDownload?.titleLine1 || 'قم بتنزيل'}
              </h2>
              <span className="text-3xl sm:text-4xl lg:text-[48px] font-bold text-[#C88F45] leading-tight font-sans mt-0.5">
                {t.appDownload?.titleLine2 || 'تطبيقنا الان'}
              </span>
            </div>

            {/* تجربة متكاملة لعالم الإبل بين يديك */}
            <p className="text-base sm:text-xl lg:text-[24px] text-[#D9D9D9] font-normal leading-[1.4] sm:leading-[1.6] lg:leading-[48px] text-center lg:text-right w-full max-w-[420px]">
              {t.appDownload?.description || 'تجربة متكاملة لعالم الإبل والهجن بين يديك'}
            </p>

            {/* أزرار التحميل */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 sm:gap-4 pt-2 sm:pt-4">
              {/* زر App Store */}
              <a
                href="#"
                className="relative w-[145px] sm:w-[170px] h-[44px] sm:h-[50px] rounded-[8px] overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 block bg-black border border-white/10"
              >
                <Image
                  src="/Camels/AppStore.png"
                  alt={t.appDownload?.appStoreAlt || 'App Store'}
                  fill
                  className="object-contain p-0.5"
                />
              </a>

              {/* زر Google Play */}
              <a
                href="#"
                className="relative w-[145px] sm:w-[170px] h-[44px] sm:h-[50px] rounded-[8px] overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 block bg-black border border-white/10"
              >
                <Image
                  src="/Camels/googlePlay.png"
                  alt={t.appDownload?.googlePlayAlt || 'Google Play'}
                  fill
                  className="object-contain p-0.5"
                />
              </a>
            </div>

          </div>

          {/* 2. صورة الموك أب على شاشات الجوال */}
          <div className="lg:hidden relative w-full h-[280px] sm:h-[360px] overflow-hidden select-none">
            <Image
              src="/Camels/downloadOurApp.png"
              alt="تطبيق سوق الإبل"
              fill
              className="object-cover object-right"
            />
          </div>

        </div>

      </div>
    </section>
  );
};
