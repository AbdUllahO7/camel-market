import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سوق المزادات الحية للإبل والهجن العربية الأصيلة',
  description: 'شارك في المزادات المباشرة واللحظية للإبل والهجن العربية الأصيلة والنوادر ومزاين الإبل. زايد بثقة وتنافس مباشر مع كبار المربين وملاك الهجن في الخليج.',
  keywords: ['مزادات إبل', 'مزاد هجن عربية', 'مزايدة مباشرة إبل', 'إبل للبيع', 'نوادر المزاين', 'سوق الإبل'],
  openGraph: {
    title: 'المزادات الحية | سوق الإبل',
    description: 'شارك في المزادات المباشرة واللحظية للإبل والهجن العربية الأصيلة وتابع السومات لحظة بلحظة.',
    url: 'https://camel.market/auctions',
    type: 'website',
  },
  twitter: {
    title: 'المزادات الحية | سوق الإبل',
    description: 'شارك في المزادات المباشرة واللحظية للإبل والهجن العربية الأصيلة وتابع السومات لحظة بلحظة.',
  },
};

export default function AuctionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
