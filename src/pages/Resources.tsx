
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ResourceCard from '@/components/resources/ResourceCard';
import ResourceFilters from '@/components/resources/ResourceFilters';
import ResourceUploadDialog from '@/components/resources/ResourceUploadDialog';
import { useResources, SpiritualResource } from '@/hooks/use-resources';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { Plus, LibraryBig, Download } from 'lucide-react';

const Resources: React.FC = () => {
  const { user } = useAuth();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const {
    resources,
    categories,
    filters,
    setFilters,
    isLoading,
    refetchResources,
    toggleBookmark,
    trackDownload
  } = useResources();
  
  const handleBookmark = (resourceId: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to bookmark resources',
        variant: 'destructive'
      });
      return;
    }
    
    toggleBookmark.mutate(resourceId);
  };

  const handleDownload = async (resource: SpiritualResource) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to download resources',
        variant: 'destructive'
      });
      return;
    }
    
    if (!resource.allow_download) {
      toast({
        title: 'Download not allowed',
        description: 'This resource cannot be downloaded',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Track the download
      trackDownload.mutate(resource.id);
      
      // Create anchor element to download the file
      const link = document.createElement('a');
      link.href = resource.file_url;
      link.target = '_blank';
      link.download = resource.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Download failed',
        description: 'There was a problem downloading the resource',
        variant: 'destructive'
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="container max-w-7xl py-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Spiritual Resources</h1>
            <p className="text-muted-foreground">
              Access shared audio, video, and text-based resources for your spiritual growth
            </p>
          </div>
          
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Upload Resource
          </Button>
        </div>
        
        <Separator />
        
        <ResourceFilters 
          categories={categories} 
          filters={filters} 
          onChange={setFilters} 
        />
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-32 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12">
            <LibraryBig className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No resources found</h3>
            <p className="text-muted-foreground">
              {filters.searchQuery || filters.type !== 'all' || filters.categoryId || filters.bookmarked ? (
                "Try adjusting your filters to find what you're looking for"
              ) : (
                "Be the first to upload a spiritual resource to the library"
              )}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map(resource => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onBookmark={handleBookmark}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </div>
      
      <ResourceUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        categories={categories}
        onSuccess={refetchResources}
      />
    </DashboardLayout>
  );
};

export default Resources;
