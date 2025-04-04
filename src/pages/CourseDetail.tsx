
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { BookOpen, Clock, Users, Play, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Course, Lesson } from '@/types/course';
import { getCourseBySlug, getLessonsByCourseId } from '@/data/coursesData';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseProgress, getCourseCompletionPercentage } from '@/services/courseProgress';

const CourseDetail = () => {
  console.log('CourseDetail component mounted');
  const { slug } = useParams<{ slug: string }>();
  console.log('Received slug from URL:', slug);
  if (!slug) {
    console.error('Error: No slug parameter in URL');
    return (
      <DashboardLayout>
        <div className="container py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Invalid URL</h2>
            <p className="mb-6">The course URL is invalid. Please check the link.</p>
            <Button asChild>
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  const { toast } = useToast();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    console.log('Loading course for slug:', slug);
    if (slug) {
      // Get course data
      const courseData = getCourseBySlug(slug);
      console.log('Course data:', courseData);
      
      if (courseData) {
        setCourse(courseData);
        
        // Get lessons for this course
        const courseLessons = getLessonsByCourseId(courseData.id);
        console.log('Course lessons:', courseLessons);
        setLessons(courseLessons);
      }
      setLoading(false);
    }
  }, [slug]);

  const handleEnroll = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to enroll in this course.",
        variant: "destructive",
      });
      return;
    }
    
    // Here we would typically call an API to enroll the user
    toast({
      title: "Enrolled Successfully",
      description: `You are now enrolled in "${course?.title}"`,
    });
    setEnrolled(true);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { progress } = useCourseProgress(course?.id || '');
  const completionPercentage = course ? getCourseCompletionPercentage(lessons, progress || []) : 0;

  if (!course) {
    console.error('No course found for slug:', slug);
    return (
      <DashboardLayout>
        <div className="container py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
            <p className="mb-6">The course you're looking for doesn't exist or has been removed.</p>
            <p className="text-red-500">Debug: Slug was {slug}</p>
            <Button asChild>
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="grid gap-6 md:grid-cols-[2fr_1fr] lg:gap-8">
          {/* Main content */}
          <div className="space-y-6">
            {/* Course header */}
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src={course.coverImage} 
                alt={course.title} 
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <Badge className="mb-2 self-start">{course.level}</Badge>
                <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
                <div className="flex flex-wrap gap-4 text-white/80">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>{course.lessonsCount} lessons</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{course.enrolledCount} enrolled</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Course tabs */}
            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="lessons">Lessons</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <h2 className="text-xl font-semibold mb-4">About This Course</h2>
                <p className="text-muted-foreground mb-6">{course.description}</p>
                
                <h3 className="text-lg font-semibold mb-3">What You'll Learn</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Essential evangelism techniques and principles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Effective communication strategies for sharing your faith</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Building authentic relationships as a foundation for outreach</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Adapting your approach to different contexts and cultures</span>
                  </li>
                </ul>
                
                <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>No prior experience required - suitable for beginners</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>A willingness to learn and practice new skills</span>
                  </li>
                </ul>
              </TabsContent>
              
              <TabsContent value="lessons" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Course Content</h2>
                  {enrolled && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {completionPercentage}% complete
                      </span>
                      <Progress value={completionPercentage} className="w-24 h-2" />
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {lessons.length > 0 ? (
                    lessons.map((lesson) => (
                      <Card key={lesson.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                                {lesson.order}
                              </div>
                              <div>
                                <h3 className="font-medium">{lesson.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {lesson.duration}
                                </p>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              variant={enrolled ? "default" : "outline"}
                              disabled={!enrolled}
                              asChild={enrolled}
                            >
                              {enrolled ? (
                                <Link to={`/courses/${slug}/lessons/${lesson.id}`}>
                                  <Play className="h-4 w-4 mr-1" />
                                  Start
                                </Link>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-1" />
                                  Locked
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center py-6 text-muted-foreground">
                      No lessons available for this course yet.
                    </p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="instructor" className="mt-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src={course.instructor.avatar} 
                      alt={course.instructor.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{course.instructor.name}</h2>
                    <p className="text-muted-foreground">{course.instructor.role}</p>
                    <p className="mt-4">
                      Experienced evangelist with a passion for teaching others how to effectively share the Gospel.
                      With over 10 years of experience in ministry and outreach, they have developed practical
                      methods that work in various cultural contexts.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Enroll in this course</h3>
                    <Badge variant="outline">Free</Badge>
                  </div>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleEnroll}
                    disabled={enrolled}
                  >
                    {enrolled ? "Already Enrolled" : "Enroll Now"}
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    {isAuthenticated 
                      ? "Start learning today!" 
                      : "You need to be logged in to enroll"}
                  </p>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-medium">This course includes:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>{course.lessonsCount} lessons</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>Lifetime access</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-primary" />
                      <span>Community support</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            {/* Related Courses */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Related Courses</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* We would typically fetch related courses from the API */}
                  {/* For now, let's display some sample related courses */}
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src="/placeholder.svg" 
                        alt="Digital Ministry Essentials" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <Link to="/courses/digital-ministry-essentials" className="font-medium hover:underline">
                        Digital Ministry Essentials
                      </Link>
                      <p className="text-xs text-muted-foreground">4 weeks • Intermediate</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src="/placeholder.svg" 
                        alt="Advanced Bible Study Techniques" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <Link to="/courses/advanced-bible-study-techniques" className="font-medium hover:underline">
                        Advanced Bible Study Techniques
                      </Link>
                      <p className="text-xs text-muted-foreground">8 weeks • Advanced</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseDetail;
