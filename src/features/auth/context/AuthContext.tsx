'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import {
  type User,
  type VerificationStatus,
  type RegisterPayload,
  type CurrentSubscription,
  type SubscriptionPlan,
  type UserRole,
  UserVerificationStatus,
  parseVerificationStatus,
} from '../types';

export interface LoginResult {
  success: boolean;
  message?: string;
  status?: VerificationStatus;
  verificationState?: UserVerificationStatus;
  rejectionReason?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  verificationStatus: VerificationStatus;
  verificationState: UserVerificationStatus;
  rejectionReason: string | null;
  subscription: CurrentSubscription | null;
  userPlan: SubscriptionPlan | null;
  hasActiveSubscription: boolean;
  login: (phone_Number: string, password: string) => Promise<LoginResult>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; message?: string }>;
  verifyOtp: (phone: string, code: string) => Promise<{ success: boolean; message?: string }>;
  resendOtp: (phoneNumber: string) => Promise<{ success: boolean; message?: string }>;
  checkVerificationStatus: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  logout: () => Promise<void>;
  setUserRole: (role: UserRole) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('none');
  const [verificationState, setVerificationState] = useState<UserVerificationStatus>(UserVerificationStatus.Unknown);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<CurrentSubscription | null>(null);
  const [userPlan, setUserPlan] = useState<SubscriptionPlan | null>(null);

  // تحديث بيانات الاشتراك والخطة لدور المستخدم
  const refreshSubscription = useCallback(async () => {
    try {
      const [subRes, planRes] = await Promise.all([
        authService.getCurrentSubscription(),
        authService.getMyPlan(),
      ]);

      if (subRes.success && subRes.data) {
        setSubscription(subRes.data);
        const isActive = Boolean(
          subRes.data.hasActiveSubscription ||
          subRes.data.isActive ||
          subRes.data.status === 2 ||
          subRes.data.subscriptionId
        );
        if (isActive) {
          setUser((prev) => {
            if (!prev) return prev;
            const updated = { ...prev, hasActiveSubscription: true };
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem("auth_user", JSON.stringify(updated));
              } catch {}
            }
            return updated;
          });
        }
      }
      if (planRes.success && planRes.data) {
        setUserPlan(planRes.data);
      }
    } catch (e) {
      console.warn('Subscription fetch error:', e);
    }
  }, []);

  // فحص حالة التوثيق من السيرفر
  const checkVerificationStatus = useCallback(async () => {
    const currentToken = authService.getToken();
    if (!currentToken) {
      setVerificationStatus('none');
      setVerificationState(UserVerificationStatus.Unknown);
      return;
    }

    try {
      const res = await authService.getMyVerificationData();
      if (res.success && res.data) {
        const rawState =
          res.data.verificationState ??
          res.data.verificationStatus ??
          res.data.status ??
          (res.data.isApproved ? 2 : undefined);

        const vState = parseVerificationStatus(rawState);
        const reason = res.data.verificationRejectionReason || res.data.rejectionReason || null;

        setVerificationState(vState);

        switch (vState) {
          case UserVerificationStatus.Active:
            setVerificationStatus('approved');
            setRejectionReason(null);
            refreshSubscription();
            break;

          case UserVerificationStatus.Rejected:
            setVerificationStatus('rejected');
            setRejectionReason(reason || 'تم رفض التوثيق من قِبل الإدارة. يرجى مراجعة سبب الرفض أو التواصل مع الدعم.');
            break;

          case UserVerificationStatus.NeedModification:
            setVerificationStatus('need_modification');
            setRejectionReason(reason || 'ملفات التوثيق بحاجة لتعديل وإعادة رفع صور واضحة.');
            break;

          case UserVerificationStatus.Pending:
            setVerificationStatus('pending_approval');
            setRejectionReason(null);
            break;

          case UserVerificationStatus.Unknown:
          default: {
            const statusStr = String(res.data.status || '').toLowerCase();
            if (res.data.isApproved || statusStr === 'approved' || statusStr === 'active') {
              setVerificationStatus('approved');
              setRejectionReason(null);
              refreshSubscription();
            } else if (statusStr === 'rejected') {
              setVerificationStatus('rejected');
              setRejectionReason(reason || 'تم رفض التوثيق من قِبل الإدارة.');
            } else {
              setVerificationStatus('pending_approval');
              setRejectionReason(null);
            }
            break;
          }
        }
      }
    } catch (e) {
      console.warn("Verification check skipped or failed:", e);
    }
  }, [refreshSubscription]);

  // التهيئة واسترجاع الحالة عند تشغيل التطبيق
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = authService.getToken();
        let storedUser = authService.getStoredUser();

        if (storedToken) {
          setToken(storedToken);

          if (!storedUser) {
            try {
              const parts = storedToken.split('.');
              if (parts.length === 3) {
                const payloadStr = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
                const decoded = JSON.parse(payloadStr);
                const role = (decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role || 'StoreOwner') as UserRole;
                const phone = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded.name || '';
                storedUser = {
                  id: decoded.sub || decoded.userId,
                  fullName: 'مستخدم سوق الإبل',
                  phoneNumber: phone,
                  role,
                  isVerified: true,
                  verificationStatus: UserVerificationStatus.Active,
                  verificationState: UserVerificationStatus.Active,
                };
                if (typeof window !== 'undefined') {
                  localStorage.setItem('auth_user', JSON.stringify(storedUser));
                }
              }
            } catch (e) {
              console.warn('Failed to decode JWT fallback:', e);
            }
          }

          if (storedUser) {
            setUser(storedUser);

            const rawState =
              storedUser.verificationState ??
              storedUser.verificationStatus ??
              (storedUser.isVerified ? 2 : undefined) ??
              2;

            const vState = parseVerificationStatus(rawState);
            const reason = storedUser.verificationRejectionReason || storedUser.rejectionReason || null;
            setVerificationState(vState);

            switch (vState) {
              case UserVerificationStatus.Active:
                setVerificationStatus('approved');
                break;
              case UserVerificationStatus.Rejected:
                setVerificationStatus('rejected');
                setRejectionReason(reason);
                break;
              case UserVerificationStatus.NeedModification:
                setVerificationStatus('need_modification');
                setRejectionReason(reason);
                break;
              case UserVerificationStatus.Pending:
                setVerificationStatus('pending_approval');
                break;
              default:
                setVerificationStatus('approved');
                break;
            }
            refreshSubscription();
          } else {
            setVerificationStatus('approved');
            setVerificationState(UserVerificationStatus.Active);
          }

          checkVerificationStatus();
        } else {
          setToken(null);
          setUser(null);
          setVerificationStatus('none');
          setVerificationState(UserVerificationStatus.Unknown);
        }
      } catch (err) {
        console.error('Auth initialization failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const handleSessionExpired = (e: Event) => {
      const customEvent = e as CustomEvent<{ message?: string }>;
      setUser(null);
      setToken(null);
      setVerificationStatus('none');
      setVerificationState(UserVerificationStatus.Unknown);
      alert(customEvent.detail?.message || 'انتهت جلستك، يرجى إعادة تسجيل الدخول');
      startTransition(() => {
        router.push('/auth/login');
      });
    };

    window.addEventListener('camel:session_expired', handleSessionExpired);
    return () => {
      window.removeEventListener('camel:session_expired', handleSessionExpired);
    };
  }, [checkVerificationStatus, refreshSubscription, router]);

  // 1. تسجيل الدخول
  const login = async (phone_Number: string, password: string): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const res = await authService.login({ phone_Number, password });
      if (!res.success) {
        setIsLoading(false);
        return { success: false, message: res.message || 'فشل في تسجيل الدخول. تأكد من البيانات المدخلة' };
      }

      const authToken = res.data?.token || res.data?.accessToken || '';
      setToken(authToken);

      const vRawState =
        res.data?.verificationStatus ??
        res.data?.verificationState ??
        res.data?.status ??
        2;

      const vState = parseVerificationStatus(vRawState);
      const role = (res.data?.role as UserRole) || 'Customer';
      const reason =
        res.data?.rejectReason ||
        res.data?.rejectionReason ||
        res.data?.verificationRejectionReason ||
        null;

      const responseUser: User = res.data?.user || {
        id: res.data?.userId,
        fullName: res.data?.fullName || 'مستخدم سوق الإبل',
        phoneNumber: res.data?.phone || phone_Number,
        role,
        isVerified: vState === UserVerificationStatus.Active || res.data?.status === 2 || !!res.data?.isVerified,
        verificationStatus: vState,
        verificationState: vState,
        rejectionReason: reason || undefined,
        avatarUrl: res.data?.profileImage || undefined,
      };

      setUser(responseUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_user', JSON.stringify(responseUser));
      }



      setVerificationState(vState);

      let status: VerificationStatus = 'pending_approval';

      // معالجة الحالات الرسمية بناءً على UserVerificationStatus
      switch (vState) {
        case UserVerificationStatus.Active:
          status = 'approved';
          setVerificationStatus('approved');
          setRejectionReason(null);
          await refreshSubscription();
          break;

        case UserVerificationStatus.Pending:
          status = 'pending_approval';
          setVerificationStatus('pending_approval');
          setRejectionReason(null);
          break;

        case UserVerificationStatus.Rejected:
          status = 'rejected';
          setVerificationStatus('rejected');
          setRejectionReason(reason || 'تم رفض التوثيق من قِبل الإدارة');
          break;

        case UserVerificationStatus.NeedModification:
          status = 'need_modification';
          setVerificationStatus('need_modification');
          setRejectionReason(reason || 'ملفات التوثيق بحاجة لتعديل وإعادة رفع');
          break;

        case UserVerificationStatus.Unknown:
        default:
          if (res.data?.isVerified || responseUser.isVerified) {
            status = 'approved';
            setVerificationStatus('approved');
            setRejectionReason(null);
            await refreshSubscription();
          } else {
            status = 'pending_approval';
            setVerificationStatus('pending_approval');
          }
          break;
      }

      setIsLoading(false);
      return {
        success: true,
        status,
        verificationState: vState,
        rejectionReason: reason,
      };
    } catch (e) {
      setIsLoading(false);
      return {
        success: false,
        message: e instanceof Error ? e.message : 'حدث خطأ غير متوقع أثناء تسجيل الدخول',
      };
    }
  };

  // 2. تسجيل حساب جديد
  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const res = await authService.register(payload);
      setIsLoading(false);
      if (!res.success) {
        return {
          success: false,
          message: res.message || 'فشل في إتمام التسجيل. يرجى مراجعة البيانات وصور الهوية',
        };
      }

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pending_verify_phone', payload.phoneNumber);
      }

      setVerificationStatus('pending_otp');
      return { success: true, message: res.message };
    } catch (e) {
      setIsLoading(false);
      return {
        success: false,
        message: e instanceof Error ? e.message : 'حدث خطأ في الاتصال بالخادم',
      };
    }
  };

  // 3. تأكيد OTP الواتساب
  const verifyOtp = async (phone: string, code: string) => {
    setIsLoading(true);
    try {
      const res = await authService.verifyOtp({ phone, code });
      setIsLoading(false);
      if (!res.success) {
        return {
          success: false,
          message: res.message || 'رمز التحقق غير صحيح أو انتهت صلاحيته',
        };
      }

      setVerificationStatus('pending_approval');
      if (res.data?.token || res.data?.accessToken) {
        setToken(res.data.token || res.data.accessToken || null);
      }
      return { success: true };
    } catch (e) {
      setIsLoading(false);
      return {
        success: false,
        message: e instanceof Error ? e.message : 'فشل في التحقق من الرمز',
      };
    }
  };

  // 4. إعادة إرسال OTP
  const resendOtp = async (phoneNumber: string) => {
    try {
      const res = await authService.resendOtp({ phoneNumber });
      return {
        success: res.success,
        message: res.message || (res.success ? 'تم إرسال كود جديد عبر الواتساب' : 'تعذر إرسال الرمز حالياً'),
      };
    } catch {
      return { success: false, message: 'فشل في طلب إعادة الإرسال' };
    }
  };

  // 5. تسجيل الخروج
  const logout = async () => {
    setIsLoading(true);
    await authService.logout();
    setUser(null);
    setToken(null);
    setVerificationStatus('none');
    setSubscription(null);
    setUserPlan(null);
    setIsLoading(false);
    startTransition(() => {
      router.push('/auth/login');
    });
  };

  const setUserRole = (role: UserRole) => {
    if (user) {
      const updated = { ...user, role };
      setUser(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_user', JSON.stringify(updated));
      }
    }
  };

  const isAuthenticated = !!token;
  const hasActiveSubscription = useMemo(() => {
    if (subscription) {
      if (subscription.hasActiveSubscription || subscription.isActive) return true;
      const isStatusActive = subscription.status === 2 || subscription.status === "Active" || subscription.status === 1;
      const hasDays = typeof subscription.remainingDays === "number" ? subscription.remainingDays > 0 : true;
      if (Boolean(subscription.subscriptionId) && isStatusActive && hasDays) return true;
    }
    if (user?.hasActiveSubscription) return true;
    return false;
  }, [subscription, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        verificationStatus,
        verificationState,
        rejectionReason,
        subscription,
        userPlan,
        hasActiveSubscription,
        login,
        register,
        verifyOtp,
        resendOtp,
        checkVerificationStatus,
        refreshSubscription,
        logout,
        setUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
