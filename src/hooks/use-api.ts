
import { useState, useCallback } from 'react';
import { getAllCourses, getCourseBySlug, getLessonsByCourseId } from '@/data/coursesData';
import { getFeaturedProducts, getProductBySlug, getAllProducts } from '@/data/productsData';
import { getPostBySlug, getFeaturedPosts, getRecentPosts, searchPosts } from '@/data/blogPosts';

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Courses API
  const courses = {
    getAll: useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        return getAllCourses();
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }, []),

    getBySlug: useCallback(async (slug: string) => {
      setIsLoading(true);
      setError(null);
      try {
        return getCourseBySlug(slug);
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }, []),

    getLessons: useCallback(async (courseId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        return getLessonsByCourseId(courseId);
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }, []),
  };

  // Products API
  const products = {
    getAll: useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        return getAllProducts();
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }, []),

    getFeatured: useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        return getFeaturedProducts();
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }, []),

    getBySlug: useCallback(async (slug: string) => {
      setIsLoading(true);
      setError(null);
      try {
        return getProductBySlug(slug);
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }, []),
  };

  // Add more API endpoints as needed

  // Blog API
  const blog = {
    getPostBySlug: useCallback(async (slug: string) => {
      setIsLoading(true);
      setError(null);
      try {
        return getPostBySlug(slug);
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }, []),

    getFeatured: useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        return getFeaturedPosts();
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }, []),

    getRecent: useCallback(async (limit: number = 5) => {
      setIsLoading(true);
      setError(null);
      try {
        return getRecentPosts(limit);
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }, []),

    search: useCallback(async (query: string) => {
      setIsLoading(true);
      setError(null);
      try {
        return searchPosts(query);
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }, []),
  };

  const api = {
    courses,
    products,
    blog,
  };

  return { api, isLoading, error };
};
