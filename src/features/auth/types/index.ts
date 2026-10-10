import type { BaseEntity } from '@/types/common';

/**
 * 1. أنواع المستخدمين (User Types)
 * enum UserRole { Admin, Customer, StoreOwner, StableOwner, Advertiser }
 */
export type UserRole =
  | 'Admin'
  | 'Customer'
  | 'StoreOwner'
  | 'StableOwner'
  | 'Advertiser';

export interface RoleOption {
  id: UserRole;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  badgeAr: string;
  badgeEn: string;
}

export const USER_ROLES_CONFIG: RoleOption[] = [
  {
    id: 'Customer',
    titleAr: 'مشتري / هجّان',
    titleEn: 'Buyer / Camel Enthusiast',
    descriptionAr: 'تصفح الإبل والمستلزمات، المزايدة في المزادات الحية، والتواصل مع ملاك العزب والمنقيات',
    descriptionEn: 'Browse camels & gear, bid in live auctions, and chat with verified sellers',
    badgeAr: 'حساب مشتري',
    badgeEn: 'Buyer Account',
  },
  {
    id: 'StoreOwner',
    titleAr: 'صاحب متجر مستلزمات الإبل',
    titleEn: 'Camel Supplies Store Owner',
    descriptionAr: 'عرض منتجات ومستلزمات الهجن والإبل، إنشاء مزادات، وبثوث مباشرة مرخصة',
    descriptionEn: 'Showcase camel & racing supplies, host auctions, and launch live streams',
    badgeAr: 'متجر معتمد',
    badgeEn: 'Verified Store',
  },
  {
    id: 'StableOwner',
    titleAr: 'صاحب عزبة / منقية إبل',
    titleEn: 'Camel Farm / Stud Owner',
    descriptionAr: 'عرض الإبل الأصيلة ونوادر المزاين والفحول وخدمات التشبية وإدارة المزادات',
    descriptionEn: 'Showcase purebred camels, mazayen, stud & breeding services, and live auctions',
    badgeAr: 'عزبة معتمدة',
    badgeEn: 'Official Farm',
  },
  {
    id: 'Advertiser',
    titleAr: 'معلن تجاري',
    titleEn: 'Commercial Advertiser',
    descriptionAr: 'ملف تجاري مخصص للإعلانات والتسويق لمنتجات وفعاليات الإبل عبر باقات إعلانية',
    descriptionEn: 'Commercial business profile for advertising and promoting camel products',
    badgeAr: 'معلن معتمد',
    badgeEn: 'Verified Advertiser',
  },
];

/**
 * حالة التحقق من الحساب (UserVerificationStatus):
 * 1: pending قيد المراجعة
 * 2: active مُفعّل
 * 3: rejected مرفوض
 * 4: needModification يحتاج تعديل
 */
export enum UserVerificationStatus {
  Pending = 1,
  Active = 2,
  Rejected = 3,
  NeedModification = 4,
  Unknown = 0,
}

export type VerificationStatus =
  | 'none'
  | 'pending_otp'
  | 'pending_approval' // 1: Pending
  | 'approved'         // 2: Active
  | 'rejected'         // 3: Rejected
  | 'need_modification'; // 4: NeedModification

export function parseVerificationStatus(val: unknown): UserVerificationStatus {
  if (val === 1 || val === '1' || val === 'pending' || val === 'Pending') {
    return UserVerificationStatus.Pending;
  }
  if (val === 2 || val === '2' || val === 'active' || val === 'Active' || val === 'approved' || val === 'Approved') {
    return UserVerificationStatus.Active;
  }
  if (val === 3 || val === '3' || val === 'rejected' || val === 'Rejected') {
    return UserVerificationStatus.Rejected;
  }
  if (val === 4 || val === '4' || val === 'needModification' || val === 'need_modification' || val === 'NeedModification') {
    return UserVerificationStatus.NeedModification;
  }
  return UserVerificationStatus.Unknown;
}

/**
 * أنواع باقات الميزات (Feature Plan Types)
 * class FeaturePlanType {
 *   static const int auction = 1;             // مزاد
 *   static const int productAdvertisement = 2; // إعلان منتج
 *   static const int liveStream = 3;          // بث مباشر
 *   static const int productPackage = 4;      // فتح تصنيف منتجات
 * }
 */
export class FeaturePlanType {
  static readonly auction = 1;
  static readonly productAdvertisement = 2;
  static readonly liveStream = 3;
  static readonly productPackage = 4;
}

export interface FeaturePlan {
  id: number;
  featureName?: string;
  name: string;
  price: number;
  duration_Value: number;
  duration_Type: 2 | 3 | 4; // 2=يوم, 3=أسبوع, 4=شهر
  quantity_Limit: number;
  is_Lifetime: boolean;
  isActive: boolean;
}

/**
 * نموذج الاشتراك الحالي (CurrentSubscription)
 * status: 1=قيد المراجعة, 2=نشط, 3=منتهي, 4=ملغي
 */
export interface CurrentSubscription {
  subscriptionId?: number;
  planName?: string;
  amount?: number;
  status?: 1 | 2 | 3 | 4 | number | string;
  isLifetime?: boolean;
  startDate?: string;
  endDate?: string;
  remainingDays?: number;
  // مساعدة واجهة
  hasActiveSubscription?: boolean;
  isActive?: boolean;
}

export interface SubscriptionPlan {
  id: string | number;
  name?: string;
  title?: string;
  description?: string;
  price: number;
  currency?: string;
  durationDays?: number;
  features?: string[];
  role?: UserRole;
}

export interface User extends Partial<BaseEntity> {
  id?: string;
  fullName: string;
  phoneNumber: string;
  country?: string;
  city?: string;
  role: UserRole;
  isVerified?: boolean;
  hasActiveSubscription?: boolean;
  verificationStatus?: UserVerificationStatus | number;
  verificationState?: UserVerificationStatus | number;
  rejectionReason?: string;
  verificationRejectionReason?: string;
  avatarUrl?: string;
  email?: string;
  createdAt?: string;
}

export interface AuthResponseData {
  user?: User;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
  fullName?: string;
  phone?: string;
  profileImage?: string | null;
  role?: string;
  status?: number | string;
  hasBusinessProfile?: boolean;
  hasActiveSubscription?: boolean;
  verificationStatus?: UserVerificationStatus | number;
  verificationState?: UserVerificationStatus | number;
  rejectReason?: string | null;
  rejectionReason?: string | null;
  verificationRejectionReason?: string;
  isVerified?: boolean;
  message?: string;
}

export interface LoginDto {
  phone_Number: string;
  password: string;
}

export interface VerifyOtpDto {
  phone: string;
  code: string;
}

export interface ResendOtpDto {
  phoneNumber: string;
}

export interface ForgotPasswordDto {
  phoneNumber: string;
}

export interface ResetPasswordDto {
  phoneNumber: string;
  otpCode: string;
  newPassword: string;
}

export interface RegisterFiles {
  frontIdentityImage: File | null;
  backIdentityImage: File | null;
  selfieWithIdentityImage: File | null;
}

export interface RegisterPayload {
  fullName: string;
  phoneNumber: string;
  password: string;
  roleName: UserRole;
  files: RegisterFiles;
}

export interface VerificationDataResponse {
  id?: string;
  status?: string | number;
  verificationState?: UserVerificationStatus | number;
  verificationStatus?: UserVerificationStatus | number;
  isApproved?: boolean;
  rejectionReason?: string;
  verificationRejectionReason?: string;
  frontIdentityImageUrl?: string;
  backIdentityImageUrl?: string;
  selfieWithIdentityImageUrl?: string;
  submittedAt?: string;
}

