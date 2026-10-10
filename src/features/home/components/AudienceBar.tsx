'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/i18n';
import {
  AdvertisersIcon,
  MerchantsIcon,
  StablesIcon,
  OwnersIcon,
  VisitorsIcon,
} from '@/assets/icons/FigmaIcons';

export const AudienceBar = () => {
  const { t } = useLanguage();

  // ترتيب الفئات من اليمين لليسار: الزائرين، أصحاب الحلال، أصحاب الأمراح، التجار، المعلنين
  const categories = [
    {
      id: 'visitors',
      title: t.audience.visitors,
      href: '/auctions',
      description: 'تصفح المزادات الحية وسوق الإبل',
      icon: (
        <VisitorsIcon
          size={56}
          color="#D2B48C"
          className="group-hover:text-white transition-colors duration-200"
        />
      ),
    },
    {
      id: 'owners',
      title: t.audience.owners,
      href: '/auctions',
      description: 'مزادات ومبيعات الإبل والهجن الأصيلة',
      icon: (
        <OwnersIcon
          size={56}
          color="#D2B48C"
          className="group-hover:text-white transition-colors duration-200"
        />
      ),
    },
    {
      id: 'stables',
      title: t.audience.stables,
      href: '/auth/register',
      description: 'تسجيل وتوثيق العزب والمزارع والمضمرين',
      icon: (
        <StablesIcon
          size={56}
          color="#D2B48C"
          className="group-hover:text-white transition-colors duration-200"
        />
      ),
    },
    {
      id: 'merchants',
      title: t.audience.merchants,
      href: '#services',
      description: 'خدمات وباقات المتاجر والتجار',
      icon: (
        <MerchantsIcon
          size={56}
          color="#D2B48C"
          className="group-hover:text-white transition-colors duration-200"
        />
      ),
    },
    {
      id: 'advertisers',
      title: t.audience.advertisers,
      href: '#contact',
      description: 'الإعلانات والرعاية في المنصة',
      icon: (
        <AdvertisersIcon
          size={56}
          color="#D2B48C"
          className="group-hover:text-white transition-colors duration-200"
        />
      ),
    },
  ];

  return (
    <div id="categories" className="w-full max-w-[1620px] mx-auto px-4 sm:px-8 -mt-16 sm:-mt-24 relative z-30">
      <div
        className="w-full bg-[#1A1410] rounded-[26px] p-4 sm:p-6 flex flex-col lg:flex-row items-center justify-between gap-6 border shadow-2xl"
        style={{
          borderColor: 'rgba(139, 94, 60, 0.45)',
          boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* فئات المستفيدين الخمسة (على اليمين) */}
        <div className="w-full flex-1 flex flex-wrap lg:flex-nowrap items-center justify-around gap-2 sm:gap-4">
          {categories.map((cat, index) => (
            <React.Fragment key={cat.id}>
              <Link
                href={cat.href}
                title={cat.description}
                className="flex flex-col items-center justify-center gap-2.5 py-3 px-3.5 rounded-2xl group cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/[0.04]"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 drop-shadow-md">
                  {cat.icon}
                </div>
                <span className="text-base sm:text-lg font-bold text-[#D2B48C] group-hover:text-white transition-colors text-center whitespace-nowrap">
                  {cat.title}
                </span>
              </Link>

              {/* الفاصل الرأسي */}
              {index < categories.length - 1 && (
                <div
                  className="hidden lg:block w-px h-28 self-center opacity-30"
                  style={{
                    backgroundColor: '#8B5E3C',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* المربع الرئيسي المميز (منصة مخصصة لكل الفئات) على اليسار */}
        <Link
          href="#about"
          className="w-full lg:w-[280px] h-[180px] lg:h-[210px] shrink-0 rounded-[15px] p-6 flex items-center justify-center text-center shadow-lg transition-transform hover:scale-[1.02] bg-gradient-to-br from-[#8B5E3C] to-[#C88F45] border border-[#D2B48C]/40 cursor-pointer"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-white leading-[1.3]">
            {t.audience.mainTitle}
            <br />
            {t.audience.mainTitleLine2}
          </h2>
        </Link>
      </div>
    </div>
  );
};
