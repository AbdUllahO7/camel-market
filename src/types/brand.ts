export type MarketId = 'Camels' | 'camels' | 'sheep';

export interface BrandColorPalette {
  primary: string;       // اللون الرئيسي الغامق
  secondary: string;     // اللون الثانوي
  medium: string;        // اللون المتوسط
  light: string;         // اللون الفاتح
  surface: string;       // لون السطح والخلفيات الفاتحة
  background: string;    // خلفية الصفحة
  textPrimary: string;   // لون النصوص الرئيسية
  textSecondary: string; // لون النصوص الثانوية
  border: string;        // لون الحدود والفواصل
}

export type BrandIconName =
  | 'legacy'
  | 'excellence'
  | 'luxury'
  | 'trust'
  | 'handshake'
  | 'quality'
  | 'palm'
  | 'camel_heritage';

export interface BrandValueItem {
  id: string;
  title: string;
  subtitle?: string;
  iconName: BrandIconName;
}

export interface BrandConfig {
  id: MarketId;
  name: string;
  slogan: string;
  description: string;
  colors: BrandColorPalette;
  typography: {
    fontFamily: string;
    titleWeight: string;
    bodyWeight: string;
  };
  values: BrandValueItem[];
  defaultCurrency: string;
  supportedCurrencies: { code: string; label: string; symbol: string }[];
  targetRegion: string;
}
