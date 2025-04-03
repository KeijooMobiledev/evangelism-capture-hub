import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest, API_ENDPOINTS } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for making API requests
 */
export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  /**
   * Make a request to the API
   */
  const makeRequest = async <T>(
    endpoint: string, 
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      params?: Record<string, string>;
      body?: any;
      successMessage?: string;
      errorMessage?: string;
    } = {}
  ): Promise<T | null> => {
    const {
      method = 'GET',
      params,
      body,
      successMessage,
      errorMessage = 'An error occurred while making the request'
    } = options;

    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to access this feature',
        variant: 'destructive'
      });
      return null;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest<T>(endpoint, {
        method,
        params,
        body
      });

      if (successMessage) {
        toast({
          title: 'Success',
          description: successMessage
        });
      }

      return response;
    } catch (error) {
      console.error('API request error:', error);
      
      toast({
        title: 'Error',
        description: error.message || errorMessage,
        variant: 'destructive'
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * API methods for different endpoints
   */
  const api = {
    evangelists: {
      getAll: () => makeRequest(API_ENDPOINTS.GET_EVANGELISTS),
      getById: (id: string) => makeRequest(API_ENDPOINTS.GET_EVANGELIST, {
        params: { id }
      })
    },
    
    events: {
      getAll: (options?: { type?: string; upcoming?: boolean; order?: 'asc' | 'desc' }) => {
        const params: Record<string, string> = {};
        if (options?.type) params.type = options.type;
        if (options?.upcoming !== undefined) params.upcoming = String(options.upcoming);
        if (options?.order) params.order = options.order;
        
        return makeRequest(API_ENDPOINTS.GET_EVENTS, { params });
      },
      
      getById: (id: string) => makeRequest(API_ENDPOINTS.GET_EVENT, {
        params: { id }
      }),
      
      create: (eventData: any) => makeRequest(API_ENDPOINTS.GET_EVENTS, {
        method: 'POST',
        body: eventData,
        successMessage: 'Event created successfully'
      }),
      
      update: (id: string, eventData: any) => makeRequest(API_ENDPOINTS.GET_EVENT, {
        method: 'PUT',
        params: { id },
        body: eventData,
        successMessage: 'Event updated successfully'
      }),
      
      delete: (id: string) => makeRequest(API_ENDPOINTS.GET_EVENT, {
        method: 'DELETE',
        params: { id },
        successMessage: 'Event deleted successfully'
      }),
      
      attend: (id: string, status: 'attending' | 'declined') => makeRequest(API_ENDPOINTS.ATTEND_EVENT, {
        method: 'POST',
        params: { id },
        body: { status },
        successMessage: status === 'attending' ? 'You are now attending this event' : 'You have declined this event'
      })
    },
    
    resources: {
      getAll: (options?: { 
        type?: 'audio' | 'video' | 'text' | 'all';
        categoryId?: string;
        search?: string;
      }) => {
        const params: Record<string, string> = {};
        if (options?.type) params.type = options.type;
        if (options?.categoryId) params.categoryId = options.categoryId;
        if (options?.search) params.search = options.search;
        
        return makeRequest(API_ENDPOINTS.GET_RESOURCES, { params });
      },
      
      getById: (id: string) => makeRequest(API_ENDPOINTS.GET_RESOURCE, {
        params: { id }
      })
    },
    
    blog: {
      getPosts: () => {
        const { getRecentPosts } = require('@/data/blogPosts');
        return Promise.resolve(getRecentPosts(100));
      },
      
      getPostBySlug: (slug: string) => {
        const { getPostBySlug } = require('@/data/blogPosts');
        return Promise.resolve(getPostBySlug(slug));
      }
    },
    
    stats: {
      getEvangelismStats: () => makeRequest(API_ENDPOINTS.GET_EVANGELISM_STATS)
    }
  };

  return { api, isLoading };
};
