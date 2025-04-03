
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Eye, 
  Pencil, 
  Trash2, 
  Plus, 
  Search, 
  Calendar, 
  Filter, 
  ArrowUpDown,
  FileText
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { blogPosts, getRecentPosts } from '@/data/blogPosts';
import { BlogPost, BlogCategory } from '@/types/blog';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const BlogPostManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>(blogPosts);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(blogPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setFilteredPosts(posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    } else {
      setFilteredPosts(posts);
    }
  };
  
  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = (post: BlogPost) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedPost) {
      // In a real app, this would make an API call to delete the post
      const updatedPosts = posts.filter(post => post.id !== selectedPost.id);
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
      
      toast({
        title: "Post deleted",
        description: `"${selectedPost.title}" has been deleted.`,
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedPost(null);
    }
  };
  
  const toggleFeatured = (postId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, featured: !post.featured };
      }
      return post;
    });
    
    setPosts(updatedPosts);
    setFilteredPosts(updatedPosts);
    
    const post = posts.find(p => p.id === postId);
    if (post) {
      toast({
        title: post.featured ? "Removed from featured" : "Added to featured",
        description: `"${post.title}" has been ${post.featured ? "removed from" : "added to"} featured posts.`,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Blog Posts</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <BlogPostForm />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search posts..." 
                  className="pl-10 min-w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" variant="secondary">Search</Button>
            </form>
          </div>
        </Tabs>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{post.category}</Badge>
                  </TableCell>
                  <TableCell>{format(post.publishedAt, 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={post.featured} 
                      onCheckedChange={() => toggleFeatured(post.id)} 
                      aria-label="Toggle featured"
                    />
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(post)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(post)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPosts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No posts found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Edit Post Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl">
            {selectedPost && <BlogPostForm post={selectedPost} onSave={() => setIsEditDialogOpen(false)} />}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedPost?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

interface BlogPostFormProps {
  post?: BlogPost;
  onSave?: () => void;
}

const BlogPostForm = ({ post, onSave }: BlogPostFormProps) => {
  const isEditing = !!post;
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    author: post?.author || '',
    featuredImage: post?.featuredImage || '',
    category: post?.category || 'evangelism',
    tags: post?.tags?.join(', ') || '',
    featured: post?.featured || false
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would make an API call to save the post
    toast({
      title: isEditing ? "Post updated" : "Post created",
      description: `"${formData.title}" has been ${isEditing ? "updated" : "saved"}.`,
    });
    
    if (onSave) onSave();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{isEditing ? 'Edit' : 'Create'} Blog Post</DialogTitle>
        <DialogDescription>
          {isEditing 
            ? "Make changes to your blog post here. Click save when you're done."
            : "Fill in the information for your new blog post."
          }
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input 
              id="slug" 
              name="slug" 
              value={formData.slug} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea 
              id="excerpt" 
              name="excerpt" 
              value={formData.excerpt} 
              onChange={handleChange} 
              rows={3} 
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="featuredImage">Featured Image URL</Label>
            <Input 
              id="featuredImage" 
              name="featuredImage" 
              value={formData.featuredImage} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="featured" 
              checked={formData.featured} 
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))} 
            />
            <Label htmlFor="featured">Featured Post</Label>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="author">Author</Label>
            <Input 
              id="author" 
              name="author" 
              value={formData.author} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              defaultValue={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="evangelism">Evangelism</SelectItem>
                <SelectItem value="bible-study">Bible Study</SelectItem>
                <SelectItem value="outreach">Outreach</SelectItem>
                <SelectItem value="testimony">Testimony</SelectItem>
                <SelectItem value="devotional">Devotional</SelectItem>
                <SelectItem value="news">News</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input 
              id="tags" 
              name="tags" 
              value={formData.tags} 
              onChange={handleChange} 
            />
          </div>
          
          <div>
            <Label htmlFor="content">Content (HTML)</Label>
            <Textarea 
              id="content" 
              name="content" 
              value={formData.content} 
              onChange={handleChange} 
              rows={10} 
              required 
            />
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button type="submit">{isEditing ? 'Save Changes' : 'Create Post'}</Button>
      </DialogFooter>
    </form>
  );
};

export default BlogPostManager;
