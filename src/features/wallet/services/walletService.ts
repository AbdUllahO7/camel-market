import { apiClient } from '@/core/services/apiClient';
import { API_ENDPOINTS } from '@/config/api.endpoints';
import type { ApiResponse } from '@/types/common';

export interface WalletTransaction {
  id?: string | number;
  amount: number;
  type?: string | number;
  description?: string;
  createdAt?: string;
  isSuccess?: boolean;
}

export const walletService = {
  // 1. جلب رصيد المحفظة الحالي (GET Wallets/GetMyWallet)
  async getMyWallet(): Promise<ApiResponse<number>> {
    const res = await apiClient.get<any>(API_ENDPOINTS.WALLETS.GET_MY_WALLET);
    if (res.success && res.data !== undefined) {
      const balance = typeof res.data === 'number' ? res.data : Number(res.data?.balance ?? res.data?.amount ?? 0);
      return {
        ...res,
        data: balance,
      };
    }
    return res;
  },

  // 2. جلب سجل العمليات والمعاملات (GET Wallets/GetMyTransaction)
  async getMyTransactions(): Promise<ApiResponse<WalletTransaction[]>> {
    const res = await apiClient.get<any>(API_ENDPOINTS.WALLETS.GET_MY_TRANSACTION);
    if (res.success && res.data) {
      const list = Array.isArray(res.data) ? res.data : (res.data.items || res.data.data || []);
      return {
        ...res,
        data: list,
      };
    }
    return res;
  },

  // 3. شحن رصيد المحفظة (POST Payments/CreateWalletTopupPayment { amount })
  async createWalletTopup(amount: number): Promise<ApiResponse<{
    paymentUrl?: string;
    paymentURL?: string;
    url?: string;
    redirectUrl?: string;
    checkoutUrl?: string;
    paymentId?: string;
  }>> {
    return apiClient.post(API_ENDPOINTS.PAYMENTS.CREATE_WALLET_TOPUP_PAYMENT, {
      amount,
    });
  },

  // 4. التحقق من نجاح عملية الشحن (GET Payments/CheckPaymentStatusTester?paymentId=)
  async checkPaymentStatus(paymentId: string | number): Promise<ApiResponse<{ isSuccess?: boolean; status?: string }>> {
    return apiClient.get(API_ENDPOINTS.PAYMENTS.CHECK_PAYMENT_STATUS_TESTER, {
      params: { paymentId },
    });
  },
};
