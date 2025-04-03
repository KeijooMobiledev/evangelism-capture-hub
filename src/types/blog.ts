
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorId: string;
  featuredImage?: string;
  publishedAt: Date;
  updatedAt: Date;
  category: string;
  tags: string[];
  featured: boolean;
}

export type BlogCategory = 'evangelism' | 'bible-study' | 'outreach' | 'testimony' | 'devotional' | 'news';
