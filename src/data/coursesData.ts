import { Course, Lesson } from '@/types/course';

// Sample courses data
export const courses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Evangelism',
    slug: 'introduction-to-evangelism',
    description: 'Learn the fundamentals of evangelism and how to effectively spread the word of God in your community.',
    coverImage: 'https://source.unsplash.com/random/300x200/?bible',
    duration: '6 weeks',
    lessonsCount: 12,
    instructor: {
      id: 'ev1',
      name: 'Pastor John Smith',
      role: 'Senior Evangelist',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    level: 'beginner',
    category: 'Evangelism',
    tags: ['fundamentals', 'outreach', 'communication'],
    enrolledCount: 324,
    createdAt: '2023-04-15T10:00:00Z',
    updatedAt: '2023-05-01T14:30:00Z',
  },
  {
    id: '2',
    title: 'Advanced Bible Study Techniques',
    slug: 'advanced-bible-study-techniques',
    description: 'Deepen your understanding of scripture through advanced study methods and interpretation techniques.',
    coverImage: 'https://source.unsplash.com/random/300x200/?scripture',
    duration: '8 weeks',
    lessonsCount: 16,
    instructor: {
      id: 'ev2',
      name: 'Dr. Sarah Williams',
      role: 'Biblical Scholar',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    level: 'advanced',
    category: 'Bible Study',
    tags: ['bible', 'scripture', 'interpretation', 'exegesis'],
    enrolledCount: 186,
    createdAt: '2023-03-10T09:00:00Z',
    updatedAt: '2023-04-20T11:45:00Z',
  },
  {
    id: '3',
    title: 'Digital Ministry Essentials',
    slug: 'digital-ministry-essentials',
    description: 'Learn how to leverage digital tools and platforms to expand your ministry\'s reach and impact.',
    coverImage: 'https://source.unsplash.com/random/300x200/?technology',
    duration: '4 weeks',
    lessonsCount: 8,
    instructor: {
      id: 'ev3',
      name: 'Mark Johnson',
      role: 'Digital Evangelist',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    level: 'intermediate',
    category: 'Digital Ministry',
    tags: ['digital', 'social media', 'online presence', 'technology'],
    enrolledCount: 257,
    createdAt: '2023-05-20T08:15:00Z',
    updatedAt: '2023-06-02T16:20:00Z',
  }
];

// Sample lessons for the first course
export const courseOneLessons: Lesson[] = [
  {
    id: 'l1',
    courseId: '1',
    title: 'Understanding the Great Commission',
    description: 'An introduction to the biblical mandate for evangelism',
    content: 'In this lesson, we explore the Great Commission as given by Jesus Christ in Matthew 28:18-20. We discuss its significance and what it means for believers today.',
    duration: '45 minutes',
    order: 1,
    videoUrl: 'https://example.com/videos/lesson1.mp4',
    createdAt: '2023-04-15T10:00:00Z',
    updatedAt: '2023-04-15T10:00:00Z',
  },
  {
    id: 'l2',
    courseId: '1',
    title: 'Effective Communication Skills',
    description: 'Learn how to clearly communicate the gospel message',
    content: 'This lesson focuses on developing the communication skills necessary to share the gospel effectively with different audiences.',
    duration: '50 minutes',
    order: 2,
    videoUrl: 'https://example.com/videos/lesson2.mp4',
    createdAt: '2023-04-16T10:00:00Z',
    updatedAt: '2023-04-16T10:00:00Z',
  },
  {
    id: 'l3',
    courseId: '1',
    title: 'Building Relationships for Evangelism',
    description: 'The importance of authentic relationships in outreach',
    content: 'Learn how to build genuine relationships as a foundation for sharing your faith with others.',
    duration: '40 minutes',
    order: 3,
    videoUrl: 'https://example.com/videos/lesson3.mp4',
    createdAt: '2023-04-17T10:00:00Z',
    updatedAt: '2023-04-17T10:00:00Z',
  },
];

// Get all courses
export const getAllCourses = () => {
  return courses;
};

// Get a specific course by ID
export const getCourseById = (id: string) => {
  return courses.find(course => course.id === id) || null;
};

// Get a specific course by slug
export const getCourseBySlug = (slug: string) => {
  console.log('Looking for course with slug:', slug);
  console.log('Available courses:', courses.map(c => c.slug));
  const foundCourse = courses.find(course => course.slug === slug);
  console.log('Found course:', foundCourse);
  return foundCourse || null;
};

// Get lessons for a specific course
export const getLessonsByCourseId = (courseId: string) => {
  if (courseId === '1') {
    return courseOneLessons;
  }
  return [];
};

// Get a specific lesson by its ID
export const getLessonById = (courseId: string, lessonId: string) => {
  const lessons = getLessonsByCourseId(courseId);
  return lessons.find(lesson => lesson.id === lessonId) || null;
};
