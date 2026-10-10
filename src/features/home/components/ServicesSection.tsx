'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/i18n';
import { SectionDivider } from './SectionDivider';
import { useServices } from '../hooks/useServices';

export const ServicesSection = () => {
  const { t } = useLanguage();
  const { services, isLoading } = useServices();

  return (
    <section id="services" className="w-full py-20 lg:py-28 px-4 sm:px-8 md:px-12 bg-[#0E0C0A] text-white relative overflow-hidden">
      <div className="max-w-[1550px] mx-auto flex flex-col gap-14 lg:gap-18">
        
        {/* 1. رأس القسم المركزي */}
        <div className="flex flex-col items-center justify-center text-center gap-3">
          <span className="text-xl sm:text-2xl lg:text-3xl font-normal text-[#D2B48C]">
            {t.servicesSection.badge}
          </span>
          
          {/* الخط الزخرفي */}
          <SectionDivider />

          <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-white leading-tight max-w-3xl">
            {t.servicesSection.heading}
          </h2>
        </div>

        {/* 2. شبكة كروت الخدمات الأربعة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="relative bg-[#17120E] border border-[#8B5E3C]/30 rounded-[28px] p-6 pt-16 flex flex-col items-center text-center animate-pulse"
                >
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-[#8B5E3C]/30 border-[6px] border-[#0E0C0A]" />
                  <div className="h-6 w-3/4 bg-[#8B5E3C]/30 rounded mt-2 mb-4" />
                  <div className="h-4 w-full bg-[#8B5E3C]/20 rounded mb-2" />
                  <div className="h-4 w-5/6 bg-[#8B5E3C]/20 rounded" />
                </div>
              ))
            : services.map((service) => (
                <div
                  key={service.id}
                  className="relative bg-[#16120E] border border-[#8B5E3C]/30 hover:border-[#C88F45] rounded-[28px] p-6 pt-16 flex flex-col items-center text-center transition-all duration-300 transform hover:-translate-y-2 shadow-2xl group"
                  style={{
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
                  }}
                >
                  {/* الدائرة العائمة العلوية */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-[6px] border-[#0E0C0A] bg-gradient-to-b from-[#FAF7F2] via-[#EED9C4] to-[#D2B48C] p-3.5 shadow-2xl group-hover:scale-110 group-hover:from-white group-hover:to-[#EED9C4] transition-all duration-300 flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image
                        src={service.iconSrc || '/icons/service-camels.svg'}
                        alt={service.title}
                        fill
                        className="object-contain p-0.5"
                      />
                    </div>
                  </div>

                  {/* عنوان الخدمة */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white pt-2 leading-snug group-hover:text-[#D2B48C] transition-colors">
                    {service.title}
                  </h3>

                  {/* وصف الخدمة */}
                  <p className="text-sm sm:text-base text-[#D9D9D9] font-normal leading-relaxed pt-3 max-w-[260px]">
                    {service.description}
                  </p>

                  {/* التمييز المطلوب */}
                  {service.id === "streaming" && (
                    <a
                      href="#download-app"
                      className="mt-3.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20 hover:bg-amber-400/20 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>📱 متاح حصرياً عبر تطبيق الجوال</span>
                    </a>
                  )}

                  {service.id === "auctions" && (
                    <Link
                      href="/auctions"
                      className="mt-3.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>⚡ دخول مزادات الإبل المباشرة</span>
                    </Link>
                  )}
                </div>
              ))}
        </div>

        {/* 3. مؤشر الكاروسيل السفلي */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="w-8 h-1.5 rounded-full bg-[#C88F45]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#8B5E3C]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#8B5E3C]" />
        </div>

      </div>
    </section>
  );
};
