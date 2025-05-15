export type User = {
  id: string;
  email: string;
  full_name?: string;
  pregnancy_start_date?: string | null;
  due_date?: string | null;
  created_at?: string;
  updated_at?: string;
};

export interface PregnancyEntry {
  id?: string;
  user_id: string;
  date: string;
  week: number;
  weight?: number;
  blood_pressure?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Symptom {
  id: string;
  name: string;
  description?: string;
}

export type EntrySymptom = {
  id: string;
  entry_id: string;
  symptom_id: string;
  severity?: number;
  created_at?: string;
};

export interface PregnancyMilestone {
  id: string;
  week: number;
  title: string;
  description: string;
}

export interface Mood {
  id: string;
  name: string;
  emoji: string;
}

export type WeekInfo = {
  week: number;
  fruit: string;
  babySize: string;
  babyWeight: string;
  babyLength: string;
  symptoms: string[];
  motherChanges: string[];
  tips: string[];
};

export type PregnancyTracking = {
  id: string;
  user_id: string;
  week_number: number;
  weight: number | null;
  symptoms: string[];
  mood: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type BabyMilestone = {
  id: string;
  user_id: string;
  milestone_date: string;
  title: string;
  description: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ForumPost = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  updated_at: string;
};

export type ForumComment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}; 