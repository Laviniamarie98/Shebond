export interface PregnancyEntry {
  id: string;
  user_id: string;
  pregnancy_week: number;
  weight?: number;
  mood?: string;
  symptoms?: string[];
  notes?: string;
  entry_date: string;
  created_at?: string;
  updated_at?: string;
} 