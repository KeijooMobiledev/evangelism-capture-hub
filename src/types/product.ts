
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: string;
  tags: string[];
  featured: boolean;
  inStock: boolean;
  stockQuantity?: number;
  rating?: number;
  reviews?: ProductReview[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}
