import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { FaSpinner } from 'react-icons/fa';
import { AuthError } from '@supabase/supabase-js';

export default function AuthForm() {
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
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        setMessage('Login successful! Redirecting to dashboard...');
        setTimeout(() => router.push('/dashboard'), 1000);
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (signUpError) throw signUpError;

        if (data.user) {
          try {
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
          }
          
          if (data.session) {
            setMessage('Account created successfully! Redirecting to dashboard...');
            setTimeout(() => router.push('/dashboard'), 1000);
          } else {
            setMessage('Success! Please check your email for the confirmation link.');
          }
        }
      }
    } catch (error) {
      if (error instanceof AuthError) {
        setError(error.message);
      } else {
        setError('An error occurred during authentication');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-500 text-sm">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-700 text-white p-2 rounded hover:bg-amber-800"
        >
          {loading ? (
            <FaSpinner className="animate-spin h-5 w-5 mx-auto" />
          ) : (
            isLogin ? 'Sign In' : 'Sign Up'
          )}
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-amber-700 p-2"
        >
          {isLogin ? 'Need an account? Sign Up' : 'Have an account? Sign In'}
        </button>
      </form>
    </div>
  );
} 