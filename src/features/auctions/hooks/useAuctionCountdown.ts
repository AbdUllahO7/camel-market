'use client';

import { useState, useEffect } from 'react';

export interface CountdownResult {
  formattedTime: string;
  isEnded: boolean;
  isUrgent: boolean; // Less than 1 hour remaining
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function useAuctionCountdown(endTimeStr?: string): CountdownResult {
  const [timeLeft, setTimeLeft] = useState<CountdownResult>(() => calculateTimeLeft(endTimeStr));

  useEffect(() => {
    if (!endTimeStr) return;

    // تحديث فوري أولاً
    setTimeLeft(calculateTimeLeft(endTimeStr));

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endTimeStr));
    }, 1000);

    return () => clearInterval(timer);
  }, [endTimeStr]);

  return timeLeft;
}

function calculateTimeLeft(endTimeStr?: string): CountdownResult {
  if (!endTimeStr) {
    return {
      formattedTime: 'غير محدد',
      isEnded: false,
      isUrgent: false,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const end = new Date(endTimeStr).getTime();
  const now = Date.now();
  const diff = end - now;

  if (diff <= 0) {
    return {
      formattedTime: 'منتهي',
      isEnded: true,
      isUrgent: false,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const pad = (n: number) => String(n).padStart(2, '0');

  let formatted = '';
  if (days > 0) {
    formatted = `${days} يوم و ${hours} س`;
  } else {
    formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  // إذا تبقى أقل من ساعتين نعتبره عاجل
  const isUrgent = diff <= 2 * 60 * 60 * 1000;

  return {
    formattedTime: formatted,
    isEnded: false,
    isUrgent,
    days,
    hours,
    minutes,
    seconds,
  };
}
