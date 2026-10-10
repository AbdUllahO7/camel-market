'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { SubscriptionModal } from '@/features/auth/components/SubscriptionModal';
import { useAuth } from '@/features/auth/context/AuthContext';
import { TopBar } from '@/features/home/components/TopBar';
import { Navbar } from '@/features/home/components/Navbar';
import { HeroSection } from '@/features/home/components/HeroSection';
import { AudienceBar } from '@/features/home/components/AudienceBar';
import { AboutSection } from '@/features/home/components/AboutSection';
import { ServicesSection } from '@/features/home/components/ServicesSection';
import { WhyUsSection } from '@/features/home/components/WhyUsSection';
import { AuctionsSection } from '@/features/auctions/components/AuctionsSection';
import { AppDownloadSection } from '@/features/home/components/AppDownloadSection';
import { CustomerReviewsSection } from '@/features/home/components/CustomerReviewsSection';
import { BlogSection } from '@/features/home/components/BlogSection';
import { ContactSection } from '@/features/home/components/ContactSection';
import { Footer } from '@/features/home/components/Footer';

function HomeContent() {
  const { hasActiveSubscription, user } = useAuth();
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col overflow-x-hidden selection:bg-[#616161] selection:text-white">
      {/* شريط تنبيه الاشتراك للمستخدم المعتمد الذي لم يشترك بعد */}
      {!hasActiveSubscription && (
        <div className="bg-gradient-to-r from-[#1F1F1F] via-[#2B2B2B] to-[#1F1F1F] border-b border-[#D1D1D1]/20 py-2.5 px-4 text-center text-xs sm:text-sm text-[#D1D1D1] flex items-center justify-center gap-3 relative z-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>
              مرحباً {user?.fullName || 'بك'}! حسابك موثق، لتفعيل المزايدة أو نشر الإبل والمستلزمات يرجى تفعيل باقة الاشتراك
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsSubscriptionModalOpen(true)}
            className="px-3 py-1 rounded-lg text-xs font-bold text-black bg-white hover:bg-[#D1D1D1] transition-all flex items-center gap-1 shadow-md cursor-pointer"
          >
            <span>عرض الباقة</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. الشريط العلوي المعتمد (TopBar) */}
      <TopBar />

      {/* 2. الحاوية المشتركة للهيرو وشريط التنقل العائم فوق الصورة تماماً كما في فيجما */}
      <div className="relative w-full">
        {/* شريط التنقل الشفاف العائم فوق صورة الهيرو */}
        <div className="absolute top-2 sm:top-4 left-0 right-0 z-40">
          <Navbar onOpenSubscription={() => setIsSubscriptionModalOpen(true)} />
        </div>

        {/* القسم الرئيسي (Hero Section) */}
        <HeroSection />

        {/* 3. شريط الفئات العائم (منصة مخصصة لكل الفئات) */}
        <div className="pb-16 bg-[#000000]">
          <AudienceBar />
        </div>
      </div>

      {/* 4. قسم من نحن (About Us Section) */}
      <AboutSection />

      {/* 5. قسم خدماتنا (Services Section) */}
      <ServicesSection />

      {/* 6. قسم لماذا تختارنا (Why Us Section) */}
      <WhyUsSection />

      {/* 7. قسم المزادات المباشرة (Auctions Section) */}
      <AuctionsSection />

      {/* 7. قسم تحميل التطبيق (App Download Section) */}
      <AppDownloadSection />

      {/* 8. قسم آراء العملاء (Customer Review
      
      s Section) */}
      <CustomerReviewsSection />

      {/* 9. قسم المدونة (Blog Section) */}
      <BlogSection />

      {/* 10. قسم تواصل معنا (Contact Us Section) */}
      <ContactSection />

      {/* 11. تذييل الصفحة (Footer) */}
      <Footer />

      {/* نافذة باقة الاشتراك حسب الدور */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        canDismiss={true}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  );
}
