-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for own user" ON users;
DROP POLICY IF EXISTS "Enable update access for own user" ON users;
DROP POLICY IF EXISTS "Enable insert for authentication" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;

-- Make the users table more permissive
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- Create more permissive policies
CREATE POLICY "Enable read access for own user" ON users
    FOR SELECT USING (true);

CREATE POLICY "Enable update access for own user" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for signup" ON users
    FOR INSERT WITH CHECK (true);

-- Drop and recreate the trigger function with better error handling
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.users (id, email, name)
    VALUES (new.id, new.email, '')
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 