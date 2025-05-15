-- Fix for profiles table structure
DO $$
BEGIN
    -- Check if profiles table exists
    IF NOT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles'
    ) THEN
        -- Create profiles table if it doesn't exist
        CREATE TABLE public.profiles (
            id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
            full_name TEXT,
            email TEXT UNIQUE,
            pregnancy_start_date DATE,
            due_date DATE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
        );

        -- Create updated_at trigger
        CREATE OR REPLACE FUNCTION public.update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = now();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER update_profiles_updated_at
        BEFORE UPDATE ON public.profiles
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at_column();

        -- Enable RLS
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

        -- Add policies
        CREATE POLICY "Users can view own profile"
        ON public.profiles
        FOR SELECT
        USING (auth.uid() = id);

        CREATE POLICY "Users can update own profile"
        ON public.profiles
        FOR UPDATE
        USING (auth.uid() = id);

        -- Create function to calculate due date
        CREATE OR REPLACE FUNCTION public.calculate_due_date(start_date DATE)
        RETURNS DATE AS $$
        BEGIN
            IF start_date IS NULL THEN
                RETURN NULL;
            END IF;
            
            RETURN start_date + INTERVAL '280 days';
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        -- Add trigger to automatically update due_date
        CREATE OR REPLACE FUNCTION update_due_date()
        RETURNS TRIGGER AS $$
        BEGIN
            IF NEW.pregnancy_start_date IS NOT NULL THEN
                NEW.due_date := public.calculate_due_date(NEW.pregnancy_start_date);
            END IF;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER trigger_update_due_date
        BEFORE INSERT OR UPDATE OF pregnancy_start_date ON public.profiles
        FOR EACH ROW
        EXECUTE FUNCTION update_due_date();
    ELSE
        -- If table exists, check columns and modify if needed
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'full_name'
        ) THEN
            -- Add full_name column if missing
            ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
        END IF;

        -- If name column exists, migrate data to full_name
        IF EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'name'
        ) THEN
            -- Copy data from name to full_name where full_name is null
            UPDATE public.profiles 
            SET full_name = name 
            WHERE full_name IS NULL AND name IS NOT NULL;
        END IF;

        -- Add due_date column and trigger if missing
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'due_date'
        ) THEN
            ALTER TABLE public.profiles ADD COLUMN due_date DATE;
            
            -- Create calculate_due_date function if not exists
            CREATE OR REPLACE FUNCTION public.calculate_due_date(start_date DATE)
            RETURNS DATE AS $$
            BEGIN
                IF start_date IS NULL THEN
                    RETURN NULL;
                END IF;
                
                RETURN start_date + INTERVAL '280 days';
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;

            -- Create trigger function if not exists
            CREATE OR REPLACE FUNCTION update_due_date()
            RETURNS TRIGGER AS $$
            BEGIN
                IF NEW.pregnancy_start_date IS NOT NULL THEN
                    NEW.due_date := public.calculate_due_date(NEW.pregnancy_start_date);
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            -- Create trigger if not exists
            CREATE TRIGGER trigger_update_due_date
            BEFORE INSERT OR UPDATE OF pregnancy_start_date ON public.profiles
            FOR EACH ROW
            EXECUTE FUNCTION update_due_date();
            
            -- Update existing records
            UPDATE public.profiles 
            SET due_date = public.calculate_due_date(pregnancy_start_date)
            WHERE pregnancy_start_date IS NOT NULL AND due_date IS NULL;
        END IF;
    END IF;

    -- Check for users table and migrate if needed
    IF EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'users'
    ) THEN
        -- Migrate data from users to profiles if profiles exists
        INSERT INTO public.profiles (id, email, full_name, pregnancy_start_date, created_at, updated_at)
        SELECT u.id, u.email, u.name, u.pregnancy_start_date, u.created_at, u.updated_at
        FROM public.users u
        WHERE NOT EXISTS (
            SELECT 1 FROM public.profiles p WHERE p.id = u.id
        );
        
        -- Calculate due_date for migrated records
        UPDATE public.profiles 
        SET due_date = public.calculate_due_date(pregnancy_start_date)
        WHERE pregnancy_start_date IS NOT NULL AND due_date IS NULL;
    END IF;
END
$$; 