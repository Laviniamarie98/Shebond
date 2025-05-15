-- Create the baby_milestones table to store user's saved milestone data
CREATE TABLE public.baby_milestones (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    milestone_id TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    date_achieved DATE NOT NULL,
    notes TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(user_id, milestone_id)
);

-- Create the updated_at trigger
CREATE TRIGGER update_baby_milestones_updated_at
BEFORE UPDATE ON public.baby_milestones
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.baby_milestones ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own baby milestones"
ON public.baby_milestones
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own baby milestones"
ON public.baby_milestones
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own baby milestones"
ON public.baby_milestones
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own baby milestones"
ON public.baby_milestones
FOR DELETE
USING (auth.uid() = user_id);

-- Create milestone categories reference table
CREATE TABLE public.milestone_categories (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Insert default milestone categories
INSERT INTO public.milestone_categories (id, title, description)
VALUES
    ('physical', 'Physical Development', 'Tracking physical growth and motor skills'),
    ('cognitive', 'Cognitive Development', 'Tracking thinking, learning, and problem-solving abilities'),
    ('social', 'Social & Emotional', 'Tracking relationship-building and emotional expression'),
    ('language', 'Language & Communication', 'Tracking communication and language development');

-- Create public policy for milestone categories
CREATE POLICY "Public can view milestone categories"
ON public.milestone_categories
FOR SELECT
TO authenticated
USING (true); 