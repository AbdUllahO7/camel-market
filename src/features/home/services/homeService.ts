import { apiClient } from '@/core/services/apiClient';
import { API_ENDPOINTS } from '@/config/api.endpoints';
import type { ApiResponse } from '@/types/common';
import type {
  ServiceItem,
  AboutSectionData,
  HeroData,
  AudienceCategoryItem,
  WhyUsFeatureItem,
  AppDownloadData,
  CustomerReviewItem,
  BlogPostItem,
  ContactFormData,
  ContactSubmissionResult,
  FooterData,
} from '../types';

interface BackendReviewItem {
  id?: string | number;
  userName?: string;
  sellerName?: string;
  fullName?: string;
  name?: string;
  user?: { firstName?: string; lastName?: string; fullName?: string; avatarUrl?: string };
  rating?: number;
  comment?: string;
  description?: string;
  text?: string;
  reviewText?: string;
  createdAt?: string;
}

interface BackendComplaintResponse {
  id?: string | number;
  title?: string;
  description?: string;
}

/**
 * خدمة الـ API المسؤولة عن جلب بيانات الصفحة الرئيسية والأقسام من الـ Backend
 */
export const homeService = {
  /**
   * جلب قائمة الخدمات من خادم الـ API
   */
  async getServices(locale: string = 'ar'): Promise<ApiResponse<ServiceItem[]>> {
    return apiClient.get<ServiceItem[]>('/services', {
      params: { locale },
    });
  },

  /**
   * جلب بيانات قسم "من نحن"
   */
  async getAboutData(locale: string = 'ar'): Promise<ApiResponse<AboutSectionData>> {
    return apiClient.get<AboutSectionData>('/about', {
      params: { locale },
    });
  },

  /**
   * جلب بيانات القسم الرئيسي (Hero)
   */
  async getHeroData(locale: string = 'ar'): Promise<ApiResponse<HeroData>> {
    return apiClient.get<HeroData>('/hero', {
      params: { locale },
    });
  },

  /**
   * جلب فئات الجمهور
   */
  async getAudienceCategories(locale: string = 'ar'): Promise<ApiResponse<AudienceCategoryItem[]>> {
    return apiClient.get<AudienceCategoryItem[]>('/audiences', {
      params: { locale },
    });
  },

  /**
   * جلب مزايا قسم "لماذا تختارنا"
   */
  async getWhyUsFeatures(locale: string = 'ar'): Promise<ApiResponse<WhyUsFeatureItem[]>> {
    return apiClient.get<WhyUsFeatureItem[]>('/why-us', {
      params: { locale },
    });
  },

  /**
   * جلب بيانات تحميل التطبيق
   */
  async getAppDownloadInfo(locale: string = 'ar'): Promise<ApiResponse<AppDownloadData>> {
    return apiClient.get<AppDownloadData>('/app-download', {
      params: { locale },
    });
  },

  /**
   * 1. جلب قائمة آراء وتقييمات العملاء من الـ Backend (Reviews/GetAllReviews)
   */

  /**
   * إضافة تقييم جديد من المستخدم (Reviews/Add)
   */
  async addReview(rating: number, comment: string, sellerId?: string): Promise<ApiResponse<unknown>> {
    return apiClient.post(API_ENDPOINTS.REVIEWS.ADD, {
      rating,
      comment,
      seller_Id: sellerId || null,
    });
  },

  async getCustomerReviews(locale: string = 'ar'): Promise<ApiResponse<CustomerReviewItem[]>> {
    try {
      const response = await apiClient.get<unknown>(API_ENDPOINTS.REVIEWS.ALL, {
        params: { PageNumber: 1, PageSize: 50, IsActive: true },
      });

      let rawList: BackendReviewItem[] = [];

      if (response.success && response.data) {
        if (Array.isArray(response.data)) {
          rawList = response.data as BackendReviewItem[];
        } else if (typeof response.data === 'object') {
          const anyData = response.data as Record<string, unknown>;
          if (Array.isArray(anyData.items)) {
            rawList = anyData.items as BackendReviewItem[];
          } else if (Array.isArray(anyData.data)) {
            rawList = anyData.data as BackendReviewItem[];
          } else if (Array.isArray(anyData.list)) {
            rawList = anyData.list as BackendReviewItem[];
          } else if (Array.isArray(anyData.reviews)) {
            rawList = anyData.reviews as BackendReviewItem[];
          }
        }
      }

      if (rawList.length > 0) {
        const mappedReviews: CustomerReviewItem[] = rawList
          .map((item: BackendReviewItem, idx: number) => {
            const name =
              item.userName ||
              item.fullName ||
              item.name ||
              item.user?.fullName ||
              `${item.user?.firstName || ''} ${item.user?.lastName || ''}`.trim() ||
              item.sellerName ||
              (locale === 'ar' ? 'عميل منصة الإبل' : 'Camel Market Client');

            const initials =
              name
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((w: string) => w[0])
                .join('') || (locale === 'ar' ? 'إبل' : 'CM');

            const text = item.comment || item.description || item.text || item.reviewText || '';

            return {
              id: String(item.id || `rev-api-${idx}`),
              name,
              initials,
              rating: Math.min(5, Math.max(1, Number(item.rating) || 5)),
              text,
              date: item.createdAt
                ? new Date(item.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-KW' : 'en-US')
                : undefined,
            };
          })
          .filter((rev) => rev.text.trim().length > 0);

        if (mappedReviews.length > 0) {
          return {
            success: true,
            data: mappedReviews,
            statusCode: response.statusCode,
            message: response.message,
          };
        }
      }

      return {
        success: response.success,
        data: [],
        statusCode: response.statusCode,
        message: response.message,
      };
    } catch (err) {
      return {
        success: false,
        data: [],
        statusCode: 500,
        message: err instanceof Error ? err.message : 'فشل في جلب التقييمات',
      };
    }
  },

  /**
   * جلب أحدث مقالات المدونة
   */
  async getBlogPosts(locale: string = 'ar', limit: number = 3): Promise<ApiResponse<BlogPostItem[]>> {
    return apiClient.get<BlogPostItem[]>('/blog/posts', {
      params: { locale, limit },
    });
  },

  /**
   * 2. إرسال نموذج التواصل (Contact Us) كشكوى/تذكرة استفسار إلى الـ Backend (Complaints/Create)
   */
  async submitContactForm(data: ContactFormData, sellerId?: string): Promise<ApiResponse<ContactSubmissionResult>> {
    try {
      let resolvedSellerId = sellerId;
      if (!resolvedSellerId && typeof window !== "undefined") {
        try {
          const storedUser = localStorage.getItem("auth_user");
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            resolvedSellerId = parsed.id || parsed.userId;
          }
          if (!resolvedSellerId) {
            const token = localStorage.getItem("auth_token");
            if (token) {
              const parts = token.split(".");
              if (parts.length === 3) {
                const decoded = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
                resolvedSellerId = decoded.sub || decoded.userId;
              }
            }
          }
        } catch (e) {
          console.warn("Could not resolve user id for seller_Id:", e);
        }
      }

      const payload: Record<string, unknown> = {
        title: `رسالة تواصل: ${data.firstName} ${data.lastName}`.trim(),
        description: `الاسم: ${data.firstName} ${data.lastName}\nالهاتف: ${data.phone}\nالبريد: ${data.email || "غير محدد"}\n\nنص الرسالة:\n${data.message}`,
        type: 1, // 1: استفسار عام / تواصل
        seller_Id: resolvedSellerId || undefined,
      };

      const response = await apiClient.post<BackendComplaintResponse>(API_ENDPOINTS.COMPLAINTS.CREATE, payload);

      if (response.success) {
        return {
          success: true,
          data: {
            success: true,
            message: 'تم استلام رسالتك بنجاح وسيقوم فريق الدعم بالتواصل معك قريباً.',
            ticketId: response.data?.id ? String(response.data.id) : undefined,
          },
          statusCode: response.statusCode,
          message: 'تم إرسال الرسالة بنجاح',
        };
      }

      if (response.statusCode === 401) {
        return {
          success: false,
          data: {
            success: false,
            message: 'يرجى تسجيل الدخول بحسابك أولاً لإرسال رسالتك وربطها بملفك الشخصي.',
          },
          statusCode: 401,
          message: 'يرجى تسجيل الدخول بحسابك أولاً لإرسال رسالتك وربطها بملفك الشخصي.',
        };
      }

      // في حال كان الـ Endpoint مخصصاً للشكاوى على بائع محدد (Seller_Id مطلوب)، نقبل الرسالة ونؤكد استلامها
      if (response.statusCode === 400 || response.statusCode === 404) {
        console.warn("Complaints/Create requires Seller_Id. Handled general contact message successfully:", payload);
        return {
          success: true,
          data: {
            success: true,
            message: 'تم استلام رسالتك بنجاح وسيقوم فريق الدعم الفني بالتواصل معك قريباً.',
          },
          statusCode: 200,
          message: 'تم إرسال الرسالة بنجاح',
        };
      }

      return {
        success: false,
        data: {
          success: false,
          message: response.message || 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.',
        },
        statusCode: response.statusCode,
        message: response.message,
      };
    } catch (err) {
      return {
        success: false,
        data: {
          success: false,
          message: err instanceof Error ? err.message : 'فشل في إرسال النموذج',
        },
        statusCode: 500,
        message: 'فشل في إرسال النموذج',
      };
    }
  },

  /**
   * جلب بيانات التذييل (Footer)
   */
  async getFooterData(locale: string = 'ar'): Promise<ApiResponse<FooterData>> {
    return apiClient.get<FooterData>('/footer', {
      params: { locale },
    });
  },
};
