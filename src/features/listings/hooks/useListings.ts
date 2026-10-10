'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ListingItem, ListingFilterParams } from '../types';
import { listingsService } from '../services/listingsService';

export function useListings(initialFilters?: ListingFilterParams) {
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [filters, setFilters] = useState<ListingFilterParams>(initialFilters || {});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await listingsService.getListings(filters);
      if (res.success && res.data) {
        const items = Array.isArray(res.data) ? res.data : res.data.items;
        setListings(items || []);
      } else {
        setError(res.message || 'فشل في تحميل الإعلانات');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    let isMounted = true;
    listingsService.getListings(filters).then(
      (res) => {
        if (isMounted) {
          if (res.success && res.data) {
            const items = Array.isArray(res.data) ? res.data : res.data.items;
            setListings(items || []);
          } else {
            setError(res.message || 'فشل في تحميل الإعلانات');
          }
          setIsLoading(false);
        }
      },
      (err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'فشل في الاتصال');
          setIsLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, [filters]);

  return {
    listings,
    isLoading,
    error,
    filters,
    setFilters,
    refetch: fetchListings,
  };
}
