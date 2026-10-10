'use client';

import { useState } from 'react';
import { homeService } from '../services/homeService';
import { useAuth } from '@/features/auth/context/AuthContext';
import type { ContactFormData } from '../types';

export const useContactForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (errorMessage) setErrorMessage(null);
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitForm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.firstName.trim()) {
      setErrorMessage('يرجى إدخال الاسم الأول');
      return;
    }

    if (!formData.phone.trim()) {
      setErrorMessage('يرجى إدخال رقم الهاتف للتواصل');
      return;
    }

    if (!formData.message.trim()) {
      setErrorMessage('يرجى كتابة نص الرسالة');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setIsSuccess(false);

      const response = await homeService.submitContactForm(formData, user?.id);

      if (response && response.success && response.data?.success !== false) {
        setIsSuccess(true);
        // إعادة تعيين جميع الحقول فارغة بعد الإرسال الناجح
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
        });
      } else {
        setErrorMessage(
          response?.data?.message || response?.message || 'فشل في إرسال الرسالة، يرجى التحقق من المدخلات.'
        );
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء الإرسال');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    isSuccess,
    errorMessage,
    handleChange,
    submitForm,
  };
};
