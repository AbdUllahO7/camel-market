'use client';

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/i18n";
import { homeService } from "../services/homeService";
import type { CustomerReviewItem } from "../types";

export const useCustomerReviews = () => {
  const { locale } = useLanguage();
  const [reviews, setReviews] = useState<CustomerReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await homeService.getCustomerReviews(locale);

      if (response?.success && Array.isArray(response.data)) {
        setReviews(response.data);
      } else {
        setReviews([]);
      }
    } catch (err) {
      setReviews([]);
      setError(err instanceof Error ? err.message : "فشل في تحميل التقييمات");
    } finally {
      setIsLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const addReview = async (rating: number, comment: string, sellerId?: string) => {
    try {
      const res = await homeService.addReview(rating, comment, sellerId);
      if (res.success) {
        await fetchReviews();
        return {
          success: true,
          statusCode: res.statusCode,
          message: "تم إرسال تقييمك بنجاح.",
        };
      }
      return {
        success: false,
        statusCode: res.statusCode,
        message: res.message || "فشل في إرسال التقييم.",
      };
    } catch (err) {
      return {
        success: false,
        statusCode: 500,
        message: err instanceof Error ? err.message : "حدث خطأ أثناء إرسال التقييم.",
      };
    }
  };

  return { reviews, isLoading, error, refetch: fetchReviews, addReview };
};
