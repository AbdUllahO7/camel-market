'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Phone, Eye, EyeOff, ArrowLeft, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useLanguage } from '@/i18n';
import { AuthLanguageSwitch } from '@/features/auth/components/AuthLanguageSwitch';
import { APP_CONFIG, type GccCountry } from '@/config/app.config';
import { UserVerificationStatus } from '@/features/auth/types';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading: authLoading } = useAuth();
  const { t, isRtl, locale } = useLanguage();

  const [selectedCountry, setSelectedCountry] = useState<GccCountry>(APP_CONFIG.supportedCountries[0]);
  const [phoneNumberOnly, setPhoneNumberOnly] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!phoneNumberOnly.trim()) {
      setErrorMessage(locale === 'ar' ? 'يرجى إدخال رقم الهاتف' : 'Please enter your phone number');
      return;
    }

    if (!password) {
      setErrorMessage(locale === 'ar' ? 'يرجى إدخال كلمة المرور' : 'Please enter your password');
      return;
    }

    let cleanPhone = phoneNumberOnly.trim();
    if (cleanPhone.startsWith('0')) {
      cleanPhone = cleanPhone.substring(1);
    }
    const fullPhoneNumber = `${selectedCountry.dialCode}${cleanPhone}`;

    setIsSubmitting(true);
    const res = await login(fullPhoneNumber, password);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMessage(
        res.message || (locale === 'ar' ? 'بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى' : 'Invalid credentials, please try again')
      );
      return;
    }

    // هندلة حالات توثيق الحساب بناءً على الـ Enum المستلم من الـ Login Response
    switch (res.verificationState) {
      case UserVerificationStatus.Active:
        // حالة (2 - مقبول ومفعل): دخول مباشر للصفحة الرئيسية
        router.push('/');
        break;

      case UserVerificationStatus.Pending:
        // حالة (1 - قيد المراجعة): شاشة الحساب قيد المراجعة
        router.push('/auth/pending-approval');
        break;

      case UserVerificationStatus.Rejected:
        // حالة (3 - مرفوض): شاشة الرفض مع سبب الرفض
        router.push('/auth/pending-approval?status=rejected');
        break;

      case UserVerificationStatus.NeedModification:
        // حالة (4 - يحتاج تعديل): شاشة تحديث وإعادة رفع ملفات وصور الهوية
        router.push('/auth/pending-approval?action=modify');
        break;

      case UserVerificationStatus.Unknown:
      default:
        // حالة احتياطية
        if (res.status === 'approved') {
          router.push('/');
        } else if (res.status === 'pending_otp') {
          sessionStorage.setItem('pending_verify_phone', fullPhoneNumber);
          router.push('/auth/register?step=3');
        } else if (res.status === 'rejected') {
          router.push('/auth/pending-approval?status=rejected');
        } else if (res.status === 'need_modification') {
          router.push('/auth/pending-approval?action=modify');
        } else {
          router.push('/auth/pending-approval');
        }
        break;
    }
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#000000] text-white flex flex-col justify-between relative overflow-hidden font-sans selection:bg-white/20 selection:text-white"
    >
      {/* خلفيات ضوئية فخمة لعلامة سوق الإبل */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--brand-primary,#8B5E3C)]/[0.08] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[var(--brand-medium,#C88F45)]/10 rounded-full blur-3xl pointer-events-none" />

      {/* الرأس: شعار سوق الإبل + محدد اللغة + رابط التسجيل */}
      <header className="relative z-20 w-full py-6 px-6 sm:px-12 flex items-center justify-between border-b border-zinc-800/80 bg-[#000000]/60 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-12 w-36 sm:w-44">
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
          {/* محدد اللغة التفاعلي */}
          <AuthLanguageSwitch />

          <Link
            href="/auth/register"
            className="text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-zinc-600 px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>{t.auth.register}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* الحاوية المركزية لتسجيل الدخول */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div
          className="w-full max-w-md rounded-3xl bg-[#111111]/95 backdrop-blur-2xl border border-zinc-700 p-6 sm:p-10 shadow-2xl transition-all duration-300"
          style={{
            boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(255,255,255,0.05)',
          }}
        >
          {/* العنوان الترحيبي */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-zinc-600 text-white mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t.auth.officialPlatform}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
              {t.auth.loginTitle}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium mt-2 leading-relaxed">
              {t.auth.loginSubtitle}
            </p>
          </div>

          {/* تنبيه الخطأ */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-100 text-xs sm:text-sm font-medium flex items-start gap-2.5 animate-fade-in shadow-lg">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* نموذج الدخول */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* حقل رقم الهاتف مع كود الدولة الخليجية */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-white mb-2">
                {t.auth.phoneNumber}
              </label>
              <div className="relative flex items-center rounded-2xl bg-[#181818] border border-zinc-700 focus-within:border-white focus-within:ring-2 focus-within:ring-white/20 transition-all overflow-hidden shadow-inner">
                {/* قائمة اختيار الدولة */}
                <div
                  className={`flex items-center gap-1.5 px-3.5 py-3.5 ${
                    isRtl ? 'border-l' : 'border-r'
                  } border-zinc-700 bg-[#222222] shrink-0`}
                >
                  <span className="text-base">{selectedCountry.flag}</span>
                  <select
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const c = APP_CONFIG.supportedCountries.find((item) => item.code === e.target.value);
                      if (c) setSelectedCountry(c);
                    }}
                    className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-1"
                  >
                    {APP_CONFIG.supportedCountries.map((c) => (
                      <option key={c.code} value={c.code} className="bg-[#1A1A1A] text-white py-1 font-sans">
                        {c.dialCode} ({locale === 'ar' ? c.nameAr : c.nameEn})
                      </option>
                    ))}
                  </select>
                </div>

                {/* حقل الإدخال */}
                <div className="relative flex-1 flex items-center">
                  <input
                    type="tel"
                    dir="ltr"
                    value={phoneNumberOnly}
                    onChange={(e) => setPhoneNumberOnly(e.target.value.replace(/\D/g, ''))}
                    placeholder="50000000"
                    className="w-full bg-transparent px-4 py-3.5 text-sm font-semibold text-white placeholder:text-zinc-400 focus:outline-none text-left"
                    autoComplete="tel"
                  />
                  <Phone className={`w-4 h-4 text-zinc-400 ${isRtl ? 'ml-3.5' : 'mr-3.5'} shrink-0`} />
                </div>
              </div>
            </div>

            {/* حقل كلمة المرور */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-semibold text-zinc-300 hover:text-white underline underline-offset-2 transition-colors"
                >
                  {t.auth.forgotPassword}
                </Link>
                <label className="text-xs sm:text-sm font-bold text-white">
                  {t.auth.password}
                </label>
              </div>
              <div className="relative flex items-center rounded-2xl bg-[#181818] border border-zinc-700 focus-within:border-white focus-within:ring-2 focus-within:ring-white/20 transition-all shadow-inner">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-3.5 text-zinc-300 hover:text-white transition-colors"
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-zinc-300" />}
                </button>
                <input
                  type={showPassword ? 'text' : 'password'}
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent px-3 py-3.5 text-sm font-semibold text-white placeholder:text-zinc-400 focus:outline-none text-left"
                  autoComplete="current-password"
                />
                <Lock className={`w-4 h-4 text-zinc-400 ${isRtl ? 'ml-3.5' : 'mr-3.5'} shrink-0`} />
              </div>
            </div>

            {/* زر تسجيل الدخول */}
            <button
              type="submit"
              disabled={isSubmitting || authLoading}
              className="w-full py-4 px-4 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-[#222222] via-[#3D3D3D] to-[#222222] border border-zinc-500 hover:border-white shadow-2xl hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 tracking-wide"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                  <span className="font-bold">{locale === 'ar' ? 'جاري تسجيل الدخول...' : 'Signing in...'}</span>
                </>
              ) : (
                <>
                  <span>{t.auth.login}</span>
                  <ArrowIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* التوجيه للتسجيل */}
          <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
            <p className="text-xs sm:text-sm text-zinc-300 font-medium">
              {t.auth.noAccount}{' '}
              <Link
                href="/auth/register"
                className="font-bold text-white underline underline-offset-4 hover:text-zinc-200 transition-colors ml-1 mr-1"
              >
                {t.auth.registerNewAccount}
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* التذييل */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-zinc-400 border-t border-zinc-900 bg-[#000000]/80">
        {t.footer.rights}
      </footer>
    </div>
  );
}
