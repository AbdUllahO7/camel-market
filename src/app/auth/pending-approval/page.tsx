'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Clock,
  ShieldCheck,
  RotateCw,
  LogOut,
  AlertTriangle,
  UploadCloud,
  CheckCircle2,
  FileText,
  Camera,
  MessageCircle,
  FileEdit,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useLanguage } from '@/i18n';
import { AuthLanguageSwitch } from '@/features/auth/components/AuthLanguageSwitch';
import { authService } from '@/features/auth/services/authService';
import { UserVerificationStatus, type RegisterFiles } from '@/features/auth/types';

function PendingApprovalInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, verificationStatus, verificationState, rejectionReason, checkVerificationStatus, logout } = useAuth();
  const { t, isRtl, locale } = useLanguage();

  const queryAction = searchParams?.get('action');
  const queryStatus = searchParams?.get('status');

  const [isChecking, setIsChecking] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // تحديد الحالة المعروضة
  // 1 = pending, 2 = active (redirect), 3 = rejected, 4 = needModification
  const isNeedModification =
    verificationStatus === 'need_modification' ||
    verificationState === UserVerificationStatus.NeedModification ||
    queryAction === 'modify' ||
    queryStatus === 'need_modification';

  const isRejected =
    !isNeedModification &&
    (verificationStatus === 'rejected' ||
      verificationState === UserVerificationStatus.Rejected ||
      queryStatus === 'rejected');

  const [files, setFiles] = useState<RegisterFiles>({
    frontIdentityImage: null,
    backIdentityImage: null,
    selfieWithIdentityImage: null,
  });
  const [previews, setPreviews] = useState<{ front?: string; back?: string; selfie?: string }>({});

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  // إذا تم قبول الحساب (Active)، يتم توجيهه مباشرة للرئيسية
  useEffect(() => {
    if (verificationStatus === 'approved' || verificationState === UserVerificationStatus.Active) {
      router.replace('/');
    }
  }, [verificationStatus, verificationState, router]);

  // فحص الحالة يدوياً من السيرفر
  const handleCheckStatus = async () => {
    setIsChecking(true);
    await checkVerificationStatus();
    setIsChecking(false);
  };

  const handleFileChange = (
    key: keyof RegisterFiles,
    previewKey: 'front' | 'back' | 'selfie',
    file: File | null
  ) => {
    if (!file) return;
    setFiles((prev) => ({ ...prev, [key]: file }));
    setPreviews((prev) => ({ ...prev, [previewKey]: URL.createObjectURL(file) }));
  };

  // إرسال وتحديث ملفات التوثيق (AccountUpdateVerificationFilesScreen)
  const handleUpdateFilesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');
    setUploadSuccess(false);

    if (!files.frontIdentityImage || !files.backIdentityImage || !files.selfieWithIdentityImage) {
      setUploadError(
        locale === 'ar'
          ? 'يرجى إرفاق الصور الثلاث كاملة (الهوية من الأمام، من الخلف، وصورة سيلفي مع الهوية)'
          : 'Please attach all 3 images (front ID, back ID, and selfie with ID)'
      );
      return;
    }

    setIsUploading(true);
    const res = await authService.updateVerificationFiles(files);
    setIsUploading(false);

    if (res.success) {
      setUploadSuccess(true);
      await checkVerificationStatus();
    } else {
      setUploadError(res.message || (locale === 'ar' ? 'فشل في إعادة رفع الملفات' : 'Failed to re-upload files'));
    }
  };

  const displayReason =
    user?.verificationRejectionReason ||
    rejectionReason ||
    user?.rejectionReason ||
    (locale === 'ar'
      ? 'لم يتم تحديد سبب محدد من الإدارة. يرجى التواصل مع الدعم الفني لمزيد من التفاصيل.'
      : 'No specific reason provided by administration. Please contact support for more details.');

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#000000] text-white flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[#616161] selection:text-white"
    >
      {/* خلفيات ضوئية فخمة */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#2B2B2B]/40 rounded-full blur-3xl pointer-events-none" />

      {/* الرأس: شعار سوق الإبل + زر الخروج */}
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
          <button
            type="button"
            onClick={logout}
            className="text-xs sm:text-sm font-semibold text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-zinc-700"
          >
            <LogOut className="w-4 h-4 text-zinc-400" />
            <span>{t.auth.logout}</span>
          </button>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div
          className="w-full max-w-xl rounded-3xl bg-[#111111]/95 backdrop-blur-2xl border border-zinc-700 p-6 sm:p-10 shadow-2xl transition-all"
          style={{
            boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(255,255,255,0.05)',
          }}
        >
          {/* ========================================================
              الحالة 1: يحتاج تعديل ملفات التوثيق (NeedModification - 4)
              AccountUpdateVerificationFilesScreen
             ======================================================== */}
          {isNeedModification ? (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/40 text-amber-300 mb-3">
                  <FileEdit className="w-4 h-4 text-amber-400" />
                  <span>{locale === 'ar' ? 'تحديث مطلوب لملفات التوثيق' : 'Modification Required'}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                  {locale === 'ar' ? 'تعديل مستندات الهوية' : 'Update Verification Files'}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
                  {locale === 'ar'
                    ? 'طلبت الإدارة تعديل أو إعادة رفع مستندات الهوية لتفعيل حسابك ومطابقة المعايير الرسمية.'
                    : 'The administration has requested modifications to your ID documents to activate your account.'}
                </p>
              </div>

              {/* بطاقة توضيح الملاحظات / سبب التعديل */}
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-right space-y-1 shadow-inner">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{locale === 'ar' ? 'ملاحظات الإدارة للمراجعة:' : 'Admin Modification Notes:'}</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed pr-6">
                  {displayReason}
                </p>
              </div>

              {/* رسائل النجاح أو الخطأ */}
              {uploadSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-center gap-2 shadow-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>
                    {locale === 'ar'
                      ? 'تم رفع وإرسال المستندات المعدلة بنجاح. طلبك قيد المراجعة الآن.'
                      : 'Updated documents submitted successfully. Your request is now under review.'}
                  </span>
                </div>
              )}

              {uploadError && (
                <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-100 text-xs sm:text-sm flex items-center gap-2 shadow-lg">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* نموذج رفع الملفات الثلاثة المحدثة */}
              <form onSubmit={handleUpdateFilesSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* 1. الهوية من الأمام */}
                  <div>
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
                      className={`h-32 rounded-2xl border-2 border-dashed ${
                        previews.front ? 'border-emerald-500 bg-emerald-950/20' : 'border-zinc-700 hover:border-white bg-[#181818]'
                      } flex flex-col items-center justify-center p-3 cursor-pointer transition-all hover:bg-zinc-800/60 text-center relative overflow-hidden`}
                    >
                      {previews.front ? (
                        <div className="flex flex-col items-center gap-1">
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          <span className="text-[11px] text-emerald-300 font-bold">{t.auth.changeImage}</span>
                        </div>
                      ) : (
                        <>
                          <FileText className="w-6 h-6 text-zinc-400 mb-1.5" />
                          <span className="text-xs font-bold text-white">{t.auth.frontId}</span>
                          <span className="text-[10px] text-zinc-400 mt-1">{locale === 'ar' ? 'اضغط لرفع الصورة' : 'Click to upload'}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 2. الهوية من الخلف */}
                  <div>
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
                      className={`h-32 rounded-2xl border-2 border-dashed ${
                        previews.back ? 'border-emerald-500 bg-emerald-950/20' : 'border-zinc-700 hover:border-white bg-[#181818]'
                      } flex flex-col items-center justify-center p-3 cursor-pointer transition-all hover:bg-zinc-800/60 text-center relative overflow-hidden`}
                    >
                      {previews.back ? (
                        <div className="flex flex-col items-center gap-1">
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          <span className="text-[11px] text-emerald-300 font-bold">{t.auth.changeImage}</span>
                        </div>
                      ) : (
                        <>
                          <RotateCw className="w-6 h-6 text-zinc-400 mb-1.5" />
                          <span className="text-xs font-bold text-white">{t.auth.backId}</span>
                          <span className="text-[10px] text-zinc-400 mt-1">{locale === 'ar' ? 'اضغط لرفع الصورة' : 'Click to upload'}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 3. سيلفي مع الهوية */}
                  <div>
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
                      className={`h-32 rounded-2xl border-2 border-dashed ${
                        previews.selfie ? 'border-emerald-500 bg-emerald-950/20' : 'border-zinc-700 hover:border-white bg-[#181818]'
                      } flex flex-col items-center justify-center p-3 cursor-pointer transition-all hover:bg-zinc-800/60 text-center relative overflow-hidden`}
                    >
                      {previews.selfie ? (
                        <div className="flex flex-col items-center gap-1">
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          <span className="text-[11px] text-emerald-300 font-bold">{t.auth.changeImage}</span>
                        </div>
                      ) : (
                        <>
                          <Camera className="w-6 h-6 text-zinc-400 mb-1.5" />
                          <span className="text-xs font-bold text-white">{t.auth.selfieId}</span>
                          <span className="text-[10px] text-zinc-400 mt-1">{locale === 'ar' ? 'اضغط لرفع الصورة' : 'Click to upload'}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2.5">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full py-4 px-4 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-[#222222] via-[#3D3D3D] to-[#222222] border border-zinc-500 hover:border-white shadow-2xl hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                        <span>{locale === 'ar' ? 'جاري رفع المستندات...' : 'Uploading Documents...'}</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>{locale === 'ar' ? 'إرسال وتحديث المستندات للمراجعة' : 'Submit & Update Documents'}</span>
                      </>
                    )}
                  </button>

                  <a
                    href="https://wa.me/+96590000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-2xl text-xs font-bold text-zinc-300 hover:text-white bg-white/5 border border-zinc-700 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>{t.auth.contactSupport}</span>
                  </a>
                </div>
              </form>
            </div>
          ) : isRejected ? (
            /* ========================================================
               الحالة 2: الحساب مرفوض (Rejected - 3)
               AccountRejectedScreen
               ======================================================== */
            <div className="space-y-6 animate-fade-in text-center">
              <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400 shadow-2xl">
                <AlertTriangle className="w-10 h-10" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 border border-red-500/40 text-red-300 mb-3">
                  <span>{locale === 'ar' ? 'حالة الحساب: مرفوض' : 'Account Status: Rejected'}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                  {locale === 'ar' ? 'تعذر قبول توثيق الحساب' : 'Account Verification Rejected'}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
                  {locale === 'ar'
                    ? 'قامت إدارة منصة سوق الإبل بمراجعة طلبك وتم رفض صور الهوية أو بيانات الحساب للأسباب التالية:'
                    : 'The administration has reviewed your account and rejected it for the following reasons:'}
                </p>
              </div>

              {/* بطاقة سبب الرفض البارزة */}
              <div className="p-5 rounded-2xl bg-red-950/40 border border-red-500/40 text-right space-y-1.5 shadow-inner">
                <div className="text-red-300 text-xs font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{locale === 'ar' ? 'سبب الرفض الرسمي:' : 'Official Rejection Reason:'}</span>
                </div>
                <p className="text-xs sm:text-sm text-red-100 font-semibold leading-relaxed pr-5">
                  {displayReason}
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <Link
                  href="/auth/pending-approval?action=modify"
                  className="w-full py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#222222] via-[#3D3D3D] to-[#222222] border border-zinc-500 hover:border-white shadow-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileEdit className="w-4 h-4 text-amber-400" />
                  <span>{locale === 'ar' ? 'إعادة رفع وتعديل المستندات' : 'Re-upload Verification Documents'}</span>
                </Link>

                <a
                  href="https://wa.me/+96590000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-2xl text-xs font-bold text-zinc-300 hover:text-white bg-white/5 border border-zinc-700 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>{t.auth.contactSupport}</span>
                </a>
              </div>
            </div>
          ) : (
            /* ========================================================
               الحالة 3: قيد المراجعة (Pending - 1)
               شاشة "حسابك قيد المراجعة"
               ======================================================== */
            <div className="space-y-6 animate-fade-in text-center">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-zinc-700 flex items-center justify-center text-white shadow-2xl">
                  <Clock className="w-10 h-10 text-zinc-300 animate-pulse" />
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-zinc-600 text-white mb-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{t.auth.officialPlatform}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                  {t.auth.pendingApprovalTitle}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-300 font-medium mt-3 leading-relaxed">
                  {t.auth.pendingApprovalDesc}
                </p>
              </div>

              {uploadSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{locale === 'ar' ? 'تم استلام طلبك بنجاح وهو قيد التدقيق' : 'Request received and under review'}</span>
                </div>
              )}

              <div className="pt-2 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleCheckStatus}
                  disabled={isChecking}
                  className="w-full py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#222222] via-[#3D3D3D] to-[#222222] border border-zinc-500 hover:border-white shadow-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RotateCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                  <span>{isChecking ? (locale === 'ar' ? 'جاري التحقق...' : 'Checking...') : t.auth.checkStatus}</span>
                </button>

                <a
                  href="https://wa.me/+96590000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-2xl text-xs font-bold text-zinc-300 hover:text-white bg-white/5 border border-zinc-700 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>{t.auth.contactSupport}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* التذييل */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-zinc-400 border-t border-zinc-900 bg-[#000000]/80">
        {t.footer.rights}
      </footer>
    </div>
  );
}

export default function PendingApprovalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#000000] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-zinc-600 border-t-white animate-spin"></div>
        </div>
      }
    >
      <PendingApprovalInner />
    </Suspense>
  );
}
