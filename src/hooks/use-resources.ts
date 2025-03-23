
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Type definitions for our resources
export type ResourceCategory = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export type SpiritualResource = {
  id: string;
  title: string;
  description: string | null;
  type: 'audio' | 'video' | 'text';
  file_url: string;
  thumbnail_url: string | null;
  created_by: string;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  downloads: number;
  size_bytes: number | null;
  duration_seconds: number | null;
  allow_download: boolean;
  category?: ResourceCategory;
  is_bookmarked?: boolean;
}

export type ResourceFilter = {
  type?: 'audio' | 'video' | 'text' | 'all';
  categoryId?: string | null;
  searchQuery?: string;
  bookmarked?: boolean;
}

// Hook for fetching and managing resources
export const useResources = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ResourceFilter>({
    type: 'all',
    categoryId: null,
    searchQuery: '',
    bookmarked: false
  });

  // Fetch all categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['resourceCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resource_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as ResourceCategory[];
    }
  });

  // Fetch resources based on filters
  const { 
    data: resources = [], 
    isLoading: resourcesLoading,
    refetch: refetchResources
  } = useQuery({
    queryKey: ['resources', filters],
    queryFn: async () => {
      let query = supabase
        .from('spiritual_resources')
        .select(`
          *,
          category:resource_categories(*)
        `)
        .order('created_at', { ascending: false });
      
      // Apply type filter
      if (filters.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }
      
      // Apply category filter
      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }
      
      // Apply search query
      if (filters.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Get current user ID
      const user = (await supabase.auth.getUser()).data.user;
      
      if (user && data.length > 0) {
        // Fetch user's bookmarks
        const { data: bookmarks } = await supabase
          .from('resource_bookmarks')
          .select('resource_id')
          .eq('user_id', user.id);
        
        const bookmarkedIds = new Set(bookmarks?.map(b => b.resource_id) || []);
        
        // Mark resources as bookmarked
        data.forEach(resource => {
          resource.is_bookmarked = bookmarkedIds.has(resource.id);
        });
        
        // Filter by bookmarked if needed
        if (filters.bookmarked) {
          return data.filter(resource => resource.is_bookmarked) as SpiritualResource[];
        }
      }
      
      return data as SpiritualResource[];
    }
  });

  // Toggle bookmark mutation
  const toggleBookmark = useMutation({
    mutationFn: async (resourceId: string) => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');
      
      // Check if already bookmarked
      const { data: existing } = await supabase
        .from('resource_bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('resource_id', resourceId)
        .single();
      
      if (existing) {
        // Remove bookmark
        const { error } = await supabase
          .from('resource_bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('resource_id', resourceId);
        
        if (error) throw error;
        return { resourceId, bookmarked: false };
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('resource_bookmarks')
          .insert({
            user_id: user.id,
            resource_id: resourceId
          });
        
        if (error) throw error;
        return { resourceId, bookmarked: true };
      }
    },
    onSuccess: (result) => {
      queryClient.setQueryData(['resources', filters], (oldData: SpiritualResource[] | undefined) => {
        if (!oldData) return [];
        return oldData.map(resource => 
          resource.id === result.resourceId 
            ? { ...resource, is_bookmarked: result.bookmarked } 
            : resource
        );
      });
      
      toast({
        title: result.bookmarked ? 'Resource bookmarked' : 'Bookmark removed',
        description: result.bookmarked 
          ? 'Resource added to your saved items' 
          : 'Resource removed from your saved items',
      });
    },
    onError: (error) => {
      console.error('Error toggling bookmark:', error);
      toast({
        title: 'Error',
        description: 'Failed to update bookmark',
        variant: 'destructive'
      });
    }
  });

  // Track download mutation
  const trackDownload = useMutation({
    mutationFn: async (resourceId: string) => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');
      
      // Record the download
      const { error: downloadError } = await supabase
        .from('resource_downloads')
        .insert({
          user_id: user.id,
          resource_id: resourceId
        });
      
      if (downloadError) throw downloadError;
      
      // Increment download count
      const { error: updateError } = await supabase
        .from('spiritual_resources')
        .update({ downloads: resources.find(r => r.id === resourceId)?.downloads as number + 1 })
        .eq('id', resourceId);
      
      if (updateError) throw updateError;
      
      return resourceId;
    },
    onSuccess: (resourceId) => {
      queryClient.setQueryData(['resources', filters], (oldData: SpiritualResource[] | undefined) => {
        if (!oldData) return [];
        return oldData.map(resource => 
          resource.id === resourceId 
            ? { ...resource, downloads: (resource.downloads || 0) + 1 } 
            : resource
        );
      });
    },
    onError: (error) => {
      console.error('Error tracking download:', error);
    }
  });

  return {
    resources,
    categories,
    filters,
    setFilters,
    isLoading: resourcesLoading || categoriesLoading,
    refetchResources,
    toggleBookmark,
    trackDownload
  };
};
