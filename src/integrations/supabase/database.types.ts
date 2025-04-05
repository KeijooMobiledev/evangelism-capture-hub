import { SupabaseClient, createClient } from '@supabase/supabase-js';

interface Database {
  public: {
    Tables: {
      bible_study_sessions: {
        Row: {
          room_name: string;
          current_passage: string;
          updated_at: string;
        };
        Insert: {
          room_name: string;
          current_passage: string;
          updated_at?: string;
        };
        Update: {
          room_name?: string;
          current_passage?: string;
          updated_at?: string;
        };
      };
      event_quizzes: {
        Row: {
          id: string;
          event_id: string;
          title: string;
          questions: Array<{
            id: string;
            text: string;
            options: string[];
            correctAnswer?: number;
          }>;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          title: string;
          questions: Array<{
            id: string;
            text: string;
            options: string[];
            correctAnswer?: number;
          }>;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          title?: string;
          questions?: Array<{
            id: string;
            text: string;
            options: string[];
            correctAnswer?: number;
          }>;
          created_at?: string;
        };
      };
      prayer_requests: {
        Row: {
          id: string;
          message_id: string;
          room_name: string;
          user_id: string;
          content: string;
          is_prayed_for: boolean;
          suggested_verses: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          message_id: string;
          room_name: string;
          user_id: string;
          content: string;
          is_prayed_for?: boolean;
          suggested_verses?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          message_id?: string;
          room_name?: string;
          user_id?: string;
          content?: string;
          is_prayed_for?: boolean;
          suggested_verses?: string[];
          created_at?: string;
        };
      };
      event_questions: {
        Row: {
          id: string;
          event_id: string;
          text: string;
          author_name: string;
          user_id: string;
          likes: number;
          is_answered: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          text: string;
          author_name: string;
          user_id: string;
          likes?: number;
          is_answered?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          text?: string;
          author_name?: string;
          user_id?: string;
          likes?: number;
          is_answered?: boolean;
          created_at?: string;
        };
      };
      evangelism_contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          latitude: number;
          longitude: number;
          last_contact: string;
          status: 'new' | 'followup' | 'believer';
          notes: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          latitude: number;
          longitude: number;
          last_contact?: string;
          status?: 'new' | 'followup' | 'believer';
          notes?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          latitude?: number;
          longitude?: number;
          last_contact?: string;
          status?: 'new' | 'followup' | 'believer';
          notes?: string;
          created_at?: string;
        };
      };
      bible_verses: {
        Row: {
          id: string;
          reference: string;
          text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          reference: string;
          text: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          reference?: string;
          text?: string;
          created_at?: string;
        };
      };
    };
    Functions: {
      get_bible_passage: {
        Args: {
          passage_ref: string;
        };
        Returns: string;
      };
      increment_likes: {
        Args: {
          question_id: string;
        };
        Returns: number;
      };
    };
  };
}

export type { Database };
