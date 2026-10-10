'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  auctionHubService,
  type BidUpdatePayload,
  type AuctionEndedPayload,
  type AuctionStoppedPayload,
} from '../services/auctionHubService';
import type {
  AuctionItem,
  AuctionHubStatus,
  BuyerAuctionRealtimeStatus,
  BidItem,
} from '../types';

export interface UseAuctionRealtimeReturn {
  hubStatus: AuctionHubStatus;
  auctionRealtimeStatus: BuyerAuctionRealtimeStatus;
  currentPrice: number;
  liveBids: BidItem[];
  remainingTimeFormatted: string;
  isEnded: boolean;
  canPlaceBid: boolean;
  retryJoinAuction: () => Promise<void>;
  addLocalBid: (amount: number, userName?: string, userId?: string) => void;
}

export function parseAuctionEndDate(dateStr?: string | number): number | null {
  if (!dateStr) return null;
  if (typeof dateStr === 'number') return dateStr;

  let trimmed = String(dateStr).trim();
  if (!trimmed) return null;

  // استبدال المسافات بـ T لضمان التوافق عبر جميع المتصفحات
  trimmed = trimmed.replace(' ', 'T');

  // إذا لم يكن التاريخ يحتوي على علامة Z أو إزاحة زمنية (+03:00 / -05:00)،
  // فيُعامل كتوقيت عالمي UTC افتراضي صادر من خادم ASP.NET Core
  if (!/([+-]\d{2}:?\d{2}|Z)$/i.test(trimmed)) {
    trimmed += 'Z';
  }

  const parsedTime = new Date(trimmed).getTime();
  if (isNaN(parsedTime)) {
    const fallback = new Date(String(dateStr)).getTime();
    return isNaN(fallback) ? null : fallback;
  }
  return parsedTime;
}

/**
 * Hook لإدارة حالة المزاد المباشر عبر SignalR والتحكم بالوقت والمزايدة
 * مطابق لقواعد SUBSCRIPTION_AUCTION_SYSTEM.md (القسم 3.7)
 */
