'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KeyRound, Phone, ArrowLeft, ArrowRight, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/features/auth/services/authService';
import { useLanguage } from '@/i18n';
import { AuthLanguageSwitch } from '@/features/auth/components/AuthLanguageSwitch';
import { APP_CONFIG, type GccCountry } from '@/config/app.config';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { t, isRtl, locale } = useLanguage();

  const ArrowForward = isRtl ? ArrowLeft : ArrowRight;

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCountry, setSelectedCountry] = useState<GccCountry>(APP_CONFIG.supportedCountries[0]);
  const [phoneNumberOnly, setPhoneNumberOnly] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const getFullPhone = () => {
    let clean = phoneNumberOnly.trim();
    if (clean.startsWith('0')) clean = clean.substring(1);
    return `${selectedCountry.dialCode}${clean}`;
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!phoneNumberOnly.trim()) {
      setErrorMessage(locale === 'ar' ? 'يرجى إدخال رقم الهاتف المسجل' : 'Please enter your registered phone number');
      return;
    }

    setIsLoading(true);
    const fullPhone = getFullPhone();
    const res = await authService.forgotPassword({ phoneNumber: fullPhone });
    setIsLoading(false);

    if (res.success) {
      setSuccessMessage(locale === 'ar' ? 'تم إرسال كود استعادة كلمة المرور عبر الواتساب' : 'Reset code sent via WhatsApp');
      setStep(2);
    } else {
      setErrorMessage(res.message || (locale === 'ar' ? 'تعذر إرسال كود الاستعادة' : 'Failed to send reset code'));
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!otpCode.trim()) {
      setErrorMessage(locale === 'ar' ? 'يرجى إدخال كود التحقق المرسل' : 'Please enter the verification code');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage(locale === 'ar' ? 'كلمة المرور الجديدة يجب أن لا تقل عن 6 خانات' : 'Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage(locale === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    const res = await authService.resetPassword({
      phoneNumber: getFullPhone(),
      otpCode: otpCode.trim(),
      newPassword,
    });
    setIsLoading(false);

    if (res.success) {
      alert(locale === 'ar' ? 'تم تغيير كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.' : 'Password reset successfully! You can now log in.');
      router.push('/auth/login');
    } else {
      setErrorMessage(res.message || (locale === 'ar' ? 'كود التحقق غير صحيح أو انتهت صلاحيته' : 'Invalid or expired code'));
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#000000] text-white flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[#616161] selection:text-white"
    >
      {/* خلفيات */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#616161]/10 rounded-full blur-3xl pointer-events-none" />

      {/* الرأس */}
      <header className="relative z-20 w-full py-6 px-6 sm:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-12 w-36">
            <Image
              src="/Camels/logo-white.png"
              alt={isRtl ? 'سوق الإبل' : 'Camel Market'}
              fill
              priority
              className={`object-contain ${isRtl ? 'object-right' : 'object-left'}`}
            />
          </div>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <AuthLanguageSwitch />
          <Link
            href="/auth/login"
            className="text-xs sm:text-sm font-semibold text-[#D1D1D1] hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>{t.auth.backToLogin}</span>
            <ArrowForward className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* المحتوى */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div
          className="w-full max-w-md rounded-3xl bg-[#0F0F0F]/85 backdrop-blur-xl border border-[#2B2B2B] p-6 sm:p-10 shadow-2xl"
          style={{
            boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 25px rgba(255,255,255,0.03)',
            borderColor: 'rgba(209, 209, 209, 0.15)',
          }}
        >
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-white">
              <KeyRound className="w-6 h-6 text-[#D1D1D1]" />
            </div>
            <h1 className="text-2xl font-bold text-white">{t.auth.resetPasswordTitle}</h1>
            <p className="text-xs sm:text-sm text-[#8E8E8E] mt-2">
              {step === 1 ? t.auth.resetPasswordDesc : (locale === 'ar' ? 'أدخل الكود المستلم وكلمة المرور الجديدة' : 'Enter received code and new password')}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#D1D1D1] mb-2">
                  {t.auth.phoneNumber}
                </label>
                <div className="relative flex items-center rounded-2xl bg-[#171717] border border-[#2B2B2B] focus-within:border-[#D1D1D1] transition-all overflow-hidden">
                  <div
                    className={`flex items-center gap-1 px-3 py-3 ${
                      isRtl ? 'border-l' : 'border-r'
                    } border-[#2B2B2B] bg-[#1F1F1F] shrink-0`}
                  >
                    <span className="text-base">{selectedCountry.flag}</span>
                    <select
                      value={selectedCountry.code}
                      onChange={(e) => {
                        const c = APP_CONFIG.supportedCountries.find((item) => item.code === e.target.value);
                        if (c) setSelectedCountry(c);
                      }}
                      className="bg-transparent text-xs text-white focus:outline-none cursor-pointer pr-1"
                    >
                      {APP_CONFIG.supportedCountries.map((c) => (
                        <option key={c.code} value={c.code} className="bg-[#1F1F1F] text-white">
                          {c.dialCode}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="tel"
                    dir="ltr"
                    value={phoneNumberOnly}
                    onChange={(e) => setPhoneNumberOnly(e.target.value.replace(/\D/g, ''))}
                    placeholder="50000000"
                    className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder:text-[#616161] focus:outline-none text-left"
                  />
                  <Phone className={`w-4 h-4 text-[#8E8E8E] ${isRtl ? 'ml-3' : 'mr-3'} shrink-0`} />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#2B2B2B] via-[#4A4A4A] to-[#2B2B2B] border border-[#D1D1D1]/30 hover:border-white shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (locale === 'ar' ? 'جاري الإرسال...' : 'Sending...') : t.auth.sendResetCode}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#D1D1D1] mb-1.5">
                  {locale === 'ar' ? 'كود التحقق من الواتساب' : 'WhatsApp OTP Code'}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[8px] text-xl font-bold py-3 px-4 rounded-2xl bg-[#171717] border border-[#2B2B2B] text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#D1D1D1] mb-1.5">
                  {t.auth.newPassword}
                </label>
                <div className="relative flex items-center rounded-2xl bg-[#171717] border border-[#2B2B2B] focus-within:border-[#D1D1D1]">
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="p-3 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
                    aria-label="Toggle new password"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4 text-zinc-300" /> : <Eye className="w-4 h-4 text-zinc-400 hover:text-white" />}
                  </button>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    dir="ltr"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent px-3 py-3 text-sm text-white focus:outline-none text-left"
                  />
                  <Lock className={`w-4 h-4 text-[#8E8E8E] ${isRtl ? 'ml-3' : 'mr-3'} shrink-0`} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#D1D1D1] mb-1.5">
                  {t.auth.confirmNewPassword}
                </label>
                <div className="relative flex items-center rounded-2xl bg-[#171717] border border-[#2B2B2B] focus-within:border-[#D1D1D1]">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="p-3 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
                    aria-label="Toggle confirm new password"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 text-zinc-300" /> : <Eye className="w-4 h-4 text-zinc-400 hover:text-white" />}
                  </button>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    dir="ltr"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent px-3 py-3 text-sm text-white focus:outline-none text-left"
                  />
                  <Lock className={`w-4 h-4 text-[#8E8E8E] ${isRtl ? 'ml-3' : 'mr-3'} shrink-0`} />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#2B2B2B] via-[#4A4A4A] to-[#2B2B2B] border border-[#D1D1D1]/30 hover:border-white shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (locale === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (locale === 'ar' ? 'تأكيد وتعيين كلمة المرور الجديدة' : 'Confirm New Password')}
              </button>
            </form>
          )}
        </div>
      </main>

      <footer className="relative z-10 w-full py-4 text-center text-xs text-[#616161]">
        {t.footer.rights}
      </footer>
    </div>
  );
}
