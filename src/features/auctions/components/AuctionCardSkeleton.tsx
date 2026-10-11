'use client';

import React from 'react';

export const AuctionCardSkeleton: React.FC = () => {
  return (
    <div
      className="relative bg-[#0E0E0E] border border-[#222222] rounded-[26px] overflow-hidden flex flex-col justify-between select-none shadow-xl animate-pulse"
      dir="rtl"
    >
      {/* 1. هيكل الصورة العلوية */}
      <div className="relative w-full aspect-[4/3] bg-zinc-900/80 overflow-hidden">
        {/* شارة علوية وهمية */}
        <div className="absolute top-3.5 right-3.5 w-20 h-6 bg-zinc-800 rounded-full" />
        <div className="absolute top-3.5 left-3.5 w-16 h-6 bg-zinc-800 rounded-full" />
        {/* اسم البائع الوهمي */}
        <div className="absolute bottom-3 right-3 w-28 h-4 bg-zinc-800/80 rounded" />
      </div>

      {/* 2. هيكل التفاصيل والسعر */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2.5">
          <div className="h-5 bg-zinc-800 rounded-lg w-4/5" />
          <div className="h-3.5 bg-zinc-800/60 rounded-md w-1/3" />
        </div>

        {/* صندوق السعر الوهمي */}
        <div className="rounded-2xl bg-[#141414] border border-[#222222] p-3.5 flex items-center justify-between">
          <div className="space-y-1.5 w-1/2">
            <div className="h-2.5 bg-zinc-800/60 rounded w-16" />
            <div className="h-6 bg-zinc-800 rounded-lg w-24" />
          </div>
          <div className="space-y-1.5 w-1/3 flex flex-col items-end">
            <div className="h-2.5 bg-zinc-800/60 rounded w-14" />
            <div className="h-4 bg-zinc-800 rounded-md w-16" />
          </div>
        </div>

        {/* أزرار الإجراءات الوهمية */}
        <div className="flex items-center gap-2 pt-1">
          <div className="h-11 bg-zinc-800 rounded-xl flex-1" />
          <div className="h-11 w-20 bg-zinc-800/60 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
