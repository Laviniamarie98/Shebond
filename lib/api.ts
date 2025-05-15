import { supabase } from './supabase';
import { User, PregnancyEntry, EntrySymptom } from './types';

// User profile functions
export async function getUserProfile(): Promise<User> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    
    if (!session) {
      throw new Error('Not authenticated');
    }

    // First try to get the user
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      
      // If user doesn't exist, try to create it
      if (userError.code === 'PGRST116') {
        const { data: newUser, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: session.user.id,
            email: session.user.email,
            full_name: ''
          })
          .select()
          .single();

        if (createError) throw createError;
        return newUser;
      }
      
      throw userError;
    }

    return user;
  } catch (error) {
    console.error('getUserProfile error:', error);
    throw error;
  }
}

export async function updateUserProfile(updates: Partial<{ full_name: string; pregnancy_start_date: string | null }>): Promise<User> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    
    if (!session) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', session.user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('updateUserProfile error:', error);
    throw error;
  }
}

// Ensure user exists
export async function ensureUserExists(): Promise<void> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    
    if (!session) {
      throw new Error('Not authenticated');
    }

    const { error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .single();

    if (error && error.code === 'PGRST116') {
      // User doesn't exist, create it
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: session.user.id,
          email: session.user.email,
          full_name: ''
        });

      if (insertError) throw insertError;
    } else if (error) {
      throw error;
    }
  } catch (error) {
    console.error('ensureUserExists error:', error);
    throw error;
  }
}

// Call this function after successful signup
export async function handlePostSignup(): Promise<void> {
  try {
    await ensureUserExists();
  } catch (error) {
    console.error('Post-signup handling failed:', error);
    throw error;
  }
}

// Pregnancy tracking functions
export async function getPregnancyEntries() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('pregnancy_entries')
    .select('*')
    .eq('user_id', session.user.id)
    .order('entry_date', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export async function addPregnancyEntry(entry: Partial<PregnancyEntry>) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('pregnancy_entries')
    .insert({
      ...entry,
      user_id: session.user.id
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// Symptoms functions
export async function getSymptoms() {
  const { data, error } = await supabase
    .from('symptoms')
    .select('*');
    
  if (error) throw error;
  return data || [];
}

export async function getEntrySymptoms(entryId: string) {
  const { data, error } = await supabase
    .from('entry_symptoms')
    .select(`
      *,
      symptoms:symptom_id(*)
    `)
    .eq('entry_id', entryId);
    
  if (error) throw error;
  return data || [];
}

export async function addEntrySymptom(entrySymptom: Partial<EntrySymptom>) {
  const { data, error } = await supabase
    .from('entry_symptoms')
    .insert(entrySymptom)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// Pregnancy milestones functions
export async function getPregnancyMilestones() {
  const { data, error } = await supabase
    .from('pregnancy_milestones')
    .select('*')
    .order('week', { ascending: true });
    
  if (error) throw error;
  return data || [];
}

export async function getPregnancyMilestoneByWeek(week: number) {
  const { data, error } = await supabase
    .from('pregnancy_milestones')
    .select('*')
    .eq('week', week)
    .single();
    
  if (error) throw error;
  return data;
}

// Moods functions
export async function getMoods() {
  const { data, error } = await supabase
    .from('moods')
    .select('*');
    
  if (error) throw error;
  return data || [];
}

// Add a function to calculate pregnancy weeks
export function calculatePregnancyWeek(startDate: string | null): number | null {
  if (!startDate) return null;
  
  const start = new Date(startDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - start.getTime());
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  
  return diffWeeks + 1; // Add 1 since we start counting from week 1
}

// Add a function to calculate due date
export function calculateDueDate(startDate: string | null): string | null {
  if (!startDate) return null;
  
  const start = new Date(startDate);
  const dueDate = new Date(start);
  dueDate.setDate(start.getDate() + 280); // 40 weeks = 280 days
  
  return dueDate.toISOString().split('T')[0];
} 