import React from 'react';

export interface IconProps {
  size?: number | string;
  className?: string;
  color?: string;
}

// 1. درع الأمان والتوثيق (منصة موثوقة)
export const ShieldTrustIcon: React.FC<IconProps> = ({ size = 28, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M12 2L4 6V12C4 17.52 7.41 22.61 12 24C16.59 22.61 20 17.52 20 12V6L12 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 12L11 14L15 10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 2. مطرقة المزادات (مزادات إلكترونية)
export const GavelAuctionIcon: React.FC<IconProps> = ({ size = 28, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M14 3L21 10L19 12L12 5L14 3Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.5 9.5L6.5 17.5C5.67157 18.3284 5.67157 19.6716 6.5 20.5C7.32843 21.3284 8.67157 21.3284 9.5 20.5L17.5 12.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 21H10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// 3. فقاعات المحادثة (تواصل مباشر)
export const ChatDirectIcon: React.FC<IconProps> = ({ size = 28, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M216 140V116C216 78 246 48 284 48H396C434 48 464 78 464 116V184L494 238L440 228C432 256 406 276 374 276H358"
      stroke={color}
      strokeWidth="32"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M104 464L174 400H286C325.765 400 358 367.765 358 328V212C358 172.235 325.765 140 286 140H110C70.2355 140 38 172.235 38 212V328C38 367.765 70.2355 400 110 400V464Z"
      stroke={color}
      strokeWidth="32"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="125" cy="270" r="18" fill={color} />
    <circle cx="198" cy="270" r="18" fill={color} />
    <circle cx="271" cy="270" r="18" fill={color} />
  </svg>
);

// 4. الإبل الأصيلة (عرض احترافي للإبل)
export const CamelProIcon: React.FC<IconProps> = ({ size = 28, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M 100 80 Q 100 110 70 110 Q 100 110 100 140 Q 100 110 130 110 Q 100 110 100 80 Z"
      fill={color}
    />
    <circle cx="145" cy="75" r="8" fill={color} />
    <g transform="translate(440, 50) scale(-10.8, 10.8)">
      <path
        fill={color}
        d="M31.595 15.007c-1.75-3.623-5.934-9.053-9.531-9.053-4.071 0-8.228 7.259-10.071 10.378-.176.299-.321.578-.464.857-3.371-1.182-.536-6.631-.536-10.463 0-.957-.138-1.637-.44-2.119.489-.606.586-1.347.192-1.699-.413-.367-1.195-.163-1.745.456-.08.089-.129.186-.189.28-.424-.067-.903-.102-1.472-.102-.565 0-2.916.266-4.229.791C-.007 5.582.993 9 1.993 9h4c1 0 .756 2.31 0 4.726-.83 2.654-1.439 5.145-1 6.606.808 2.687 3.712 3.589 6.164 3.86 1.059 2.659 1.517 6.455 1.473 7.962-.059 2 1.94 2.059 1.999.059.036-1.211-.102-3.68.143-5.781.658 2.833.935 6.097.899 7.314-.059 1.998 1.94 2.057 1.999.059.047-1.602-.182-6.36.559-8.982.507.017 1.044.03 1.619.035 1.774.09 3.726.085 5.506-.015 1.05 1.592 1.996 2.991 1.982 3.435-.029 1-1.117 3.969-1.146 4.969-.029 1 .94 2.029 1.999.059.648-1.205 1.324-3.419 1.536-5.421.171.364.274.656.269.843-.029 1-.97 3.93-.999 4.93-.029.998.941 2.027 1.999.059 1.059-1.971 1.998-4.898 1.058-6.928-.797-1.72.431-4.165.824-7.914 1.082 1.665 1.117 3.351 1.118 3.459 0 .553.447 1 1 1 .553 0 1-.447 1-1-.001-.215-.067-4.85-4.399-7.327z"
      />
      <circle cx="8.2" cy="5.5" r="0.9" fill="#ffffff" />
    </g>
    <path d="M 65 440 H 447" stroke={color} strokeWidth="26" strokeLinecap="round" />
    <path d="M 130 472 H 382" stroke={color} strokeWidth="18" strokeLinecap="round" />
  </svg>
);
export const HorseProIcon = CamelProIcon;

// 5. التروس (خدمات متكاملة)
export const GearsServiceIcon: React.FC<IconProps> = ({ size = 28, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="8" cy="8" r="3" stroke={color} strokeWidth="2"/>
    <path d="M8 3V5M8 11V13M3 8H5M11 8H13M4.5 4.5L5.9 5.9M10.1 10.1L11.5 11.5M4.5 11.5L5.9 10.1M10.1 5.9L11.5 4.5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="16" cy="16" r="3" stroke={color} strokeWidth="2"/>
    <path d="M16 11V13M16 19V21M11 16H13M19 16H21M12.5 12.5L13.9 13.9M18.1 18.1L19.5 19.5M12.5 19.5L13.9 18.1M18.1 13.9L19.5 12.5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// 6. الهاتف والذكاء الرقمي (تجربة رقمية حديثة)
export const DigitalExperienceIcon: React.FC<IconProps> = ({ size = 28, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="5" y="2" width="14" height="20" rx="3" stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="7" r="2" stroke={color} strokeWidth="1.5"/>
    <path d="M9 12H15M9 15H13" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="18.5" r="0.75" fill={color}/>
  </svg>
);
