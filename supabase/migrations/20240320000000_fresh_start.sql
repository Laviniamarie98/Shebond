-- First, drop all existing tables (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS forum_comments CASCADE;
DROP TABLE IF EXISTS forum_posts CASCADE;
DROP TABLE IF EXISTS baby_milestones CASCADE;
DROP TABLE IF EXISTS pregnancy_tracking CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    pregnancy_start_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pregnancy_tracking table
CREATE TABLE pregnancy_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 42),
    weight DECIMAL(5,2),
    symptoms TEXT[],
    mood TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create baby_milestones table
CREATE TABLE baby_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    milestone_date DATE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum_posts table
CREATE TABLE forum_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum_comments table
CREATE TABLE forum_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_pregnancy_tracking_user_id ON pregnancy_tracking(user_id);
CREATE INDEX idx_pregnancy_tracking_created_at ON pregnancy_tracking(created_at DESC);
CREATE INDEX idx_baby_milestones_user_id ON baby_milestones(user_id);
CREATE INDEX idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX idx_forum_posts_category ON forum_posts(category);
CREATE INDEX idx_forum_comments_post_id ON forum_comments(post_id);
CREATE INDEX idx_forum_comments_user_id ON forum_comments(user_id);
CREATE INDEX idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_receiver_id ON chat_messages(receiver_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pregnancy_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE baby_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Enable read access for own user" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable update access for own user" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authentication" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Pregnancy tracking policies
CREATE POLICY "Users can manage their own pregnancy tracking"
    ON pregnancy_tracking
    FOR ALL USING (auth.uid() = user_id);

-- Baby milestones policies
CREATE POLICY "Users can manage their own baby milestones"
    ON baby_milestones
    FOR ALL USING (auth.uid() = user_id);

-- Forum posts policies
CREATE POLICY "Anyone can view forum posts"
    ON forum_posts FOR SELECT
    USING (true);

CREATE POLICY "Users can manage their own forum posts"
    ON forum_posts
    FOR ALL USING (auth.uid() = user_id);

-- Forum comments policies
CREATE POLICY "Anyone can view forum comments"
    ON forum_comments FOR SELECT
    USING (true);

CREATE POLICY "Users can manage their own forum comments"
    ON forum_comments
    FOR ALL USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Users can view their own chat messages"
    ON chat_messages FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send chat messages"
    ON chat_messages FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can manage their sent messages"
    ON chat_messages
    FOR UPDATE USING (auth.uid() = sender_id);

-- Create function to automatically set updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pregnancy_tracking_updated_at
    BEFORE UPDATE ON pregnancy_tracking
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_baby_milestones_updated_at
    BEFORE UPDATE ON baby_milestones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at
    BEFORE UPDATE ON forum_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to ensure user exists after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.users (id, email, name)
    VALUES (new.id, new.email, '');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user record after signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 