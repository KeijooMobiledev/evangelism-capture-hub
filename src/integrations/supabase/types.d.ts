
// This file extends the types in src/integrations/supabase/types.ts
// It does not replace the existing file, but adds our custom types
// to the existing Database type definition

declare module "@/integrations/supabase/types" {
  interface Database {
    public: {
      Tables: {
        events: {
          Row: {
            id: string;
            title: string;
            description: string | null;
            location: string;
            date: string;
            is_online: boolean;
            meeting_url: string | null;
            type: "prayer" | "bible_study" | "conference" | "other";
            created_by: string;
            max_attendees: number | null;
            created_at: string;
            updated_at: string;
          };
          Insert: {
            id?: string;
            title: string;
            description?: string | null;
            location: string;
            date: string;
            is_online?: boolean;
            meeting_url?: string | null;
            type: "prayer" | "bible_study" | "conference" | "other";
            created_by: string;
            max_attendees?: number | null;
            created_at?: string;
            updated_at?: string;
          };
          Update: {
            id?: string;
            title?: string;
            description?: string | null;
            location?: string;
            date?: string;
            is_online?: boolean;
            meeting_url?: string | null;
            type?: "prayer" | "bible_study" | "conference" | "other";
            created_by?: string;
            max_attendees?: number | null;
            created_at?: string;
            updated_at?: string;
          };
        };
        event_attendees: {
          Row: {
            id: string;
            event_id: string;
            user_id: string;
            status: "attending" | "declined";
            joined_at: string | null;
            created_at: string;
            updated_at: string;
          };
          Insert: {
            id?: string;
            event_id: string;
            user_id: string;
            status: "attending" | "declined";
            joined_at?: string | null;
            created_at?: string;
            updated_at?: string;
          };
          Update: {
            id?: string;
            event_id?: string;
            user_id?: string;
            status?: "attending" | "declined";
            joined_at?: string | null;
            created_at?: string;
            updated_at?: string;
          };
        };
        event_reminders: {
          Row: {
            id: string;
            event_id: string;
            user_id: string;
            reminder_time: string;
            sent: boolean;
            created_at: string;
          };
          Insert: {
            id?: string;
            event_id: string;
            user_id: string;
            reminder_time: string;
            sent?: boolean;
            created_at?: string;
          };
          Update: {
            id?: string;
            event_id?: string;
            user_id?: string;
            reminder_time?: string;
            sent?: boolean;
            created_at?: string;
          };
        };
      };
    };
  }
}

