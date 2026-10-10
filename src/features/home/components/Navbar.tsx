'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User as UserIcon, LogOut, Sparkles, ShieldCheck, Gavel, Wallet } from "lucide-react";
import { useLanguage } from "@/i18n";
import { useAuth } from "@/features/auth/context/AuthContext";
import { WalletModal } from "@/features/wallet/components/WalletModal";

interface NavbarProps {
  onOpenSubscription?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSubscription }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(
    pathname?.startsWith("/auctions") ? "auctions" : "home"
  );
  const { t, isRtl } = useLanguage();
  const { user, isAuthenticated, hasActiveSubscription, logout } = useAuth();

  const navLinks = [
    { id: "home", label: t.navbar.home, href: "/#home" },
    { id: "about", label: t.navbar.about, href: "/#about" },
    { id: "services", label: t.navbar.services, href: "/#services" },
    { id: "auctions", label: isRtl ? "المزادات الحية" : "Live Auctions", href: "/auctions" },
    { id: "blog", label: t.navbar.blog, href: "/#blog" },
    { id: "contact", label: t.navbar.contactUs, href: "/#contact" },
  ];

  useEffect(() => {
    if (pathname?.startsWith("/auctions")) {
      setActiveSection("auctions");
      return;
    }

    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const handleScroll = () => {
      const sections = ["home", "about", "services", "auctions", "reviews", "blog", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "Customer":
        return isRtl ? "مشتري" : "Buyer";
      case "StoreOwner":
        return isRtl ? "صاحب متجر" : "Store";
      case "StableOwner":
        return isRtl ? "صاحب عزبة / مزرعة" : "Farm / Izba";
      case "Advertiser":
        return isRtl ? "معلن" : "Advertiser";
      default:
        return isRtl ? "عضو معتمد" : "Member";
    }
  };

  return (
    <nav className="w-full relative z-40 px-4 sm:px-8 md:px-12 pt-4 pb-2">
      <div
        className="max-w-7xl mx-auto rounded-2xl bg-[#14100C]/85 backdrop-blur-md px-6 py-3.5 flex items-center justify-between border shadow-2xl transition-all duration-300"
        style={{
          borderColor: "rgba(139, 94, 60, 0.4)",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.7)",
        }}
      >
        {/* الشعار */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#C88F45] p-1.5 flex items-center justify-center shadow-md">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-[#F8F4EF]" stroke="currentColor" strokeWidth="2">
                <path d="M5 18V14C5 13 6 12 7 12C9 12 10 9 12 9C14 9 15 12 18 12C19.5 12 21 10 21 8C21 6.5 20 6 18.5 6C17 6 15.5 4 14.5 3C14 2 12.5 2 12 3C11 4.5 12 6.5 13 8L11 11C9 11 8 10 6 10C4 10 3 13 3 15" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 18V21M10 18V21M15 18V21M19 18V21" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-extrabold text-white tracking-tight group-hover:text-[#D2B48C] transition-colors">
                {isRtl ? "سوق الإبل" : "Camel Market"}
              </span>
              <span className="text-[10px] text-[#D2B48C] font-medium leading-none">
                {isRtl ? "للإبل والهجن الأصيلة" : "Arabian Camels"}
              </span>
            </div>
          </Link>
        </div>

        {/* روابط التنقل في المنتصف */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <Link
                key={link.id}
                href={link.href}
                className={`relative py-1 text-sm xl:text-base font-semibold transition-colors duration-200 ${
                  isActive ? "text-[#D2B48C] font-bold" : "text-[#D1D1D1] hover:text-[#F8F4EF]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full bg-[#C88F45]"
                    style={{
                      boxShadow: "0 0 8px rgba(200, 143, 69, 0.8)",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* الجانب الأيسر: زر الباقة وحساب المستخدم والمحفظة */}
        <div className="hidden md:flex items-center gap-2.5">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2.5">
              {/* زر المحفظة السريعة */}
              <button
                type="button"
                onClick={() => setIsWalletModalOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#D2B48C] hover:text-white bg-[#1E1712] hover:bg-[#2A2019] border border-[#8B5E3C]/40 hover:border-[#C88F45] transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                title={isRtl ? "المحفظة والرصيد" : "Wallet"}
              >
                <Wallet className="w-3.5 h-3.5 text-[#C88F45]" />
                <span>{isRtl ? "المحفظة" : "Wallet"}</span>
              </button>

              {/* زر تفعيل الاشتراك إذا لم يشترك */}
              {!hasActiveSubscription && onOpenSubscription && (
                <button
                  type="button"
                  onClick={onOpenSubscription}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B5E3C] via-[#C88F45] to-[#8B5E3C] border border-[#D2B48C]/40 hover:border-white shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                  <span>{isRtl ? "تفعيل الاشتراك" : "Activate Plan"}</span>
                </button>
              )}

              {/* شارة المستخدم والدور */}
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-[#8B5E3C]/30">
                <div className="w-7 h-7 rounded-full bg-[#8B5E3C]/30 border border-[#C88F45] flex items-center justify-center text-[#F8F4EF] text-xs font-bold">
                  {user.fullName ? user.fullName[0] : "إ"}
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-white leading-tight line-clamp-1">
                    {user.fullName}
                  </span>
                  <span className="text-[10px] text-[#C88F45] font-semibold">
                    {getRoleBadge(user.role)}
                  </span>
                </div>
              </div>

              {/* زر الخروج */}
              <button
                type="button"
                onClick={() => logout()}
                className="p-2 rounded-xl text-[#8E8E8E] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                title={isRtl ? "تسجيل الخروج" : "Logout"}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#D2B48C] hover:text-white hover:bg-white/10 transition-colors"
              >
                {isRtl ? "تسجيل الدخول" : "Login"}
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B5E3C] to-[#C88F45] hover:brightness-110 transition-all shadow-md"
              >
                {isRtl ? "حساب جديد" : "Register"}
              </Link>
            </div>
          )}
        </div>

        {/* زر القائمة للشاشات الصغيرة */}
        <div className="lg:hidden flex items-center">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-[#D1D1D1] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* قائمة الجوال المنسدلة */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-2 max-w-7xl mx-auto rounded-2xl bg-[#121212] border border-[#2B2B2B] p-4 flex flex-col gap-3 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg text-sm font-semibold text-[#D1D1D1] hover:text-white hover:bg-white/5 transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated && user && (
            <div className="pt-2 border-t border-[#2B2B2B] flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsWalletModalOpen(true);
                }}
                className="py-2 px-3 rounded-lg text-sm font-semibold text-white bg-[#1C1C1C] hover:bg-[#282828] border border-[#333] flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-amber-300" />
                  <span>{isRtl ? "المحفظة والرصيد" : "My Wallet"}</span>
                </div>
              </button>

              {!hasActiveSubscription && onOpenSubscription && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenSubscription();
                  }}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2B2B2B] via-[#4A4A4A] to-[#2B2B2B] border border-amber-400/40 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isRtl ? "تفعيل باقة الاشتراك" : "Activate Plan"}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="py-2 px-3 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>{isRtl ? "تسجيل الخروج" : "Logout"}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* نافذة المحفظة الإلكترونية */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </nav>
  );
};
