
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { SpiritualResource } from '@/hooks/use-resources';
import { formatDistanceToNow } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileAudio, FileVideo, FileText, Download, ExternalLink } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DownloadRecord {
  id: string;
  downloaded_at: string;
  resource: SpiritualResource;
}

const MyDownloads: React.FC = () => {
  const { user } = useAuth();
  
  const { data: downloads = [], isLoading } = useQuery({
    queryKey: ['myDownloads'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('resource_downloads')
        .select(`
          id, 
          downloaded_at,
          resource:resource_id(
            id, 
            title, 
            type, 
            file_url,
            category_id,
            category:resource_categories(name)
          )
        `)
        .eq('user_id', user.id)
        .order('downloaded_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as DownloadRecord[];
    },
    enabled: !!user
  });
  
  if (!user) return null;
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'audio': return <FileAudio className="h-4 w-4 text-blue-500" />;
      case 'video': return <FileVideo className="h-4 w-4 text-red-500" />;
      case 'text': return <FileText className="h-4 w-4 text-green-500" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-4">Loading your downloads...</div>;
  }
  
  return (
    <div className="rounded-lg border shadow-sm">
      <div className="px-4 py-3 border-b bg-muted/30">
        <h3 className="text-lg font-medium">My Recent Downloads</h3>
      </div>
      
      <ScrollArea className="h-[300px]">
        {downloads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Download className="mx-auto h-8 w-8 mb-2 opacity-50" />
            <p>You haven't downloaded any resources yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden sm:table-cell">Downloaded</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {downloads.map((download) => (
                <TableRow key={download.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    {getTypeIcon(download.resource.type)}
                    <span className="truncate max-w-[200px]">{download.resource.title}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {download.resource.category?.name || 'Uncategorized'}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                    {formatDistanceToNow(new Date(download.downloaded_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <a 
                        href={download.resource.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        title="Open Resource"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </ScrollArea>
    </div>
  );
};

export default MyDownloads;
