
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Course, Lesson } from '@/types/course';
import { getCourseBySlug, getLessonsByCourseId, getLessonById } from '@/data/coursesData';
import { useAuth } from '@/contexts/AuthContext';
import CourseNavigation from '@/components/courses/CourseNavigation';

const CourseLesson = () => {
  const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access course lessons.",
        variant: "destructive",
      });
      navigate(`/courses/${slug}`);
      return;
    }

    if (slug && lessonId) {
      // Get course data
      const courseData = getCourseBySlug(slug);
      if (courseData) {
        setCourse(courseData);
        
        // Get all lessons for this course
        const courseLessons = getLessonsByCourseId(courseData.id);
        setLessons(courseLessons);
        
        // Get the specific lesson
        if (courseLessons.length > 0) {
          const lessonData = getLessonById(courseData.id, lessonId);
          if (lessonData) {
            setLesson(lessonData);
            // In a real app, we would check if the user is enrolled
            setIsEnrolled(true);
          } else {
            toast({
              title: "Lesson Not Found",
              description: "The requested lesson could not be found.",
              variant: "destructive",
            });
            navigate(`/courses/${slug}`);
          }
        }
      } else {
        toast({
          title: "Course Not Found",
          description: "The requested course could not be found.",
          variant: "destructive",
        });
        navigate('/courses');
      }
      
      setLoading(false);
    }
  }, [slug, lessonId, isAuthenticated, navigate, toast]);

  const markAsCompleted = () => {
    setLessonCompleted(true);
    toast({
      title: "Lesson Completed",
      description: "Great job! This lesson has been marked as completed.",
    });
    
    // In a real app, we would send this status to the backend
  };

  // Navigate to the next lesson
  const goToNextLesson = () => {
    if (!course || !lesson || lessons.length === 0) return;
    
    const currentIndex = lessons.findIndex(l => l.id === lesson.id);
    if (currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];
      navigate(`/courses/${slug}/lessons/${nextLesson.id}`);
    } else {
      // This is the last lesson
      toast({
        title: "Course Completed",
        description: "Congratulations! You've completed all lessons in this course.",
      });
      navigate(`/courses/${slug}`);
    }
  };

  // Navigate to the previous lesson
  const goToPreviousLesson = () => {
    if (!course || !lesson || lessons.length === 0) return;
    
    const currentIndex = lessons.findIndex(l => l.id === lesson.id);
    if (currentIndex > 0) {
      const prevLesson = lessons[currentIndex - 1];
      navigate(`/courses/${slug}/lessons/${prevLesson.id}`);
    }
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

  if (!course || !lesson) {
    return (
      <DashboardLayout>
        <div className="container py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Lesson Not Found</h2>
            <p className="mb-6">The lesson you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to={`/courses/${slug}`}>Back to Course</Link>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/courses/${slug}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Course
            </Link>
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-[280px_1fr] lg:gap-8">
          {/* Sidebar with lesson navigation */}
          <div className="order-2 md:order-1">
            <Card>
              <CardContent className="p-4">
                <CourseNavigation 
                  lessons={lessons} 
                  currentLessonId={lesson.id}
                  courseSlug={slug!}
                  isEnrolled={isEnrolled}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Main lesson content */}
          <div className="order-1 md:order-2">
            <Card>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
                <p className="text-sm text-muted-foreground mb-6">
                  {lesson.duration} • Lesson {lesson.order} of {lessons.length}
                </p>
                
                {/* Video player (placeholder) */}
                {lesson.videoUrl && (
                  <div className="aspect-video bg-muted rounded-md mb-6 flex items-center justify-center">
                    <p className="text-muted-foreground">Video Player - {lesson.videoUrl}</p>
                  </div>
                )}
                
                <div className="prose max-w-none">
                  <h2>Lesson Content</h2>
                  <p>{lesson.content}</p>
                  
                  <h3>Key Takeaways</h3>
                  <ul>
                    <li>Understanding the fundamental principles covered in this lesson</li>
                    <li>Practical applications of the concepts discussed</li>
                    <li>How to implement these strategies in your own evangelism efforts</li>
                  </ul>
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Button 
                    variant="outline" 
                    onClick={goToPreviousLesson}
                    disabled={lesson.order === 1}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous Lesson
                  </Button>
                  
                  {!lessonCompleted ? (
                    <Button onClick={markAsCompleted}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Completed
                    </Button>
                  ) : (
                    <Button onClick={goToNextLesson}>
                      Next Lesson
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseLesson;
