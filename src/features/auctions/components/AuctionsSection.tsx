'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Gavel, Plus, ArrowLeft, Sparkles, RefreshCw } from "lucide-react";
import { SectionDivider } from "@/features/home/components/SectionDivider";
import { AuctionCard } from "./AuctionCard";
import { BidModal } from "./BidModal";
import { CreateAuctionModal } from "./CreateAuctionModal";
import { auctionsService } from "../services/auctionsService";
import { useAuth } from "@/features/auth/context/AuthContext";
import type { AuctionItem } from "../types";

export const AuctionsSection = () => {
  const { isAuthenticated, user } = useAuth();
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeBidAuction, setActiveBidAuction] = useState<AuctionItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchAuctions = () => {
    setIsLoading(true);
    auctionsService.getAuctions({ pageNumber: 1, pageSize: 6, isActive: true })
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setAuctions(res.data);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch auctions:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const handleBidSuccess = (newBid: number) => {
    if (!activeBidAuction) return;
    const currentUserName = user?.fullName || "أنت";
    setAuctions((prev) =>
      prev.map((auc) =>
        auc.id === activeBidAuction.id
          ? {
              ...auc,
              currentBid: newBid,
              bidsCount: auc.bidsCount + 1,
              bidsHistory: [
                {
                  id: Date.now(),
                  bidderName: currentUserName,
                  customerName: currentUserName,
                  amount: newBid,
                  time: "الآن",
                },
                ...(auc.bidsHistory || []),
              ],
            }
          : auc
      )
    );
  };

  const isSellerRole =
    user?.role === "StoreOwner" ||
    user?.role === "StableOwner";

  return (
    <section id="auctions" className="w-full py-20 lg:py-28 px-4 sm:px-8 md:px-12 bg-[#000000] text-white relative overflow-hidden" dir="rtl">
      <div className="max-w-[1620px] mx-auto flex flex-col gap-12 sm:gap-16">
        
        {/* 1. رأس القسم المركزي المعتمد للهوية الرسمية */}
        <div className="flex flex-col items-center justify-center text-center gap-3">
          <span className="text-xl sm:text-2xl lg:text-[30px] font-normal text-white leading-[33px]">
            المزادات المباشرة
          </span>

          <SectionDivider />

          <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-white leading-tight max-w-4xl px-2">
            تنافس على نخبة الإبل العربية الأصيلة لحظة بلحظة
          </h2>

          <p className="text-sm sm:text-base text-[#8E8E8E] max-w-2xl mt-1 leading-relaxed">
            منصة مزادات معتمدة توفر الشفافية التامة، فحص بيطري موثق، وتنافس مباشر مع كبار المربين وعشاق الإبل في الخليج العربي.
          </p>
        </div>

        {/* 2. شريط الأزرار والإجراءات */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#222222] pb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-bold text-white">
              المزادات النشطة ({auctions.length})
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* زر إنشاء مزاد للبائعين */}
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-black bg-gradient-to-r from-[#FFFFFF] via-[#F7F7F7] to-[#D1D1D1] hover:scale-105 transition-all shadow-[0_4px_15px_rgba(255,255,255,0.2)] flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>أنشئ مزاداً جديداً</span>
            </button>

            {/* رابط كافة المزادات */}
            <Link
              href="/auctions"
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#D1D1D1] hover:text-white bg-[#141414] hover:bg-[#202020] border border-[#2B2B2B] transition-colors flex items-center gap-1.5"
            >
              <span>عرض كافة المزادات</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 3. شبكة كروت المزادات */}
        {isLoading && auctions.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-500">
            <RefreshCw className="w-8 h-8 animate-spin text-[#8E8E8E]" />
            <span className="text-sm">جاري تحميل المزادات الحية...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {auctions.map((auction) => (
              <AuctionCard
                key={auction.id}
                auction={auction}
                onBidClick={(auc) => setActiveBidAuction(auc)}
                onViewDetails={(auc) => setActiveBidAuction(auc)}
              />
            ))}
          </div>
        )}

        {/* 4. نافذة المزايدة (BidModal) */}
        <BidModal
          isOpen={!!activeBidAuction}
          onClose={() => setActiveBidAuction(null)}
          auction={activeBidAuction}
          onBidSuccess={handleBidSuccess}
          onAuctionAccepted={fetchAuctions}
        />

        {/* 5. نافذة إنشاء المزاد (CreateAuctionModal) */}
        <CreateAuctionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchAuctions}
        />

      </div>
    </section>
  );
};
