import { createClient } from '@supabase/supabase-js';

// Define types for your database tables
export type User = {
  id: string;
  email: string;
  full_name?: string;
  pregnancy_start_date?: string | null;
  due_date?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type PregnancyEntry = {
  id: string;
  user_id: string;
  pregnancy_week: number;
  weight?: number;
  mood?: string;
  entry_date: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export type Symptom = {
  id: string;
  name: string;
  description?: string;
  trimester_relevance?: number[];
  created_at?: string;
};

export type EntrySymptom = {
  id: string;
  entry_id: string;
  symptom_id: string;
  severity?: number;
  created_at?: string;
};

export type PregnancyMilestone = {
  id: string;
  week: number;
  trimester: number;
  baby_development: string;
  mother_changes: string;
  tips?: string;
  created_at?: string;
};

export type Mood = {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
};

// Create Supabase client using environment variables
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
); 