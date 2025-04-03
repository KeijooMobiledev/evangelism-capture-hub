
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useApi } from '@/hooks/use-api';
import { useAuth } from '@/contexts/AuthContext';
import { Course, Lesson } from '@/types/course';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Clock, BookOpen, Users, Play, CheckCircle, Lock } from 'lucide-react';

const CourseDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { api, isLoading } = useApi();
  const { user } = useAuth();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!slug) return;
      
      try {
        const fetchedCourse = await api.courses.getBySlug(slug);
        
        if (fetchedCourse) {
          setCourse(fetchedCourse);
          
          // Fetch lessons for this course
          const fetchedLessons = await api.courses.getLessons(fetchedCourse.id);
          setLessons(fetchedLessons);
          
          // In a real app, check if the user is enrolled
          setIsEnrolled(false); // Default to not enrolled
        } else {
          toast({
            title: 'Course not found',
            description: 'The course you are looking for does not exist',
            variant: 'destructive'
          });
          navigate('/courses');
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load course details',
          variant: 'destructive'
        });
      }
    };

    fetchCourseDetails();
  }, [slug, api, toast, navigate]);

  const handleEnrollCourse = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to enroll in this course',
        variant: 'destructive'
      });
      navigate('/login');
      return;
    }
    
    if (!course) return;
    
    setEnrollLoading(true);
    try {
      await api.courses.enroll(course.id);
      setIsEnrolled(true);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setEnrollLoading(false);
    }
  };

  const startLearning = () => {
    if (!course) return;
    
    if (lessons.length > 0) {
      navigate(`/courses/${course.slug}/lessons/${lessons[0].id}`);
    }
  };

  if (!course) {
    return (
      <DashboardLayout>
        <div className="container py-12">
          <p className="text-center">Loading course details...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/courses')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to courses
        </Button>

        <div className="grid gap-8 md:grid-cols-[2fr_1fr] lg:gap-12">
          <div>
            {/* Course header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge>{course.category}</Badge>
                <Badge variant="outline">{course.level}</Badge>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              
              <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
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
              
              {/* Course image */}
              <div className="w-full h-[300px] md:h-[400px] lg:h-[450px] rounded-lg overflow-hidden mb-8">
                <img 
                  src={course.coverImage} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Course content tabs */}
            <Tabs defaultValue="overview">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-3">About this course</h2>
                  <p>{course.description}</p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-3">What you'll learn</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <li className="flex">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                      <span>Fundamental principles of evangelism</span>
                    </li>
                    <li className="flex">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                      <span>Effective communication techniques</span>
                    </li>
                    <li className="flex">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                      <span>Building authentic relationships</span>
                    </li>
                    <li className="flex">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                      <span>Cultural sensitivity in evangelism</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-3">Requirements</h2>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Basic understanding of scripture</li>
                    <li>Willingness to engage with others</li>
                    <li>Open heart and mind</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="curriculum">
                <h2 className="text-xl font-semibold mb-4">Course Curriculum</h2>
                <div className="mb-4">
                  <div className="flex justify-between">
                    <span>{course.lessonsCount} lessons</span>
                    <span>{course.duration} total length</span>
                  </div>
                </div>
                
                <Accordion type="single" collapsible className="mb-8">
                  <AccordionItem value="section-1">
                    <AccordionTrigger>
                      <div>
                        <h3 className="text-left">Course Introduction</h3>
                        <span className="text-sm text-muted-foreground">3 lessons • 45 minutes</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {lessons.slice(0, 3).map((lesson) => (
                          <li key={lesson.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md">
                            <div className="flex items-center">
                              <Play className="h-4 w-4 mr-3" />
                              <div>
                                <span className="font-medium">{lesson.title}</span>
                                <div className="text-xs text-muted-foreground">{lesson.duration}</div>
                              </div>
                            </div>
                            {isEnrolled ? (
                              <Button size="sm" variant="ghost">Play</Button>
                            ) : (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            )}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
              
              <TabsContent value="instructor">
                <h2 className="text-xl font-semibold mb-4">About the Instructor</h2>
                <div className="flex items-start gap-4 mb-6">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                    <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">{course.instructor.name}</h3>
                    <p className="text-muted-foreground">{course.instructor.role}</p>
                  </div>
                </div>
                <p className="mb-6">
                  An experienced evangelist with over 15 years of ministry experience in various cultural contexts. 
                  Passionate about equipping others with the tools they need to effectively share their faith.
                </p>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Enrollment card */}
          <div className="md:sticky md:top-24 h-fit">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">Course Enrollment</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEnrolled ? (
                  <div className="space-y-6">
                    <div>
                      <p className="mb-2 text-sm text-muted-foreground">Your progress</p>
                      <Progress value={0} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">0% complete</p>
                    </div>
                    
                    <Button className="w-full" onClick={startLearning}>
                      <Play className="h-4 w-4 mr-2" />
                      Continue Learning
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <p className="text-3xl font-bold mb-2">Free</p>
                      <p className="text-muted-foreground">Full course access</p>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={handleEnrollCourse}
                      disabled={enrollLoading}
                    >
                      {enrollLoading ? 'Processing...' : 'Enroll Now'}
                    </Button>
                    
                    {!user && (
                      <p className="text-xs text-center text-muted-foreground">
                        You need to be logged in to enroll in this course
                      </p>
                    )}
                  </>
                )}
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="font-medium">This course includes:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span>{course.lessonsCount} on-demand lessons</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Full lifetime access</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Community discussions</span>
                    </li>
                  </ul>
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
