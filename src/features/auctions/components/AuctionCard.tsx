'use client';

import React, { useState } from "react";
import Image from "next/image";
import { Gavel, MapPin, ArrowUpRight, ShieldCheck, Clock } from "lucide-react";
import type { AuctionItem } from "../types";

interface AuctionCardProps {
  auction: AuctionItem;
  onBidClick: (auction: AuctionItem) => void;
  onViewDetails?: (auction: AuctionItem) => void;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({
  auction,
  onBidClick,
  onViewDetails,
}) => {
  const [imgSrc, setImgSrc] = useState(auction.coverImage || "/Camels/hero.png");
  const statusNum = Number(auction.status ?? 2);
  const isLive = statusNum === 2;
  const isEnded = statusNum === 3 || statusNum === 4;

  const currentPrice = auction.currentPrice || auction.currentBid || auction.startingPrice;
  const startPrice = auction.startPrice || auction.startingPrice;

  return (
    <div
      className="group relative bg-[#0E0E0E] border border-[#262626] hover:border-[#D1D1D1]/60 rounded-[26px] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between select-none shadow-xl"
      style={{
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7)",
      }}
      dir="rtl"
    >
      {/* 1. حاوية الصورة العلوية */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#161616]">
        <Image
          src={imgSrc}
          alt={auction.title}
          fill
          priority
          onError={() => setImgSrc("/Camels/hero.png")}
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* تدرج داكن سفلي على الصورة */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-black/30 pointer-events-none" />

        {/* شارة الحالة */}
        <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border shadow-lg bg-black/60 border-white/10">
          {isLive ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400">مباشر الآن</span>
            </>
          ) : isEnded ? (
            <span className="text-zinc-400">مزاد منتهي</span>
          ) : (
            <span className="text-amber-300">مزاد قادم</span>
          )}
        </div>

        {/* شارة عدد السومات */}
        <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md bg-black/60 border border-white/10 text-[#D1D1D1]">
          <Gavel className="w-3.5 h-3.5 text-amber-300" />
          <span>{auction.bidsCount || auction.bidsHistory?.length || 0} سومات</span>
        </div>

        {/* اسم البائع */}
        {auction.sellerName && (
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 text-xs text-white/90 drop-shadow-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold line-clamp-1">{auction.sellerName}</span>
          </div>
        )}
      </div>

      {/* 2. تفاصيل المزاد والسعر */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white leading-snug line-clamp-2 group-hover:text-amber-200 transition-colors">
            {auction.title}
          </h3>

          {auction.address && (
            <div className="flex items-center gap-1.5 text-xs text-[#8E8E8E] mt-2">
              <MapPin className="w-3.5 h-3.5 text-[#8E8E8E]" />
              <span>{auction.address}</span>
            </div>
          )}
        </div>

        {/* حاوية السعر الحالية وسعر البداية */}
        <div className="rounded-2xl bg-[#141414] border border-[#222222] p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#8E8E8E]">السومة الحالية</span>
            <div className="text-xl sm:text-2xl font-black text-white flex items-baseline gap-1 mt-0.5 font-mono">
              <span>{currentPrice.toLocaleString()}</span>
              <span className="text-xs font-normal text-amber-300">{auction.currency}</span>
            </div>
          </div>

          <div className="text-left border-r border-white/5 pr-3">
            <span className="text-[11px] text-[#8E8E8E]">سعر البداية</span>
            <div className="text-xs sm:text-sm font-bold text-[#A0A0A0] mt-0.5 font-mono">
              {startPrice.toLocaleString()} {auction.currency}
            </div>
          </div>
        </div>

        {/* أزرار الإجراءات: زايد الآن + تفاصيل */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => onBidClick(auction)}
            className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-black bg-gradient-to-r from-[#FFFFFF] via-[#F7F7F7] to-[#D1D1D1] hover:scale-[1.02] shadow-[0_4px_20px_rgba(255,255,255,0.15)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Gavel className="w-4 h-4" />
            <span>{isEnded ? "عرض التفاصيل" : "زايد الآن"}</span>
          </button>

          {onViewDetails && (
            <button
              type="button"
              onClick={() => onViewDetails(auction)}
              className="py-3 px-3.5 rounded-xl text-xs font-bold text-[#D1D1D1] hover:text-white bg-[#1A1A1A] hover:bg-[#252525] border border-[#333] transition-colors cursor-pointer flex items-center justify-center gap-1"
              title="عرض التفاصيل"
            >
              <span>تفاصيل</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

