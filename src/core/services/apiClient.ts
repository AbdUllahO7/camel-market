import { APP_CONFIG } from '@/config/app.config';
import type { ApiResponse, QueryParams } from '@/types/common';

export interface RequestOptions extends RequestInit {
  params?: QueryParams;
  token?: string;
}

/**
 * Central HTTP client for Backend communication.
 * Complies with SUBSCRIPTION_AUCTION_SYSTEM.md:
 * - Base headers: Accept: application/json, Accept-Language: ar, lang: ar, Authorization: Bearer {token}, Content-Type: application/json (except multipart)
 * - Automatic session expiration on HTTP 405 or body statusCode == 405 (and 401).
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = APP_CONFIG.apiBaseUrl) {
    this.baseUrl = baseUrl;
  }

  private buildUrl(endpoint: string, params?: QueryParams): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = new URL(`${this.baseUrl}${cleanEndpoint}`, typeof window !== 'undefined' ? window.location.origin : 'https://localhost:3000');
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('auth_token');
    if (!token) return null;
    return token.replace(/^Bearer\s+/i, '').replace(/^"|"$/g, '').trim();
  }

  private handleSessionExpiration(message?: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
    window.dispatchEvent(
      new CustomEvent('camel:session_expired', {
        detail: { message: message || 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً' },
      })
    );
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { params, token, headers: customHeaders, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);
    const authToken = token || this.getAuthToken();

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': 'ar',
      'lang': 'ar',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(customHeaders as Record<string, string>),
    };

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      const text = await response.text();
      let data: any = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }
      }

      // 405 Session Expiration check according to SUBSCRIPTION_AUCTION_SYSTEM.md
      const is405 = response.status === 405 || data?.statusCode === 405;
      const is401 = response.status === 401 || data?.statusCode === 401;

      if (is405 || is401) {
        this.handleSessionExpiration(data?.message || 'انتهت الجلسة، يرجى تسجيل الدخول مجدداً');
      }

      if (!response.ok) {
        if (response.status >= 500) {
          console.error('[apiClient SERVER ERROR]', response.status, JSON.stringify(data));
        }
        let errorMsg = data?.message;
        if (!errorMsg && data?.errors && typeof data.errors === 'object') {
          const vals = Object.entries(data.errors).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`);
          if (vals.length > 0) errorMsg = vals.join(' | ');
        }
        if (!errorMsg && data?.title) {
          errorMsg = data.title;
        }

        return {
          success: false,
          data: null as unknown as T,
          statusCode: data?.statusCode || response.status,
          message: errorMsg || `HTTP Error: ${response.status} ${response.statusText}`,
          errors: data?.errors,
        };
      }

      return {
        success: data?.success !== undefined ? Boolean(data.success) : true,
        data: data?.data !== undefined ? data.data : (data as T),
        statusCode: data?.statusCode || response.status,
        message: data?.message,
        errors: data?.errors,
      };
    } catch (error) {
      return {
        success: false,
        data: null as unknown as T,
        statusCode: 500,
        message: error instanceof Error ? error.message : 'فشل في الاتصال بخادم الـ Backend',
      };
    }
  }

  public get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', ...options });
  }

  public post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options,
    });
  }

  public put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options,
    });
  }

  public patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options,
    });
  }

  public delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', ...options });
  }

  // رفع الصور والملفات بصيغة Multipart FormData مع Query Params وبدون Content-Type
  public async upload<T>(
    endpoint: string,
    formData: FormData,
    options?: { params?: QueryParams; token?: string } | string
  ): Promise<ApiResponse<T>> {
    const opts = typeof options === 'string' ? { token: options } : options;
    const url = this.buildUrl(endpoint, opts?.params);
    const authToken = opts?.token || this.getAuthToken();

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'ar',
          'lang': 'ar',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: formData,
      });

      const text = await response.text();
      let data: any = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }
      }

      // 405 Session Expiration check
      const is405 = response.status === 405 || data?.statusCode === 405;
      const is401 = response.status === 401 || data?.statusCode === 401;

      if (is405 || is401) {
        this.handleSessionExpiration(data?.message || 'انتهت الجلسة، يرجى تسجيل الدخول مجدداً');
      }

      if (!response.ok) {
        let errorMsg = data?.message;
        if (!errorMsg && data?.errors && typeof data.errors === 'object') {
          const vals = Object.entries(data.errors).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`);
          if (vals.length > 0) errorMsg = vals.join(' | ');
        }
        if (!errorMsg && data?.title) {
          errorMsg = data.title;
        }

        return {
          success: false,
          data: null as unknown as T,
          statusCode: data?.statusCode || response.status,
          message: errorMsg || `HTTP Error: ${response.status} ${response.statusText}`,
          errors: data?.errors,
        };
      }

      return {
        success: data?.success !== undefined ? Boolean(data.success) : true,
        data: data?.data !== undefined ? data.data : (data as T),
        statusCode: data?.statusCode || response.status,
        message: data?.message,
        errors: data?.errors,
      };
    } catch (error) {
      return {
        success: false,
        data: null as unknown as T,
        statusCode: 500,
        message: error instanceof Error ? error.message : 'فشل في رفع الملف',
      };
    }
  }
}

export const apiClient = new ApiClient();

