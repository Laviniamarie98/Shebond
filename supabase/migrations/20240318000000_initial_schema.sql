-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_pregnancy_tracking_user_id;
DROP INDEX IF EXISTS idx_pregnancy_tracking_created_at;

-- Check if users table exists and create/modify it
DO $$
BEGIN
    -- Create users table if it doesn't exist
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY REFERENCES auth.users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Add columns if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'email'
    ) THEN
        ALTER TABLE users ADD COLUMN email TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'name'
    ) THEN
        ALTER TABLE users ADD COLUMN name TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'pregnancy_start_date'
    ) THEN
        ALTER TABLE users ADD COLUMN pregnancy_start_date DATE;
    END IF;

    -- Add NOT NULL constraints
    ALTER TABLE users ALTER COLUMN email SET NOT NULL;
    ALTER TABLE users ALTER COLUMN name SET NOT NULL;

    -- Add unique constraint on email if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'users' AND constraint_name = 'users_email_key'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
    END IF;

EXCEPTION
    WHEN others THEN
        -- If there's an error, it might be because the constraints already exist
        NULL;
END $$;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- First, drop ALL existing policies on the users table to start clean
DROP POLICY IF EXISTS "Allow individual read access" ON users;
DROP POLICY IF EXISTS "Allow individual update access" ON users;
DROP POLICY IF EXISTS "Allow insert during signup" ON users;
DROP POLICY IF EXISTS "Allow public insert" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;
DROP POLICY IF EXISTS "Enable read access for own profile" ON users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view and update their own data" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;

-- Create new, simplified policies
-- 1. Allow users to read their own profile
CREATE POLICY "Enable read own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- 2. Allow users to update their own profile
CREATE POLICY "Enable update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- 3. Allow profile creation during signup (more permissive)
CREATE POLICY "Enable insert during signup" ON users
    FOR INSERT WITH CHECK (true);  -- Most permissive for testing

-- Create pregnancy_tracking table if it doesn't exist
CREATE TABLE IF NOT EXISTS pregnancy_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    current_week INTEGER NOT NULL CHECK (current_week BETWEEN 1 AND 42),
    weight DECIMAL(5,2) NOT NULL,
    mood VARCHAR(50),
    symptoms JSONB,
    doctor_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Enable RLS for pregnancy_tracking
ALTER TABLE pregnancy_tracking ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for pregnancy_tracking if they exist
DROP POLICY IF EXISTS "Users can view their own pregnancy tracking data" ON pregnancy_tracking;
DROP POLICY IF EXISTS "Users can insert their own pregnancy tracking data" ON pregnancy_tracking;

-- Create policies for pregnancy_tracking
CREATE POLICY "Users can view their own pregnancy tracking data" ON pregnancy_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pregnancy tracking data" ON pregnancy_tracking
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes if they don't exist (wrapped in DO block to handle errors)
DO $$
BEGIN
    -- Create user_id index if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_pregnancy_tracking_user_id'
    ) THEN
        CREATE INDEX idx_pregnancy_tracking_user_id 
        ON pregnancy_tracking(user_id);
    END IF;

    -- Create created_at index if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_pregnancy_tracking_created_at'
    ) THEN
        CREATE INDEX idx_pregnancy_tracking_created_at 
        ON pregnancy_tracking(created_at DESC);
    END IF;
END
$$; 