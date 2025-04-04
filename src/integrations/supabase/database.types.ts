// Types manuels pour Supabase
export interface Database {
  public: {
    Tables: {
      blog_articles: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          slug: string;
          content: string;
          featured_image_url: string | null;
          author_id: string;
          tags: string[] | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          slug: string;
          content: string;
          featured_image_url?: string | null;
          author_id: string;
          tags?: string[] | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          slug?: string;
          content?: string;
          featured_image_url?: string | null;
          author_id?: string;
          tags?: string[] | null;
        };
      };
      products: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          slug: string;
          description: string;
          price: number;
          image_url: string;
          stock: number | null;
          category: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          slug: string;
          description: string;
          price: number;
          image_url: string;
          stock?: number | null;
          category: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          slug?: string;
          description?: string;
          price?: number;
          image_url?: string;
          stock?: number | null;
          category?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          slug: string;
          description: string;
          cover_image: string;
          price: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          slug: string;
          description: string;
          cover_image: string;
          price?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          slug?: string;
          description?: string;
          cover_image?: string;
          price?: number;
        };
      };
    };
  };
}
