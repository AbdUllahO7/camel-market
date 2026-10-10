'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '@/i18n';
import { homeService } from '../services/homeService';
import type { ServiceItem } from '../types';

export const useServices = () => {
  const { locale, t } = useLanguage();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // البيانات الاحتياطية المعتمدة المستندة للترجمة الحالية
  const fallbackServices: ServiceItem[] = useMemo(() => [
    {
      id: 'market',
      title: t.servicesSection.createMarketTitle,
      description: t.servicesSection.createMarketDesc,
      iconSrc: '/icons/service-market.svg',
      order: 1,
    },
    {
      id: 'show',
      title: t.servicesSection.showCamelsTitle,
      description: t.servicesSection.showCamelsDesc,
      iconSrc: '/icons/service-camels.svg',
      order: 2,
    },
    {
      id: 'auctions',
      title: t.servicesSection.liveAuctionsTitle,
      description: t.servicesSection.liveAuctionsDesc,
      iconSrc: '/icons/service-auctions.svg',
      order: 3,
    },
    {
      id: 'streaming',
      title: t.servicesSection.liveStreamingTitle,
      description: t.servicesSection.liveStreamingDesc,
      iconSrc: '/icons/service-live.svg',
      order: 4,
    },
  ], [t]);

  const fetchServices = useCallback(async () => {
    try {
      const response = await homeService.getServices(locale);
      if (response.success && response.data && response.data.length > 0) {
        setServices(response.data);
      } else {
        setServices(fallbackServices);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
      setServices(fallbackServices);
    } finally {
      setIsLoading(false);
    }
  }, [locale, fallbackServices]);

  useEffect(() => {
    let isMounted = true;

    homeService.getServices(locale)
      .then((response) => {
        if (!isMounted) return;
        if (response.success && response.data && response.data.length > 0) {
          setServices(response.data);
        } else {
          setServices(fallbackServices);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to fetch services');
        setServices(fallbackServices);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [locale, fallbackServices]);

  return {
    services: services.length > 0 ? services : fallbackServices,
    isLoading,
    error,
    refetch: fetchServices,
  };
};
