
import { Product, ProductCategory } from '@/types/product';

export const productCategories: ProductCategory[] = [
  {
    id: '1',
    name: 'Books',
    slug: 'books',
    description: 'Christian books and study materials',
    image: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Devotional Materials',
    slug: 'devotional-materials',
    description: 'Daily devotional materials and journals',
    image: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Evangelism Tools',
    slug: 'evangelism-tools',
    description: 'Tools to help with evangelism outreach',
    image: '/placeholder.svg'
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Effective Evangelism Guide',
    slug: 'effective-evangelism-guide',
    description: 'A comprehensive guide to effective evangelism techniques in the modern world. This book provides practical steps and biblical foundations for sharing your faith.',
    price: 19.99,
    salePrice: 14.99,
    images: ['/placeholder.svg'],
    category: 'Books',
    tags: ['evangelism', 'outreach', 'guide'],
    featured: true,
    inStock: true,
    stockQuantity: 100,
    rating: 4.8,
    reviews: [
      {
        id: 'r1',
        userId: 'u1',
        userName: 'John Davis',
        rating: 5,
        comment: 'This guide transformed my approach to evangelism!',
        createdAt: '2023-06-15T10:00:00Z'
      }
    ],
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-05-20T14:30:00Z'
  },
  {
    id: '2',
    name: 'Prayer Journal',
    slug: 'prayer-journal',
    description: 'A beautifully designed journal for recording your prayers, reflections, and God\'s answers. Includes guided prompts and scripture references.',
    price: 12.99,
    images: ['/placeholder.svg'],
    category: 'Devotional Materials',
    tags: ['prayer', 'journal', 'devotional'],
    featured: true,
    inStock: true,
    stockQuantity: 75,
    rating: 4.5,
    reviews: [
      {
        id: 'r2',
        userId: 'u2',
        userName: 'Sarah Miller',
        rating: 4,
        comment: 'Love the layout and prompts in this journal!',
        createdAt: '2023-07-10T14:20:00Z'
      }
    ],
    createdAt: '2023-02-10T11:30:00Z',
    updatedAt: '2023-05-25T09:15:00Z'
  },
  {
    id: '3',
    name: 'Gospel Tract Pack',
    slug: 'gospel-tract-pack',
    description: 'A pack of 50 well-designed gospel tracts with clear, concise presentations of the gospel message. Perfect for street evangelism and outreach events.',
    price: 9.99,
    salePrice: 7.99,
    images: ['/placeholder.svg'],
    category: 'Evangelism Tools',
    tags: ['tracts', 'outreach', 'evangelism'],
    featured: false,
    inStock: true,
    stockQuantity: 200,
    rating: 4.7,
    reviews: [
      {
        id: 'r3',
        userId: 'u3',
        userName: 'Michael Johnson',
        rating: 5,
        comment: 'These tracts have been incredibly effective in our outreach work.',
        createdAt: '2023-08-05T16:45:00Z'
      }
    ],
    createdAt: '2023-03-20T13:45:00Z',
    updatedAt: '2023-06-10T10:20:00Z'
  }
];

// Helper functions
export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getAllProducts = (): Product[] => {
  return products;
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};
