import { apiClient } from '@/core/services/apiClient';
import { API_ENDPOINTS } from '@/config/api.endpoints';
import type { ServiceItem, BookServiceDto, ServicesFilterParams } from '../types';
import type { ApiResponse, PaginatedResponse } from '@/types/common';

const isMockEnabled = process.env.NEXT_PUBLIC_ENABLE_MOCK_API === 'true';

const MOCK_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'فحص طبي بيطري شامل وفحص DNA معتمد',
    category: 'veterinary',
    providerName: 'المستشفى البيطري الدولي',
    location: 'الشويخ، الكويت',
    country: 'الكويت',
    rating: 4.9,
    reviewsCount: 48,
    contactPhone: '+96522003344',
    isVerified: true,
    priceStartingFrom: 50,
    currency: 'د.ك',
    description: 'فحوصات سلامة القلب، المفاصل، العظام، وسحب عينات الحمض النووي المعتمدة دولياً.',
    createdAt: '2026-08-01',
  },
  {
    id: 'srv-2',
    title: 'نقل وشحن الإبل المبرد بين الكويت ودول الخليج',
    category: 'transport',
    providerName: 'الخيالة للنقل السريع',
    location: 'الري، الكويت',
    country: 'الكويت',
    rating: 4.8,
    reviewsCount: 32,
    contactPhone: '+96591112233',
    isVerified: true,
    priceStartingFrom: 120,
    currency: 'د.ك',
    description: 'شاحنات مخصصة ومكيفة ومجهزة بكاميرات مراقبة طوال الرحلة مع مرافقة بيطرية.',
    createdAt: '2026-08-05',
  },
];

export const servicesService = {
  // 1. جلب الخدمات
  async getServices(params?: ServicesFilterParams): Promise<ApiResponse<PaginatedResponse<ServiceItem> | ServiceItem[]>> {
    if (isMockEnabled) {
      let result = [...MOCK_SERVICES];
      if (params?.category) {
        result = result.filter((s) => s.category === params.category);
      }
      return { success: true, data: result, statusCode: 200 };
    }
    return apiClient.get<PaginatedResponse<ServiceItem>>(API_ENDPOINTS.SERVICES.BASE, { params });
  },

  // 2. حجز خدمة
  async bookService(payload: BookServiceDto): Promise<ApiResponse<{ bookingId: string; status: string }>> {
    if (isMockEnabled) {
      return {
        success: true,
        data: { bookingId: `book-${Date.now()}`, status: 'confirmed' },
        statusCode: 201,
        message: 'تم تأكيد طلب الحجز بنجاح',
      };
    }
    return apiClient.post<{ bookingId: string; status: string }>(API_ENDPOINTS.SERVICES.BOOK, payload);
  },
};
