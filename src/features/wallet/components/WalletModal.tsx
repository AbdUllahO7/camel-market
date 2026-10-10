'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, X, Plus, ArrowLeft, CheckCircle2, AlertCircle, History, RefreshCw, CreditCard } from 'lucide-react';
import { walletService, type WalletTransaction } from '../services/walletService';
import { extractPaymentUrl } from '@/features/auth/services/authService';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredAmount?: number;
  initialMessage?: string;
}

/**
 * 2.8 التعامل مع رصيد غير كافٍ (Wallet Modal)
 * يعرض رصيد المحفظة، سجل المعاملات، وتعبئة الرصيد الفوري عبر بوابة الدفع المعتمدة
 */
export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  requiredAmount,
  initialMessage,
}) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [topupAmount, setTopupAmount] = useState<number>(requiredAmount || 20);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialMessage || null);
  const [activeTab, setActiveTab] = useState<'topup' | 'history'>('topup');

  const fetchWalletData = async () => {
    setIsLoading(true);
    try {
      const [balRes, txRes] = await Promise.all([
        walletService.getMyWallet(),
        walletService.getMyTransactions(),
      ]);

      if (balRes.success && typeof balRes.data === 'number') {
        setBalance(balRes.data);
      }
      if (txRes.success && Array.isArray(txRes.data)) {
        setTransactions(txRes.data);
      }
    } catch (e) {
      console.warn('Wallet fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchWalletData();
      if (requiredAmount) {
        setTopupAmount(requiredAmount);
      }
      if (initialMessage) {
        setErrorMessage(initialMessage);
      }
    }
  }, [isOpen, requiredAmount, initialMessage]);

  if (!isOpen) return null;

  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topupAmount || topupAmount <= 0) {
      setErrorMessage('يرجى تحديد مبلغ صحيح للشحن');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await walletService.createWalletTopup(Number(topupAmount));
      if (res.success && res.data) {
        const data = res.data as any;
        const redirectUrl = extractPaymentUrl(data);

        if (redirectUrl) {
          window.location.href = redirectUrl;
          return;
        }

        if (data.paymentId) {
          await walletService.checkPaymentStatus(data.paymentId);
        }

        await fetchWalletData();
        setActiveTab('history');
      } else {
        setErrorMessage(res.message || 'تعذر بدء عملية الشحن');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'فشل في الاتصال ببوابة الدفع');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in" dir="rtl">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-[#121212] border border-[#2B2B2B] p-6 sm:p-8 shadow-2xl text-right text-white overflow-hidden max-h-[90vh] flex flex-col"
        style={{
          boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(209, 209, 209, 0.05)',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full text-[#8E8E8E] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* رأس النافذة */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#222]">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">محفظتي الإلكترونية</h2>
            <p className="text-xs text-[#8E8E8E]">إدارة الرصيد وشحن المحفظة لدفع باقات الميزات</p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* بطاقة الرصيد */}
        <div className="rounded-2xl bg-[#1A1A1A] border border-[#2B2B2B] p-4 mb-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#8E8E8E]">الرصيد المتاح حالياً</span>
            <div className="text-2xl font-black text-white flex items-baseline gap-1 mt-0.5 font-mono">
              <span>{isLoading ? '...' : (balance !== null ? balance.toLocaleString() : '0')}</span>
              <span className="text-xs font-normal text-amber-300">د.ك</span>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchWalletData}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#8E8E8E] hover:text-white transition-colors cursor-pointer"
            title="تحديث الرصيد"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* تبويبات الشحن والسجل */}
        <div className="flex items-center gap-2 mb-4 border-b border-[#222] pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('topup')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'topup'
                ? 'bg-white text-black'
                : 'bg-[#181818] text-[#8E8E8E] hover:text-white'
            }`}
          >
            شحن الرصيد
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-white text-black'
                : 'bg-[#181818] text-[#8E8E8E] hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>سجل المعاملات</span>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 pr-1">
          {activeTab === 'topup' ? (
            <form onSubmit={handleTopup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#D1D1D1] mb-1.5">
                  حدد مبلغ الشحن (د.ك) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    value={topupAmount || ''}
                    onChange={(e) => setTopupAmount(Number(e.target.value))}
                    required
                    placeholder="مثال: 25"
                    className="w-full px-4 py-3 rounded-xl bg-[#0E0E0E] border border-[#2B2B2B] text-white text-lg font-bold placeholder:text-[#555] focus:outline-none focus:border-[#FFFFFF] transition-colors"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8E8E8E]">
                    د.ك
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-[#8E8E8E] block mb-1.5">مبالغ سريعة:</span>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 25, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopupAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                        topupAmount === amt
                          ? 'bg-white text-black border-white'
                          : 'bg-[#181818] text-[#D1D1D1] border-[#333] hover:border-white'
                      }`}
                    >
                      {amt} د.ك
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-black bg-gradient-to-r from-white via-[#F7F7F7] to-[#D1D1D1] hover:scale-[1.02] shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin"></div>
                      <span>جاري الانتقال لبوابة الدفع...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>شحن {topupAmount} د.ك الآن</span>
                      <ArrowLeft className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              {transactions.length > 0 ? (
                transactions.map((tx, idx) => (
                  <div
                    key={tx.id || idx}
                    className="p-3 rounded-xl bg-[#181818] border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{tx.description || 'عملية شحن محفظة'}</span>
                      {tx.createdAt && (
                        <span className="text-[10px] text-[#8E8E8E]">
                          {new Date(tx.createdAt).toLocaleDateString('ar-KW')}
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      +{tx.amount} د.ك
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-[#8E8E8E]">
                  لا توجد عمليات سابقة في سجل المحفظة.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
