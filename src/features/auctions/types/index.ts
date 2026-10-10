import type { QueryParams } from '@/types/common';
import type { FeaturePlan } from '@/features/auth/types';

/**
 * حالات المزاد من السيرفر (AuctionServerStatus)
 * 1: draft (مسودة)
 * 2: active (نشط)
 * 3: ended (منتهي)
 * 4: cancelled (ملغي)
 */
export enum AuctionServerStatus {
  Draft = 1,
  Active = 2,
  Ended = 3,
  Cancelled = 4,
}

/**
 * حالات الاتصال بقناة SignalR الريال تايم (AuctionHubStatus)
 */
export type AuctionHubStatus = 'initial' | 'connecting' | 'connected' | 'failure';

/**
 * حالات المزاد عند المشتري لحظياً (BuyerAuctionRealtimeStatus)
 */
export type BuyerAuctionRealtimeStatus = 'initial' | 'draft' | 'active' | 'ended' | 'stopped';

export interface BidItem {
  id?: string | number;
  customerId?: string;
  customerName?: string;
  bidderName?: string;
  amount: number;
  createdAt?: string;
  time?: string;
}

export interface AuctionImageItem {
  id?: number;
  imageName?: string;
  image_Name?: string;
  url?: string;
}

/**
 * نموذج تفاصيل المزاد (Response Model)
 */
export interface AuctionItem {
  id: number | string;
  title: string;
  description?: string;
  address?: string;
  currentPrice: number;
  startPrice: number;
  startTime?: string;
  endTime?: string;
  status: AuctionServerStatus | number;
  bids: BidItem[];
  images: string[];
  sellerId?: string;
  sellerName?: string;
  sellerPhoneNumber?: string;
  userId?: string;
  userName?: string;
  featurePlanId?: number;
  createdAt?: string;
  // مساعدة واجهة
  currentBid: number;
  startingPrice: number;
  bidsCount: number;
  bidsHistory: BidItem[];
  coverImage: string;
  currency: string;
  minIncrement?: number;
}

export interface CreateAuctionPayload {
  title: string;
  description: string;
  address: string;
  startPrice: number;
  featurePlanId: number;
  images: File[];
}

export interface PlaceBidPayload {
  auction_Id: number;
  amount: number;
}

export type AuctionFeaturePlan = FeaturePlan;

export interface AuctionFilterParams extends QueryParams {
  PageNumber?: number;
  PageSize?: number;
  Search?: string;
  Status?: number | null; // null=الكل, 2=نشط, 3=منتهي
  Category_Id?: number;
  MinBid?: number;
  MaxBid?: number;
  UserId?: string;
  IsActive?: boolean;
}

