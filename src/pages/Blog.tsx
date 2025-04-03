import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Search, Calendar, User, Tag, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { getPostsByCategory, searchPosts } from '@/data/blogPosts';
import { BlogPost as BlogPostType } from '@/types/blog';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApi } from '@/hooks/use-api';

const Blog = () => {
  const { t } = useLanguage();
  const { api } = useApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [allPosts, setAllPosts] = useState<BlogPostType[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPostType[]>([]);
  const [currentCategory, setCurrentCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const posts = await api.blog.getPosts();
        setAllPosts(posts);
        setFilteredPosts(posts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [api]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setFilteredPosts(searchPosts(searchQuery));
    } else {
      setFilteredPosts(currentCategory === 'all' ? allPosts : getPostsByCategory(currentCategory));
    }
  };

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    setSearchQuery('');
    setFilteredPosts(category === 'all' ? allPosts : getPostsByCategory(category));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Blog</h1>
          <p className="text-muted-foreground mb-8">
            Explore articles, resources, and insights about evangelism and ministry
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search articles..." 
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                  Search
                </Button>
              </div>
            </form>
          </div>

          {/* Categories */}
          <Tabs defaultValue="all" className="mb-8" onValueChange={handleCategoryChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="evangelism">Evangelism</TabsTrigger>
              <TabsTrigger value="bible-study">Bible Study</TabsTrigger>
              <TabsTrigger value="outreach">Outreach</TabsTrigger>
              <TabsTrigger value="testimony">Testimonies</TabsTrigger>
              <TabsTrigger value="devotional">Devotional</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Blog Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const BlogPostCard = ({ post }: { post: BlogPostType }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-0">
        <div 
          className="h-48 bg-cover bg-center rounded-t-lg" 
          style={{ backgroundImage: `url(${post.featuredImage})` }}
        >
          <div className="h-full w-full bg-black/30 rounded-t-lg flex items-end p-4">
            <span className="text-xs bg-primary/80 text-primary-foreground px-2 py-1 rounded-full">
              {post.category}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Calendar className="h-3 w-3" />
          <span>{format(post.publishedAt, 'MMM d, yyyy')}</span>
          <Separator orientation="vertical" className="h-3" />
          <User className="h-3 w-3" />
          <span>{post.author}</span>
        </div>
        <Link to={`/blog/${post.slug}`}>
          <CardTitle className="mb-2 hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
        </Link>
        <CardDescription className="line-clamp-3">
          {post.excerpt}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/blog/${post.slug}`}>
          <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto font-normal text-primary">
            Read more <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default Blog;
