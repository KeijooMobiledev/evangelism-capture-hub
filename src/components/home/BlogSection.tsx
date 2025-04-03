
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ArrowRight, Calendar } from 'lucide-react';
import { getFeaturedPosts } from '@/data/blogPosts';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

const BlogSection = () => {
  const { t } = useLanguage();
  const featuredPosts = getFeaturedPosts();

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest from Our Blog</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Insights, resources, and stories to help you grow in your evangelistic mission
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden flex flex-col h-full transition-all duration-200 hover:shadow-md">
              <div 
                className="h-48 bg-cover bg-center" 
                style={{ backgroundImage: `url(${post.featuredImage})` }}
              />
              <CardHeader className="p-6 pb-2">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{format(post.publishedAt, 'MMMM d, yyyy')}</span>
                </div>
                <Link to={`/blog/${post.slug}`} className="group">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                </Link>
              </CardHeader>
              <CardContent className="px-6 pb-4 flex-grow">
                <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="px-6 pb-6 pt-0">
                <Link to={`/blog/${post.slug}`}>
                  <Button variant="ghost" className="p-0 h-auto font-medium text-primary hover:text-primary/80">
                    Read More <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/blog">
            <Button variant="outline" size="lg">
              View All Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
