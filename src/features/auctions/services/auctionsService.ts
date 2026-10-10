import { apiClient } from "@/core/services/apiClient";
import { API_ENDPOINTS } from "@/config/api.endpoints";
import { FeaturePlanType, type FeaturePlan } from "@/features/auth/types";
import { authService } from "@/features/auth/services/authService";
import type {
  AuctionItem,
  AuctionServerStatus,
  CreateAuctionPayload,
  PlaceBidPayload,
  AuctionFilterParams,
  BidItem,
} from "../types";
import type { ApiResponse } from "@/types/common";

function formatImageUrl(rawUrl?: string): string {
  if (!rawUrl) return "/Camels/hero.png";
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://") || rawUrl.startsWith("/")) {
    return rawUrl;
  }
  return `https://api.camel.market/img/${rawUrl}`;
}

function mapBackendAuction(item: any): AuctionItem {
  // 1. معالجة الصور واستخراج الروابط
  let rawImages: (string | undefined)[] = [];
  if (Array.isArray(item.images) && item.images.length > 0) {
    rawImages = item.images.map((img: any) =>
      typeof img === "string"
        ? img
        : img?.image_Name || img?.imageName || img?.url || img?.filePath || img?.path
    );
  }

  if (rawImages.filter(Boolean).length === 0) {
    if (item.image_Name || item.imageName || item.imageUrl) {
      rawImages = [item.image_Name || item.imageName || item.imageUrl];
    }
  }

  const validImages = rawImages.filter(Boolean) as string[];
  const images: string[] = validImages.length > 0
    ? validImages.map(formatImageUrl)
    : ["/Camels/hero.png"];

  // 2. سجل المزايدات (النموذج: { amount, createdAt, customerId, customerName })
  const bidsHistory: BidItem[] = Array.isArray(item.bids)
    ? item.bids.map((b: any, idx: number) => {
        const bidderName =
          b.customerName ||
          b.customer_Name ||
          b.userName ||
          b.user_Name ||
          b.fullName ||
          b.full_Name ||
          b.bidderName ||
          b.bidder_Name ||
          b.user?.fullName ||
          b.user?.name ||
          b.customer?.fullName ||
          b.customer?.name ||
          b.name ||
          "مزايد معتمد";

        return {
          id: b.id || idx + 1,
          customerId: b.customerId || b.userId || b.customer_Id || b.user_Id,
          customerName: bidderName,
          bidderName: bidderName,
          amount: Number(b.amount || 0),
          time: b.createdAt ? new Date(b.createdAt).toLocaleTimeString("ar-KW", { hour: "2-digit", minute: "2-digit" }) : "مؤخراً",
          createdAt: b.createdAt,
        };
      })
    : [];

  const startPrice = Number(item.start_Price ?? item.startPrice ?? item.startingPrice ?? item.price ?? 0);
  const currentPrice = Number(item.current_Price ?? item.currentPrice ?? item.currentBid ?? item.highestBid ?? startPrice);

  // 3. حالة المزاد (1=draft, 2=active, 3=ended, 4=cancelled)
  const rawStatus = Number(
    item.status ?? item.status_Id ?? item.statusId ?? item.auctionStatus ?? item.state ?? 2
  );
  const status: AuctionServerStatus =
    rawStatus === 1 ? 1 : rawStatus === 2 ? 2 : rawStatus === 3 ? 3 : rawStatus === 4 ? 4 : 2;

  const isPhoneOrId = (val?: string) => {
    if (!val) return true;
    const clean = val.replace(/[\s\+\-\(\)]/g, '');
    return /^\d+$/.test(clean) && clean.length >= 7;
  };

  const sellerId = String(item.seller_Id || item.sellerId || item.user_Id || item.userId || "");
  
  const possibleNames = [
    item.seller_Full_Name,
    item.sellerFullName,
    item.fullName,
    item.full_Name,
    item.storeName,
    item.store_Name,
    item.user?.fullName,
    item.user?.name,
    item.user?.storeName,
    item.seller_Name,
    item.sellerName,
    item.user_Name,
    item.userName,
  ].filter(Boolean);

  const humanName = possibleNames.find((n) => !isPhoneOrId(String(n)));
  const sellerName = String(humanName || possibleNames[0] || "بائع معتمد");

  const sellerPhoneNumber =
    item.seller_Phone_Number ||
    item.sellerPhoneNumber ||
    item.sellerPhone ||
    item.phone_Number ||
    item.phoneNumber ||
    item.user?.phone ||
    item.user?.phoneNumber ||
    (isPhoneOrId(item.userName) ? item.userName : "") ||
    (isPhoneOrId(item.sellerName) ? item.sellerName : "") ||
    "";

  const rawEndTime =
    item.end_Time ||
    item.endTime ||
    item.expiryDate ||
    item.expireDate ||
    item.expire_Date ||
    item.endDate ||
    item.end_Date ||
    item.expirationDate ||
    item.expiresAt ||
    item.expires_At;

  const rawStartTime =
    item.start_Time ||
    item.startTime ||
    item.created_At ||
    item.createdAt ||
    item.startDate ||
    item.start_Date;

  return {
    id: item.id,
    title: item.title || item.name || "مزاد إبل أصيلة - هجن ومزاين",
    description: item.description || "إبل أصيلة مسجلة بفحص بيطري معتمد ومواصفات نقاوة وسلالة موثقة.",
    address: item.address || "الكويت",
    startPrice,
    startingPrice: startPrice,
    currentPrice: currentPrice > 0 ? currentPrice : startPrice,
    currentBid: currentPrice > 0 ? currentPrice : startPrice,
    minIncrement: Number(item.minIncrement || item.minimumBidIncrement || 50),
    currency: item.currency || "د.ك",
    startTime: rawStartTime,
    endTime: rawEndTime,
    status,
    bids: bidsHistory,
    bidsHistory,
    bidsCount: Number(item.bids_Count ?? item.bidsCount ?? bidsHistory.length ?? 0),
    images,
    coverImage: images[0] || "/Camels/hero.png",
    sellerId,
    sellerName,
    sellerPhoneNumber,
    userId: item.userId || sellerId,
    userName: sellerName,
    featurePlanId: item.featurePlanId || item.feature_Plan_Id,
    createdAt: item.created_At || item.createdAt,
  };
}

