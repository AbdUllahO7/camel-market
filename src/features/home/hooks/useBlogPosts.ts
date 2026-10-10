'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/i18n';
import { homeService } from '../services/homeService';
import type { BlogPostItem } from '../types';

export const useBlogPosts = (limit: number = 3) => {
  const { locale, t } = useLanguage();
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fallbackPosts: BlogPostItem[] = useMemo(
    () => [
      {
        id: 'blog-1',
        image: '/Camels/blog-1.jpg',
        title: t.blogSection.sampleArticleTitle,
        date: t.blogSection.sampleDate,
      },
      {
        id: 'blog-2',
        image: '/Camels/blog-2.jpg',
        title: t.blogSection.sampleArticleTitle,
        date: t.blogSection.sampleDate,
      },
      {
        id: 'blog-3',
        image: '/Camels/bglo-3.png',
        title: t.blogSection.sampleArticleTitle,
        date: t.blogSection.sampleDate,
      },
    ],
    [t.blogSection]
  );

  useEffect(() => {
    let isMounted = true;

    async function fetchPosts() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await homeService.getBlogPosts(locale, limit);
        if (isMounted && response?.data && response.data.length > 0) {
          setPosts(response.data);
        } else if (isMounted) {
          setPosts(fallbackPosts);
        }
      } catch (err) {
        if (isMounted) {
          setPosts(fallbackPosts);
          setError(err instanceof Error ? err.message : 'Failed to load blog posts');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, [locale, limit, fallbackPosts]);

  return { posts, isLoading, error };
};
