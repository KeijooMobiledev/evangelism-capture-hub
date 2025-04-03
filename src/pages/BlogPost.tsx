
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, ArrowLeft, Tag, Clock, Share2, Bookmark, Facebook, Twitter } from 'lucide-react';
import { getPostBySlug, getRecentPosts } from '@/data/blogPosts';
import { BlogPost } from '@/types/blog';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [readingTime, setReadingTime] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      const blogPost = getPostBySlug(slug);
      if (blogPost) {
        setPost(blogPost);
        // Calculate reading time (rough estimate: 200 words per minute)
        const wordCount = blogPost.content.split(/\s+/).length;
        setReadingTime(Math.ceil(wordCount / 200));
        
        // Get related posts (just getting recent posts for now)
        setRelatedPosts(getRecentPosts(3).filter(p => p.id !== blogPost.id));
      } else {
        navigate('/blog');
      }
    }
  }, [slug, navigate]);

  const handleShare = (platform: string) => {
    const shareUrl = window.location.href;
    let shareWindow;
    
    switch(platform) {
      case 'facebook':
        shareWindow = window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'twitter':
        shareWindow = window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post?.title || '')}`, '_blank');
        break;
      default:
        // Copy link to clipboard
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied to clipboard",
          description: "You can now share this article with others.",
        });
    }
    
    if (shareWindow) shareWindow.focus();
  };
  
  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <article className="max-w-3xl mx-auto">
          <Link to="/blog">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to blog
            </Button>
          </Link>

          {/* Featured Image */}
          <div 
            className="w-full h-72 bg-cover bg-center rounded-lg mb-8" 
            style={{ backgroundImage: `url(${post.featuredImage})` }}
          >
            <div className="h-full w-full bg-black/40 rounded-lg flex flex-col justify-end p-6">
              <span className="text-sm bg-primary/80 text-primary-foreground px-3 py-1 rounded-full w-fit mb-4">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {post.title}
              </h1>
              <div className="flex items-center gap-3 text-sm text-white/90">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <Separator orientation="vertical" className="h-4 bg-white/30" />
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(post.publishedAt, 'MMMM d, yyyy')}</span>
                </div>
                <Separator orientation="vertical" className="h-4 bg-white/30" />
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex gap-8">
            <div className="hidden md:flex flex-col gap-4 items-center pt-12">
              <Button variant="outline" size="icon" onClick={() => handleShare('facebook')}>
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleShare('twitter')}>
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleShare('link')}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Mobile Share Buttons */}
              <div className="flex md:hidden justify-center gap-4 my-8">
                <Button variant="outline" size="icon" onClick={() => handleShare('facebook')}>
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleShare('twitter')}>
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleShare('link')}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-8">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {post.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="text-xs bg-secondary/10 text-secondary-foreground px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Card key={relatedPost.id} className="h-full flex flex-col">
                <CardHeader className="p-4 pb-2">
                  <Link to={`/blog/${relatedPost.slug}`}>
                    <CardTitle className="text-lg hover:text-primary transition-colors line-clamp-2">
                      {relatedPost.title}
                    </CardTitle>
                  </Link>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-grow">
                  <CardDescription className="line-clamp-3 mb-4">
                    {relatedPost.excerpt}
                  </CardDescription>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{format(relatedPost.publishedAt, 'MMM d, yyyy')}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
