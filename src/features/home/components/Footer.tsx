'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/i18n';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full relative bg-[#0A0806] text-white pt-24 sm:pt-28 pb-12 overflow-hidden min-h-[480px] flex flex-col justify-between">
      {/* 1. صورة الخلفية التراثية المعتمدة */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none opacity-40">
        <Image
          src="/Camels/footer-bg.png"
          alt="footer background"
          fill
          priority
          className="object-cover object-top sm:object-[center_50%] brightness-110 contrast-105"
        />
      </div>

      {/* 2. محتوى الفوتر */}
      <div className="relative z-10 max-w-[1550px] w-full mx-auto px-4 sm:px-8 md:px-12 my-auto">
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-14 pb-14 border-b border-[#8B5E3C]/20"
          dir="rtl"
        >
          {/* العمود الأول: الشعار + الوصف + أيقونات التواصل */}
          <div className="lg:col-span-5 flex flex-col items-start text-right gap-5">
            {/* الشعار المعتمد */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#C88F45] p-2 flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white" stroke="currentColor" strokeWidth="2">
                  <path d="M5 18V14C5 13 6 12 7 12C9 12 10 9 12 9C14 9 15 12 18 12C19.5 12 21 10 21 8C21 6.5 20 6 18.5 6C17 6 15.5 4 14.5 3C14 2 12.5 2 12 3C11 4.5 12 6.5 13 8L11 11C9 11 8 10 6 10C4 10 3 13 3 15" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 18V21M10 18V21M15 18V21M19 18V21" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white">{t.navbar.brandName}</span>
                <span className="text-xs text-[#D2B48C] font-semibold">{t.navbar.brandSlogan}</span>
              </div>
            </div>

            {/* نص الوصف */}
            <p className="text-sm sm:text-base text-[#E5E5E5] leading-[26px] sm:leading-[28px] max-w-[380px] drop-shadow-md">
              {t.footer.description}
            </p>

            {/* أيقونات التواصل الاجتماعي */}
            <div className="flex items-center gap-4 mt-2">
              {/* فيسبوك */}
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#8B5E3C] border border-[#8B5E3C]/40 flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                aria-label="Facebook"
              >
                <div className="relative w-5 h-5 filter brightness-0 invert">
                  <Image
                    src="/icons/facebook.svg"
                    alt="facebook"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>

              {/* انستقرام */}
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#8B5E3C] border border-[#8B5E3C]/40 flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                aria-label="Instagram"
              >
                <div className="relative w-5 h-5 filter brightness-0 invert">
                  <Image
                    src="/icons/instagram.svg"
                    alt="instagram"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
            </div>
          </div>

          {/* العمود الثاني: روابط سريعة */}
          <div className="lg:col-span-3 flex flex-col justify-end text-right gap-4">
            {/* عنوان العمود */}
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-[#C88F45]" />
              <h4 className="text-lg sm:text-xl font-bold text-white drop-shadow-sm">
                {t.footer.quickLinksTitle}
              </h4>
            </div>

            {/* قائمة الروابط */}
            <ul className="flex flex-col gap-3 mt-1 text-sm sm:text-base text-[#D9D9D9] font-medium">
              <li>
                <Link
                  href="#home"
                  className="hover:text-[#D2B48C] transition-colors hover:translate-x-[-4px] inline-block duration-200"
                >
                  {t.navbar.home}
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="hover:text-[#D2B48C] transition-colors hover:translate-x-[-4px] inline-block duration-200"
                >
                  {t.navbar.about}
                </Link>
              </li>
              <li>
                <Link
                  href="/auctions"
                  className="hover:text-[#D2B48C] transition-colors hover:translate-x-[-4px] inline-block duration-200"
                >
                  مزادات الإبل الحية
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="hover:text-[#D2B48C] transition-colors hover:translate-x-[-4px] inline-block duration-200"
                >
                  {t.navbar.services}
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#D2B48C] transition-colors hover:translate-x-[-4px] inline-block duration-200"
                >
                  {t.navbar.contactUs}
                </Link>
              </li>
            </ul>
          </div>

          {/* العمود الثالث: معلومات أخرى */}
          <div className="lg:col-span-4 flex flex-col justify-end text-right gap-4">
            {/* عنوان العمود */}
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-[#C88F45]" />
              <h4 className="text-lg sm:text-xl font-bold text-white drop-shadow-sm">
                {t.footer.otherInfoTitle}
              </h4>
            </div>

            {/* قائمة معلومات التواصل */}
            <ul className="flex flex-col gap-4 mt-1 text-sm sm:text-base text-[#D9D9D9] font-medium">
              {/* البريد الإلكتروني */}
              <li className="flex items-center gap-3">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C88F45"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a
                  href={`mailto:${t.topBar.email}`}
                  className="hover:text-[#D2B48C] transition-colors dir-ltr font-sans"
                >
                  {t.topBar.email}
                </a>
              </li>

              {/* رقم الهاتف */}
              <li className="flex items-center gap-3">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C88F45"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a
                  href={`tel:${t.topBar.phone}`}
                  className="hover:text-[#D2B48C] transition-colors font-sans"
                  dir="ltr"
                >
                  {t.topBar.phone}
                </a>
              </li>

              {/* العنوان */}
              <li className="flex items-center gap-3">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C88F45"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{t.footer.location}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. شريط حقوق النشر السفلي */}
        <div className="pt-8 flex items-center justify-center text-center text-xs sm:text-sm text-[#AAAAAA]">
          <p>{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};
