import { apiClient } from '@/core/services/apiClient';
import { API_ENDPOINTS } from '@/config/api.endpoints';
import type {
  ListingItem,
  ListingFilterParams,
  CreateListingDto,
  UpdateListingDto,
} from '../types';
import type { ApiResponse, PaginatedResponse } from '@/types/common';

// عينات بيانات أولية تجريبية للإبل
const MOCK_LISTINGS: ListingItem[] = [
  {
    id: 'camel-1',
    title: 'فحل مجاهيم فاخر - سلالة الشيخة الموثقة',
    marketType: 'camels',
    breed: 'مجاهيم',
    gender: 'stallion',
    ageYears: 6,
    price: 18500,
    currency: 'د.ك',
    saleType: 'direct',
    status: 'available',
    country: 'الكويت',
    city: 'الوفرة',
    images: ['/Camels/hero.png'],
    isVerified: true,
    hasPedigree: true,
    pedigree: {
      sire: 'سلطان المجاهيم',
      dam: 'الظبية',
      strain: 'مجاهيم نجدية أصيلة',
      breeder: 'عزبة الصياهد للتراث',
      passportNo: 'KWT-CAM-2024-101',
    },
    description: 'فحل مجاهيم فاخر يتميز بجرم فاره وعرنون وسنام متناسق، منتج لسلالات أبطال المزاين.',
    sellerName: 'عزبة النخبة للإبل',
    sellerPhone: '+96590001122',
    createdAt: '2026-08-20',
  },
  {
    id: 'camel-2',
    title: 'بكرة وضحاء مميزة - مؤهلة لمزاين الخليج',
    marketType: 'camels',
    breed: 'وضح',
    gender: 'mare',
    ageYears: 3,
    price: 24000,
    currency: 'د.ك',
    saleType: 'direct',
    status: 'available',
    country: 'الكويت',
    city: 'كبد',
    images: ['/Camels/why-us-camel.png'],
    isVerified: true,
    hasPedigree: true,
    pedigree: {
      sire: 'وضاح الصحراء',
      dam: 'نجمة البادية',
      strain: 'وضح أصلية',
      breeder: 'مزرعة الهدى للإبل',
      passportNo: 'KWT-CAM-2025-304',
    },
    description: 'بكرة وضحاء ذات مواصفات جمال نادرة، بياض ناصع ورقبة طويلة وسنام رجاف مميز.',
    sellerName: 'فهد العازمي',
    sellerPhone: '+96599887766',
    createdAt: '2026-08-25',
  },
];

const isMockEnabled = process.env.NEXT_PUBLIC_ENABLE_MOCK_API === 'true';

export const listingsService = {
  // 1. جلب قائمة الإعلانات مع التصفية والصفحات
  async getListings(params?: ListingFilterParams): Promise<ApiResponse<PaginatedResponse<ListingItem> | ListingItem[]>> {
    if (isMockEnabled) {
      let result = [...MOCK_LISTINGS];
      if (params?.search) {
        const q = params.search.toLowerCase();
        result = result.filter(
          (item) => item.title.toLowerCase().includes(q) || item.breed.toLowerCase().includes(q)
        );
      }
      if (params?.gender) {
        result = result.filter((item) => item.gender === params.gender);
      }
      if (params?.isVerifiedOnly) {
        result = result.filter((item) => item.isVerified);
      }
      return {
        success: true,
        data: result,
        statusCode: 200,
      };
    }

    return apiClient.get<PaginatedResponse<ListingItem>>(API_ENDPOINTS.LISTINGS.BASE, { params });
  },

  // 2. جلب تفاصيل إعلان محدد
  async getListingById(id: string): Promise<ApiResponse<ListingItem | null>> {
    if (isMockEnabled) {
      const found = MOCK_LISTINGS.find((item) => item.id === id) || null;
      return {
        success: !!found,
        data: found,
        statusCode: found ? 200 : 404,
      };
    }

    return apiClient.get<ListingItem>(API_ENDPOINTS.LISTINGS.BY_ID(id));
  },

  // 3. إنشاء إعلان جديد
  async createListing(payload: CreateListingDto): Promise<ApiResponse<ListingItem>> {
    if (isMockEnabled) {
      const newListing: ListingItem = {
        id: `listing-${Date.now()}`,
        ...payload,
        status: 'available',
        isVerified: false,
        hasPedigree: !!payload.pedigree,
        sellerName: 'المعلن الحالي',
        createdAt: new Date().toISOString(),
      };
      MOCK_LISTINGS.unshift(newListing);
      return { success: true, data: newListing, statusCode: 201 };
    }

    return apiClient.post<ListingItem>(API_ENDPOINTS.LISTINGS.CREATE, payload);
  },

  // 4. تعديل إعلان
  async updateListing(id: string, payload: UpdateListingDto): Promise<ApiResponse<ListingItem>> {
    if (isMockEnabled) {
      const index = MOCK_LISTINGS.findIndex((item) => item.id === id);
      if (index !== -1) {
        MOCK_LISTINGS[index] = { ...MOCK_LISTINGS[index], ...payload };
        return { success: true, data: MOCK_LISTINGS[index], statusCode: 200 };
      }
    }

    return apiClient.put<ListingItem>(API_ENDPOINTS.LISTINGS.UPDATE(id), payload);
  },

  // 5. حذف إعلان
  async deleteListing(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    if (isMockEnabled) {
      const index = MOCK_LISTINGS.findIndex((item) => item.id === id);
      if (index !== -1) {
        MOCK_LISTINGS.splice(index, 1);
      }
      return { success: true, data: { deleted: true }, statusCode: 200 };
    }

    return apiClient.delete<{ deleted: boolean }>(API_ENDPOINTS.LISTINGS.DELETE(id));
  },
};
