
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useApi } from '@/hooks/use-api';
import { useAuth } from '@/contexts/AuthContext';
import { Course, Lesson } from '@/types/course';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, CheckCircle, Play, Lock } from 'lucide-react';

const CourseLesson: React.FC = () => {
  const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>();
  const navigate = useNavigate();
  const { api, isLoading } = useApi();
  const { user } = useAuth();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [completingLesson, setCompletingLesson] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug || !lessonId) return;
      
      try {
        // Get course information
        const fetchedCourse = await api.courses.getBySlug(slug);
        
        if (fetchedCourse) {
          setCourse(fetchedCourse);
          
          // Check if enrolled (would be a real API call in production)
          setIsEnrolled(true); // For demo purposes
          
          // Get all lessons for the course
          const fetchedLessons = await api.courses.getLessons(fetchedCourse.id);
          setAllLessons(fetchedLessons);
          
          // Get the current lesson
          const currentLesson = fetchedLessons.find(l => l.id === lessonId);
          
          if (currentLesson) {
            setLesson(currentLesson);
          } else {
            toast({
              title: 'Lesson not found',
              description: 'The requested lesson does not exist',
              variant: 'destructive'
            });
            navigate(`/courses/${slug}`);
          }
        } else {
          toast({
            title: 'Course not found',
            description: 'The course you are looking for does not exist',
            variant: 'destructive'
          });
          navigate('/courses');
        }
      } catch (error) {
        console.error('Error fetching lesson:', error);
        toast({
          title: 'Error',
          description: 'Failed to load lesson data',
          variant: 'destructive'
        });
      }
    };

    fetchData();
  }, [slug, lessonId, api, toast, navigate, user]);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="mb-6">You need to be logged in to access course lessons.</p>
          <Button onClick={() => navigate('/login')}>Login</Button>
        </div>
      </DashboardLayout>
    );
  }

  if (!isEnrolled && course) {
    return (
      <DashboardLayout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Enrollment Required</h1>
          <p className="mb-6">You need to enroll in this course to access its lessons.</p>
          <Button onClick={() => navigate(`/courses/${slug}`)}>
            Go to Course Page
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (!course || !lesson) {
    return (
      <DashboardLayout>
        <div className="container py-12">
          <p className="text-center">Loading lesson...</p>
        </div>
      </DashboardLayout>
    );
  }

  const currentIndex = allLessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const markAsComplete = async () => {
    if (!course || !lesson) return;
    
    setCompletingLesson(true);
    try {
      await api.courses.completeLesson(course.id, lesson.id);
      
      // Update the lesson state to reflect completion
      setLesson({
        ...lesson,
        isCompleted: true
      });
      
      toast({
        title: 'Lesson Completed',
        description: 'Your progress has been saved'
      });
      
      // Navigate to next lesson if available
      if (nextLesson) {
        navigate(`/courses/${slug}/lessons/${nextLesson.id}`);
      }
    } catch (error) {
      console.error('Error marking lesson as complete:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark lesson as complete',
        variant: 'destructive'
      });
    } finally {
      setCompletingLesson(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(`/courses/${slug}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to course
        </Button>

        <div className="grid gap-8 md:grid-cols-[3fr_1fr] lg:gap-12">
          <div>
            {/* Video player placeholder */}
            <div className="aspect-video bg-muted rounded-lg mb-8 flex items-center justify-center">
              {lesson.videoUrl ? (
                <div className="w-full h-full bg-black flex items-center justify-center text-white">
                  <p>Video player would be here</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-muted-foreground">
                  <Play className="h-12 w-12 mb-2" />
                  <p>No video available for this lesson</p>
                </div>
              )}
            </div>

            {/* Lesson content */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
                <p className="text-muted-foreground">{lesson.description}</p>
              </div>
              
              <Separator />
              
              <div className="prose dark:prose-invert max-w-none">
                {lesson.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              
              <div className="flex justify-between pt-6">
                {prevLesson ? (
                  <Button 
                    variant="outline"
                    onClick={() => navigate(`/courses/${slug}/lessons/${prevLesson.id}`)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous Lesson
                  </Button>
                ) : <div />}
                
                {lesson.isCompleted ? (
                  <Button disabled>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completed
                  </Button>
                ) : (
                  <Button 
                    onClick={markAsComplete}
                    disabled={completingLesson}
                  >
                    {completingLesson ? 'Processing...' : 'Mark as Complete'}
                    {!completingLesson && nextLesson && (
                      <ArrowRight className="h-4 w-4 ml-2" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Lessons sidebar */}
          <div className="md:sticky md:top-24 h-fit">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Course Lessons</h2>
                
                <ul className="space-y-2">
                  {allLessons.map((l) => {
                    const isActive = l.id === lesson.id;
                    
                    return (
                      <li 
                        key={l.id}
                        className={`
                          flex items-center justify-between p-2 rounded-md 
                          ${isActive ? 'bg-primary/10' : 'hover:bg-muted/50'}
                        `}
                      >
                        <div className="flex items-center">
                          {l.isCompleted ? (
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          ) : (
                            <Play className="h-4 w-4 mr-2" />
                          )}
                          <div 
                            className={`text-sm truncate max-w-[150px] ${isActive ? 'font-medium' : ''}`}
                            title={l.title}
                          >
                            {l.title}
                          </div>
                        </div>
                        
                        {isActive ? (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => navigate(`/courses/${slug}/lessons/${l.id}`)}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseLesson;
