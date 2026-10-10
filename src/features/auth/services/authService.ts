import { apiClient } from '@/core/services/apiClient';
import { API_ENDPOINTS } from '@/config/api.endpoints';
import type {
  LoginDto,
  RegisterPayload,
  RegisterFiles,
  VerifyOtpDto,
  ResendOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthResponseData,
  VerificationDataResponse,
  SubscriptionPlan,
  CurrentSubscription,
  FeaturePlan,
  User,
  UserRole,
  UserVerificationStatus,
} from '../types';
import type { ApiResponse } from '@/types/common';

export function extractPaymentUrl(data: any): string | null {
  if (!data) return null;
  if (typeof data === 'string' && data.startsWith('http')) return data;

  const candidates = [
    data.paymentUrl,
    data.paymentURL,
    data.payment_url,
    data.payment_Url,
    data.invoiceURL,
    data.invoiceUrl,
    data.invoice_url,
    data.redirectUrl,
    data.redirect_url,
    data.checkoutUrl,
    data.checkout_url,
    data.url,
    data.link,
    data.data?.paymentUrl,
    data.data?.paymentURL,
    data.data?.url,
    data.data?.redirectUrl,
  ];

  for (const c of candidates) {
    if (typeof c === 'string' && c.trim().startsWith('http')) {
      return c.trim();
    }
  }

  return null;
}

