export interface LogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const CamelLogo = ({
  className = '',
  size = 130,
  showText = true,
}: LogoProps) => {
  return (
    <div
      className={`flex flex-col items-center select-none ${className}`}
      style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 240 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* خلفية الدائرة العاجية الذهبية */}
        <circle cx="120" cy="100" r="85" fill="var(--brand-secondary, #D2B48C)" fillOpacity="0.2" />

        <g fill="var(--brand-primary, #8B5E3C)">
          {/* جذع النخلة الفاخر */}
          <path d="M108 80 C107 105, 102 140, 92 165 L116 165 C114 135, 116 105, 114 80 Z" />

          {/* سعف وأغصان النخلة العربية */}
          {/* السعف العلوي الأيمن */}
          <path d="M110 78 C115 55, 140 45, 168 55 C160 62, 145 66, 130 70 C145 72, 162 76, 172 88 C158 88, 142 84, 128 80 C144 86, 156 96, 162 110 C148 104, 136 94, 122 84 Z" />
          {/* السعف العلوي الأيسر */}
          <path d="M110 78 C105 55, 80 45, 52 55 C60 62, 75 66, 90 70 C75 72, 58 76, 48 88 C62 88, 78 84, 92 80 C76 86, 64 96, 58 110 C72 104, 84 94, 98 84 Z" />
          {/* قمة النخلة المركزية */}
          <path d="M110 78 C102 58, 106 38, 110 25 C114 38, 118 58, 110 78 Z" />
          <path d="M110 78 C95 48, 110 32, 128 35 C122 46, 118 62, 110 78 Z" />
          <path d="M110 78 C125 48, 110 32, 92 35 C98 46, 102 62, 110 78 Z" />

          {/* الجمل العربي الأصيل الواقف بجانب النخلة */}
          {/* الرأس والعنق */}
          <path d="M152 92 C154 88, 158 86, 162 88 C164 90, 164 93, 161 95 C158 97, 157 101, 158 106 C160 114, 164 124, 168 132 C165 130, 160 125, 157 118 C154 112, 151 100, 152 92 Z" />
          {/* السنام والجسم */}
          <path d="M168 132 C172 128, 178 120, 185 120 C192 120, 196 128, 198 134 C204 135, 208 140, 206 148 C204 153, 200 156, 195 156 C184 156, 176 156, 168 152 C164 150, 160 142, 164 135 Z" />
          {/* القوائم الخلفية والأمامية */}
          <path d="M168 150 L166 168 L171 168 L174 153 Z" />
          <path d="M174 150 L176 168 L181 168 L180 152 Z" />
          <path d="M194 154 L193 168 L198 168 L200 154 Z" />
          <path d="M201 152 L204 168 L209 168 L206 152 Z" />
          {/* الذيل */}
          <path d="M206 148 C209 152, 209 158, 207 162 L205 162 C207 158, 207 154, 205 150 Z" />

          {/* خط الأرضية الأفقي */}
          <rect x="40" y="168" width="160" height="2.5" rx="1.2" fill="var(--brand-medium, #C88F45)" />
        </g>
      </svg>

      {showText && (
        <div style={{ textAlign: 'center', marginTop: '6px' }}>
          <div
            style={{
              fontFamily: 'var(--font-cairo), sans-serif',
              fontWeight: 700,
              fontSize: '1.8rem',
              color: 'var(--brand-primary, #8B5E3C)',
              letterSpacing: '-0.5px',
              lineHeight: 1.15,
            }}
          >
            سوق الإبل
          </div>

          {/* الزخرفة الهندسية المعينية في وسط الشعار */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px 0' }}>
            <span style={{ width: '22px', height: '1px', backgroundColor: 'var(--brand-medium, #C88F45)', opacity: 0.6 }}></span>
            <span style={{ width: '5px', height: '5px', backgroundColor: 'var(--brand-medium, #C88F45)', transform: 'rotate(45deg)', margin: '0 5px' }}></span>
            <span style={{ width: '22px', height: '1px', backgroundColor: 'var(--brand-medium, #C88F45)', opacity: 0.6 }}></span>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-cairo), sans-serif',
              fontWeight: 400,
              fontSize: '0.9rem',
              color: 'var(--brand-secondary, #D2B48C)',
            }}
          >
            للإبل والهجن العربية الأصيلة
          </div>
        </div>
      )}
    </div>
  );
};
