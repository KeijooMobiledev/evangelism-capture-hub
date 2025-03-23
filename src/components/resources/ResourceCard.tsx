
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Bookmark, 
  BookmarkCheck, 
  FileText, 
  FileAudio, 
  FileVideo, 
  ExternalLink, 
  Clock, 
  HardDrive
} from "lucide-react";
import { SpiritualResource } from '@/hooks/use-resources';
import { formatDistanceToNow } from 'date-fns';

interface ResourceCardProps {
  resource: SpiritualResource;
  onBookmark: (id: string) => void;
  onDownload: (resource: SpiritualResource) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ 
  resource, 
  onBookmark, 
  onDownload 
}) => {
  const TypeIcon = {
    'audio': FileAudio,
    'video': FileVideo,
    'text': FileText
  }[resource.type];

  const formattedDate = formatDistanceToNow(
    new Date(resource.created_at),
    { addSuffix: true }
  );

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '';
    
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    } else if (mins > 0) {
      return `${mins}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const handleDownload = () => {
    onDownload(resource);
  };
  
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 relative bg-muted/30">
        <div className="absolute top-2 right-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full" 
            onClick={() => onBookmark(resource.id)}
            aria-label={resource.is_bookmarked ? "Remove bookmark" : "Bookmark"}
          >
            {resource.is_bookmarked ? (
              <BookmarkCheck className="h-5 w-5 text-primary" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary p-2 rounded-lg">
            <TypeIcon className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-lg truncate">{resource.title}</CardTitle>
            <CardDescription className="text-xs">
              {resource.category?.name} • Added {formattedDate}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="py-3 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {resource.description || "No description provided."}
        </p>
        
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {resource.size_bytes && (
            <div className="flex items-center gap-1">
              <HardDrive className="h-3 w-3" />
              <span>{formatSize(resource.size_bytes)}</span>
            </div>
          )}
          {resource.duration_seconds && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDuration(resource.duration_seconds)}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            <span>{resource.downloads || 0} downloads</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-1 pb-3 flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={handleDownload}
          disabled={!resource.allow_download}
        >
          <Download className="h-4 w-4 mr-2" />
          {resource.allow_download ? "Download" : "Download Disabled"}
        </Button>
        
        <Button 
          variant="default" 
          size="icon"
          asChild
        >
          <a href={resource.file_url} target="_blank" rel="noopener noreferrer" aria-label="View">
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResourceCard;
