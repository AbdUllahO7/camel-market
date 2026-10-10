export interface LogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const HorseLogo = ({
  className = '',
  size = 120,
  showText = true,
}: LogoProps) => {
  return (
    <div className={`flex flex-col items-center select-none ${className}`} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="75" fill="var(--brand-light, #D1D1D1)" fillOpacity="0.45" />
        <g fill="var(--brand-primary, #2B2B2B)">
          <path d="M125 50 C125 45, 118 42, 112 40 C108 38, 102 42, 100 48 C97 55, 98 62, 102 68 C96 72, 88 78, 82 86 C74 96, 70 108, 65 118 C61 125, 54 130, 48 132 C45 133, 44 136, 46 138 C52 143, 62 144, 70 138 C75 134, 78 128, 80 122 C85 125, 92 126, 100 125 C108 123, 114 118, 118 110 C124 99, 126 86, 125 74 C129 70, 133 63, 131 56 C130 52, 127 50, 125 50 Z" />
          <path d="M85 123 L80 162 L88 162 L94 130 Z" />
          <path d="M72 135 L64 162 L71 162 L79 138 Z" />
          <path d="M112 115 L120 162 L127 162 L121 122 Z" />
          <path d="M102 120 L108 145 L118 143 L122 135 L112 120 Z" />
          <path d="M52 130 C42 128, 32 132, 28 140 C26 144, 28 147, 32 148 C38 149, 44 144, 48 138 Z" />
          <rect x="35" y="166" width="130" height="3" rx="1.5" />
        </g>
      </svg>

      {showText && (
        <div style={{ textAlign: 'center', marginTop: '4px' }}>
          <div
            style={{
              fontFamily: 'var(--font-main)',
              fontWeight: 700,
              fontSize: '1.6rem',
              color: 'var(--brand-primary, #2B2B2B)',
              letterSpacing: '-0.5px',
              lineHeight: 1.2,
            }}
          >
            سوق الإبل
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '3px 0' }}>
            <span style={{ width: '16px', height: '1px', backgroundColor: 'var(--brand-medium, #8E8E8E)', opacity: 0.5 }}></span>
            <span style={{ width: '4px', height: '4px', backgroundColor: 'var(--brand-medium, #8E8E8E)', transform: 'rotate(45deg)', margin: '0 4px' }}></span>
            <span style={{ width: '16px', height: '1px', backgroundColor: 'var(--brand-medium, #8E8E8E)', opacity: 0.5 }}></span>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-main)',
              fontWeight: 400,
              fontSize: '0.85rem',
              color: 'var(--brand-secondary, #616161)',
            }}
          >
            للخيول العربية الأصيلة
          </div>
        </div>
      )}
    </div>
  );
};
