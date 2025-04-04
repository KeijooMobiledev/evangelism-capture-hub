import { PostgrestQueryBuilder } from '@supabase/postgrest-js';
import { Database } from '@/integrations/supabase/database.types';

declare module '@supabase/supabase-js' {
  interface SupabaseClient {
    from<T extends keyof Database['public']['Tables']>(
      table: T
    ): PostgrestQueryBuilder<Database['public']['Tables'][T]['Row']>;
  }
}
