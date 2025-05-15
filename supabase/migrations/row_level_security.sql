-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pregnancy_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE baby_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Pregnancy tracking policies
CREATE POLICY "Users can view their own pregnancy data" ON pregnancy_tracking
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own pregnancy data" ON pregnancy_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own pregnancy data" ON pregnancy_tracking
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own pregnancy data" ON pregnancy_tracking
  FOR DELETE USING (auth.uid() = user_id);

-- Baby milestones policies
CREATE POLICY "Users can view their own baby milestones" ON baby_milestones
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own baby milestones" ON baby_milestones
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own baby milestones" ON baby_milestones
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own baby milestones" ON baby_milestones
  FOR DELETE USING (auth.uid() = user_id);

-- Forum posts policies
CREATE POLICY "Anyone can view forum posts" ON forum_posts
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated users can create forum posts" ON forum_posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Users can update their own forum posts" ON forum_posts
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own forum posts" ON forum_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Forum comments policies
CREATE POLICY "Anyone can view forum comments" ON forum_comments
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated users can create forum comments" ON forum_comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Users can update their own forum comments" ON forum_comments
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own forum comments" ON forum_comments
  FOR DELETE USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Users can view their own chat messages" ON chat_messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
  
CREATE POLICY "Authenticated users can send chat messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);
  
CREATE POLICY "Users can update their own sent messages" ON chat_messages
  FOR UPDATE USING (auth.uid() = sender_id);
  
CREATE POLICY "Users can delete their own sent messages" ON chat_messages
  FOR DELETE USING (auth.uid() = sender_id); 