import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { ToastProvider } from "@/core/context/ToastContext";
import { BackToTop } from "@/core/components/BackToTop";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://camel.market'),
  title: {
    default: "سوق الإبل | المنصة الأولى للإبل والهجن العربية الأصيلة والمزادات الحية",
    template: "%s | سوق الإبل",
  },
  description: "المنصة الخليجية الرائدة لبيع وشراء الإبل والهجن العربية الأصيلة، المزادات الحية الفورية، عزب ومزاين الهجن، وخدمات الفحص البيطري المعتمدة في الكويت ودول الخليج العربي.",
  keywords: [
    "سوق الإبل",
    "إبل عربية أصيلة",
    "هجن السباق",
    "مزادات إبل حية",
    "بيع وشراء الإبل",
    "مزاين الإبل",
    "عزب الكويت والسعودية",
    "مجاهيم ووضح وصفر",
    "سوق الهجن الخليجي",
  ],
  authors: [{ name: "سوق الإبل", url: "https://camel.market" }],
  creator: "Camel Market Team",
  publisher: "Camel Market",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "ar-KW": "/",
      "en-US": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_KW",
    url: "https://camel.market",
    title: "سوق الإبل | المنصة الأولى للإبل والهجن العربية الأصيلة والمزادات الحية",
    description: "المنصة الخليجية الرائدة لبيع وشراء الإبل والهجن العربية الأصيلة، المزادات الحية، ومزاين الخليج المعتمدة.",
    siteName: "سوق الإبل - Camel Market",
    images: [
      {
        url: "/Camels/hero.png",
        width: 1200,
        height: 630,
        alt: "سوق الإبل - الإبل والهجن العربية الأصيلة والمزادات",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "سوق الإبل | للإبل والهجن العربية الأصيلة والمزادات الحية",
    description: "منصة المزادات الحية وسوق الإبل والهجن العربية الأصيلة في الكويت ودول الخليج.",
    images: ["/Camels/hero.png"],
    creator: "@camel_market",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} font-sans`}>
      <body className="min-h-screen bg-[#000000] text-white antialiased">
        <LanguageProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
              <BackToTop />
            </ToastProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
