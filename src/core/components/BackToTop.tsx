'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="العودة لأعلى الصفحة"
      className="fixed bottom-6 left-6 z-50 p-3.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-white border border-amber-500/30 hover:border-amber-400 shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center group"
    >
      <ArrowUp className="w-5 h-5 text-amber-300 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
};
