-- Create the pregnancy_entries table
CREATE TABLE IF NOT EXISTS public.pregnancy_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    weight NUMERIC,
    mood TEXT,
    symptoms TEXT[] DEFAULT '{}',
    notes TEXT,
    entry_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add Row Level Security
ALTER TABLE public.pregnancy_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own pregnancy entries"
ON public.pregnancy_entries
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pregnancy entries"
ON public.pregnancy_entries
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pregnancy entries"
ON public.pregnancy_entries
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pregnancy entries"
ON public.pregnancy_entries
FOR DELETE
USING (auth.uid() = user_id);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update the updated_at column
CREATE TRIGGER update_pregnancy_entries_updated_at
BEFORE UPDATE ON public.pregnancy_entries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 