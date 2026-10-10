/**
 * إعدادات وثوابت منصة سوق الإبل
 */

export interface CountryItem {
  code: string;
  nameAr: string;
  nameEn: string;
  flag: string;
  currencyCode: string;
  currencySymbol: string;
  dialCode: string;
}

export type GccCountry = CountryItem;

export const APP_CONFIG = {
  appName: 'Camel Storefront',
  appNameAr: 'سوق الإبل',
  version: '1.0.0',
  defaultLocale: 'ar',
  direction: 'rtl',
  defaultCountry: 'KW',

  supportedCountries: [
    // 1. دول مجلس التعاون الخليجي (GCC)
    { code: 'KW', nameAr: 'الكويت', nameEn: 'Kuwait', flag: '🇰🇼', currencyCode: 'KWD', currencySymbol: 'د.ك', dialCode: '+965' },
    { code: 'SA', nameAr: 'السعودية', nameEn: 'Saudi Arabia', flag: '🇸🇦', currencyCode: 'SAR', currencySymbol: 'ر.س', dialCode: '+966' },
    { code: 'AE', nameAr: 'الإمارات', nameEn: 'UAE', flag: '🇦🇪', currencyCode: 'AED', currencySymbol: 'د.إ', dialCode: '+971' },
    { code: 'QA', nameAr: 'قطر', nameEn: 'Qatar', flag: '🇶🇦', currencyCode: 'QAR', currencySymbol: 'ر.ق', dialCode: '+974' },
    { code: 'BH', nameAr: 'البحرين', nameEn: 'Bahrain', flag: '🇧🇭', currencyCode: 'BHD', currencySymbol: 'د.ب', dialCode: '+973' },
    { code: 'OM', nameAr: 'عمان', nameEn: 'Oman', flag: '🇴🇲', currencyCode: 'OMR', currencySymbol: 'ر.ع', dialCode: '+968' },

    // 2. باقي الدول العربية
    { code: 'EG', nameAr: 'مصر', nameEn: 'Egypt', flag: '🇪🇬', currencyCode: 'EGP', currencySymbol: 'ج.م', dialCode: '+20' },
    { code: 'JO', nameAr: 'الأردن', nameEn: 'Jordan', flag: '🇯🇴', currencyCode: 'JOD', currencySymbol: 'د.أ', dialCode: '+962' },
    { code: 'IQ', nameAr: 'العراق', nameEn: 'Iraq', flag: '🇮🇶', currencyCode: 'IQD', currencySymbol: 'د.ع', dialCode: '+964' },
    { code: 'SY', nameAr: 'سوريا', nameEn: 'Syria', flag: '🇸🇾', currencyCode: 'SYP', currencySymbol: 'ل.س', dialCode: '+963' },
    { code: 'LB', nameAr: 'لبنان', nameEn: 'Lebanon', flag: '🇱🇧', currencyCode: 'LBP', currencySymbol: 'ل.ل', dialCode: '+961' },
    { code: 'PS', nameAr: 'فلسطين', nameEn: 'Palestine', flag: '🇵🇸', currencyCode: 'ILS', currencySymbol: '₪', dialCode: '+970' },
    { code: 'YE', nameAr: 'اليمن', nameEn: 'Yemen', flag: '🇾🇪', currencyCode: 'YER', currencySymbol: 'ر.ي', dialCode: '+967' },
    { code: 'LY', nameAr: 'ليبيا', nameEn: 'Libya', flag: '🇱🇾', currencyCode: 'LYD', currencySymbol: 'د.ل', dialCode: '+218' },
    { code: 'SD', nameAr: 'السودان', nameEn: 'Sudan', flag: '🇸🇩', currencyCode: 'SDG', currencySymbol: 'ج.س', dialCode: '+249' },
    { code: 'MA', nameAr: 'المغرب', nameEn: 'Morocco', flag: '🇲🇦', currencyCode: 'MAD', currencySymbol: 'د.م', dialCode: '+212' },
    { code: 'DZ', nameAr: 'الجزائر', nameEn: 'Algeria', flag: '🇩🇿', currencyCode: 'DZD', currencySymbol: 'د.ج', dialCode: '+213' },
    { code: 'TN', nameAr: 'تونس', nameEn: 'Tunisia', flag: '🇹🇳', currencyCode: 'TND', currencySymbol: 'د.ت', dialCode: '+216' },
    { code: 'MR', nameAr: 'موريتانيا', nameEn: 'Mauritania', flag: '🇲🇷', currencyCode: 'MRU', currencySymbol: 'أوقية', dialCode: '+222' },
    { code: 'SO', nameAr: 'الصومال', nameEn: 'Somalia', flag: '🇸🇴', currencyCode: 'SOS', currencySymbol: 'ش.ص', dialCode: '+252' },
    { code: 'DJ', nameAr: 'جيبوتي', nameEn: 'Djibouti', flag: '🇩🇯', currencyCode: 'DJF', currencySymbol: 'ف.ج', dialCode: '+253' },
    { code: 'KM', nameAr: 'جزر القمر', nameEn: 'Comoros', flag: '🇰🇲', currencyCode: 'KMF', currencySymbol: 'ف.ق', dialCode: '+269' },

    // 3. دول الشرق الأوسط وآسيا
    { code: 'TR', nameAr: 'تركيا', nameEn: 'Turkey', flag: '🇹🇷', currencyCode: 'TRY', currencySymbol: '₺', dialCode: '+90' },
    { code: 'IR', nameAr: 'إيران', nameEn: 'Iran', flag: '🇮🇷', currencyCode: 'IRR', currencySymbol: '﷼', dialCode: '+98' },
    { code: 'PK', nameAr: 'باكستان', nameEn: 'Pakistan', flag: '🇵🇰', currencyCode: 'PKR', currencySymbol: 'Rs', dialCode: '+92' },
    { code: 'IN', nameAr: 'الهند', nameEn: 'India', flag: '🇮🇳', currencyCode: 'INR', currencySymbol: '₹', dialCode: '+91' },
    { code: 'BD', nameAr: 'بنغلاديش', nameEn: 'Bangladesh', flag: '🇧🇩', currencyCode: 'BDT', currencySymbol: '৳', dialCode: '+880' },
    { code: 'AF', nameAr: 'أفغانستان', nameEn: 'Afghanistan', flag: '🇦🇫', currencyCode: 'AFN', currencySymbol: '؋', dialCode: '+93' },
    { code: 'MY', nameAr: 'ماليزيا', nameEn: 'Malaysia', flag: '🇲🇾', currencyCode: 'MYR', currencySymbol: 'RM', dialCode: '+60' },
    { code: 'ID', nameAr: 'إندونيسيا', nameEn: 'Indonesia', flag: '🇮🇩', currencyCode: 'IDR', currencySymbol: 'Rp', dialCode: '+62' },
    { code: 'PH', nameAr: 'الفلبين', nameEn: 'Philippines', flag: '🇵🇭', currencyCode: 'PHP', currencySymbol: '₱', dialCode: '+63' },
    { code: 'SG', nameAr: 'سنغافورة', nameEn: 'Singapore', flag: '🇸🇬', currencyCode: 'SGD', currencySymbol: 'S$', dialCode: '+65' },
    { code: 'TH', nameAr: 'تايلاند', nameEn: 'Thailand', flag: '🇹🇭', currencyCode: 'THB', currencySymbol: '฿', dialCode: '+66' },
    { code: 'VN', nameAr: 'فيتنام', nameEn: 'Vietnam', flag: '🇻🇳', currencyCode: 'VND', currencySymbol: '₫', dialCode: '+84' },
    { code: 'CN', nameAr: 'الصين', nameEn: 'China', flag: '🇨🇳', currencyCode: 'CNY', currencySymbol: '¥', dialCode: '+86' },
    { code: 'JP', nameAr: 'اليابان', nameEn: 'Japan', flag: '🇯🇵', currencyCode: 'JPY', currencySymbol: '¥', dialCode: '+81' },
    { code: 'KR', nameAr: 'كوريا الجنوبية', nameEn: 'South Korea', flag: '🇰🇷', currencyCode: 'KRW', currencySymbol: '₩', dialCode: '+82' },
    { code: 'HK', nameAr: 'هونغ كونغ', nameEn: 'Hong Kong', flag: '🇭🇰', currencyCode: 'HKD', currencySymbol: 'HK$', dialCode: '+852' },
    { code: 'AZ', nameAr: 'أذربيجان', nameEn: 'Azerbaijan', flag: '🇦🇿', currencyCode: 'AZN', currencySymbol: '₼', dialCode: '+994' },
    { code: 'KZ', nameAr: 'كازاخستان', nameEn: 'Kazakhstan', flag: '🇰🇿', currencyCode: 'KZT', currencySymbol: '₸', dialCode: '+7' },
    { code: 'UZ', nameAr: 'أوزبكستان', nameEn: 'Uzbekistan', flag: '🇺🇿', currencyCode: 'UZS', currencySymbol: 'soʻm', dialCode: '+998' },

    // 4. دول أوروبا
    { code: 'GB', nameAr: 'المملكة المتحدة', nameEn: 'United Kingdom', flag: '🇬🇧', currencyCode: 'GBP', currencySymbol: '£', dialCode: '+44' },
    { code: 'DE', nameAr: 'ألمانيا', nameEn: 'Germany', flag: '🇩🇪', currencyCode: 'EUR', currencySymbol: '€', dialCode: '+49' },
    { code: 'FR', nameAr: 'فرنسا', nameEn: 'France', flag: '🇫🇷', currencyCode: 'EUR', currencySymbol: '€', dialCode: '+33' },
    { code: 'IT', nameAr: 'إيطاليا', nameEn: 'Italy', flag: '🇮🇹', currencyCode: 'EUR', currencySymbol: '€', dialCode: '+39' },
    { code: 'ES', nameAr: 'إسبانيا', nameEn: 'Spain', flag: '🇪🇸', currencyCode: 'EUR', currencySymbol: '€', dialCode: '+34' },
    { code: 'NL', nameAr: 'هولندا', nameEn: 'Netherlands', flag: '🇳🇱', currencyCode: 'EUR', currencySymbol: '€', dialCode: '+31' },
    { code: 'BE', nameAr: 'بلجيكا', nameEn: 'Belgium', flag: '🇧🇪', currencyCode: 'EUR', currencySymbol: '€', dialCode: '+32' },
    { code: 'CH', nameAr: 'سويسرا', nameEn: 'Switzerland', flag: '🇨🇭', currencyCode: 'CHF', currencySymbol: 'CHF', dialCode: '+41' },
    { code: 'AT', nameAr: 'النمسا', nameEn: 'Austria', flag: '🇦🇹', currencyCode: 'EUR', currencySymbol: '€', dialCode: '+43' },
    { code: 'SE', nameAr: 'السويد', nameEn: 'Sweden', flag: '🇸🇪', currencyCode: 'SEK', currencySymbol: 'kr', dialCode: '+46' },
    { code: 'NO', nameAr: 'النرويج', nameEn: 'Norway', flag: '🇳🇴', currencyCode: 'NOK', currencySymbol: 'kr', dialCode: '+47' },
    { code: 'DK', nameAr: 'الدنمارك', nameEn: 'Denmark', flag: '🇩🇰', currencyCode: 'DKK', currencySymbol: 'kr', dialCode: '+45' },
    { code: 'FI', nameAr: 'فنلندا', nameEn: 'Finland', flag: '🇫🇮', currencyCode: 'EUR', currencySymbol: '€', dialCode: '+358' },
    { code: 'IE', nameAr: 'أيرلندا', nameEn: 'Ireland', flag: '🇮🇪', currencyCode: 'EUR', currencySymbol: '€', dialCode: '+353' },
    { code: 'PL', nameAr: 'بولندا', nameEn: 'Poland', flag: '🇵🇱', currencyCode: 'PLN', currencySymbol: 'zł', dialCode: '+48' },
    { code: 'PT', nameAr: 'البرتغال', nameEn: 'Portugal', flag: '🇵🇹', currencyCode: 'EUR', currencySymbol: '€', dialCode: '+351' },
    { code: 'GR', nameAr: 'اليونان', nameEn: 'Greece', flag: '🇬🇷', currencyCode: 'EUR', currencySymbol: '€', dialCode: '+30' },
    { code: 'CZ', nameAr: 'التشيك', nameEn: 'Czech Republic', flag: '🇨🇿', currencyCode: 'CZK', currencySymbol: 'Kč', dialCode: '+420' },
    { code: 'HU', nameAr: 'المجر', nameEn: 'Hungary', flag: '🇭🇺', currencyCode: 'HUF', currencySymbol: 'Ft', dialCode: '+36' },
    { code: 'RO', nameAr: 'رومانيا', nameEn: 'Romania', flag: '🇷🇴', currencyCode: 'RON', currencySymbol: 'lei', dialCode: '+40' },
    { code: 'RU', nameAr: 'روسيا', nameEn: 'Russia', flag: '🇷🇺', currencyCode: 'RUB', currencySymbol: '₽', dialCode: '+7' },
    { code: 'UA', nameAr: 'أوكرانيا', nameEn: 'Ukraine', flag: '🇺🇦', currencyCode: 'UAH', currencySymbol: '₴', dialCode: '+380' },

    // 5. الأمريكتين
    { code: 'US', nameAr: 'الولايات المتحدة', nameEn: 'United States', flag: '🇺🇸', currencyCode: 'USD', currencySymbol: '$', dialCode: '+1' },
    { code: 'CA', nameAr: 'كندا', nameEn: 'Canada', flag: '🇨🇦', currencyCode: 'CAD', currencySymbol: 'C$', dialCode: '+1' },
    { code: 'BR', nameAr: 'البرازيل', nameEn: 'Brazil', flag: '🇧🇷', currencyCode: 'BRL', currencySymbol: 'R$', dialCode: '+55' },
    { code: 'MX', nameAr: 'المكسيك', nameEn: 'Mexico', flag: '🇲🇽', currencyCode: 'MXN', currencySymbol: '$', dialCode: '+52' },
    { code: 'AR', nameAr: 'الأرجنتين', nameEn: 'Argentina', flag: '🇦🇷', currencyCode: 'ARS', currencySymbol: '$', dialCode: '+54' },
    { code: 'CL', nameAr: 'تشيلي', nameEn: 'Chile', flag: '🇨🇱', currencyCode: 'CLP', currencySymbol: '$', dialCode: '+56' },
    { code: 'CO', nameAr: 'كولومبيا', nameEn: 'Colombia', flag: '🇨🇴', currencyCode: 'COP', currencySymbol: '$', dialCode: '+57' },

    // 6. أوقيانوسيا وأفريقيا
    { code: 'AU', nameAr: 'أستراليا', nameEn: 'Australia', flag: '🇦🇺', currencyCode: 'AUD', currencySymbol: 'A$', dialCode: '+61' },
    { code: 'NZ', nameAr: 'نيوزيلندا', nameEn: 'New Zealand', flag: '🇳🇿', currencyCode: 'NZD', currencySymbol: 'NZ$', dialCode: '+64' },
    { code: 'ZA', nameAr: 'جنوب أفريقيا', nameEn: 'South Africa', flag: '🇿🇦', currencyCode: 'ZAR', currencySymbol: 'R', dialCode: '+27' },
    { code: 'NG', nameAr: 'نيجيريا', nameEn: 'Nigeria', flag: '🇳🇬', currencyCode: 'NGN', currencySymbol: '₦', dialCode: '+234' },
    { code: 'KE', nameAr: 'كينيا', nameEn: 'Kenya', flag: '🇰🇪', currencyCode: 'KES', currencySymbol: 'KSh', dialCode: '+254' },
    { code: 'ET', nameAr: 'إثيوبيا', nameEn: 'Ethiopia', flag: '🇪🇹', currencyCode: 'ETB', currencySymbol: 'Br', dialCode: '+251' },
    { code: 'GH', nameAr: 'غانا', nameEn: 'Ghana', flag: '🇬🇭', currencyCode: 'GHS', currencySymbol: 'GH₵', dialCode: '+233' },
  ] as CountryItem[],

  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.camel.market/api/',
};
