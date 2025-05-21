import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '@/lib/supabase';
import { FaHeart, FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(router.query.signup ? false : true);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        // Login successful, redirect to dashboard
        setMessage('Login successful! Redirecting to dashboard...');
        setTimeout(() => router.push('/dashboard'), 1000);
      } else {
        // Sign up
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (signUpError) throw signUpError;

        // Create user profile
        if (data.user) {
          try {
            // Insert into profiles table
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                email: data.user.email,
                full_name: '',
              });

            if (profileError) throw profileError;
          } catch (profileError) {
            console.error('Error creating profile:', profileError);
            // Continue even if profile creation fails
          }
          
          if (data.session) {
            // User is auto-confirmed, redirect to dashboard
            setMessage('Account created successfully! Redirecting to dashboard...');
            setTimeout(() => router.push('/dashboard'), 1000);
          } else {
            // User needs to confirm email
            setMessage('Success! Please check your email for the confirmation link before signing in.');
          }
        }
      }
    } catch (error: unknown) {
      console.error('Auth error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>{isLogin ? 'Sign In' : 'Sign Up'} | SheBond</title>
        <meta name="description" content="Sign in to your SheBond account to track your pregnancy journey" />
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center text-amber-900">
            <FaHeart className="h-8 w-8 mr-2" />
            <span className="text-2xl font-bold font-lovelace">SheBond</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-amber-900 font-lovelace">
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </h2>
        <p className="mt-2 text-center text-sm text-amber-800">
          {isLogin ? "Track your pregnancy journey with SheBond" : "Join thousands of moms on their pregnancy journey"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-amber-100">
          <form className="space-y-6" onSubmit={handleAuth}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-amber-900">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-amber-600" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-amber-200 rounded-md shadow-sm placeholder-amber-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-amber-900">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-amber-600" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-amber-200 rounded-md shadow-sm placeholder-amber-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <a href="#" className="font-medium text-amber-700 hover:text-amber-600">
                    Forgot your password?
                  </a>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-amber-700 to-red-700 hover:from-amber-800 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:from-amber-300 disabled:to-red-300"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin h-5 w-5 mr-2" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  isLogin ? 'Sign in' : 'Sign up'
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-100">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {message && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md border border-green-100">
              <p className="text-sm">{message}</p>
            </div>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-amber-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-amber-600">
                  Or
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="w-full inline-flex justify-center py-2 px-4 border border-amber-200 rounded-md shadow-sm bg-white text-sm font-medium text-amber-700 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                {isLogin ? 'Create a new account' : 'Sign in to an existing account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 