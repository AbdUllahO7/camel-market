import type { BaseEntity, QueryParams } from '@/types/common';

export type ServiceCategory =
  | 'veterinary'    // فحص بيطري وتطعيمات
  | 'transport'     // نقل وشحن الإبل بين دول الخليج
  | 'stables'       // إيواء وتدريب ومرابط
  | 'supplies'      // مستلزمات وأعلاف وفروسية
  | 'farrier';      // بيطرة وحذاء الإبل

export interface ServiceItem extends BaseEntity {
  title: string;
  category: ServiceCategory;
  providerName: string;
  location: string;
  country: string;
  rating: number;
  reviewsCount: number;
  contactPhone: string;
  isVerified: boolean;
  priceStartingFrom?: number;
  currency?: string;
  description?: string;
}

export interface BookServiceDto {
  serviceId: string;
  bookingDate: string;
  notes?: string;
  customerName: string;
  customerPhone: string;
}

export interface ServicesFilterParams extends QueryParams {
  category?: ServiceCategory;
  country?: string;
  isVerifiedOnly?: boolean;
}
