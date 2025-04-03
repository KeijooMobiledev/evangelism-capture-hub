
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, Lock } from 'lucide-react';
import { Lesson } from '@/types/course';

interface CourseNavigationProps {
  lessons: Lesson[];
  currentLessonId?: string;
  courseSlug: string;
  isEnrolled: boolean;
}

const CourseNavigation: React.FC<CourseNavigationProps> = ({
  lessons,
  currentLessonId,
  courseSlug,
  isEnrolled
}) => {
  return (
    <div className="space-y-1">
      <h3 className="font-medium mb-2">Course Content</h3>
      {lessons.map((lesson) => {
        const isActive = lesson.id === currentLessonId;
        const isCompleted = lesson.isCompleted;
        
        return (
          <div 
            key={lesson.id}
            className={`flex items-center px-3 py-2 rounded-md text-sm ${
              isActive 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
          >
            <div className="mr-3 w-5 h-5 flex-shrink-0">
              {isCompleted ? (
                <Check className="h-5 w-5 text-primary" />
              ) : isActive ? (
                <div className="w-2 h-2 rounded-full bg-primary-foreground mx-auto" />
              ) : (
                <div className="w-5 h-5" />
              )}
            </div>
            
            {isEnrolled ? (
              <Link 
                to={`/courses/${courseSlug}/lessons/${lesson.id}`}
                className="flex-1 truncate"
              >
                {lesson.title}
              </Link>
            ) : (
              <div className="flex justify-between items-center w-full">
                <span className="flex-1 truncate">{lesson.title}</span>
                <Lock className="h-3 w-3 text-muted-foreground" />
              </div>
            )}
          </div>
        );
      })}
      
      {!isEnrolled && (
        <div className="mt-4 px-3">
          <Button asChild className="w-full">
            <Link to={`/courses/${courseSlug}`}>Enroll to Access</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseNavigation;
