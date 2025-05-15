import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { handlePostSignup } from '@/lib/api';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const { code } = router.query;

    // Exchange the auth code for a session
    const handleAuthCallback = async (authCode: string) => {
      try {
        // Process the callback URL
        const { error } = await supabase.auth.exchangeCodeForSession(authCode);

        if (error) {
          throw error;
        }

        // Create user in the database if needed
        await handlePostSignup();

        // Redirect to profile setup or dashboard
        const { data: { session } } = await supabase.auth.getSession();
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session?.user.id)
          .single();

        if (profile?.full_name) {
          router.push('/dashboard');
        } else {
          router.push('/profile-setup');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        router.push('/?login=true&error=callback_error');
      }
    };

    if (code) {
      handleAuthCallback(code as string);
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white shadow-lg rounded-lg max-w-md w-full">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 mb-4 border-4 border-t-purple-600 border-b-purple-600 border-l-gray-200 border-r-gray-200 rounded-full animate-spin"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Logging you in...</h2>
          <p className="text-gray-600 text-center">Please wait while we complete the authentication process.</p>
        </div>
      </div>
    </div>
  );
} 