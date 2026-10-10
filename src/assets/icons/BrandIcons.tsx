export interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

// 1. تراث عريق (حدوة الحصان)
export const LegacyIcon = ({ size = 28, color = 'currentColor', className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 4v5a6 6 0 0 0 12 0V4" />
    <path d="M4 4h4" />
    <path d="M16 4h4" />
    <circle cx="8" cy="9" r="1" fill={color} />
    <circle cx="16" cy="9" r="1" fill={color} />
    <circle cx="10" cy="13" r="1" fill={color} />
    <circle cx="14" cy="13" r="1" fill={color} />
  </svg>
);

// 2. خبرة وتميز (الكأس)
export const ExcellenceIcon = ({ size = 28, color = 'currentColor', className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34" />
    <path d="M18 4H6v7a6 6 0 0 0 12 0V4Z" />
  </svg>
);

// 3. أصالة وفخامة (رأس الإبل)
export const LuxuryIcon = ({ size = 28, color = 'currentColor', className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 19c-1-3-2-7-5-9-1.5-1-4-1-6-3l-1-4c0 0-3 1-3 5 0 2.5 1 4 2 6l-3 4h16z" />
    <circle cx="10" cy="9" r="1" fill={color} />
  </svg>
);

// 4. ثقة وأمان (الدرع المعتمد)
export const TrustIcon = ({ size = 28, color = 'currentColor', className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

// 5. تواصل ونزاهة (المصافحة من هوية سوق الإبل)
export const HandshakeIcon = ({ size = 28, color = 'currentColor', className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.6-4.6a2 2 0 0 0 0-2.8l-1.4-1.4a2 2 0 0 0-2.8 0l-1.8 1.8" />
    <path d="m18 14 3-3a2 2 0 0 0 0-2.8l-1.4-1.4a2 2 0 0 0-2.8 0l-3 3" />
    <path d="M14 6 8.5 11.5a2 2 0 0 0 0 2.8l1.4 1.4a2 2 0 0 0 2.8 0L17 11" />
    <path d="m6 14-3-3a2 2 0 0 1 0-2.8l1.4-1.4a2 2 0 0 1 2.8 0l3 3" />
  </svg>
);

// 6. جودة وتميز (شارة الجودة من هوية سوق الإبل)
export const QualityBadgeIcon = ({ size = 28, color = 'currentColor', className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="9" r="6" />
    <path d="m9 9 2 2 4-4" />
    <path d="M8.21 13.89 7 22l5-3 5 3-1.21-8.11" />
  </svg>
);

// 7. الهوية العربية (النخلة من هوية سوق الإبل)
export const PalmIcon = ({ size = 28, color = 'currentColor', className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22v-9" />
    <path d="M12 13c-3-2-6-1-8 2 2-3 5-5 8-4" />
    <path d="M12 13c3-2 6-1 8 2-2-3-5-5-8-4" />
    <path d="M12 13c-2-4-1-7 2-9-3 1-4 4-2 9" />
    <path d="M12 13c2-4 1-7-2-9 3 1 4 4 2 9" />
    <path d="M12 13c0-5 2-8 5-9-3 0-5 3-5 9" />
    <path d="M12 13c0-5-2-8-5-9 3 0 5 3 5 9" />
  </svg>
);

// 8. أصالة وتراث (الجمل من هوية سوق الإبل)
export const CamelSilhouetteIcon = ({ size = 28, color = 'currentColor', className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 18v-4l2-2 1-3 2-1 1 2 2 0 1-2 2-1 2 1 2 4 1 5" />
    <path d="M7 18v-3" />
    <path d="M17 18v-3" />
    <path d="M19 18v-3" />
    <path d="M5 18v-2" />
  </svg>
);
