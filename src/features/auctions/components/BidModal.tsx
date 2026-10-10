'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Gavel,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  User,
  MapPin,
  Calendar,
  Phone,
  Coins,
  FileText,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { auctionsService } from "../services/auctionsService";
import { useAuctionRealtime, parseAuctionEndDate } from "../hooks/useAuctionRealtime";
import { SellerAuctionDecisionBox } from "./SellerAuctionDecisionBox";
import { useAuth } from "@/features/auth/context/AuthContext";
import type { AuctionItem } from "../types";

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  auction: AuctionItem | null;
  onBidSuccess?: (newBid: number) => void;
  onAuctionAccepted?: (auctionId: string | number) => void;
}

export const BidModal: React.FC<BidModalProps> = ({
  isOpen,
  onClose,
  auction: initialAuction,
  onBidSuccess,
  onAuctionAccepted,
}) => {
  const { isAuthenticated, user } = useAuth();
  const [auction, setAuction] = useState<AuctionItem | null>(initialAuction);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [amount, setAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // تحديث بيانات المزاد عند الفتح
  useEffect(() => {
    if (initialAuction && isOpen) {
      setAuction(initialAuction);
      setActiveImageIdx(0);
      const minNext = (initialAuction.currentPrice || initialAuction.currentBid) + (initialAuction.minIncrement || 50);
      setAmount(minNext);
      setSuccessMessage(null);
      setErrorMessage(null);

      // جلب التفاصيل الحية من السيرفر
      auctionsService.getAuctionById(initialAuction.id)
        .then((res) => {
          if (res.success && res.data) {
            setAuction(res.data);
            const updatedMinNext = (res.data.currentPrice || res.data.currentBid) + (res.data.minIncrement || 50);
            setAmount(updatedMinNext);
          }
        })
        .catch(() => {});
    }
  }, [initialAuction, isOpen]);

  // الاتصال عبر SignalR ومزامنة الوقت والعروض اللحظية
  const {
    hubStatus,
    auctionRealtimeStatus,
    currentPrice,
    liveBids,
    remainingTimeFormatted,
    isEnded,
    canPlaceBid,
    retryJoinAuction,
    addLocalBid,
  } = useAuctionRealtime(isOpen ? auction : null, isSubmitting);

  if (!isOpen || !auction) return null;

  // التحقق إن كان المستخدم الحالي هو البائع
  const isOwner = Boolean(
    user && (
      (user.id && auction.sellerId && String(user.id) === String(auction.sellerId)) ||
      (user.id && auction.userId && String(user.id) === String(auction.userId)) ||
      (user.phoneNumber && auction.sellerPhoneNumber && user.phoneNumber === auction.sellerPhoneNumber) ||
      (user.fullName && auction.sellerName && user.fullName === auction.sellerName)
    )
  );

  const displayPrice = currentPrice || auction.currentPrice || auction.currentBid || auction.startingPrice;
  const minAcceptableBid = displayPrice + (auction.minIncrement || 50);

  const handleQuickAdd = (inc: number) => {
    setAmount((prev) => Math.max(minAcceptableBid, (prev || displayPrice) + inc));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isAuthenticated) {
      setErrorMessage("يرجى تسجيل الدخول إلى حسابك أولاً لتتمكن من تقديم سومة في المزاد.");
      return;
    }

    if (isOwner) {
      setErrorMessage("أنت صاحب هذا المزاد، تمنع القوانين البائع من المزايدة على الإبله.");
      return;
    }

    if (!canPlaceBid) {
      if (hubStatus !== 'connected') {
        setErrorMessage("قناة البث المباشر غير متصلة حالياً. اضغط على زر إعادة الاتصال.");
      } else if (auctionRealtimeStatus !== 'active') {
        setErrorMessage("هذا المزاد غير نشط حالياً للمزايدة.");
      }
      return;
    }

    if (amount <= displayPrice) {
      setErrorMessage(`يجب أن يكون مبلغ السومة أعلى من السعر الحالي (${displayPrice.toLocaleString()} ${auction.currency})`);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await auctionsService.placeBid({
        auction_Id: Number(auction.id),
        amount,
      });

      if (res.success) {
        addLocalBid(amount, user?.fullName || 'حساب مشتري', user?.id ? String(user.id) : undefined);
        const nextMin = amount + (auction.minIncrement || 50);
        setAmount(nextMin);
        setSuccessMessage(res.data?.message || `تم تقديم سومتك بنجاح بمبلغ ${amount.toLocaleString()} ${auction.currency}!`);
        if (onBidSuccess) {
          onBidSuccess(amount);
        }
      } else {
        if (res.statusCode === 403 || String(res.message).includes('403')) {
          setErrorMessage("غير مصرح لك بالمزايدة يجب ان يكون حساب نوعه مشتري");
        } else {
          setErrorMessage(res.message || "تعذر إرسال السومة، تأكد من أن المبلغ أعلى من السومة الحالية.");
        }
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "فشل في الاتصال بخادم المزادات");
    } finally {
      setIsSubmitting(false);
    }
  };

  const imagesList = auction.images && auction.images.length > 0 ? auction.images : [auction.coverImage || "/Camels/hero.png"];
  const currentDisplayImage = imagesList[activeImageIdx] || imagesList[0];

  const formatDateTime = (isoDate?: string) => {
    if (!isoDate) return null;
    try {
      const timestamp = parseAuctionEndDate(isoDate);
      if (!timestamp) return isoDate;
      const d = new Date(timestamp);
      return d.toLocaleDateString("ar-KW", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoDate;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in" dir="rtl">
      <div
        className="relative w-full max-w-4xl rounded-[28px] bg-[#0E0E0E] border border-[#2B2B2B] shadow-2xl text-white overflow-hidden max-h-[92vh] flex flex-col"
        style={{
          boxShadow: "0 25px 70px rgba(0, 0, 0, 0.95), 0 0 40px rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* شريط الإغلاق والعنوان وحالة SignalR */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222222] bg-[#121212]/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFFFFF] via-[#E5E5E5] to-[#B8860B] flex items-center justify-center text-black shadow-md shrink-0">
              <Gavel className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {/* شارة حالة المزاد اللحظية */}
                {auctionRealtimeStatus === 'active' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    مزاد حي مباشر
                  </span>
                ) : auctionRealtimeStatus === 'ended' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                    مزاد منتهي
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    مزاد قادم
                  </span>
                )}

                {/* حالة اتصال SignalR */}
                <div className="flex items-center gap-1 text-[11px]">
                  {hubStatus === 'connected' ? (
                    <span className="text-emerald-400 flex items-center gap-1 text-[10px]" title="متصل بالبث اللحظي">
                      <Wifi className="w-3 h-3" />
                      متصل
                    </span>
                  ) : hubStatus === 'connecting' ? (
                    <span className="text-amber-400 flex items-center gap-1 text-[10px]">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      جاري الاتصال...
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={retryJoinAuction}
                      className="text-red-400 hover:text-red-300 flex items-center gap-1 text-[10px] underline cursor-pointer"
                      title="انقر لإعادة الاتصال"
                    >
                      <WifiOff className="w-3 h-3" />
                      إعادة الاتصال
                    </button>
                  )}
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug line-clamp-1 mt-0.5">
                {auction.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[#8E8E8E] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* محتوى التفاصيل في عمودين متجاوبين */}
        <div className="overflow-y-auto p-5 sm:p-7 flex-1 space-y-6">
          
          {/* رسائل التنبيه والنجاح */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* 1. الجانب الأيمن: معرض الصور والبيانات الوصفية */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              
              {/* معرض صور الإبل الرئيسي */}
              <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-black/60 border border-[#252525] group">
                <Image
                  src={currentDisplayImage}
                  alt={auction.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {imagesList.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : imagesList.length - 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveImageIdx((prev) => (prev < imagesList.length - 1 ? prev + 1 : 0))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-[11px] font-mono text-white">
                  {activeImageIdx + 1} / {imagesList.length}
                </div>
              </div>

              {/* مصغرات الصور */}
              {imagesList.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {imagesList.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeImageIdx === idx ? "border-white scale-105 shadow-md" : "border-[#333] opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={imgUrl} alt="thumb" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* بطاقة تفاصيل الإبل */}
              <div className="bg-[#141414] border border-[#262626] rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#D1D1D1] mb-2.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>تفاصيل الإبل والشهادات البيطرية:</span>
                </div>
                <p className="text-sm text-[#CCCCCC] leading-relaxed whitespace-pre-line text-right">
                  {auction.description || "لا تتوفر تفاصيل إضافية عن هذا المزاد حالياً."}
                </p>
              </div>

              {/* البيانات الوصفية */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#141414] border border-[#222222] rounded-xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[#8E8E8E]">الموقع / المدينة</span>
                    <span className="text-xs sm:text-sm font-bold text-white">{auction.address || "الكويت"}</span>
                  </div>
                </div>

                <div className="bg-[#141414] border border-[#222222] rounded-xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <Coins className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[#8E8E8E]">سعر افتتاح المزاد</span>
                    <span className="text-xs sm:text-sm font-bold text-white font-mono">
                      {auction.startingPrice.toLocaleString()} {auction.currency}
                    </span>
                  </div>
                </div>

                <div className="bg-[#141414] border border-[#222222] rounded-xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[#8E8E8E]">البائع / المالك</span>
                    <span className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                      {auction.sellerName && !/^\+?\d+$/.test(auction.sellerName.replace(/\s+/g, ''))
                        ? auction.sellerName
                        : isOwner && user?.fullName
                        ? user.fullName
                        : "إسطبل / بائع معتمد"}
                    </span>
                  </div>
                </div>

                {auction.sellerPhoneNumber ? (
                  <a
                    href={`https://wa.me/${auction.sellerPhoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً، أود الاستفسار عن مزاد الإبل: ${auction.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#141414] hover:bg-[#1C1C1C] border border-[#222222] hover:border-emerald-500/40 rounded-xl p-3 flex items-center justify-between transition-colors cursor-pointer group"
                    title="تواصل مع البائع عبر واتساب"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/5 group-hover:bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-teal-400" />
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[11px] text-[#8E8E8E]">هاتف التواصل (محادثة)</span>
                        <span className="text-xs sm:text-sm font-bold text-white font-mono group-hover:text-emerald-300" dir="ltr">
                          {auction.sellerPhoneNumber}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400" />
                  </a>
                ) : (
                  <div className="bg-[#141414] border border-[#222222] rounded-xl p-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[#8E8E8E]">توقيت البدء</span>
                      <span className="text-[11px] font-bold text-white">
                        {formatDateTime(auction.startTime) || "اليوم"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* الوقت المتبقي اللحظي */}
              <div className="bg-[#141414] border border-[#222222] rounded-xl p-3 flex items-center justify-between text-xs text-[#8E8E8E]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>الوقت المتبقي:</span>
                </div>
                <span className="text-white font-bold font-mono text-sm">
                  {remainingTimeFormatted || (formatDateTime(auction.endTime) || "جاري الحساب...")}
                </span>
              </div>

            </div>

            {/* 2. الجانب الأيسر: لوحة المزايدة أو صندوق قرار البائع */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              
              {/* بطاقة السعر الحالي */}
              <div className="bg-gradient-to-b from-[#181818] to-[#121212] border-2 border-[#333333] rounded-2xl p-5 shadow-lg flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8E8E8E]">السعر الحالي الأعلى</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                    {displayPrice.toLocaleString()} {auction.currency}
                  </span>
                </div>

                <div className="text-3xl sm:text-4xl font-black text-white flex items-baseline gap-1.5 font-mono">
                  <span>{displayPrice.toLocaleString()}</span>
                  <span className="text-sm font-normal text-[#D1D1D1]">{auction.currency}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-[#8E8E8E] block text-[11px]">أقل زيادة مقبولة:</span>
                    <strong className="text-white font-mono">+{auction.minIncrement || 50} {auction.currency}</strong>
                  </div>
                  <div>
                    <span className="text-[#8E8E8E] block text-[11px]">عدد السومات:</span>
                    <strong className="text-white font-mono">{liveBids.length || auction.bidsCount} مزايدات</strong>
                  </div>
                </div>
              </div>

              {/* إن كان المستخدم هو البائع وانتهى المزاد ولديه عروض -> عرض SellerAuctionDecisionBox */}
              {isOwner ? (
                isEnded && liveBids.length > 0 ? (
                  <SellerAuctionDecisionBox
                    auction={auction}
                    onAccepted={() => {
                      if (onAuctionAccepted) onAuctionAccepted(auction.id);
                      if (onBidSuccess) onBidSuccess(displayPrice);
                    }}
                  />
                ) : (
                  <div className="bg-[#141414] border border-[#252525] rounded-2xl p-5 text-center text-xs text-[#8E8E8E] space-y-2">
                    <ShieldCheck className="w-8 h-8 text-amber-400 mx-auto" />
                    <p className="font-bold text-white">أنت صاحب هذا المزاد</p>
                    <p>
                      {isEnded
                        ? "انتهى المزاد ولا تتوفر عروض لترسيتها."
                        : "يمكنك متابعة العروض اللحظية المقدمة من المشترين هنا."}
                    </p>
                  </div>
                )
              ) : (
                /* نموذج تقديم السومة للمشتري */
                <form onSubmit={handleSubmit} className="bg-[#141414] border border-[#252525] rounded-2xl p-5 flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#D1D1D1] mb-2">
                      أدخل مبلغ سومتك الجديدة ({auction.currency}) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount || ""}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        min={minAcceptableBid}
                        step="any"
                        required
                        disabled={!canPlaceBid}
                        className="w-full px-4 py-3 rounded-xl bg-[#181818] border border-[#333333] text-white text-lg font-bold placeholder:text-[#555555] focus:outline-none focus:border-[#FFFFFF] transition-colors disabled:opacity-50"
                        placeholder={minAcceptableBid.toString()}
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8E8E8E]">
                        {auction.currency}
                      </span>
                    </div>
                  </div>

                  {/* أزرار الإضافة السريعة */}
                  <div>
                    <span className="text-[11px] text-[#8E8E8E] block mb-1.5">زيادة سريعة بالمبلغ:</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[50, 100, 200, 500].map((inc) => (
                        <button
                          key={inc}
                          type="button"
                          disabled={!canPlaceBid}
                          onClick={() => handleQuickAdd(inc)}
                          className="py-1.5 px-2 rounded-lg text-xs font-bold bg-[#1F1F1F] hover:bg-white hover:text-black border border-[#333333] transition-all cursor-pointer text-center disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          +{inc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* زر تأكيد المزايدة */}
                  <button
                    type="submit"
                    disabled={!canPlaceBid || isSubmitting}
                    className="w-full mt-1 py-3.5 px-4 rounded-xl text-sm sm:text-base font-bold text-black bg-gradient-to-r from-[#FFFFFF] via-[#F7F7F7] to-[#D1D1D1] hover:scale-[1.02] shadow-[0_4px_25px_rgba(255,255,255,0.2)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>جاري إرسال السومة...</span>
                    ) : isEnded ? (
                      <span>المزاد منتهي</span>
                    ) : (
                      <>
                        <Gavel className="w-5 h-5" />
                        <span>تأكيد المزايدة بمبلغ {amount ? amount.toLocaleString() : minAcceptableBid.toLocaleString()} {auction.currency}</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* سجل آخر السومات الحية */}
              <div className="bg-[#141414] border border-[#252525] rounded-2xl p-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#D1D1D1]">سجل المزايدات الحية:</span>
                  <span className="text-[11px] text-[#8E8E8E] font-mono">({liveBids.length}) سومة</span>
                </div>

                {liveBids.length > 0 ? (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {liveBids.slice(0, 8).map((bid, i) => (
                      <div
                        key={bid.id || i}
                        className="flex items-center justify-between py-2 px-3 rounded-xl bg-[#181818] border border-white/5 text-xs"
                      >
                        <div className="flex items-center gap-2 text-zinc-300">
                          <User className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="font-bold">{bid.customerName || bid.bidderName}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-emerald-400 font-mono">
                            {bid.amount.toLocaleString()} {auction.currency}
                          </span>
                          {bid.time && <span className="text-[10px] text-zinc-500">{bid.time}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-5 text-center text-xs text-zinc-500">
                    لا توجد مزايدات مسجلة بعد، كن أول من يفتتح السوم!
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

