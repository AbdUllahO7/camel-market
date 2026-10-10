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
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M14 9C14 6.79086 11.7614 5 9 5C6.23858 5 4 6.79086 4 9C4 10.36 4.88 11.55 6.22 12.24L5.5 15L8.3 13.9C8.53 13.96 8.76 14 9 14C11.7614 14 14 12.2091 14 9Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.5 14C14.7 14 14.85 13.97 15 13.93L17.5 15L16.85 12.55C18.15 11.9 19 10.75 19 9.5C19 8.6 18.5 7.8 17.7 7.2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 4. الإبل الأصيلة (عرض احترافي للإبل)
export const CamelProIcon: React.FC<IconProps> = ({ size = 28, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M5 18V14C5 13 6 12 7 12C9 12 10 9 12 9C14 9 15 12 18 12C19.5 12 21 10 21 8C21 6.5 20 6 18.5 6C17 6 15.5 4 14.5 3C14 2 12.5 2 12 3C11 4.5 12 6.5 13 8L11 11C9 11 8 10 6 10C4 10 3 13 3 15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 18V21M10 18V21M15 18V21M19 18V21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
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
