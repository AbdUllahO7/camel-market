'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/i18n';
import { SectionDivider } from './SectionDivider';
import { useBlogPosts } from '../hooks/useBlogPosts';

export const BlogSection = () => {
  const { t } = useLanguage();
  const { posts } = useBlogPosts(3);

  return (
    <section id="blog" className="w-full py-20 lg:py-28 px-4 sm:px-8 md:px-12 bg-[#0E0C0A] text-white relative overflow-hidden">
      <div className="max-w-[1550px] mx-auto flex flex-col gap-12 sm:gap-16">
        
        {/* 1. رأس القسم المركزي */}
        <div className="flex flex-col items-center justify-center text-center gap-3">
          {/* المدونة */}
          <span className="text-xl sm:text-2xl lg:text-[30px] font-normal text-[#D2B48C] leading-[33px]">
            {t.blogSection.badge}
          </span>
          
          {/* الخط الزخرفي */}
          <SectionDivider />

          {/* العنوان الرئيسي */}
          <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-white leading-tight max-w-4xl px-2">
            {t.blogSection.heading}
          </h2>
        </div>

        {/* 2. شبكة كروت المقالات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8 xl:gap-12 w-full">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col group/card cursor-pointer w-full max-w-[456px] mx-auto"
              dir="rtl"
            >
              {/* حاوية الصورة مع زر السهم الذهبي المضيء */}
              <div className="relative w-full aspect-[456/520] rounded-[30px] shadow-2xl bg-[#14100C] border border-[#8B5E3C]/30 select-none mb-6">
                {/* صورة المقال */}
                <div className="relative w-full h-full rounded-[30px] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    priority
                    className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* زر السهم المائل المستقل */}
                <div
                  className="absolute -bottom-5 -left-3 sm:-bottom-6 sm:-left-4 w-[90px] sm:w-[110px] lg:w-[115px] h-[82px] sm:h-[100px] lg:h-[105px] rounded-[21px] border-[6px] sm:border-[8px] border-[#0E0C0A] bg-gradient-to-b from-[#FAF7F2] via-[#EED9C4] to-[#D2B48C] flex items-center justify-center shadow-[0px_10px_30px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover/card:scale-110 z-20"
                >
                  <div className="relative w-[36px] sm:w-[46px] lg:w-[50px] h-[36px] sm:h-[46px] lg:h-[50px]">
                    <Image
                      src="/icons/top-left-arrow.svg"
                      alt={t.blogSection.readMoreAlt}
                      fill
                      className="object-contain filter brightness-0"
                    />
                  </div>
                </div>
              </div>

              {/* تفاصيل المقال */}
              <div className="flex flex-col text-right mt-2 gap-3 w-full">
                {/* عنوان المقال */}
                <h3 className="text-lg sm:text-xl lg:text-[22px] font-bold text-white group-hover/card:text-[#D2B48C] transition-colors leading-[33px]">
                  {post.title}
                </h3>

                {/* التاريخ مع أيقونة التقويم */}
                <div className="flex items-center justify-start gap-2 text-base sm:text-lg lg:text-[20px] text-[#D9D9D9]">
                  <span className="font-sans" dir="ltr">
                    {post.date}
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#D2B48C"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
