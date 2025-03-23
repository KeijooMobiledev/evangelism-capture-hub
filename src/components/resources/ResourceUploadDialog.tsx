
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ResourceCategory } from '@/hooks/use-resources';
import { v4 as uuidv4 } from '@supabase/supabase-js/dist/main/lib/helpers';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileAudio,
  FileVideo,
  FileText,
  Upload,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface ResourceUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: ResourceCategory[];
  onSuccess: () => void;
}

const ResourceUploadDialog: React.FC<ResourceUploadDialogProps> = ({
  open,
  onOpenChange,
  categories,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'audio' | 'video' | 'text'>('text');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [allowDownload, setAllowDownload] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('text');
    setCategoryId(undefined);
    setAllowDownload(true);
    setFile(null);
    setThumbnail(null);
  };

  const handleClose = () => {
    if (!isUploading) {
      resetForm();
      onOpenChange(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Auto-detect file type if possible
      if (selectedFile.type.startsWith('audio/')) {
        setType('audio');
      } else if (selectedFile.type.startsWith('video/')) {
        setType('video');
      } else {
        setType('text');
      }
      
      setFile(selectedFile);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to upload resources',
        variant: 'destructive',
      });
      return;
    }

    if (!file) {
      toast({
        title: 'File required',
        description: 'Please select a file to upload',
        variant: 'destructive',
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please provide a title for the resource',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${uuidv4()}.${fileExt}`;
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('spiritual_resources')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get file URL
      const { data: fileData } = supabase.storage
        .from('spiritual_resources')
        .getPublicUrl(filePath);
      
      // Upload thumbnail if present
      let thumbnailUrl = null;
      if (thumbnail) {
        const thumbExt = thumbnail.name.split('.').pop();
        const thumbPath = `${user.id}/thumbnails/${uuidv4()}.${thumbExt}`;
        
        const { error: thumbError } = await supabase.storage
          .from('spiritual_resources')
          .upload(thumbPath, thumbnail);
        
        if (thumbError) throw thumbError;
        
        const { data: thumbData } = supabase.storage
          .from('spiritual_resources')
          .getPublicUrl(thumbPath);
        
        thumbnailUrl = thumbData.publicUrl;
      }
      
      // Get file size
      const sizeBytes = file.size;
      
      // Get duration for audio/video (not implemented here)
      const durationSeconds = null;
      
      // Create record in database
      const { error: dbError } = await supabase
        .from('spiritual_resources')
        .insert({
          title,
          description,
          type,
          file_url: fileData.publicUrl,
          thumbnail_url: thumbnailUrl,
          created_by: user.id,
          category_id: categoryId,
          size_bytes: sizeBytes,
          duration_seconds: durationSeconds,
          allow_download: allowDownload
        });
      
      if (dbError) throw dbError;
      
      toast({
        title: 'Resource uploaded',
        description: 'Your resource has been successfully uploaded',
      });
      
      resetForm();
      onSuccess();
      onOpenChange(false);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'There was a problem uploading your resource',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Upload Spiritual Resource</DialogTitle>
            <DialogDescription>
              Share educational, inspirational, or practical content with your community.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 gap-3">
              <Label htmlFor="file">Resource File</Label>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  {type === 'audio' && <FileAudio className="h-6 w-6 text-primary" />}
                  {type === 'video' && <FileVideo className="h-6 w-6 text-primary" />}
                  {type === 'text' && <FileText className="h-6 w-6 text-primary" />}
                </div>
                
                <div className="flex-1">
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    className="h-auto py-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported formats: PDF, DOC, MP3, MP4, etc. (Max size: 100MB)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Resource title"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">Resource Type</Label>
                <Select value={type} onValueChange={(value) => setType(value as any)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="text">Text Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this resource is about..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={categoryId} 
                  onValueChange={setCategoryId}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="thumbnail">Thumbnail (Optional)</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="h-auto py-2"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowDownload"
                checked={allowDownload}
                onCheckedChange={(checked) => setAllowDownload(!!checked)}
              />
              <Label htmlFor="allowDownload">Allow users to download this resource</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading || !file || !title.trim()}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Resource
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceUploadDialog;