export function useAuctionRealtime(
  auction: AuctionItem | null,
  isPlacingBid: boolean = false
): UseAuctionRealtimeReturn {
  const [hubStatus, setHubStatus] = useState<AuctionHubStatus>('initial');
  const [auctionRealtimeStatus, setAuctionRealtimeStatus] = useState<BuyerAuctionRealtimeStatus>('initial');
  const [currentPrice, setCurrentPrice] = useState<number>(auction?.currentBid || auction?.startingPrice || 0);
  const [liveBids, setLiveBids] = useState<BidItem[]>(auction?.bidsHistory || []);
  const [remainingTimeFormatted, setRemainingTimeFormatted] = useState<string>('');
  const [isEnded, setIsEnded] = useState<boolean>(false);

  const auctionIdRef = useRef<number | string | null>(null);
  const endTimeRef = useRef<string | undefined>(auction?.endTime);

  // إضافة سومة محلية فورية والحفاظ على التاريخ الكامل للسومات المتتالية
  const addLocalBid = useCallback((amount: number, userName?: string, userId?: string) => {
    const newBid: BidItem = {
      id: Date.now(),
      customerId: userId,
      customerName: userName || 'حساب مشتري',
      bidderName: userName || 'حساب مشتري',
      amount,
      createdAt: new Date().toISOString(),
      time: 'الآن',
    };
    setCurrentPrice(amount);
    setLiveBids((prev) => {
      const filtered = prev.filter((b) => b.amount !== amount);
      return [newBid, ...filtered].sort((a, b) => b.amount - a.amount);
    });
  }, []);

  // تحديث المرجع عند تغير المزاد
  useEffect(() => {
    if (auction) {
      auctionIdRef.current = auction.id;
      endTimeRef.current = auction.endTime;
      setCurrentPrice(auction.currentBid || auction.startingPrice || 0);

      // دمج السومات السابقة مع السومات الحية لعدم فقدان أي مزايدة متتالية
      setLiveBids((prev) => {
        const incoming = auction.bidsHistory || [];
        if (prev.length === 0) return incoming;
        if (incoming.length === 0) return prev;

        const map = new Map<string, BidItem>();
        incoming.forEach((b) => {
          map.set(`${b.amount}_${b.createdAt || b.id}`, b);
        });
        prev.forEach((b) => {
          map.set(`${b.amount}_${b.createdAt || b.id}`, b);
        });
        return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
      });

      // تعيين الحالة المبدئية
      const serverStatus = Number(auction.status);
      const endTimestamp = parseAuctionEndDate(auction.endTime);
      const isPastEnd = endTimestamp !== null ? endTimestamp <= Date.now() : false;

      if (serverStatus === 1) {
        setAuctionRealtimeStatus('draft');
        setIsEnded(false);
      } else if (serverStatus === 3) {
        setAuctionRealtimeStatus('ended');
        setIsEnded(true);
      } else if (serverStatus === 4) {
        setAuctionRealtimeStatus('stopped');
        setIsEnded(true);
      } else if (serverStatus === 2) {
        if (isPastEnd && endTimestamp !== null) {
          setAuctionRealtimeStatus('ended');
          setIsEnded(true);
        } else {
          setAuctionRealtimeStatus('active');
          setIsEnded(false);
        }
      } else {
        setAuctionRealtimeStatus('active');
        setIsEnded(false);
      }
    }
  }, [auction]);

  // الاتصال والانضمام لقناة المزاد عبر SignalR
  const joinAuction = useCallback(async () => {
    if (!auction?.id) return;
    await auctionHubService.joinAuction(auction.id);
  }, [auction]);

  useEffect(() => {
    if (!auction?.id) return;

    // 1. الاشتراك في حالة اتصال الـ Hub
    const unsubStatus = auctionHubService.subscribeStatus((status) => {
      setHubStatus(status);
    });

    // 2. استقبال عروض المزايدة اللحظية
    const unsubBid = auctionHubService.subscribeBidUpdate((data: BidUpdatePayload) => {
      if (String(data.auctionId) === String(auction.id)) {
        setCurrentPrice(data.currentPrice);
        setLiveBids((prev) => {
          // تفادي التكرار إذا كان نفس السعر ونفس الوقت
          const exists = prev.some((b) => b.amount === data.amount && (b.customerId === data.userId || b.time === data.createdAt));
          if (exists) return prev;
          const newBid: BidItem = {
            id: Date.now(),
            customerId: data.userId,
            customerName: data.userName || 'حساب مشتري',
            bidderName: data.userName || 'حساب مشتري',
            amount: data.amount,
            createdAt: data.createdAt,
            time: 'الآن',
          };
          return [newBid, ...prev].sort((a, b) => b.amount - a.amount);
        });
      }
    });

    // 3. استقبال حدث انتهاء المزاد
    const unsubEnded = auctionHubService.subscribeAuctionEnded((data: AuctionEndedPayload) => {
      if (String(data.auctionId) === String(auction.id)) {
        setAuctionRealtimeStatus('ended');
        setIsEnded(true);
      }
    });

    // 4. استقبال حدث إيقاف المزاد
    const unsubStopped = auctionHubService.subscribeAuctionStopped((data: AuctionStoppedPayload) => {
      if (String(data.auctionId) === String(auction.id)) {
        setAuctionRealtimeStatus('stopped');
        setIsEnded(true);
      }
    });

    // تنفيذ الانضمام الفعلي
    joinAuction();

    // المغادرة عند إلغاء التحميل
    return () => {
      unsubStatus();
      unsubBid();
      unsubEnded();
      unsubStopped();
      auctionHubService.leaveAuction(auction.id);
    };
  }, [auction?.id, joinAuction]);

  // عداد الوقت المتبقي اللحظي (يُحسب كل ثانية طالما الحالة active)
  useEffect(() => {
    const calculateCountdown = () => {
      const endTimestamp = parseAuctionEndDate(endTimeRef.current);

      if (auctionRealtimeStatus !== 'active') {
        if (auctionRealtimeStatus === 'ended') {
          setRemainingTimeFormatted('المزاد منتهي');
        } else if (auctionRealtimeStatus === 'stopped') {
          setRemainingTimeFormatted('تم إيقاف المزاد');
        } else if (auctionRealtimeStatus === 'draft') {
          setRemainingTimeFormatted('مزاد قادم');
        } else {
          setRemainingTimeFormatted('');
        }
        return;
      }

      // في حال عدم توفر وقت نهاية محدد وكان المزاد نشطاً
      if (!endTimestamp) {
        setRemainingTimeFormatted('مزاد مباشر نشط');
        return;
      }

      const diff = endTimestamp - Date.now();
      if (diff <= 0) {
        setRemainingTimeFormatted('انتهى وقت المزاد');
        setAuctionRealtimeStatus('ended');
        setIsEnded(true);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (n: number) => n.toString().padStart(2, '0');
      setRemainingTimeFormatted(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [auctionRealtimeStatus]);

  // إعادة المحاولة عند فشل الاتصال
  const retryJoinAuction = async () => {
    if (auction?.id) {
      await auctionHubService.joinAuction(auction.id);
    }
  };

  // شرط تمكين زر المزايدة الرسمي:
  // activeAuctionId != null && auctionHubStatus == connected && buyerAuctionStatus == active && !isPlacingBid
  const canPlaceBid = Boolean(
    auction?.id &&
    hubStatus === 'connected' &&
    auctionRealtimeStatus === 'active' &&
    !isPlacingBid &&
    !isEnded
  );

  return {
    hubStatus,
    auctionRealtimeStatus,
    currentPrice,
    liveBids,
    remainingTimeFormatted,
    isEnded,
    canPlaceBid,
    retryJoinAuction,
    addLocalBid,
  };
}
