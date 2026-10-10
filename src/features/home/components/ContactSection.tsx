'use client';

import Image from 'next/image';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/i18n';
import { useContactForm } from '../hooks/useContactForm';

export const ContactSection = () => {
  const { t } = useLanguage();
  const { formData, isSubmitting, isSuccess, errorMessage, handleChange, submitForm } = useContactForm();

  return (
    <section id="contact" className="w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-8 md:px-12 bg-[#000000] text-white relative overflow-hidden">
      <div className="max-w-[1550px] mx-auto">
        
        {/* حاوية بطاقة تواصل معنا الفخمة */}
        <div
          className="relative rounded-[28px] sm:rounded-[36px] lg:rounded-[44px] bg-[#070707] border border-[#222222] shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 overflow-hidden"
          dir="rtl"
        >
          {/* 1. جانب نموذج البيانات (Form) */}
          <div className="w-full lg:w-[50%] flex flex-col justify-between gap-8 sm:gap-10 z-20">
            <form onSubmit={submitForm} className="flex flex-col gap-8 sm:gap-10 w-full">
              
              {/* الصف الأول: الاسم الأول + الاسم الأخير */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 w-full">
                {/* الاسم الأول */}
                <div className="flex flex-col gap-2 text-right">
                  <label className="text-base sm:text-lg font-bold text-white">
                    {t.contactSection.firstNameLabel}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder={t.contactSection.firstNamePlaceholder}
                    className="w-full bg-transparent border-b border-[#2E2E2E] focus:border-[#FFFFFF] pb-3 text-sm sm:text-base text-white placeholder:text-[#555555] outline-none transition-colors text-right"
                  />
                </div>

                {/* الاسم الأخير */}
                <div className="flex flex-col gap-2 text-right">
                  <label className="text-base sm:text-lg font-bold text-white">
                    {t.contactSection.lastNameLabel}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder={t.contactSection.lastNamePlaceholder}
                    className="w-full bg-transparent border-b border-[#2E2E2E] focus:border-[#FFFFFF] pb-3 text-sm sm:text-base text-white placeholder:text-[#555555] outline-none transition-colors text-right"
                  />
                </div>
              </div>

              {/* الصف الثاني: البريد الإلكتروني + رقم الهاتف */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 w-full">
                {/* البريد الإلكتروني */}
                <div className="flex flex-col gap-2 text-right">
                  <label className="text-base sm:text-lg font-bold text-white">
                    {t.contactSection.emailLabel}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t.contactSection.emailPlaceholder}
                    className="w-full bg-transparent border-b border-[#2E2E2E] focus:border-[#FFFFFF] pb-3 text-sm sm:text-base text-white placeholder:text-[#555555] outline-none transition-colors text-right"
                  />
                </div>

                {/* رقم الهاتف */}
                <div className="flex flex-col gap-2 text-right">
                  <label className="text-base sm:text-lg font-bold text-white">
                    {t.contactSection.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder={t.contactSection.phonePlaceholder}
                    className="w-full bg-transparent border-b border-[#2E2E2E] focus:border-[#FFFFFF] pb-3 text-sm sm:text-base text-white placeholder:text-[#555555] outline-none transition-colors text-right"
                  />
                </div>
              </div>

              {/* الصف الثالث: الرسالة */}
              <div className="flex flex-col gap-2 text-right w-full">
                <label className="text-base sm:text-lg font-bold text-white">
                  {t.contactSection.messageLabel}
                </label>
                <input
                  type="text"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder={t.contactSection.messagePlaceholder}
                  className="w-full bg-transparent border-b border-[#2E2E2E] focus:border-[#FFFFFF] pb-3 text-sm sm:text-base text-white placeholder:text-[#555555] outline-none transition-colors text-right"
                />
              </div>

              {/* رسائل التنبيه والنجاح */}
              {isSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-sm text-right flex items-center gap-2.5 shadow-lg animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>تم استلام رسالتك بنجاح! سيقوم فريق الدعم الفني بمراجعتها والتواصل معك.</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-sm text-right flex items-center gap-2.5 shadow-lg animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* الصف السفلي: زر الإرسال على اليسار + مسار الخط المتقطع والسهم الذهبي الطائر */}
              <div className="relative pt-4 w-full h-[140px] flex items-start select-none" dir="ltr">
                {/* زر الإرسال على اليسار */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-[140px] sm:w-[170px] h-[48px] sm:h-[52px] rounded-[10px] bg-gradient-to-b from-[#FFFFFF] via-[#F7F7F7] to-[#D1D1D1] text-[#000000] font-bold text-base sm:text-lg hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.25)] cursor-pointer flex items-center justify-center gap-2 relative z-20 ${
                    isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-black" />
                      <span>إرسال...</span>
                    </>
                  ) : (
                    t.contactSection.submitButton
                  )}
                </button>

                {/* الخط المتقطع المنحني الصاعد لليمين */}
                <div className="absolute left-0 bottom-[-10px] w-[320px] sm:w-[410px] lg:w-[435px] h-[120px] sm:h-[137px] pointer-events-none z-0">
                  <Image
                    src="/icons/dashed-line.svg"
                    alt="dashed line"
                    fill
                    className="object-contain object-left-bottom"
                  />
                </div>

                {/* السهم الذهبي الطائر (#B8860B) في نهاية الخط المتقطع متجهاً للأعلى واليمين */}
                <div className="absolute left-[295px] sm:left-[375px] lg:left-[400px] top-[-5px] sm:top-[-10px] w-[46px] sm:w-[56px] h-[46px] sm:h-[57px] pointer-events-none z-10 rotate-[-5deg]">
                  <Image
                    src="/icons/head-arrow.svg"
                    alt="send arrow"
                    fill
                    className="object-contain drop-shadow-lg"
                  />
                </div>
              </div>

            </form>
          </div>

          {/* 2. جانب صورة الإبل (ContactUs.png) */}
          <div className="w-full lg:w-[48%] h-[360px] sm:h-[480px] lg:h-[560px] rounded-[24px] sm:rounded-[32px] overflow-hidden relative shadow-2xl border border-white/5 shrink-0 select-none">
            <Image
              src="/Camels/ContactUs.png"
              alt="تواصل معنا"
              fill
              priority
              className="object-cover"
            />
          </div>

        </div>

      </div>
    </section>
  );
};
