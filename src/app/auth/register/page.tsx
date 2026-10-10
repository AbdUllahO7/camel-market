'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  User as UserIcon,
  Phone,
  Lock,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  Camera,
  FileText,
  RotateCw,
  MessageSquare,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useLanguage } from '@/i18n';
import { AuthLanguageSwitch } from '@/features/auth/components/AuthLanguageSwitch';
import {
  USER_ROLES_CONFIG,
  type UserRole,
  type RegisterFiles,
} from '@/features/auth/types';
import { APP_CONFIG, type GccCountry } from '@/config/app.config';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, verifyOtp, resendOtp } = useAuth();
  const { t, isRtl, locale } = useLanguage();

  const ArrowForward = isRtl ? ArrowLeft : ArrowRight;
  const ArrowBack = isRtl ? ArrowRight : ArrowLeft;

  const initialStep = parseInt(searchParams?.get('step') || '1', 10);
  const [currentStep, setCurrentStep] = useState<number>(initialStep || 1);

  // حقول الخطوة 1
  const [role, setRole] = useState<UserRole>('Customer');
  const [fullName, setFullName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<GccCountry>(APP_CONFIG.supportedCountries[0]);
  const [phoneNumberOnly, setPhoneNumberOnly] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // حقول الخطوة 2 (صور الهوية)
  const [files, setFiles] = useState<RegisterFiles>({
    frontIdentityImage: null,
    backIdentityImage: null,
    selfieWithIdentityImage: null,
  });
  const [previews, setPreviews] = useState<{
    front?: string;
    back?: string;
    selfie?: string;
  }>({});

  // حقول الخطوة 3 (كود OTP الواتساب)
  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState('');

  // حالات التحميل والرسائل
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPhone = sessionStorage.getItem('pending_verify_phone');
      if (savedPhone) {
        setVerifiedPhone(savedPhone);
      }
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentStep === 3 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep, timer]);

  const handleFileChange = (
    key: keyof RegisterFiles,
    previewKey: 'front' | 'back' | 'selfie',
    file: File | null
  ) => {
    if (!file) return;
    setFiles((prev) => ({ ...prev, [key]: file }));
    const objectUrl = URL.createObjectURL(file);
    setPreviews((prev) => ({ ...prev, [previewKey]: objectUrl }));
  };

  const validateStep1 = () => {
    setErrorMessage('');
    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMessage(locale === 'ar' ? 'يرجى إدخال الاسم الكامل بشكل صحيح' : 'Please enter your full name');
      return false;
    }
    if (!phoneNumberOnly.trim() || phoneNumberOnly.trim().length < 7) {
      setErrorMessage(locale === 'ar' ? 'يرجى إدخال رقم هاتف صحيح' : 'Please enter a valid phone number');
      return false;
    }
    if (!password || password.length < 6) {
      setErrorMessage(locale === 'ar' ? 'كلمة المرور يجب أن لا تقل عن 6 خانات' : 'Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage(locale === 'ar' ? 'كلمة المرور وتأكيدها غير متطابقين' : 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRegisterSubmit = async () => {
    setErrorMessage('');
    if (!files.frontIdentityImage || !files.backIdentityImage || !files.selfieWithIdentityImage) {
      setErrorMessage(
        locale === 'ar'
          ? 'يرجى إرفاق صور التوثيق الثلاث كاملة (وجه الهوية، ظهر الهوية، وسيلفي مع الهوية)'
          : 'Please attach all 3 verification photos (Front ID, Back ID, and Selfie with ID)'
      );
      return;
    }

    let cleanPhone = phoneNumberOnly.trim();
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
    const fullPhone = `${selectedCountry.dialCode}${cleanPhone}`;
    setVerifiedPhone(fullPhone);

    setIsSubmitting(true);
    const res = await register({
      fullName: fullName.trim(),
      phoneNumber: fullPhone,
      password,
      roleName: role,
      files,
    });
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.message || (locale === 'ar' ? 'فشل في إنشاء الحساب. تأكد من رفع صور صالحة' : 'Registration failed. Please ensure valid photos'));
      return;
    }

    setTimer(60);
    setCanResend(false);
    setCurrentStep(3);
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!otpCode.trim() || otpCode.trim().length < 4) {
      setErrorMessage(locale === 'ar' ? 'يرجى إدخال كود التحقق المرسل' : 'Please enter the verification code');
      return;
    }

    setIsSubmitting(true);
    const res = await verifyOtp(verifiedPhone, otpCode.trim());
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.message || (locale === 'ar' ? 'كود التحقق غير صحيح أو انتهت صلاحيته' : 'Invalid or expired verification code'));
      return;
    }

    setCurrentStep(4);
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    const res = await resendOtp(verifiedPhone);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage(locale === 'ar' ? 'تم إعادة إرسال كود التحقق عبر الواتساب' : 'Verification code resent via WhatsApp');
      setTimer(60);
      setCanResend(false);
    } else {
      setErrorMessage(res.message || (locale === 'ar' ? 'فشل في إعادة إرسال الكود' : 'Failed to resend code'));
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#000000] text-white flex flex-col justify-between relative overflow-hidden font-sans selection:bg-white/20 selection:text-white"
    >
      {/* خلفيات */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-white/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#2B2B2B]/40 rounded-full blur-3xl pointer-events-none" />

      {/* الرأس */}
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
          <AuthLanguageSwitch />
          <Link
            href="/auth/login"
            className="text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-zinc-600 px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>{t.auth.login}</span>
            <ArrowForward className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div
          className="w-full max-w-2xl rounded-3xl bg-[#111111]/95 backdrop-blur-2xl border border-zinc-700 p-6 sm:p-10 shadow-2xl transition-all duration-300"
          style={{
            boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(255,255,255,0.05)',
          }}
        >
          {/* مؤشر مراحل التسجيل (Stepper) */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative mb-2">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800 -translate-y-1/2 z-0" />
              {[
                { step: 1, label: t.auth.step1 },
                { step: 2, label: t.auth.step2 },
                { step: 3, label: t.auth.step3 },
                { step: 4, label: t.auth.step4 },
              ].map((s) => (
                <div key={s.step} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      currentStep === s.step
                        ? 'bg-white text-black ring-4 ring-white/30'
                        : currentStep > s.step
                        ? 'bg-emerald-500 text-white ring-2 ring-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-300 border border-zinc-600'
                    }`}
                  >
                    {currentStep > s.step ? <CheckCircle2 className="w-5 h-5" /> : s.step}
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs mt-1.5 font-bold ${
                      currentStep === s.step ? 'text-white font-black' : 'text-zinc-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* تنبيه الأخطاء */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-100 text-xs sm:text-sm font-medium flex items-start gap-2.5 animate-fade-in shadow-lg">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* تنبيه النجاح */}
          {successMessage && (
            <div className="mb-6 p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-100 text-xs sm:text-sm font-medium flex items-start gap-2.5 animate-fade-in shadow-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* الخطوة 1 */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white mb-1">
                  {t.auth.registerTitle}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 font-medium">
                  {t.auth.registerSubtitle}
                </p>
              </div>

              {/* نوع الحساب */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-white mb-2.5">
                  {t.auth.accountType}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {USER_ROLES_CONFIG.map((opt) => {
                    const isSelected = role === opt.id;
                    const badgeText = locale === 'ar' ? opt.badgeAr : opt.badgeEn;
                    const titleText = locale === 'ar' ? opt.titleAr : opt.titleEn;
                    const descText = locale === 'ar' ? opt.descriptionAr : opt.descriptionEn;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setRole(opt.id)}
                        className={`p-4 rounded-2xl text-start transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-[#1C1C1C] border-white shadow-xl ring-2 ring-white/30'
                            : 'bg-[#161616] border-zinc-700 hover:border-zinc-500 hover:bg-[#1C1C1C]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-md font-bold ${
                              isSelected ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                            }`}
                          >
                            {badgeText}
                          </span>
                          <span className="text-sm font-black text-white">{titleText}</span>
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed mt-1">
                          {descText}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* الاسم */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-white mb-1.5">
                  {t.auth.fullName}
                </label>
                <div className="relative flex items-center rounded-2xl bg-[#181818] border border-zinc-700 focus-within:border-white focus-within:ring-2 focus-within:ring-white/20 transition-all shadow-inner">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={locale === 'ar' ? 'مثال: عبدالله محمد الهاجري' : 'e.g. Abdullah Mohammed'}
                    className="w-full bg-transparent px-4 py-3.5 text-sm font-semibold text-white placeholder:text-zinc-400 focus:outline-none"
                  />
                  <UserIcon className={`w-4 h-4 text-zinc-400 ${isRtl ? 'ml-3.5' : 'mr-3.5'} shrink-0`} />
                </div>
              </div>

              {/* الهاتف */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-white mb-1.5">
                  {t.auth.phoneNumber}
                </label>
                <div className="relative flex items-center rounded-2xl bg-[#181818] border border-zinc-700 focus-within:border-white focus-within:ring-2 focus-within:ring-white/20 transition-all overflow-hidden shadow-inner">
                  <div
                    className={`flex items-center gap-1.5 px-3.5 py-3.5 ${
                      isRtl ? 'border-l' : 'border-r'
                    } border-zinc-700 bg-[#222222] shrink-0`}
                  >
                    <span className="text-base">{selectedCountry.flag}</span>
                    <select
                      value={selectedCountry.code}
                      onChange={(e) => {
                        const c = APP_CONFIG.supportedCountries.find((i) => i.code === e.target.value);
                        if (c) setSelectedCountry(c);
                      }}
                      className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-1"
                    >
                      {APP_CONFIG.supportedCountries.map((c) => (
                        <option key={c.code} value={c.code} className="bg-[#1A1A1A] text-white py-1">
                          {c.dialCode} ({locale === 'ar' ? c.nameAr : c.nameEn})
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
                    className="w-full bg-transparent px-4 py-3.5 text-sm font-semibold text-white placeholder:text-zinc-400 focus:outline-none text-left"
                  />
                  <Phone className={`w-4 h-4 text-zinc-400 ${isRtl ? 'ml-3.5' : 'mr-3.5'} shrink-0`} />
                </div>
              </div>

              {/* كلمة المرور */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-white mb-1.5">
                    {t.auth.password}
                  </label>
                  <div className="relative flex items-center rounded-2xl bg-[#181818] border border-zinc-700 focus-within:border-white focus-within:ring-2 focus-within:ring-white/20 transition-all shadow-inner">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-3.5 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
                      aria-label="Toggle password"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-zinc-300" /> : <Eye className="w-4 h-4 text-zinc-400 hover:text-white" />}
                    </button>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      dir="ltr"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent px-3 py-3.5 text-sm font-semibold text-white placeholder:text-zinc-400 focus:outline-none text-left"
                    />
                    <Lock className={`w-4 h-4 text-zinc-400 ${isRtl ? 'ml-3.5' : 'mr-3.5'} shrink-0`} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-white mb-1.5">
                    {t.auth.confirmPassword}
                  </label>
                  <div className="relative flex items-center rounded-2xl bg-[#181818] border border-zinc-700 focus-within:border-white focus-within:ring-2 focus-within:ring-white/20 transition-all shadow-inner">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="p-3.5 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
                      aria-label="Toggle confirm password"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4 text-zinc-300" /> : <Eye className="w-4 h-4 text-zinc-400 hover:text-white" />}
                    </button>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      dir="ltr"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent px-3 py-3.5 text-sm font-semibold text-white placeholder:text-zinc-400 focus:outline-none text-left"
                    />
                    <Lock className={`w-4 h-4 text-zinc-400 ${isRtl ? 'ml-3.5' : 'mr-3.5'} shrink-0`} />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) {
                    setCurrentStep(2);
                  }
                }}
                className="w-full py-4 px-4 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-[#222222] via-[#3D3D3D] to-[#222222] border border-zinc-500 hover:border-white shadow-2xl hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{t.auth.continueToVerification}</span>
                <ArrowForward className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* الخطوة 2 */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white mb-1">
                    {t.auth.identityVerification}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-300 font-medium">
                    {t.auth.identityVerificationDesc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-zinc-300 hover:text-white flex items-center gap-1"
                >
                  <ArrowBack className="w-3.5 h-3.5" />
                  <span>{locale === 'ar' ? 'تعديل البيانات' : 'Edit details'}</span>
                </button>
              </div>

              {/* إرشادات التوثيق */}
              <div className="p-4 rounded-2xl bg-white/5 border border-zinc-700 text-xs sm:text-sm text-zinc-200 space-y-1.5 shadow-inner">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{t.auth.guidelinesTitle}</span>
                </div>
                <p>{t.auth.guideline1}</p>
                <p>{t.auth.guideline2}</p>
              </div>

              {/* شبكة رفع الصور */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. وجه الهوية */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-white mb-2 text-center">
                    {t.auth.frontId}
                  </label>
                  <input
                    type="file"
                    ref={frontInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileChange('frontIdentityImage', 'front', e.target.files?.[0] || null)
                    }
                  />
                  <div
                    onClick={() => frontInputRef.current?.click()}
                    className={`h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-2 cursor-pointer transition-all overflow-hidden relative ${
                      previews.front
                        ? 'border-emerald-400 bg-[#161616]'
                        : 'border-zinc-700 hover:border-white bg-[#181818]'
                    }`}
                  >
                    {previews.front ? (
                      <div className="relative w-full h-full">
                        <Image src={previews.front} alt="Front ID" fill className="object-cover rounded-xl" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-xs text-white font-bold">{t.auth.changeImage}</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <FileText className="w-8 h-8 text-zinc-400 mb-1.5" />
                        <span className="text-xs text-white font-bold">{t.auth.frontId}</span>
                        <span className="text-[10px] text-zinc-400 mt-0.5">JPG, PNG</span>
                      </>
                    )}
                  </div>
                </div>

                {/* 2. ظهر الهوية */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-white mb-2 text-center">
                    {t.auth.backId}
                  </label>
                  <input
                    type="file"
                    ref={backInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileChange('backIdentityImage', 'back', e.target.files?.[0] || null)
                    }
                  />
                  <div
                    onClick={() => backInputRef.current?.click()}
                    className={`h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-2 cursor-pointer transition-all overflow-hidden relative ${
                      previews.back
                        ? 'border-emerald-400 bg-[#161616]'
                        : 'border-zinc-700 hover:border-white bg-[#181818]'
                    }`}
                  >
                    {previews.back ? (
                      <div className="relative w-full h-full">
                        <Image src={previews.back} alt="Back ID" fill className="object-cover rounded-xl" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-xs text-white font-bold">{t.auth.changeImage}</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <RotateCw className="w-8 h-8 text-zinc-400 mb-1.5" />
                        <span className="text-xs text-white font-bold">{t.auth.backId}</span>
                        <span className="text-[10px] text-zinc-400 mt-0.5">JPG, PNG</span>
                      </>
                    )}
                  </div>
                </div>

                {/* 3. سيلفي مع الهوية */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-white mb-2 text-center">
                    {t.auth.selfieId}
                  </label>
                  <input
                    type="file"
                    ref={selfieInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileChange('selfieWithIdentityImage', 'selfie', e.target.files?.[0] || null)
                    }
                  />
                  <div
                    onClick={() => selfieInputRef.current?.click()}
                    className={`h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-2 cursor-pointer transition-all overflow-hidden relative ${
                      previews.selfie
                        ? 'border-emerald-400 bg-[#161616]'
                        : 'border-zinc-700 hover:border-white bg-[#181818]'
                    }`}
                  >
                    {previews.selfie ? (
                      <div className="relative w-full h-full">
                        <Image src={previews.selfie} alt="Selfie with ID" fill className="object-cover rounded-xl" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-xs text-white font-bold">{t.auth.changeImage}</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-zinc-400 mb-1.5" />
                        <span className="text-xs text-white font-bold">{t.auth.selfieId}</span>
                        <span className="text-[10px] text-zinc-400 mt-0.5">Clear photo</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* أزرار الخطوة 2 */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-4 rounded-2xl text-xs sm:text-sm font-bold text-white bg-white/10 border border-zinc-600 hover:bg-white/20 transition-colors"
                >
                  {locale === 'ar' ? 'السابق' : 'Previous'}
                </button>
                <button
                  type="button"
                  onClick={handleRegisterSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-4 px-4 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-[#222222] via-[#3D3D3D] to-[#222222] border border-zinc-500 hover:border-white shadow-2xl hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                      <span className="font-bold">{locale === 'ar' ? 'جاري رفع المستندات...' : 'Uploading files...'}</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-5 h-5" />
                      <span>{t.auth.submitVerification}</span>
                      <ArrowForward className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* الخطوة 3 */}
          {currentStep === 3 && (
            <div className="space-y-6 text-center animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
                <MessageSquare className="w-7 h-7" />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white mb-1">
                  {t.auth.whatsappOtpTitle}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 font-medium">
                  {t.auth.whatsappOtpDesc}
                </p>
                <div className="font-black text-white text-base mt-2" dir="ltr">
                  {verifiedPhone}
                </div>
              </div>

              <form onSubmit={handleVerifyOtpSubmit} className="space-y-5 max-w-sm mx-auto">
                <div>
                  <input
                    type="text"
                    dir="ltr"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full text-center tracking-[10px] text-2xl font-black py-4 px-4 rounded-2xl bg-[#181818] border border-zinc-700 text-white focus:outline-none focus:border-white shadow-inner transition-all"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-4 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-[#222222] via-[#3D3D3D] to-[#222222] border border-zinc-500 hover:border-white shadow-2xl hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                      <span className="font-bold">{locale === 'ar' ? 'جاري تأكيد الرمز...' : 'Verifying...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.auth.confirmAndContinue}</span>
                      <ArrowForward className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-xs font-semibold text-zinc-300">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isSubmitting}
                      className="font-bold text-white underline underline-offset-4 hover:text-zinc-200 transition-colors"
                    >
                      {t.auth.resendOtpNow}
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5">
                      <Clock className="w-4 h-4 text-zinc-400" />
                      <span>{t.auth.resendOtpIn} {timer}s</span>
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* الخطوة 4 */}
          {currentStep === 4 && (
            <div className="space-y-6 text-center animate-fade-in py-4">
              <div className="w-16 h-16 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-white shadow-2xl">
                <ShieldCheck className="w-9 h-9 text-emerald-400" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-white mb-2">
                  {locale === 'ar' ? 'تم استلام طلب التوثيق بنجاح!' : 'Verification Request Submitted!'}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 font-medium max-w-md mx-auto leading-relaxed">
                  {t.auth.pendingApprovalDesc}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => router.push('/auth/pending-approval')}
                  className="w-full max-w-sm py-4 px-4 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-[#222222] via-[#3D3D3D] to-[#222222] border border-zinc-500 hover:border-white shadow-2xl hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  <span>{t.auth.checkStatus}</span>
                  <ArrowForward className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 w-full py-4 text-center text-xs text-zinc-400 border-t border-zinc-900 bg-[#000000]/80">
        {t.footer.rights}
      </footer>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#000000] flex items-center justify-center text-white">
          <div className="w-8 h-8 rounded-full border-2 border-zinc-700 border-t-white animate-spin"></div>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
