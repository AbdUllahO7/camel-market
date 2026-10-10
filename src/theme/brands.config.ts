import type { BrandConfig, MarketId } from '@/types/brand';

/**
 * إعدادات الهويات البصرية للأسواق الثلاثة
 */
export const BRANDS_CONFIG: Record<MarketId, BrandConfig> = {
  // 1. سوق الإبل (الهوية المعتمدة لدليل سوق الإبل)
  Camels: {
    id: 'Camels',
    name: 'سوق الإبل',
    slogan: 'للخيول العربية الأصيلة',
    description: 'المنصة الخليجية الأولى لبيع وشراء الإبل العربية الأصيلة والمزادات والخدمات البيطرية ومعدات الإبل.',
    colors: {
      primary: '#2B2B2B',       // رمادي فحمي
      secondary: '#616161',     // رمادي غامق
      medium: '#8E8E8E',        // رمادي متوسط
      light: '#D1D1D1',         // رمادي فاتح
      surface: '#F7F7F7',       // أبيض نقي
      background: '#FFFFFF',
      textPrimary: '#2B2B2B',
      textSecondary: '#616161',
      border: '#E5E5E5',
    },
    typography: {
      fontFamily: "'Cairo', sans-serif",
      titleWeight: '600',       // Cairo SemiBold
      bodyWeight: '400',        // Cairo Regular
    },
    values: [
      {
        id: 'legacy',
        title: 'تراث عريق',
        subtitle: 'أصالة متجذرة في تاريخ الإبل العربي',
        iconName: 'legacy',
      },
      {
        id: 'excellence',
        title: 'خبرة وتميز',
        subtitle: 'أعلى معايير فحص وسلالات الإبل',
        iconName: 'excellence',
      },
      {
        id: 'luxury',
        title: 'أصالة وفخامة',
        subtitle: 'نخبة المرابط والإبل العربية البطلة',
        iconName: 'luxury',
      },
      {
        id: 'trust',
        title: 'ثقة وأمان',
        subtitle: 'توثيق رسمي وضمان مالي للعمليات',
        iconName: 'trust',
      },
    ],
    defaultCurrency: 'KWD',
    supportedCurrencies: [
      { code: 'KWD', label: 'دينار كويتي', symbol: 'د.ك' },
      { code: 'SAR', label: 'ريال سعودي', symbol: 'ر.س' },
      { code: 'AED', label: 'درهم إماراتي', symbol: 'د.إ' },
      { code: 'QAR', label: 'ريال قطري', symbol: 'ر.ق' },
      { code: 'BHD', label: 'دينار بحريني', symbol: 'د.ب' },
      { code: 'OMR', label: 'ريال عماني', symbol: 'ر.ع' },
    ],
    targetRegion: 'الكويت ودول مجلس التعاون الخليجي',
  },

  // 2. سوق الابل (الهوية المعتمدة لدليل سوق الابل)
  camels: {
    id: 'camels',
    name: 'سوق الإبل',
    slogan: 'للإبل والهجن العربية الأصيلة',
    description: 'المنصة الخليجية الأولى لبيع وشراء الإبل والهجن والمزادات المباشرة ومزاين الخليج وخدمات التضمير والفحص البيطري المعتمد.',
    colors: {
      primary: '#8B5E3C',       // بني برونزي صحراوي فاخر
      secondary: '#D2B48C',     // بيج رملي دافئ
      medium: '#C88F45',        // ذهبي كهرماني
      light: '#EED9C4',         // رملي فاتح ناعم
      surface: '#F8F4EF',       // عاجي صحراوي
      background: '#120F0C',    // أسود صحراوي فاخر
      textPrimary: '#F8F4EF',
      textSecondary: '#D2B48C',
      border: '#8B5E3C',
    },
    typography: {
      fontFamily: "'Cairo', sans-serif",
      titleWeight: '600',       // Cairo SemiBold
      bodyWeight: '400',        // Cairo Regular
    },
    values: [
      {
        id: 'handshake',
        title: 'تواصل ونزاهة',
        subtitle: 'معاملات موثوقة قائمة على الشفافية والأمانة',
        iconName: 'handshake',
      },
      {
        id: 'quality',
        title: 'جودة وتميز',
        subtitle: 'أعلى معايير السلالات ومواصفات المزاين والسباق',
        iconName: 'quality',
      },
      {
        id: 'palm',
        title: 'الهوية العربية',
        subtitle: 'إرث خليجي أصيل ممتد عبر الأجيال',
        iconName: 'palm',
      },
      {
        id: 'camel_heritage',
        title: 'أصالة وتراث',
        subtitle: 'أعرق سلالات الهجن ونخبة الفحول والنوادر',
        iconName: 'camel_heritage',
      },
      {
        id: 'trust',
        title: 'ثقة وأمان',
        subtitle: 'توثيق رسمي وفحوصات بيطرية وشرائح معتمدة',
        iconName: 'trust',
      },
    ],
    defaultCurrency: 'KWD',
    supportedCurrencies: [
      { code: 'KWD', label: 'دينار كويتي', symbol: 'د.ك' },
      { code: 'SAR', label: 'ريال سعودي', symbol: 'ر.س' },
      { code: 'AED', label: 'درهم إماراتي', symbol: 'د.إ' },
      { code: 'QAR', label: 'ريال قطري', symbol: 'ر.ق' },
      { code: 'BHD', label: 'دينار بحريني', symbol: 'د.ب' },
      { code: 'OMR', label: 'ريال عماني', symbol: 'ر.ع' },
    ],
    targetRegion: 'الكويت ودول مجلس التعاون الخليجي',
  },

  // 3. سوق الغنم
  sheep: {
    id: 'sheep',
    name: 'سوق الغنم',
    slogan: 'للأنعام والنوادر والمواشي الأصيلة',
    description: 'سوق المواشي والنوادر والأضاحي الأول في الخليج العربي بأعلى معايير الجودة والضمان الصحي.',
    colors: {
      primary: '#1E2C22',       // زيتي غابات داكن
      secondary: '#496050',     // زيتي متوسط
      medium: '#7D9B86',        // أخضر ترابي ناعم
      light: '#D3E2D8',         // رمادي عشبي فاتح
      surface: '#F4F8F5',       // أخضر فاتح نقي
      background: '#FFFFFF',
      textPrimary: '#1E2C22',
      textSecondary: '#496050',
      border: '#E1EBE4',
    },
    typography: {
      fontFamily: "'Cairo', sans-serif",
      titleWeight: '600',
      bodyWeight: '400',
    },
    values: [
      {
        id: 'legacy',
        title: 'ثروة حيوانية أصيلة',
        subtitle: 'أجود السلالات المحلية والمستوردة',
        iconName: 'legacy',
      },
      {
        id: 'excellence',
        title: 'مواصفات قياسية',
        subtitle: 'أفضل الأوزان والأعمار والصحة',
        iconName: 'excellence',
      },
      {
        id: 'luxury',
        title: 'نوادر وسلالات',
        subtitle: 'فحول ومنتجين من أندر الأصناف',
        iconName: 'luxury',
      },
      {
        id: 'trust',
        title: 'ضمان صحي بيطري',
        subtitle: 'فحص معتمد وتوصيل مبرد آمن',
        iconName: 'trust',
      },
    ],
    defaultCurrency: 'KWD',
    supportedCurrencies: [
      { code: 'KWD', label: 'دينار كويتي', symbol: 'د.ك' },
      { code: 'SAR', label: 'ريال سعودي', symbol: 'ر.س' },
      { code: 'AED', label: 'درهم إماراتي', symbol: 'د.إ' },
      { code: 'QAR', label: 'ريال قطري', symbol: 'ر.ق' },
      { code: 'BHD', label: 'دينار بحريني', symbol: 'د.ب' },
      { code: 'OMR', label: 'ريال عماني', symbol: 'ر.ع' },
    ],
    targetRegion: 'الكويت ودول مجلس التعاون الخليجي',
  },
};

export const DEFAULT_MARKET_ID: MarketId = 'camels';
