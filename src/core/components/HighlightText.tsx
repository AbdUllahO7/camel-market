'use client';

import React from 'react';

interface HighlightTextProps {
  text: string;
  highlight?: string;
  className?: string;
}

export const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  highlight,
  className = '',
}) => {
  if (!highlight || !highlight.trim()) {
    return <span className={className}>{text}</span>;
  }

  const query = highlight.trim();
  // Safe escape for regex special characters
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-amber-400/25 text-amber-200 font-bold px-0.5 rounded shadow-[0_0_8px_rgba(245,158,11,0.2)]"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};
