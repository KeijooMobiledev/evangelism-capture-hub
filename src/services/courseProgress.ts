import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

interface LessonProgress {
  lessonId: string;
  completed: boolean;
  lastAccessed: string;
}

// Temporary in-memory storage for development
const progressStorage = new Map<string, LessonProgress[]>();

export const useCourseProgress = (courseId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: progress } = useQuery({
    queryKey: ['courseProgress', courseId, user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // In a real implementation, this would call Supabase
      // For now, return stored progress or empty array
      const storageKey = `${user.id}-${courseId}`;
      return progressStorage.get(storageKey) || [];
    },
    enabled: !!user
  });

  const markLessonComplete = useMutation({
    mutationFn: async (lessonId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      // In a real implementation, this would upsert to Supabase
      // For now, update in-memory storage
      const storageKey = `${user.id}-${courseId}`;
      const currentProgress = progressStorage.get(storageKey) || [];
      
      const existingIndex = currentProgress.findIndex(p => p.lessonId === lessonId);
      const newProgress = {
        lessonId,
        completed: true,
        lastAccessed: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        currentProgress[existingIndex] = newProgress;
      } else {
        currentProgress.push(newProgress);
      }

      progressStorage.set(storageKey, currentProgress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['courseProgress', courseId, user?.id] 
      });
    }
  });

  return { progress, markLessonComplete };
};

export const getCourseCompletionPercentage = (
  lessons: {id: string}[],
  progress: {lessonId: string, completed: boolean}[]
) => {
  if (!progress || progress.length === 0 || lessons.length === 0) return 0;
  
  const completedLessons = progress.filter(p => p.completed).length;
  return Math.round((completedLessons / lessons.length) * 100);
};
