'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { SubscriptionModal } from './SubscriptionModal';

interface SubscriptionAccessGateProps {
  children: React.ReactNode;
  onAllowed?: () => void;
}

/**
 * 2.1 بوابة التحقق من الاشتراك (Subscription Gate)
 * آلية العمل حسب SUBSCRIPTION_AUCTION_SYSTEM.md:
 * 1. يُطبّق فقط على الأدوار: Customer, StoreOwner, StableOwner, Advertiser
 * 2. يستدعي GET Subscription/GetCurrentSubscription
 * 3. لو فشل الطلب بـ statusCode == 400 والرسالة تحتوي "لا يوجد اشتراك" أو "لا يوجد اشتراك حالي" -> يفتح شاشة شراء اشتراك ثم يعيد الفحص بعد الشراء
 * 4. أي فشل آخر -> عرض AppErrorWidget مع زر إعادة محاولة
 * 5. عند النجاح -> استدعاء onAllowed وعرض المحتوى
 */
export const SubscriptionAccessGate: React.FC<SubscriptionAccessGateProps> = ({
  children,
  onAllowed,
}) => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [checking, setChecking] = useState<boolean>(true);
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const checkSubscription = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setChecking(false);
      return;
    }

    // يُطبّق فقط على الأدوار المحددة (Customer, StoreOwner, StableOwner, Advertiser)
    const targetRoles = ['Customer', 'StoreOwner', 'StableOwner', 'Advertiser'];
    if (!targetRoles.includes(user.role)) {
      setHasSubscription(true);
      setChecking(false);
      if (onAllowed) onAllowed();
      return;
    }

    setChecking(true);
    setErrorMessage(null);

    try {
      const res = await authService.getCurrentSubscription();

      if (res.success && res.data) {
        const sub = res.data;
        const statusCode = Number(sub.status ?? 0);
        const isStatusActive = statusCode === 2 || sub.status === 'Active';
        const isLifetime = Boolean(sub.isLifetime);
        const remainingDays = Number(sub.remainingDays ?? 0);
        const notExpired = sub.endDate ? new Date(sub.endDate).getTime() > Date.now() : true;
        const isActive = (isStatusActive || isLifetime) && (isLifetime || (remainingDays > 0 && notExpired));

        if (isActive) {
          setHasSubscription(true);
          setShowSubscriptionModal(false);
          if (onAllowed) onAllowed();
        } else {
          // منتهي أو غير مفعل
          setHasSubscription(false);
          setShowSubscriptionModal(true);
        }
      } else {
        // فحص رمز الخطأ والرسالة
        const msg = (res.message || '').toLowerCase();
        const isNoSubscription =
          res.statusCode === 400 ||
          msg.includes('لا يوجد اشتراك') ||
          msg.includes('لا يوجد اشتراك حالي') ||
          msg.includes('no subscription');

        if (isNoSubscription) {
          setHasSubscription(false);
          setShowSubscriptionModal(true);
        } else {
          setErrorMessage(res.message || 'حدث خطأ أثناء التحقق من صلاحية الاشتراك');
        }
      }
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : 'فشل في الاتصال بخادم الاشتراكات');
    } finally {
      setChecking(false);
    }
  }, [isAuthenticated, user, onAllowed]);

  useEffect(() => {
    if (!authLoading) {
      checkSubscription();
    }
  }, [authLoading, checkSubscription]);

  if (authLoading || checking) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-black/90 text-white rounded-3xl border border-[#222]">
        <RefreshCw className="w-8 h-8 animate-spin text-[#8E8E8E] mb-3" />
        <p className="text-sm text-[#D1D1D1]">جاري التحقق من صلاحية الاشتراك الرسمي...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-[350px] flex flex-col items-center justify-center p-8 bg-[#121212] text-white rounded-3xl border border-red-500/30 text-center max-w-lg mx-auto my-8">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold mb-2">تعذر التحقق من الاشتراك</h3>
        <p className="text-xs text-[#8E8E8E] mb-6 leading-relaxed">{errorMessage}</p>
        <button
          type="button"
          onClick={checkSubscription}
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-black bg-white hover:bg-[#E5E5E5] transition-all flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <RefreshCw className="w-4 h-4" />
          <span>إعادة المحاولة</span>
        </button>
      </div>
    );
  }

  if (!hasSubscription) {
    return (
      <>
        <div className="min-h-[450px] flex flex-col items-center justify-center p-8 bg-[#0E0E0E] text-white rounded-3xl border border-amber-500/20 text-center max-w-lg mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4 shadow-lg">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold mb-2">الاشتراك العام مطلوب</h3>
          <p className="text-xs text-[#8E8E8E] mb-6 leading-relaxed">
            وفقاً لضوابط المنصة، يتطلب دور حسابك ({user?.role}) تفعيل اشتراك معتمد للوصول إلى هذه الميزة.
          </p>
          <button
            type="button"
            onClick={() => setShowSubscriptionModal(true)}
            className="px-8 py-3 rounded-xl text-sm font-bold text-black bg-gradient-to-r from-white via-[#F7F7F7] to-[#D1D1D1] hover:scale-105 transition-all cursor-pointer shadow-xl"
          >
            تفعيل الاشتراك الآن
          </button>
        </div>

        <SubscriptionModal
          isOpen={showSubscriptionModal}
          canDismiss={false}
          onSuccess={() => {
            setShowSubscriptionModal(false);
            checkSubscription();
          }}
          onClose={() => setShowSubscriptionModal(false)}
        />
      </>
    );
  }

  return <>{children}</>;
};
