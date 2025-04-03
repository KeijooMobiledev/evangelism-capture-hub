
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  duration: string;
  lessonsCount: number;
  instructor: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  };
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  enrolledCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  duration: string;
  order: number;
  videoUrl?: string;
  isCompleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  userId: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  startedAt: string;
  completedAt?: string;
}
