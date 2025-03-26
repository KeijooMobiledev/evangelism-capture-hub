
import { supabase } from '@/integrations/supabase/client';

/**
 * Base API URL for the Supabase Edge Functions
 */
export const API_BASE_URL = 'https://rqswoltcvzccnaafnzvq.supabase.co/functions/v1';

/**
 * API endpoints for the application
 */
export const API_ENDPOINTS = {
  // Evangelism data endpoints
  GET_EVANGELISTS: '/api/evangelists',
  GET_EVANGELIST: '/api/evangelists/:id',
  GET_EVENTS: '/api/events',
  GET_EVENT: '/api/events/:id',
  ATTEND_EVENT: '/api/events/:id/attend',
  GET_RESOURCES: '/api/resources',
  GET_RESOURCE: '/api/resources/:id',
  
  // Community endpoints
  GET_COMMUNITY_MEMBERS: '/api/community',
  GET_COMMUNITY_MEMBER: '/api/community/:id',
  
  // Analytics endpoints
  GET_EVANGELISM_STATS: '/api/stats/evangelism',
  GET_EVENT_STATS: '/api/stats/events',
  GET_RESOURCE_STATS: '/api/stats/resources',
};

/**
 * Builds a URL with the API base URL and endpoint
 */
export const buildApiUrl = (endpoint: string, params?: Record<string, string>): string => {
  let url = `${API_BASE_URL}${endpoint}`;
  
  // Replace path parameters
  if (params) {
    Object.keys(params).forEach(key => {
      url = url.replace(`:${key}`, params[key]);
    });
  }
  
  return url;
};

/**
 * Makes an authenticated API request
 */
export const apiRequest = async <T>(
  endpoint: string, 
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    params?: Record<string, string>;
    body?: any;
    headers?: Record<string, string>;
  } = {}
): Promise<T> => {
  const { method = 'GET', params, body, headers = {} } = options;
  
  try {
    // Get the current session for authentication
    const { data: { session } } = await supabase.auth.getSession();
    const authToken = session?.access_token;
    
    if (!authToken) {
      throw new Error('Authentication required');
    }
    
    const url = buildApiUrl(endpoint, params);
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};
