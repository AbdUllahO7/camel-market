export interface LogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const SheepLogo = ({
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
        <circle cx="100" cy="100" r="75" fill="var(--brand-light, #D3E2D8)" fillOpacity="0.45" />
        <g fill="var(--brand-primary, #1E2C22)">
          <path d="M126 70 C128 62, 120 54, 110 58 C104 60, 100 68, 96 74 C86 72, 74 76, 68 84 C60 94, 62 108, 64 120 C64 126, 70 132, 78 132 C88 132, 98 128, 108 124 C118 118, 124 108, 124 96 C124 88, 126 78, 126 70 Z" />
          <path d="M76 130 L72 162 L80 162 L84 135 Z" />
          <path d="M90 128 L88 162 L95 162 L98 132 Z" />
          <path d="M106 124 L108 162 L116 162 L114 128 Z" />
          <path d="M118 118 L122 162 L129 162 L125 122 Z" />
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
              color: 'var(--brand-primary, #1E2C22)',
              lineHeight: 1.2,
            }}
          >
            سوق الغنم
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '3px 0' }}>
            <span style={{ width: '16px', height: '1px', backgroundColor: 'var(--brand-medium, #7D9B86)', opacity: 0.5 }}></span>
            <span style={{ width: '4px', height: '4px', backgroundColor: 'var(--brand-medium, #7D9B86)', transform: 'rotate(45deg)', margin: '0 4px' }}></span>
            <span style={{ width: '16px', height: '1px', backgroundColor: 'var(--brand-medium, #7D9B86)', opacity: 0.5 }}></span>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-main)',
              fontWeight: 400,
              fontSize: '0.85rem',
              color: 'var(--brand-secondary, #496050)',
            }}
          >
            للأنعام والنوادر والمواشي الأصيلة
          </div>
        </div>
      )}
    </div>
  );
};