function normalizeArabicText(text: string): string {
  if (!text) return '';
  return text
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export const authService = {
  // 1. تسجيل الدخول
  async login(payload: LoginDto): Promise<ApiResponse<AuthResponseData>> {
    const res = await apiClient.post<AuthResponseData>(API_ENDPOINTS.AUTH.LOGIN, {
      phone_Number: payload.phone_Number,
      password: payload.password,
    });

    if (res.success && res.data) {
      const token = res.data.token || res.data.accessToken;
      if (token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
        if (res.data.refreshToken) {
          localStorage.setItem('refresh_token', res.data.refreshToken);
        }
        const vStatus = Number(res.data.verificationStatus ?? res.data.status ?? 2) as UserVerificationStatus;
        const role = (res.data.role as UserRole) || 'Customer';
        const userData: User = res.data.user || {
          id: res.data.userId,
          fullName: res.data.fullName || 'مستخدم سوق الإبل',
          phoneNumber: res.data.phone || payload.phone_Number,
          role,
          isVerified: vStatus === 2 || res.data.status === 2 || !!res.data.isVerified,
          verificationStatus: vStatus,
          verificationState: vStatus,
          rejectionReason: (res.data.rejectReason || res.data.rejectionReason) || undefined,
          avatarUrl: res.data.profileImage || undefined,
        };
        localStorage.setItem('auth_user', JSON.stringify(userData));
      }
    }
    return res;
  },

  // 2. إنشاء حساب جديد مع صور الهوية الرسمية (Multipart + Query Params)
  async register(payload: RegisterPayload): Promise<ApiResponse<AuthResponseData>> {
    const formData = new FormData();
    if (payload.files.frontIdentityImage) {
      formData.append('FrontIdentityImage', payload.files.frontIdentityImage);
    }
    if (payload.files.backIdentityImage) {
      formData.append('BackIdentityImage', payload.files.backIdentityImage);
    }
    if (payload.files.selfieWithIdentityImage) {
      formData.append('SelfieWithIdentityImage', payload.files.selfieWithIdentityImage);
    }

    const queryParams = {
      FullName: payload.fullName,
      PhoneNumber: payload.phoneNumber,
      Password: payload.password,
      RoleName: payload.roleName,
    };

    return apiClient.upload<AuthResponseData>(API_ENDPOINTS.AUTH.REGISTER, formData, {
      params: queryParams,
    });
  },

  // 3. التحقق من كود OTP المرسل على الواتساب
  async verifyOtp(payload: VerifyOtpDto): Promise<ApiResponse<AuthResponseData>> {
    const res = await apiClient.post<AuthResponseData>(API_ENDPOINTS.AUTH.VERIFY_OTP, {
      phone: payload.phone,
      code: payload.code,
    });

    if (res.success && res.data) {
      const token = res.data.token || res.data.accessToken;
      if (token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
        if (res.data.refreshToken) {
          localStorage.setItem('refresh_token', res.data.refreshToken);
        }
        if (res.data.user) {
          localStorage.setItem('auth_user', JSON.stringify(res.data.user));
        }
      }
    }
    return res;
  },

  // 4. إعادة إرسال كود OTP
  async resendOtp(payload: ResendOtpDto): Promise<ApiResponse<{ message?: string }>> {
    return apiClient.post<{ message?: string }>(API_ENDPOINTS.AUTH.RESEND_OTP, {
      phoneNumber: payload.phoneNumber,
    });
  },

  // 5. استعادة كلمة المرور
  async forgotPassword(payload: ForgotPasswordDto): Promise<ApiResponse<{ message?: string }>> {
    return apiClient.post<{ message?: string }>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, undefined, {
      params: { PhoneNumber: payload.phoneNumber },
    });
  },

  // 6. إعادة تعيين كلمة المرور بالكود
  async resetPassword(payload: ResetPasswordDto): Promise<ApiResponse<{ message?: string }>> {
    return apiClient.post<{ message?: string }>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      phoneNumber: payload.phoneNumber,
      otpCode: payload.otpCode,
      newPassword: payload.newPassword,
    });
  },

  // 7. إعادة رفع ملفات وصور الهوية عند رفض الإدارة
  async updateVerificationFiles(files: RegisterFiles): Promise<ApiResponse<unknown>> {
    const formData = new FormData();
    if (files.frontIdentityImage) {
      formData.append('FrontIdentityImage', files.frontIdentityImage);
    }
    if (files.backIdentityImage) {
      formData.append('BackIdentityImage', files.backIdentityImage);
    }
    if (files.selfieWithIdentityImage) {
      formData.append('SelfieWithIdentityImage', files.selfieWithIdentityImage);
    }

    return apiClient.upload(API_ENDPOINTS.AUTH.UPDATE_VERIFICATION_FILES, formData);
  },

  // 8. جلب بيانات وحالة التوثيق الخاصة بالمستخدم
  async getMyVerificationData(): Promise<ApiResponse<VerificationDataResponse>> {
    return apiClient.get<VerificationDataResponse>(API_ENDPOINTS.AUTH.GET_MY_VERIFICATION_DATA);
  },

  // 9. جلب خطة الاشتراك المخصصة لدور المستخدم (GET Subscription/GetMyPlan)
  async getMyPlan(): Promise<ApiResponse<SubscriptionPlan>> {
    const res = await apiClient.get<any>(API_ENDPOINTS.SUBSCRIPTION.GET_MY_PLAN);
    if (res.success && res.data) {
      const d = res.data;
      const mapped: SubscriptionPlan = {
        id: d.id || d.planId || d.subscriptionPlanId || d.subscription_Plan_Id || 1,
        title: d.title || d.name || d.planName || d.plan_Name || 'باقة الاشتراك المعتمدة',
        name: d.name || d.title || d.planName || 'باقة الاشتراك المعتمدة',
        description: d.description || d.desc || 'تفعيل كامل صلاحيات الحساب والمميزات',
        price: Number(d.price ?? d.amount ?? 0),
        currency: d.currency || d.currencyCode || 'د.ك',
        durationDays: Number(d.durationDays ?? d.duration_Days ?? d.days ?? d.duration ?? 30),
        features: Array.isArray(d.features) ? d.features : Array.isArray(d.planFeatures) ? d.planFeatures : [],
        role: d.role || d.roleName,
      };
      return {
        ...res,
        data: mapped,
      };
    }
    return res;
  },

  // 10. معرفة حالة الاشتراك الحالي (GET Subscription/GetCurrentSubscription)
  async getCurrentSubscription(): Promise<ApiResponse<CurrentSubscription>> {
    const res = await apiClient.get<any>(API_ENDPOINTS.SUBSCRIPTION.GET_CURRENT);
    if (res.success && res.data) {
      const d = res.data;
      const statusCode = Number(d.status ?? 0);
      const isStatusActive = statusCode === 2 || d.status === 'Active';
      const isLifetime = Boolean(d.isLifetime || d.is_Lifetime);
      const remainingDays = Number(d.remainingDays ?? d.daysRemaining ?? 0);
      const notExpired = d.endDate ? new Date(d.endDate).getTime() > Date.now() : true;
      const isActive = (isStatusActive || isLifetime) && (isLifetime || (remainingDays > 0 && notExpired));

      const mapped: CurrentSubscription = {
        subscriptionId: d.subscriptionId || d.id,
        planName: d.planName || d.name,
        amount: Number(d.amount ?? d.price ?? 0),
        status: (statusCode as any) || d.status,
        isLifetime,
        startDate: d.startDate,
        endDate: d.endDate,
        remainingDays,
        hasActiveSubscription: isActive,
        isActive,
      };

      return {
        ...res,
        data: mapped,
      };
    }

    return res;
  },

  // 11. جلب باقات ميزة معيّنة وتخزينها محلياً في الكاش (GET FeaturePlansManagement/GetPlans?featureType=)
  async getFeaturePlans(featureType: number): Promise<ApiResponse<FeaturePlan[]>> {
    const cacheKey = `feature_plans_${featureType}`;
    try {
      const res = await apiClient.get<any>(API_ENDPOINTS.FEATURE_PLANS.GET_PLANS, {
        params: { featureType },
      });

      if (res.success && res.data) {
        const rawList = Array.isArray(res.data) ? res.data : (res.data.items || res.data.data || []);
        const mappedPlans: FeaturePlan[] = rawList.map((p: any) => ({
          id: p.id || p.planId || p.featurePlanId || p.feature_Plan_Id,
          featureName: p.featureName || p.name || p.feature_Name,
          name: p.name || p.featureName || p.planName || p.title,
          price: Number(p.price ?? p.amount ?? 0),
          duration_Value: Number(p.duration_Value ?? p.durationValue ?? p.duration ?? 1),
          duration_Type: (p.duration_Type ?? p.durationType ?? 2) as 2 | 3 | 4,
          quantity_Limit: Number(p.quantity_Limit ?? p.quantityLimit ?? p.limit ?? 1),
          is_Lifetime: Boolean(p.is_Lifetime || p.isLifetime || p.lifetime),
          isActive: Boolean(p.isActive !== undefined ? p.isActive : true),
        }));

        // إزالة التكرار بدقة باستخدام توحيد النصوص العربية (Deduplication)
        const seenIds = new Set<number>();
        const seenSignatures = new Set<string>();
        const plans: FeaturePlan[] = [];

        for (const plan of mappedPlans) {
          const normalizedName = normalizeArabicText(plan.name || plan.featureName || '');
          const sig = `${normalizedName}_${plan.price}`;
          if (plan.id && seenIds.has(plan.id)) continue;
          if (seenSignatures.has(sig)) continue;
          if (plan.id) seenIds.add(plan.id);
          seenSignatures.add(sig);
          plans.push(plan);
        }

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(cacheKey, JSON.stringify(plans));
          } catch {}
        }

        return {
          ...res,
          data: plans,
        };
      }
    } catch (e) {
      console.warn(`Feature plans fetch failed for type ${featureType}:`, e);
    }

    // استرجاع من الكاش المحلي إن وُجد
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          const rawCached = Array.isArray(parsed) ? parsed : [];
          const seen = new Set<string>();
          const cleanCached: FeaturePlan[] = [];
          for (const item of rawCached) {
            const normalizedName = normalizeArabicText(item.name || item.featureName || '');
            const key = item.id ? `id_${item.id}` : `${normalizedName}_${item.price}`;
            if (!seen.has(key)) {
              seen.add(key);
              cleanCached.push(item);
            }
          }
          return {
            success: true,
            data: cleanCached,
            statusCode: 200,
          };
        }
      } catch {}
    }

    return {
      success: false,
      data: [],
      statusCode: 500,
      message: 'تعذر جلب باقات الميزة المحددة',
    };
  },

  // 12. إنشاء رابط دفع باقة الاشتراك (POST Payments/CreateSubscriptionPayment)
  async createSubscriptionPayment(couponCode?: string): Promise<ApiResponse<{
    paymentUrl?: string;
    paymentURL?: string;
    url?: string;
    redirectUrl?: string;
    checkoutUrl?: string;
    paymentId?: string;
  }>> {
    return apiClient.post(API_ENDPOINTS.PAYMENTS.CREATE_SUBSCRIPTION_PAYMENT, {
      coupon_Code: couponCode ? couponCode.trim() : null,
    });
  },

  // 13. التحقق من نجاح الدفع (GET Payments/CheckPaymentStatusTester?paymentId=)
  async checkPaymentStatus(paymentId: string | number): Promise<ApiResponse<{ isSuccess?: boolean; status?: string; message?: string }>> {
    return apiClient.get(API_ENDPOINTS.PAYMENTS.CHECK_PAYMENT_STATUS_TESTER, {
      params: { paymentId },
    });
  },

  // 14. شراء باقة تصنيف منتجات (POST ProductPackages/PurchasePackage?planId=&categoryId=)
  async purchaseProductPackage(planId: number, categoryId: number): Promise<ApiResponse<unknown>> {
    return apiClient.post(API_ENDPOINTS.PRODUCT_PACKAGES.PURCHASE_PACKAGE, undefined, {
      params: {
        planId,
        categoryId,
      },
    });
  },

  // 15. تسجيل الخروج
  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('refresh_token');
      try {
        if (refreshToken) {
          await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, undefined, {
            params: { RefreshToken: refreshToken },
          });
        }
      } catch (e) {
        console.warn('Logout server request failed:', e);
      } finally {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('auth_user');
      }
    }
  },

  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem('auth_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  },
};

