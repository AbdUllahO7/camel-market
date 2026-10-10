'use client';

import { useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  schemaData?: Record<string, unknown>;
}

export const SEO = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  schemaData,
}: SEOProps) => {
  const { brand } = useTheme();

  const fullTitle = title
    ? `${title} | ${brand.name} - ${brand.slogan}`
    : `${brand.name} | ${brand.slogan}`;

  const metaDescription = description || brand.description;

  useEffect(() => {
    // 1. تحديث عنوان الصفحة
    document.title = fullTitle;

    const currentKeywords = keywords || [
      brand.name,
      brand.slogan,
      'خيول عربية أصيلة',
      'إبل ومزاين أصيلة',
      'مزادات الخليج',
      'الكويت',
      'الخليج العربي',
    ];

    const setMetaTag = (attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. وسوم Meta الأساسية
    setMetaTag('name', 'description', metaDescription);
    setMetaTag('name', 'keywords', currentKeywords.join(', '));
    setMetaTag('name', 'author', brand.name);

    // 3. Open Graph Tags
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', metaDescription);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:locale', 'ar_KW');
    setMetaTag('property', 'og:site_name', brand.name);
    if (canonicalUrl) {
      setMetaTag('property', 'og:url', canonicalUrl);
    }
    if (ogImage) {
      setMetaTag('property', 'og:image', ogImage);
    }

    // 4. Twitter Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', metaDescription);
    if (ogImage) {
      setMetaTag('name', 'twitter:image', ogImage);
    }

    // 5. رابط Canonical
    if (canonicalUrl) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', canonicalUrl);
    }

    // 6. بيانات Schema.org JSON-LD المدمجة لمحركات البحث
    const schema = schemaData || {
      '@context': 'https://schema.org',
      '@type': 'OnlineMarketplace',
      name: brand.name,
      description: brand.description,
      url: typeof window !== 'undefined' ? window.location.origin : '',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${typeof window !== 'undefined' ? window.location.origin : ''}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };

    let scriptTag = document.querySelector('#seo-schema-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'seo-schema-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(schema);
  }, [fullTitle, metaDescription, keywords, canonicalUrl, ogImage, ogType, schemaData, brand]);

  return null;
};
