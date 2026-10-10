'use client';

import React, { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, verificationStatus } = useAuth();
  const router = useRouter();
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      startTransition(() => {
        router.replace('/auth/login');
      });
      return;
    }

    if (verificationStatus === 'pending_otp') {
      startTransition(() => {
        router.replace('/auth/register?step=3');
      });
      return;
    }

    if (verificationStatus === 'need_modification') {
      startTransition(() => {
        router.replace('/auth/pending-approval?action=modify');
      });
      return;
    }

    if (verificationStatus === 'rejected') {
      startTransition(() => {
        router.replace('/auth/pending-approval?status=rejected');
      });
      return;
    }

    if (verificationStatus === 'pending_approval') {
      startTransition(() => {
        router.replace('/auth/pending-approval');
      });
      return;
    }
  }, [isAuthenticated, isLoading, verificationStatus, router]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#000000] flex flex-col items-center justify-center p-4">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full border-2 border-[var(--brand-primary,#8B5E3C)]/20 border-t-[var(--brand-medium,#C88F45)] animate-spin flex items-center justify-center"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-12 h-12">
              <Image
                src="/Camels/logo-white.png"
                alt="سوق الإبل"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
        <h2 className="text-lg font-bold text-[var(--brand-surface,#F8F4EF)] tracking-wide">سوق الإبل</h2>
        <p className="text-xs text-[var(--brand-secondary,#D2B48C)] mt-1 animate-pulse">جاري التحقق من أمان الجلسة والتوثيق...</p>
      </div>
    );
  }

  if (!isAuthenticated || verificationStatus !== 'approved') {
    return null;
  }

  return <>{children}</>;
};
