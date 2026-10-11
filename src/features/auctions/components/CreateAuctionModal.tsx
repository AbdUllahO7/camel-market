'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Plus, Upload, CheckCircle2, AlertCircle, Sparkles, Trash2, Wallet } from "lucide-react";
import { auctionsService } from "../services/auctionsService";
import { WalletModal } from "@/features/wallet/components/WalletModal";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useToast } from "@/core/context/ToastContext";
import type { FeaturePlan } from "@/features/auth/types";

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

function toEnglishDigits(text: string): string {
  if (!text) return '';
  return text
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776));
}

interface CreateAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * 3.2 إنشاء مزاد (Create Auction)
 * - يظهر لـ StoreOwner و StableOwner فقط
 * - التحقق: Title, Address, Description, Start_Price إلزامية، Start_Price >= 0
 * - الحد الأقصى للصور: 6 صور
 * - باقة من نوع auction (FeaturePlanId) إلزامية. وإن لم توجد باقات يُمنع الإرسال برسالة "لا توجد خطط متاحة لنشر المزاد"
 * - في حال فشل الشراء برمز 407 (الرصيد غير كافي) -> التوجيه للمحفظة
 */
export const CreateAuctionModal: React.FC<CreateAuctionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [startPrice, setStartPrice] = useState<number | "">("");
  const [priceInput, setPriceInput] = useState<string>("");
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const handlePriceChange = (val: string) => {
    const englishVal = toEnglishDigits(val);
    // Allow digits and at most one decimal point
    const cleaned = englishVal.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    const sanitized = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : cleaned;

    setPriceInput(sanitized);
    if (sanitized === "" || isNaN(Number(sanitized))) {
      setStartPrice("");
    } else {
      setStartPrice(Number(sanitized));
    }
  };

  const handleQuickPriceAdjust = (delta: number) => {
    const current = typeof startPrice === "number" ? startPrice : 0;
    const next = Math.max(0, current + delta);
    setPriceInput(String(next));
    setStartPrice(next);
  };
  const [plans, setPlans] = useState<FeaturePlan[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [walletRequiredAmount, setWalletRequiredAmount] = useState<number>(0);

  // جلب باقات المزاد من السيرفر (featureType=1)
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoadingPlans(true);
    setErrorMessage(null);

    auctionsService.getAuctionFeaturePlans()
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.data && res.data.length > 0) {
          const activePlans = res.data.filter((p) => p.isActive);
          const rawList = activePlans.length > 0 ? activePlans : res.data;
          
          // منع أي تكرار محتمل بتوحيد النصوص العربية
          const seen = new Set<string>();
          const uniqueList: FeaturePlan[] = [];
          for (const item of rawList) {
            const normalizedName = normalizeArabicText(item.name || item.featureName || '');
            const key = item.id ? `id_${item.id}` : `${normalizedName}_${item.price}`;
            if (!seen.has(key)) {
              seen.add(key);
              uniqueList.push(item);
            }
          }

          setPlans(uniqueList);
          if (uniqueList.length > 0) {
            setSelectedPlanId(uniqueList[0].id);
          }
        } else {
          setPlans([]);
          setSelectedPlanId(null);
        }
      })
      .catch(() => {
        if (isMounted) setPlans([]);
      })
      .finally(() => {
        if (isMounted) setIsLoadingPlans(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // التحقق من الصلاحية: يُسمح فقط لـ StoreOwner و StableOwner
  const isSellerRole = user?.role === "StoreOwner" || user?.role === "StableOwner";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    if (images.length + newFiles.length > 6) {
      setErrorMessage("الحد الأقصى للصور هو 6 صور فقط.");
      return;
    }

    setErrorMessage(null);
    setImages((prev) => [...prev, ...newFiles]);
    const newUrls = newFiles.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newUrls]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isAuthenticated) {
      setErrorMessage("يرجى تسجيل الدخول بحساب بائع معتمد لإنشاء مزاد.");
      return;
    }

    if (!isSellerRole) {
      setErrorMessage("إنشاء المزادات متاح فقط لأصحاب المتاجر والإسطبلات المعتمدين.");
      return;
    }

    if (plans.length === 0 || !selectedPlanId) {
      setErrorMessage("لا توجد خطط متاحة لنشر المزاد.");
      return;
    }

    if (!title.trim() || !address.trim() || !description.trim()) {
      setErrorMessage("جميع الحقول (العنوان، الموقع، التفاصيل) إلزامية.");
      return;
    }

    if (startPrice === "" || Number(startPrice) < 0) {
      setErrorMessage("سعر بداية المزاد يجب أن يكون رقماً أكبر من أو يساوي 0.");
      return;
    }

    if (images.length === 0) {
      setErrorMessage("يرجى رفع صورة واحدة على الأقل للالإبل المعروض.");
      return;
    }

    if (images.length > 6) {
      setErrorMessage("الحد الأقصى للصور هو 6 صور.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await auctionsService.createAuction({
        title: title.trim(),
        description: description.trim(),
        address: address.trim(),
        startPrice: Number(startPrice),
        featurePlanId: selectedPlanId,
        images,
      });

      if (res.success) {
        const succMsg = "تم إنشاء المزاد بنجاح ونشره على المنصة!";
        setSuccessMessage(succMsg);
        toast.success(succMsg, "تم النشر بنجاح");
        setPriceInput("");
        setStartPrice("");
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 1500);
      } else {
        const is407 =
          res.statusCode === 407 ||
          (res.message && res.message.includes("الرصيد غير كافي")) ||
          (res.message && res.message.toLowerCase().includes("insufficient"));

        if (is407) {
          const selectedPlan = plans.find((p) => p.id === selectedPlanId);
          setWalletRequiredAmount(selectedPlan?.price || 10);
          setShowWalletModal(true);
        } else {
          let msg = res.message || "فشل في إنشاء المزاد، يرجى مراجعة البيانات.";
          if (msg.includes("Failed to fetch")) {
            msg = "تعذر الاتصال بالخادم. يرجى التحقق من تسجيل الدخول بحساب بائع معتمد وتوفر رصيد كافٍ في المحفظة.";
          }
          setErrorMessage(msg);
        }
      }
    } catch (err) {
      let msg = err instanceof Error ? err.message : "حدث خطأ غير متوقع أثناء إرسال المزاد";
      if (msg.includes("Failed to fetch")) {
        msg = "تعذر إرسال المزاد إلى الخادم (Failed to fetch). يرجى التأكد من تسجيل الدخول بحساب بائع معتمد.";
      }
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in" dir="rtl">
        <div
          className="relative w-full max-w-2xl rounded-t-[32px] sm:rounded-[30px] bg-[#0E0E0E] border-t sm:border border-[#2B2B2B] p-6 sm:p-8 shadow-2xl text-white overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 duration-300"
          style={{
            boxShadow: "0 30px 80px rgba(0, 0, 0, 0.95), 0 0 50px rgba(255, 255, 255, 0.05)",
          }}
        >
          {/* شريط السحب على الهاتف المحمول (Mobile Drag Handle) */}
          <div className="w-12 h-1.5 bg-zinc-700/80 rounded-full mx-auto -mt-2 mb-3 sm:hidden shrink-0" />

          {/* زر الإغلاق */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 left-5 p-2 rounded-full text-[#8E8E8E] hover:text-white hover:bg-white/10 transition-colors z-20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* رأس النافذة */}
          <div className="flex items-center justify-between mb-6 border-b border-[#222222] pb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2B2B2B] to-[#454545] border border-[#D1D1D1]/30 flex items-center justify-center text-white shadow-lg shrink-0">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-[#D1D1D1] mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  صاحب متجر / صاحب إسطبل
                </div>
                <h3 className="text-xl font-bold text-white">إنشاء مزاد الإبل جديد</h3>
              </div>
            </div>

            {/* زر فحص وشحن المحفظة السريع */}
            <button
              type="button"
              onClick={() => {
                const selectedPlan = plans.find((p) => p.id === selectedPlanId);
                setWalletRequiredAmount(selectedPlan?.price || 10);
                setShowWalletModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ml-8"
              title="عرض رصيد المحفظة والشحن"
            >
              <Wallet className="w-4 h-4" />
              <span>محفظتي</span>
            </button>
          </div>

          {/* رسائل التنبيه والنجاح */}
          {successMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const selectedPlan = plans.find((p) => p.id === selectedPlanId);
                  setWalletRequiredAmount(selectedPlan?.price || 10);
                  setShowWalletModal(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 border border-red-400/30 text-white text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
              >
                شحن المحفظة
              </button>
            </div>
          )}

          {!isSellerRole ? (
            <div className="py-12 text-center text-zinc-400 space-y-3">
              <p className="text-sm font-bold text-white">خاصية إنشاء المزادات متاحة للبائعين فقط</p>
              <p className="text-xs">
                حسابك الحالي مسجل كـ ({user?.role || "مشتري"}). لإنشاء المزادات يرجى التسجيل بحساب صاحب متجر أو إسطبل.
              </p>
            </div>
          ) : (
            /* نموذج إنشاء المزاد */
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 overflow-y-auto pr-1 flex-1">
              {/* عنوان المزاد */}
              <div>
                <label className="block text-xs font-bold text-[#D1D1D1] mb-1.5">
                  عنوان المزاد واسم الإبل *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: مهر عربي مصري أصيل خطوط الشقب (دي سراج)"
                  className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-[#2B2B2B] text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#FFFFFF] transition-colors"
                />
              </div>

              {/* سعر البداية والموقع */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#D1D1D1]">
                      سعر بداية المزاد (Start Price) *
                    </label>
                    <span className="text-[11px] text-amber-300 font-bold font-mono">د.ك</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="decimal"
                      required
                      value={priceInput}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      placeholder="أدخل السعر (مثال: 500)"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#161616] border border-[#2B2B2B] text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#FFFFFF] transition-colors font-bold font-mono"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8E8E8E] font-mono pointer-events-none">
                      د.ك
                    </span>
                  </div>

                  {/* أزرار زيادة سريعة وتحكم سلس بالمبلغ */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="text-[10px] text-[#777] shrink-0">زيادة سريعة:</span>
                    {[50, 100, 250, 500, 1000].map((inc) => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => handleQuickPriceAdjust(inc)}
                        className="px-2 py-1 rounded-lg text-[11px] font-bold font-mono bg-[#1C1C1C] hover:bg-white hover:text-black border border-[#2E2E2E] transition-all cursor-pointer"
                        title={`إضافة ${inc} د.ك`}
                      >
                        +{inc}
                      </button>
                    ))}
                    {priceInput !== "" && (
                      <button
                        type="button"
                        onClick={() => {
                          setPriceInput("");
                          setStartPrice("");
                        }}
                        className="px-2 py-1 rounded-lg text-[10px] text-zinc-400 hover:text-white bg-transparent hover:bg-white/5 transition-all cursor-pointer mr-auto"
                      >
                        مسح
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#D1D1D1] mb-1.5">
                    الموقع / العنوان (Address) *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="مثال: الكويت - الوفرة"
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-[#2B2B2B] text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#FFFFFF] transition-colors"
                  />
                </div>
              </div>

              {/* باقة المزاد (FeaturePlanId) */}
              <div>
                <label className="block text-xs font-bold text-[#D1D1D1] mb-2">
                  اختر باقة نشر المزاد (FeaturePlan) *
                </label>
                {isLoadingPlans ? (
                  <div className="py-4 text-xs text-[#8E8E8E] text-center">جاري تحميل باقات المزادات...</div>
                ) : plans.length === 0 ? (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs">
                    لا توجد خطط متاحة لنشر المزاد.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {plans.map((plan) => {
                      const isSelected = selectedPlanId === plan.id;
                      return (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => setSelectedPlanId(plan.id)}
                          className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? "bg-[#1F1F1F] border-[#FFFFFF] shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                              : "bg-[#141414] border-[#2B2B2B] hover:border-[#666]"
                          }`}
                        >
                          <span className="text-xs font-bold text-white leading-tight">{plan.name}</span>
                          <span className="text-sm font-black text-amber-300 mt-2 font-mono">
                            {plan.price} د.ك
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* تفاصيل المزاد */}
              <div>
                <label className="block text-xs font-bold text-[#D1D1D1] mb-1.5">
                  تفاصيل ووصف المزاد (Description) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اكتب مواصفات الإبل، السلالة، شهادات الفحص، وتفاصيل التسليم..."
                  className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-[#2B2B2B] text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#FFFFFF] transition-colors resize-none"
                />
              </div>

              {/* رفع صور الإبل (الحد الأقصى 6 صور) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#D1D1D1]">
                    صور المزاد (Images) * (الحد الأقصى: 6 صور)
                  </label>
                  <span className="text-[11px] text-[#8E8E8E] font-mono">
                    {images.length} / 6
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {previews.map((url, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#333] group">
                      <Image src={url} alt="preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute inset-0 bg-red-950/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {images.length < 6 && (
                    <label className="w-20 h-20 rounded-xl border border-dashed border-[#444] hover:border-white bg-[#141414] flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors">
                      <Upload className="w-5 h-5 text-[#8E8E8E]" />
                      <span className="text-[10px] text-[#8E8E8E]">إضافة صورة</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* زر التأكيد والنشر */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting || plans.length === 0}
                  className="w-full py-3.5 px-4 rounded-xl text-base font-bold text-black bg-gradient-to-r from-[#FFFFFF] via-[#F7F7F7] to-[#D1D1D1] hover:scale-[1.02] shadow-[0_4px_25px_rgba(255,255,255,0.2)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>جاري نشر المزاد...</span>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>تأكيد ونشر المزاد الآن</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* نافذة المحفظة عند وجود خطأ 407 (رصيد غير كافٍ) */}
      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        requiredAmount={walletRequiredAmount}
        initialMessage="الرصيد في محفظتك غير كافٍ لتفعيل باقة المزاد. يرجى شحن المحفظة للمتابعة."
      />
    </>
  );
};

