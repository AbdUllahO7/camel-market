'use client';

import React, { useState, useEffect, useRef } from "react";
import { Search, Plus, Gavel, RefreshCw, X, Filter } from "lucide-react";
import { TopBar } from "@/features/home/components/TopBar";
import { Navbar } from "@/features/home/components/Navbar";
import { Footer } from "@/features/home/components/Footer";
import { SectionDivider } from "@/features/home/components/SectionDivider";
import { AuctionCard } from "@/features/auctions/components/AuctionCard";
import { BidModal } from "@/features/auctions/components/BidModal";
import { CreateAuctionModal } from "@/features/auctions/components/CreateAuctionModal";
import { auctionsService } from "@/features/auctions/services/auctionsService";
import { useAuth } from "@/features/auth/context/AuthContext";
import type { AuctionItem } from "@/features/auctions/types";

/**
 * 3.4 تصفّح المزادات
 * - فلترة المشتري: Search مع تأخير 500ms, Status (null=الكل, 2=نشط, 3=منتهي)
 * - زر إنشاء مزاد يظهر لأصحاب المتاجر والإسطبلات فقط (StoreOwner / StableOwner)
 */
export default function AuctionsPage() {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const [allAuctions, setAllAuctions] = useState<AuctionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | null>(null); // null=الكل, 2=نشط, 3=منتهي
  const [activeBidAuction, setActiveBidAuction] = useState<AuctionItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isSellerRole = user?.role === "StoreOwner" || user?.role === "StableOwner";

  // Debounce البحث لمدة 500ms حسب التوثيق
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  const handleStatusChange = (newStatus: number | null) => {
    setStatusFilter(newStatus);
    // تصفية فورية من الذاكرة لتجنب الوميض وظهور "لا توجد نتائج" مؤقتاً
    if (allAuctions.length > 0 && !debouncedSearch.trim()) {
      if (newStatus === null) {
        setAuctions(allAuctions);
      } else if (newStatus === 2) {
        setAuctions(allAuctions.filter((a) => Number(a.status) === 2));
      } else if (newStatus === 3 || newStatus === 4) {
        setAuctions(allAuctions.filter((a) => Number(a.status) === 3 || Number(a.status) === 4));
      }
    }
  };

  const fetchAuctions = () => {
    setIsLoading(true);
    auctionsService.getAuctions({
      PageNumber: 1,
      PageSize: 40,
      Search: debouncedSearch.trim() || undefined,
      Status: statusFilter,
    })
      .then((res) => {
        if (res.success && res.data) {
          setAuctions(res.data);
          if (statusFilter === null && !debouncedSearch.trim()) {
            setAllAuctions(res.data);
          }
        }
      })
      .catch((err) => console.warn("Error fetching auctions:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchAuctions();
  }, [debouncedSearch, statusFilter]);

  const handleBidSuccess = (newBid: number) => {
    if (!activeBidAuction) return;
    setAuctions((prev) =>
      prev.map((auc) =>
        auc.id === activeBidAuction.id
          ? {
              ...auc,
              currentPrice: newBid,
              currentBid: newBid,
              bidsCount: auc.bidsCount + 1,
            }
          : auc
      )
    );
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setStatusFilter(null);
    if (allAuctions.length > 0) {
      setAuctions(allAuctions);
    }
  };

  const hasActiveFilters = debouncedSearch.trim().length > 0 || statusFilter !== null;

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col overflow-x-hidden selection:bg-[#616161] selection:text-white" dir="rtl">
      {/* 1. الشريط العلوي وشريط التنقل */}
      <TopBar />
      <div className="relative w-full border-b border-[#222222]">
        <div className="max-w-[1620px] mx-auto px-4 sm:px-8 py-3">
          <Navbar />
        </div>
      </div>

      {/* 2. رأس صفحة المزادات */}
      <div className="relative py-16 lg:py-24 px-4 sm:px-8 bg-gradient-to-b from-[#121212] via-[#080808] to-[#000000] border-b border-[#222222]">
        <div className="max-w-[1620px] mx-auto flex flex-col items-center text-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-white/10 text-[#D1D1D1] border border-white/10">
            <Gavel className="w-4 h-4 text-amber-300" />
            <span>منظومة المزادات الحية الرسمية</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            سوق المزادات الإلكتروني للخيول الأصيلة
          </h1>

          <SectionDivider />

          <p className="text-sm sm:text-base text-[#8E8E8E] max-w-2xl mt-1 leading-relaxed">
            زايد بثقة وشفافية كاملة على أفضل السلالات، مع إمكانية المزايدة اللحظية ومتابعة البثوث.
          </p>

          {/* شريط البحث وزر إضافة مزاد */}
          <div className="w-full max-w-2xl mt-6 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم الإبل، السلالة، أو موقع المزاد ..."
                className="w-full pl-10 pr-10 py-3.5 rounded-2xl bg-[#181818] border border-[#333333] text-white text-sm placeholder:text-[#666] focus:outline-none focus:border-[#FFFFFF] transition-colors"
              />
              <Search className="w-4 h-4 text-[#8E8E8E] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1 text-[#8E8E8E] hover:text-white transition-colors cursor-pointer"
                  title="مسح البحث"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* زر إنشاء مزاد يظهر للبائعين فقط */}
            {isSellerRole && (
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-sm font-bold text-black bg-gradient-to-r from-[#FFFFFF] via-[#F7F7F7] to-[#D1D1D1] hover:scale-105 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>إنشاء مزاد جديد</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. تصنيفات التبويب وشبكة المزادات */}
      <main className="max-w-[1620px] mx-auto w-full px-4 sm:px-8 py-12 flex-1">
        {/* أزرار التصفية: الكل (null), نشط (2), منتهي (3) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-[#222222] pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleStatusChange(null)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                statusFilter === null
                  ? "bg-white text-black shadow-md"
                  : "bg-[#141414] text-[#D1D1D1] hover:bg-[#202020]"
              }`}
            >
              كافة المزادات
            </button>

            <button
              type="button"
              onClick={() => handleStatusChange(2)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 2
                  ? "bg-emerald-500 text-black shadow-md"
                  : "bg-[#141414] text-[#D1D1D1] hover:bg-[#202020]"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span>المباشرة الآن (Active)</span>
            </button>

            <button
              type="button"
              onClick={() => handleStatusChange(3)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                statusFilter === 3
                  ? "bg-white text-black shadow-md"
                  : "bg-[#141414] text-[#D1D1D1] hover:bg-[#202020]"
              }`}
            >
              المزادات المنتهية (Ended)
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors flex items-center gap-1 cursor-pointer"
                title="إلغاء كافة الفلاتر والبحث"
              >
                <X className="w-3.5 h-3.5" />
                <span>إلغاء التصفية</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm text-[#8E8E8E]">
            {!isLoading && (
              <span className="bg-[#141414] px-3 py-1.5 rounded-lg border border-[#2B2B2B] text-[#D1D1D1]">
                {auctions.length > 0 ? `النتائج: ${auctions.length} مزاد` : "لا توجد نتائج"}
              </span>
            )}

            <button
              type="button"
              onClick={fetchAuctions}
              className="p-2.5 rounded-xl bg-[#141414] hover:bg-[#202020] border border-[#2B2B2B] text-[#D1D1D1] hover:text-white transition-colors cursor-pointer"
              title="تحديث القائمة"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* شبكة كروت المزادات */}
        {isLoading && auctions.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-zinc-500">
            <RefreshCw className="w-8 h-8 animate-spin text-[#8E8E8E]" />
            <span className="text-sm">جاري تحميل المزادات من السيرفر...</span>
          </div>
        ) : auctions.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-[#333] flex items-center justify-center">
              <Gavel className="w-8 h-8 text-[#8E8E8E]" />
            </div>
            <h3 className="text-lg font-bold text-white">لا توجد مزادات مطابقة حالياً</h3>
            <p className="text-xs text-[#8E8E8E] max-w-sm">
              {hasActiveFilters
                ? "لم نجد نتائج تطابق بحثك الحالي، جرب إزالة الفلاتر أو البحث بكلمة مختلفة."
                : "لا توجد مزادات معروضة في هذه الفئة في الوقت الحالي."}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-bold text-black bg-white hover:bg-[#D1D1D1] transition-all cursor-pointer"
              >
                إلغاء التصفية وعرض الكل
              </button>
            )}
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
      </main>

      {/* 4. نوافذ المزايدة وإنشاء المزاد */}
      <BidModal
        isOpen={!!activeBidAuction}
        onClose={() => setActiveBidAuction(null)}
        auction={activeBidAuction}
        onBidSuccess={handleBidSuccess}
        onAuctionAccepted={fetchAuctions}
      />

      <CreateAuctionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchAuctions}
      />

      {/* 5. الفوتر */}
      <Footer />
    </div>
  );
}

