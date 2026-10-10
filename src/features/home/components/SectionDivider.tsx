import React from 'react';

export interface SectionDividerProps {
  className?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-[208px] h-[14.14px] flex items-center justify-center my-1 select-none ${className}`}>
      {/* الخط العرضي الكامل (Line 2: 208px) */}
      <div
        className="w-full h-px"
        style={{
          background: 'linear-gradient(90deg, rgba(97, 97, 97, 0.2) 0%, #D1D1D1 50%, rgba(97, 97, 97, 0.2) 100%)',
        }}
      />
      {/* المعين المركزي المائل 45- درجة (Rectangle 8: 10px × 10px) */}
      <div
        className="absolute w-[10px] h-[10px] bg-[#D1D1D1] shadow-sm"
        style={{
          transform: 'rotate(-45deg)',
          background: 'linear-gradient(135deg, #F7F7F7 0%, #8E8E8E 100%)',
        }}
      />
    </div>
  );
};
