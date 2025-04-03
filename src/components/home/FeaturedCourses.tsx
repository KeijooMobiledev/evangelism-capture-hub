
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import { courses } from '@/data/coursesData';

const FeaturedCourses: React.FC = () => {
  // Get the first 3 courses for the featured section
  const featuredCourses = courses.slice(0, 3);

  return (
    <section className="py-16">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold tracking-tight">Popular Courses</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Enhance your evangelism skills with our in-depth courses taught by experienced evangelists.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.map((course) => (
            <Card key={course.id} className="h-full overflow-hidden transition-all hover:shadow-lg">
              <CardHeader className="p-0">
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={course.coverImage} 
                    alt={course.title} 
                    className="h-full w-full object-cover transition-transform hover:scale-105" 
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{course.duration}</span>
                  <span>•</span>
                  <span>{course.lessonsCount} lessons</span>
                  <span>•</span>
                  <span className="capitalize">{course.level}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm">{course.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link to={`/courses/${course.slug}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Course
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Link to="/courses">
            <Button className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Browse All Courses
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
