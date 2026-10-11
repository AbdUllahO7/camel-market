'use client';

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, LayoutGrid, Sliders, Star, Plus, CheckCircle2, AlertCircle, X } from "lucide-react";
import { useLanguage } from "@/i18n";
import { SectionDivider } from "./SectionDivider";
import { useCustomerReviews } from "../hooks/useCustomerReviews";
import { useAuth } from "@/features/auth/context/AuthContext";

export const CustomerReviewsSection = () => {
  const { t } = useLanguage();
  const { reviews, isLoading, addReview } = useCustomerReviews();
  const { isAuthenticated, user } = useAuth();
  const trackRef = useRef<HTMLDivElement>(null);

  // أنماط العرض: إما سلايدر أفقي أو شبكة كاملة لعرض كافة الآراء
  const [viewMode, setViewMode] = useState<"slider" | "grid">("slider");
  const [activeCardId, setActiveCardId] = useState<string>("");

  // حالة نافذة إضافة تقييم
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // السحب بالفأرة
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    if (reviews.length > 0 && !activeCardId) {
      setActiveCardId(reviews[0].id);
    }
  }, [reviews, activeCardId]);

  // أزرار التنقل السلس (التالي والسابق)
  const scrollNext = () => {
    if (!trackRef.current) return;
    const cardWidth = 440;
    trackRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
  };

  const scrollPrev = () => {
    if (!trackRef.current) return;
    const cardWidth = 440;
    trackRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
  };

  // معالجة السحب
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - trackRef.current.offsetLeft);
    setScrollLeft(trackRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewMessage(null);

    if (!comment.trim()) {
      setReviewMessage({ type: "error", text: "يرجى كتابة نص التقييم أو رأيك بالخدمة." });
      return;
    }

    try {
      setIsSubmittingReview(true);
      const res = await addReview(rating, comment.trim());
      if (res.success) {
        setReviewMessage({ type: "success", text: "شكراً لتقييمك! تم إرسال رأيك بنجاح." });
        setComment("");
        setTimeout(() => {
          setIsAddReviewModalOpen(false);
          setReviewMessage(null);
        }, 1500);
      } else {
        const errorText =
          res.statusCode === 401
            ? "يرجى تسجيل الدخول بحسابك أولاً لتتمكن من إضافة تقييمك."
            : res.message || "فشل في إرسال التقييم، يرجى المحاولة لاحقاً.";
        setReviewMessage({ type: "error", text: errorText });
      }
    } catch {
      setReviewMessage({ type: "error", text: "حدث خطأ غير متوقع أثناء إرسال التقييم." });
    } finally {
      setIsSubmittingReview(false);
    }
  };



  return (
    <section id="reviews" className="w-full py-20 lg:py-28 bg-[#000000] text-white relative overflow-hidden" dir="rtl">
      <div className="max-w-[1700px] mx-auto flex flex-col gap-10 sm:gap-14">
        
        {/* 1. رأس القسم المركزي */}
        <div className="flex flex-col items-center justify-center text-center gap-3 px-4">
          <span className="text-xl sm:text-2xl lg:text-[30px] font-normal text-white leading-[33px]">
            {t.reviewsSection.badge}
          </span>
          
          <SectionDivider />

          <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-white leading-tight max-w-4xl px-2">
            {t.reviewsSection.heading}
          </h2>

          <p className="text-sm sm:text-base text-[#8E8E8E] max-w-xl mt-1">
            آراء وتجارب حقيقية من ملاك الإبل والمربين والمشترين الذين وثقوا منصتنا لتجارة خيولهم الأصيلة.
          </p>
        </div>

        {/* 2. شريط الأدوات: أزرار التبديل وأزرار التنقل السهمية وزر إضافة تقييم */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 sm:px-12 border-b border-[#222222] pb-5">
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-bold text-white">
              كافة التقييمات المعتمدة ({reviews.length})
            </span>

            {/* زر تبديل العرض: سلايدر أو شبكة كاملة */}
            <div className="flex items-center bg-[#141414] border border-[#2B2B2B] rounded-xl p-1">
              <button
                type="button"
                onClick={() => setViewMode("slider")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "slider" ? "bg-white text-black shadow" : "text-[#8E8E8E] hover:text-white"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>سلايدر متتابع</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "grid" ? "bg-white text-black shadow" : "text-[#8E8E8E] hover:text-white"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>عرض الكل بشبكة</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* زر إضافة تقييم */}
            <button
              type="button"
              onClick={() => setIsAddReviewModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-black bg-gradient-to-r from-[#FFFFFF] via-[#F7F7F7] to-[#D1D1D1] hover:scale-105 transition-all shadow-[0_4px_15px_rgba(255,255,255,0.15)] flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>أضف رأيك</span>
            </button>

            {/* أزرار الأسهم في وضع السلايدر */}
            {viewMode === "slider" && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={scrollPrev}
                  className="w-9 h-9 rounded-xl bg-[#141414] hover:bg-[#252525] border border-[#333] text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="التقييم السابق"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={scrollNext}
                  className="w-9 h-9 rounded-xl bg-[#141414] hover:bg-[#252525] border border-[#333] text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="التقييم التالي"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3. عرض التقييمات حسب النمط المختار */}
        {isLoading && reviews.length === 0 ? (
          <div className="w-full py-16 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-zinc-400 text-sm">
              <div className="w-8 h-8 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
              <span>جاري تحميل آراء العملاء...</span>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          /* النمط الأول: شبكة كاملة تعرض كافة التقييمات في نفس الوقت (Grid View) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-6 sm:px-12">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-[#0E0E0E] border border-[#2B2B2B] hover:border-[#D1D1D1]/60 rounded-[20px] p-6 sm:p-7 flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between w-full mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/10 border border-[#D1D1D1] flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-lg">{review.initials}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-white text-base font-bold line-clamp-1">{review.name}</span>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-zinc-600"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="relative w-8 h-8 opacity-60 filter brightness-125">
                      <Image src="/icons/quote.svg" alt="quote" fill className="object-contain" />
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-[#D1D1D1] leading-relaxed text-right mt-2">
                    {review.text}
                  </p>
                </div>

                {review.date && (
                  <div className="text-xs text-zinc-500 text-left pt-4 border-t border-white/5 mt-4">
                    {review.date}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* النمط الثاني: السلايدر المتتابع الأفقي (Slider View) - تم إصلاح مشكلة الـ RTL والقص التلقائي بالكامل */
          <div
            ref={trackRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="w-full overflow-x-auto no-scrollbar scroll-smooth select-none py-6 pb-12 px-6 sm:px-12 cursor-grab"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {/* استخدام justify-start لضمان ظهور كافة الكروت بدون أي اقتطاع في بداية ونهاية المسار */}
            <div className="flex flex-row items-start justify-start gap-6 sm:gap-8 min-w-max">
              {reviews.map((review) => {
                const isSelected = review.id === activeCardId;

                return (
                  <div
                    id={`card-${review.id}`}
                    key={review.id}
                    onClick={() => setActiveCardId(review.id)}
                    className={`w-[320px] sm:w-[380px] lg:w-[420px] min-h-[320px] p-6 sm:p-8 rounded-[20px] cursor-pointer flex flex-col justify-between shrink-0 box-border transition-all duration-300 ${
                      isSelected
                        ? "bg-[#0E0E0E] border-2 border-[#D1D1D1] shadow-[0px_4px_30px_rgba(255,255,255,0.15)] opacity-100 translate-y-[10px] z-20"
                        : "bg-[#0A0A0A] border border-[#2B2B2B] shadow-lg opacity-85 hover:opacity-100 translate-y-0 z-10"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between w-full mb-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 border border-[#D1D1D1] flex items-center justify-center shrink-0">
                            <span className="text-white font-bold text-lg sm:text-xl">{review.initials}</span>
                          </div>

                          <div className="flex flex-col text-right gap-1">
                            <span className="text-white text-base sm:text-lg font-bold line-clamp-1">{review.name}</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-zinc-600"}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 opacity-70 filter brightness-125">
                          <Image src="/icons/quote.svg" alt="quote" fill className="object-contain" />
                        </div>
                      </div>

                      <p className="text-sm sm:text-base text-[#D1D1D1] leading-relaxed text-right mt-3">
                        {review.text}
                      </p>
                    </div>

                    {review.date && (
                      <div className="text-xs text-zinc-500 text-left pt-3 border-t border-white/5 mt-4 font-mono">
                        {review.date}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* نافذة إضافة تقييم جديد */}
        {isAddReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-md rounded-3xl bg-[#0E0E0E] border border-[#2B2B2B] p-6 sm:p-8 shadow-2xl text-white text-right">
              <button
                type="button"
                onClick={() => setIsAddReviewModalOpen(false)}
                className="absolute top-5 left-5 p-2 rounded-full text-[#8E8E8E] hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-white mb-2">أضف تقييمك ورأيك في المنصة</h3>
              <p className="text-xs text-[#8E8E8E] mb-5">
                رأيك يساعدنا على تطوير تجربة المزادات وتجارة الإبل باستمرار.
              </p>

              {reviewMessage && (
                <div
                  className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${
                    reviewMessage.type === "success"
                      ? "bg-emerald-950/70 border border-emerald-500 text-emerald-200"
                      : "bg-red-950/70 border border-red-500 text-red-200"
                  }`}
                >
                  {reviewMessage.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{reviewMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* تحديد عدد النجوم */}
                <div>
                  <label className="block text-xs font-bold text-[#D1D1D1] mb-2">التقييم بالنجوم:</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 cursor-pointer transition-transform hover:scale-125"
                      >
                        <Star
                          className={`w-6 h-6 ${star <= rating ? "text-amber-400 fill-amber-400" : "text-zinc-600"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* نص التقييم */}
                <div>
                  <label className="block text-xs font-bold text-[#D1D1D1] mb-1.5">تعليقك وتجربتك:</label>
                  <textarea
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="اكتب تفاصيل تجربتك في البيع، الشراء، أو المزايدة..."
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-[#333] text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold text-black bg-gradient-to-r from-white via-zinc-100 to-zinc-300 hover:scale-[1.02] shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingReview ? "جاري إرسال التقييم..." : "إرسال التقييم الآن"}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
