
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useApi } from '@/hooks/use-api';
import type { BlogPost as BlogPostType } from '@/types/blog';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { api } = useApi();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      try {
        // In a real app, you would fetch this from an API
        const posts = await api.blog.getPosts();
        const foundPost = posts.find(post => post.slug === slug);
        
        if (foundPost) {
          setPost(foundPost);
        } else {
          toast({
            title: "Post not found",
            description: "The blog post you're looking for doesn't exist.",
            variant: "destructive",
          });
          navigate('/blog');
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        toast({
          title: "Error",
          description: "Failed to load the blog post.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug, toast, navigate, api]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container py-12">
          <p className="text-center">Loading post...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!post) {
    return (
      <DashboardLayout>
        <div className="container py-12">
          <p className="text-center">Post not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/blog')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to all posts
          </Button>
        </div>

        <article className="max-w-4xl mx-auto">
          {post.featuredImage && (
            <div 
              className="w-full h-96 bg-cover bg-center rounded-lg mb-8"
              style={{ backgroundImage: `url(${post.featuredImage})` }}
            />
          )}
          
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap gap-4 mb-8 text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              <span>{post.category}</span>
            </div>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {post.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-6">{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map(tag => (
              <div key={tag} className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-sm">
                #{tag}
              </div>
            ))}
          </div>
        </article>
      </div>
    </DashboardLayout>
  );
};

export default BlogPost;
