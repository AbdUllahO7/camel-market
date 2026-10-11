'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toast: {
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// مؤثر صوتي رقمي ناعم باستخدام Web Audio API بدون ملفات خارجية
function playSubtleChime(type: ToastType) {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'error') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(220, now + 0.2);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch {
    // تجاهل إذا كانت سياسة المتصفح تمنع التشغيل التلقائي للصوت
  }
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string, title?: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const duration = 3800;

    playSubtleChime(type);

    setToasts((prev) => [...prev.slice(-3), { id, type, title, message, duration }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const toastMethods = {
    success: (message: string, title?: string) => addToast('success', message, title),
    error: (message: string, title?: string) => addToast('error', message, title),
    info: (message: string, title?: string) => addToast('info', message, title),
  };

  return (
    <ToastContext.Provider value={{ toast: toastMethods }}>
      {children}
      {/* حاوية الإشعارات العائمة الفخمة */}
      <div
        className="fixed bottom-5 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-6 z-[9999] flex flex-col gap-2.5 max-w-[92vw] sm:max-w-md w-full pointer-events-none"
        dir="rtl"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
              item.type === 'success'
                ? 'bg-zinc-950/90 border-emerald-500/40 text-white shadow-[0_8px_30px_rgba(16,185,129,0.15)]'
                : item.type === 'error'
                ? 'bg-zinc-950/90 border-rose-500/40 text-white shadow-[0_8px_30px_rgba(244,63,94,0.15)]'
                : 'bg-zinc-950/90 border-amber-500/40 text-white shadow-[0_8px_30px_rgba(245,158,11,0.15)]'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {item.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {item.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {item.type === 'info' && <Info className="w-5 h-5 text-amber-400" />}
            </div>

            <div className="flex-1 min-w-0 text-right">
              {item.title && <h4 className="text-sm font-bold text-white mb-0.5">{item.title}</h4>}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed break-words">{item.message}</p>
            </div>

            <button
              type="button"
              onClick={() => removeToast(item.id)}
              className="text-zinc-400 hover:text-white transition-colors p-1 -mr-1 -mt-1 cursor-pointer shrink-0"
              aria-label="إغلاق الإشعار"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // في حال الاستخدام خارج Provider، تجنب تعطل التطبيق
    return {
      toast: {
        success: (msg: string) => console.log('[Toast Success]:', msg),
        error: (msg: string) => console.error('[Toast Error]:', msg),
        info: (msg: string) => console.info('[Toast Info]:', msg),
      },
    };
  }
  return context;
};