export const auctionsService = {
  // 1. جلب قائمة المزادات للمشتري (GET Auctions/GetAuctions)
  // الفلاتر: PageNumber, Search, Status (null=الكل, 2=نشط, 3=منتهي)
  async getAuctions(params?: AuctionFilterParams): Promise<ApiResponse<AuctionItem[]>> {
    const p = params as any;
    const queryParams: Record<string, any> = {
      PageNumber: params?.PageNumber ?? p?.pageNumber ?? 1,
      PageSize: params?.PageSize ?? p?.pageSize ?? 30,
    };

    const searchVal = params?.Search ?? p?.search;
    if (searchVal) {
      queryParams.Search = searchVal;
    }

    const statusVal = params?.Status !== undefined ? params.Status : (p?.status !== undefined ? p.status : (p?.isActive ? 2 : undefined));
    if (statusVal !== undefined && statusVal !== null) {
      queryParams.Status = statusVal;
    }

    const userVal = params?.UserId ?? p?.userId;
    if (userVal) {
      queryParams.UserId = userVal;
    }

    const response = await apiClient.get<any>(API_ENDPOINTS.AUCTIONS.BASE, {
      params: queryParams,
    });

    let items: any[] = [];
    if (response.success && response.data) {
      if (Array.isArray(response.data)) {
        items = response.data;
      } else if (Array.isArray(response.data.items)) {
        items = response.data.items;
      } else if (Array.isArray(response.data.data)) {
        items = response.data.data;
      }
    }

    return {
      success: response.success,
      data: items.map(mapBackendAuction),
      statusCode: response.statusCode,
      message: response.message,
    };
  },

  // 2. جلب تفاصيل مزاد محدد (GET Auctions/GetById?id=)
  async getAuctionById(id: string | number): Promise<ApiResponse<AuctionItem | null>> {
    const response = await apiClient.get<any>(API_ENDPOINTS.AUCTIONS.BY_ID(id));
    if (response.success && response.data) {
      return {
        success: true,
        data: mapBackendAuction(response.data),
        statusCode: response.statusCode,
      };
    }

    return {
      success: false,
      data: null,
      statusCode: response.statusCode,
      message: response.message || "تعذر جلب تفاصيل المزاد",
    };
  },

  // 3. تقديم سومة جديدة (POST Auctions/PlaceBid)
  // Request Body: { "auction_Id": 0, "amount": 0 }
  async placeBid(payload: PlaceBidPayload): Promise<ApiResponse<{ currentBid: number; message?: string }>> {
    const response = await apiClient.post<any>(API_ENDPOINTS.AUCTIONS.PLACE_BID, {
      auction_Id: Number(payload.auction_Id),
      amount: Number(payload.amount),
    });

    if (response.success) {
      return {
        success: true,
        data: {
          currentBid: Number(payload.amount),
          message: response.message || "تمت المزايدة بنجاح",
        },
        statusCode: response.statusCode,
        message: response.message || "تمت المزايدة بنجاح",
      };
    }

    return {
      success: false,
      data: null as any,
      statusCode: response.statusCode || 400,
      message: response.message || "تعذر تقديم السومة على المزاد",
    };
  },

  // 4. إنشاء مزاد جديد للبائع (POST Auctions/Create - multipart)
  // Request Body: Title, Description, Address, Start_Price, FeaturePlanId + Images
  async createAuction(payload: CreateAuctionPayload): Promise<ApiResponse<unknown>> {
    const formData = new FormData();
    formData.append("Title", payload.title);
    formData.append("Description", payload.description);
    formData.append("Address", payload.address);
    formData.append("Start_Price", String(payload.startPrice));
    formData.append("FeaturePlanId", String(payload.featurePlanId));

    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((file) => {
        formData.append("Images", file);
      });
    }

    return apiClient.upload(API_ENDPOINTS.AUCTIONS.CREATE, formData);
  },

  // 5. جلب باقات المزادات (featureType=1) مع الكاش المحلي
  async getAuctionFeaturePlans(): Promise<ApiResponse<FeaturePlan[]>> {
    return authService.getFeaturePlans(FeaturePlanType.auction);
  },

  // 6. جلب مزادات البائع الحالي (GET Auctions/GetMyAuctions)
  // الفلاتر: PageNumber, Search, Category_Id, MinBid, MaxBid, Status (تبويبات: الكل / نشط الآن / منتهي)
  async getMyAuctions(params?: AuctionFilterParams): Promise<ApiResponse<AuctionItem[]>> {
    const queryParams: Record<string, any> = {
      PageNumber: params?.PageNumber || 1,
      PageSize: params?.PageSize || 30,
    };

    if (params?.Search) queryParams.Search = params.Search;
    if (params?.Category_Id) queryParams.Category_Id = params.Category_Id;
    if (params?.MinBid) queryParams.MinBid = params.MinBid;
    if (params?.MaxBid) queryParams.MaxBid = params.MaxBid;
    if (params?.Status !== undefined && params?.Status !== null) {
      queryParams.Status = params.Status;
    }

    const res = await apiClient.get<any>(API_ENDPOINTS.AUCTIONS.GET_MY, {
      params: queryParams,
    });

    let items: any[] = [];
    if (res.success && res.data) {
      items = Array.isArray(res.data) ? res.data : (res.data.items || res.data.data || []);
    }

    return {
      success: res.success,
      data: items.map(mapBackendAuction),
      statusCode: res.statusCode,
      message: res.message,
    };
  },

  // 7. قبول أعلى عرض من البائع (POST Auctions/AcceptAuction?id=)
  async acceptAuction(auctionId: string | number): Promise<ApiResponse<unknown>> {
    return apiClient.post(API_ENDPOINTS.AUCTIONS.ACCEPT(auctionId));
  },
};

