'use client';

import React, { useState } from 'react';
import { Gavel, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { auctionsService } from '../services/auctionsService';
import type { AuctionItem } from '../types';

interface SellerAuctionDecisionBoxProps {
  auction: AuctionItem;
  onAccepted?: () => void;
}

/**
 * 3.5 صندوق قرار البائع (SellerAuctionDecisionBox)
 * يظهر للبائع عند انتهاء المزاد ووجود عروض، ويعرض أعلى سومة مع زر قبول فقط
 * عند الضغط: POST Auctions/AcceptAuction?id=
 */
export const SellerAuctionDecisionBox: React.FC<SellerAuctionDecisionBoxProps> = ({
  auction,
  onAccepted,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const highestBid = auction.currentPrice || auction.currentBid || auction.startingPrice;
  const highestBidderName =
    auction.bidsHistory?.[0]?.customerName ||
    auction.bidsHistory?.[0]?.bidderName ||
    auction.bids?.[0]?.customerName ||
    'المزايد صاحب أعلى سومة';

  const isAlreadyEndedMsg = (msg?: string | null) => {
    if (!msg) return false;
    const lower = msg.toLowerCase();
    return (
      lower.includes('انهاء') ||
      lower.includes('إنهاء') ||
      lower.includes('منتهي') ||
      lower.includes('منتهيا') ||
      lower.includes('مسبق') ||
      lower.includes('مسبقا') ||
      lower.includes('مسبقاً') ||
      lower.includes('already') ||
      lower.includes('ended') ||
      lower.includes('closed')
    );
  };

  const handleAccept = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await auctionsService.acceptAuction(auction.id);
      if (res.success) {
        setIsAccepted(true);
        if (onAccepted) onAccepted();
      } else {
        if (isAlreadyEndedMsg(res.message)) {
          // المزاد تم إنهاؤه وقبول العرض مسبقاً
          setIsAccepted(true);
          if (onAccepted) onAccepted();
        } else {
          setErrorMessage(res.message || 'تعذر قبول العرض حالياً');
        }
      }
    } catch (err) {
      const errStr = err instanceof Error ? err.message : String(err);
      if (isAlreadyEndedMsg(errStr)) {
        setIsAccepted(true);
        if (onAccepted) onAccepted();
      } else {
        setErrorMessage(err instanceof Error ? err.message : 'فشل في الاتصال بخادم المزادات');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAccepted) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-emerald-950/60 to-emerald-900/30 border border-emerald-500/50 p-5 text-center text-white space-y-3 shadow-xl animate-fade-in">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-base font-bold text-emerald-300">تم إنهاء المزاد واعتماد الترسية بنجاح!</h4>
          <p className="text-xs text-[#CCCCCC] mt-1">
            تمت الترسية على <strong className="text-white font-bold">{highestBidderName}</strong> بمبلغ{' '}
            <strong className="text-amber-300 font-mono text-sm">{highestBid.toLocaleString()} {auction.currency}</strong>.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>المزاد مكتمل ومغلق رسمياً</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#1E1E1E] to-[#141414] border-2 border-amber-400/40 p-5 text-white space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
            <Gavel className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">صندوق قرار البائع</h4>
            <span className="text-[11px] text-[#8E8E8E]">انتهى وقت المزاد ويتوفر عروض شراء</span>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30">
          بانتظار قرارك
        </span>
      </div>

      <div className="rounded-xl bg-black/50 border border-white/10 p-3.5 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-[#8E8E8E] block">أعلى سومة مقدمة</span>
          <span className="text-xs font-bold text-white line-clamp-1">{highestBidderName}</span>
        </div>
        <div className="text-left">
          <span className="text-lg sm:text-xl font-black text-amber-300 font-mono">
            {highestBid.toLocaleString()} {auction.currency}
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleAccept}
        disabled={isSubmitting}
        className="w-full py-3 px-4 rounded-xl text-sm font-bold text-black bg-gradient-to-r from-white via-[#F7F7F7] to-[#D1D1D1] hover:scale-[1.02] shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isSubmitting ? (
          <span>جاري قبول العرض...</span>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>قبول أعلى عرض ({highestBid.toLocaleString()} {auction.currency})</span>
          </>
        )}
      </button>
    </div>
  );
};
