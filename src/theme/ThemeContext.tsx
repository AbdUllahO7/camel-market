import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { BrandConfig, MarketId } from '@/types/brand';
import { BRANDS_CONFIG, DEFAULT_MARKET_ID } from './brands.config';


export interface ThemeContextType {
  activeMarketId: MarketId;
  brand: BrandConfig;
  setMarket: (marketId: MarketId) => void;
  availableMarkets: MarketId[];
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
  initialMarketId?: MarketId;
}

export const ThemeProvider = ({
  children,
  initialMarketId = DEFAULT_MARKET_ID,
}: ThemeProviderProps) => {
  const [activeMarketId, setActiveMarketId] = useState<MarketId>(initialMarketId);

  const brand = BRANDS_CONFIG[activeMarketId] || BRANDS_CONFIG.camels;

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', activeMarketId);

    root.style.setProperty('--brand-primary', brand.colors.primary);
    root.style.setProperty('--brand-secondary', brand.colors.secondary);
    root.style.setProperty('--brand-medium', brand.colors.medium);
    root.style.setProperty('--brand-light', brand.colors.light);
    root.style.setProperty('--brand-surface', brand.colors.surface);
    root.style.setProperty('--brand-bg', brand.colors.background);
    root.style.setProperty('--brand-text-primary', brand.colors.textPrimary);
    root.style.setProperty('--brand-text-secondary', brand.colors.textSecondary);
    root.style.setProperty('--brand-border', brand.colors.border);

    document.title = `${brand.name} | ${brand.slogan}`;
  }, [activeMarketId, brand]);

  const setMarket = (marketId: MarketId) => {
    if (BRANDS_CONFIG[marketId]) {
      setActiveMarketId(marketId);
    }
  };

  const availableMarkets: MarketId[] = ['Camels', 'camels', 'sheep'];

  return (
    <ThemeContext.Provider
      value={{
        activeMarketId,
        brand,
        setMarket,
        availableMarkets,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
