import type { BaseEntity, QueryParams } from '@/types/common';

export type CamelGender = 'stallion' | 'mare' | 'foal' | 'bakrah' | 'qaood' | 'naqah' | 'jaml'; // فحل | ناقة / بكرة | قعود / جمل / حوار
export type HorseGender = CamelGender;
export type ListingStatus = 'available' | 'reserved' | 'sold' | 'draft';
export type SaleType = 'direct' | 'auction';

export interface CamelPedigree {
  sire?: string;        // اسم الأب (الفحل)
  dam?: string;         // اسم الأم (الناقة)
  strain?: string;      // السلالة (مجاهيم، وضح، صفر، شعل، حمر، شقح، حراير، عمانيات)
  breeder?: string;     // المربي / العزبة الأصلية
  passportNo?: string;  // رقم الشريحة أو بطاقة النسب
}
export type HorsePedigree = CamelPedigree;

export interface ListingItem extends BaseEntity {
  title: string;
  marketType: 'Camels' | 'camels' | 'sheep';
  breed: string;
  gender: CamelGender;
  ageYears: number;
  price: number;
  currency: string;
  saleType: SaleType;
  status: ListingStatus;
  country: string;
  city: string;
  images: string[];
  isVerified: boolean;      // فحص بيطري موثق
  hasPedigree: boolean;     // شجرة نسب معتمدة
  pedigree?: CamelPedigree;
  description: string;
  sellerId?: string;
  sellerName: string;
  sellerPhone: string;
  viewsCount?: number;
  favoritesCount?: number;
}

export interface ListingFilterParams extends QueryParams {
  marketType?: 'Camels' | 'camels' | 'sheep';
  breed?: string;
  gender?: HorseGender;
  saleType?: SaleType;
  country?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  isVerifiedOnly?: boolean;
}

export interface CreateListingDto {
  title: string;
  marketType: 'Camels' | 'camels' | 'sheep';
  breed: string;
  gender: HorseGender;
  ageYears: number;
  price: number;
  currency: string;
  saleType: SaleType;
  country: string;
  city: string;
  images: string[];
  description: string;
  sellerPhone: string;
  pedigree?: HorsePedigree;
}

export interface UpdateListingDto extends Partial<CreateListingDto> {
  status?: ListingStatus;
}
