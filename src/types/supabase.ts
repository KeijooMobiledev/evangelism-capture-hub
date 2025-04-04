import { Database as DatabaseGenerated } from '@/integrations/supabase/database.types';

export type Database = DatabaseGenerated;

// Étendons les types si nécessaire
declare global {
  namespace Database {
    interface Public {
      Tables: {
        products: {
          Row: {
            id: string;
            created_at: string;
            name: string;
            slug: string;
            description: string;
            price: number;
            image_url: string;
            stock: number;
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
            stock?: number;
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
            stock?: number;
            category?: string;
          };
        };
        // Ajouter d'autres tables si nécessaire
      };
    }
  }
}
