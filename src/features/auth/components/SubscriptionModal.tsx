'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, ShieldCheck, Sparkles, X, ArrowLeft, CreditCard, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService, extractPaymentUrl } from '../services/authService';
import type { SubscriptionPlan } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  canDismiss?: boolean;
}

/**
 * 2.2 تدفق شراء الاشتراك (خطوات الشاشات)
 * AccountVerificationSubscriptionScreen -> GET Subscription/GetMyPlan -> زر "متابعة"
 * SubscriptionPaymentConfirmScreen -> كوبون خصم -> POST Payments/CreateSubscriptionPayment { coupon_Code? }
 * استخراج رابط الدفع من الاستجابة (data/paymentUrl/paymentURL/url/redirectUrl/checkoutUrl)
 * لو غير موجود: GET Payments/CheckPaymentStatusTester?paymentId=
 */
export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  canDismiss = true,
}) => {
  const { user, hasActiveSubscription, refreshSubscription } = useAuth();
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [paying, setPaying] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successInfo, setSuccessInfo] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;

    const fetchPlan = async () => {
      setLoading(true);
      try {
        const res = await authService.getMyPlan();
        if (res.success && res.data) {
          setPlan(res.data);
        } else {
          // خطة افتراضية حسب الدور إن لم يرد السيرفر
          setPlan({
            id: 'role-plan',
            title: user?.role === 'Customer' ? 'باقة المشتري والمزايد' : 'باقة التاجر والإسطبل المعتمد',
            description: 'تتيح لك استخدام كامل مميزات المنصة والمزايدة والتواصل الموثق',
            price: user?.role === 'Customer' ? 15 : 45,
            currency: 'د.ك',
            durationDays: 30,
            features: [
              'المزايدة الفورية في المزادات الحية للخيول العربية الأصيلة',
              'التواصل المباشر والآمن عبر المحادثات الخاصة مع البائعين',
              'إمكانية استخدام المنصة وفق ضوابط التوثيق الرسمية',
              'مشاهدة البثوث المباشرة مع التفاعل اللحظي',
            ],
          });
        }
      } catch {
        setPlan({
          id: 'default-plan',
          title: 'باقة سوق الإبل الرسمية',
          description: 'تفعيل كامل صلاحيات الحساب',
          price: 25,
          currency: 'د.ك',
          durationDays: 30,
          features: [
            'المزايدة الحية في كافة المزادات',
            'التواصل المباشر مع البائعين',
            'إشعارات فورية وتوثيق الصفقات',
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [isOpen, user?.role]);

  if (!isOpen || hasActiveSubscription) return null;

  const handleSubscribe = async () => {
    setPaying(true);
    setErrorMessage('');
    setSuccessInfo('');
    try {
      const res = await authService.createSubscriptionPayment(couponCode.trim() || undefined);
      if (res.success && res.data) {
        const data = res.data as any;
        const redirectUrl = extractPaymentUrl(data);

        // إذا كان هناك رابط دفع بنكي خارجي، يتم التحويل فوراً
        if (redirectUrl) {
          window.location.href = redirectUrl;
          return;
        }

        // إذا كانت البيئة تجريبية بدون رابط خارجي (Tester Mode)
        if (data.paymentId) {
          await authService.checkPaymentStatus(data.paymentId);
        }

        await refreshSubscription();
        setSuccessInfo('تم تفعيل الاشتراك بنجاح!');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          if (onClose) onClose();
        }, 1200);
      } else {
        setErrorMessage(res.message || 'تعذر بدء عملية الدفع حالياً. يرجى المحاولة لاحقاً');
      }
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : 'فشل في الاتصال ببوابة الدفع');
    } finally {
      setPaying(false);
    }
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'Customer':
        return 'المشتري';
      case 'StoreOwner':
        return 'صاحب المتجر';
      case 'StableOwner':
        return 'صاحب الإسطبل';
      case 'Advertiser':
        return 'المعلن التجاري';
      default:
        return 'المستخدم المعتمد';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in" dir="rtl">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-[#121212] border border-[#2B2B2B] p-6 sm:p-8 shadow-2xl text-right text-white overflow-hidden"
        style={{
          boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(209, 209, 209, 0.05)',
        }}
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-[#616161]/10 blur-3xl pointer-events-none" />

        {canDismiss && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full text-[#8E8E8E] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2B2B2B] to-[#616161] border border-[#D1D1D1]/30 flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-6 h-6 text-[#D1D1D1]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-[#D1D1D1] border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              باقة مخصصة لـ {getRoleLabel()}
            </div>
            <h2 className="text-xl font-bold text-white mt-1">تفعيل باقة الاشتراك الرسمية</h2>
          </div>
        </div>

        <p className="text-sm text-[#8E8E8E] mb-6 leading-relaxed">
          الاشتراك العام هو شرط إلزامي لحسابات ({getRoleLabel()}) لاستخدام مميزات المنصة والمزايدة والتفاعل.
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-900/30 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-[#616161] border-t-white animate-spin mb-3"></div>
            <p className="text-xs text-[#8E8E8E]">جاري تجهيز تفاصيل باقتك المعتمدة...</p>
          </div>
        ) : (
          plan && (
            <div className="space-y-5">
              <div className="rounded-2xl bg-[#1A1A1A] border border-[#2B2B2B] p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#8E8E8E]">قيمة الاشتراك</div>
                  <div className="text-2xl font-black text-white flex items-baseline gap-1 mt-0.5 font-mono">
                    <span>{plan.price}</span>
                    <span className="text-xs font-normal text-[#D1D1D1]">
                      {plan.currency || 'د.ك'} / {plan.durationDays ? `${plan.durationDays} يوم` : 'شهرياً'}
                    </span>
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-xs px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    تفعيل فوري
                  </span>
                </div>
              </div>

              {plan.features && plan.features.length > 0 && (
                <div className="space-y-2.5">
                  <div className="text-xs font-semibold text-[#D1D1D1]">مميزات باقة حسابك:</div>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#D1D1D1]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="coupon" className="block text-xs text-[#8E8E8E] mb-1.5 font-medium">
                  كوبون خصم (اختياري)
                </label>
                <input
                  id="coupon"
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="أدخل كود الخصم إن وجد"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E0E] border border-[#2B2B2B] text-white text-xs placeholder:text-[#616161] focus:outline-none focus:border-[#D1D1D1]"
                />
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleSubscribe}
                  disabled={paying}
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold text-black bg-gradient-to-r from-white via-[#F7F7F7] to-[#D1D1D1] hover:scale-[1.02] shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {paying ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin"></div>
                      <span>جاري التحويل لبوابة الدفع...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>متابعة والانتقال لبوابة الدفع</span>
                      <ArrowLeft className="w-4 h-4" />
                    </>
                  )}
                </button>

                {canDismiss && onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2 text-xs text-[#8E8E8E] hover:text-white transition-colors text-center cursor-pointer"
                  >
                    إلغاء والمتابعة كزائر
                  </button>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

