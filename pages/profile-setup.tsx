import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '@/lib/supabase';
import { updateUserProfile, calculateDueDate as calcDueDate } from '@/lib/api';

export default function ProfileSetup() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [pregnancyStartDate, setPregnancyStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Redirect if not authenticated
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }
        
        // Verify the user with getUser to ensure authentication is valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          router.push('/login');
          return;
        }
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [router]);

  useEffect(() => {
    // Calculate due date when pregnancy start date changes
    if (pregnancyStartDate) {
      const calculatedDueDate = calcDueDate(pregnancyStartDate);
      setDueDate(calculatedDueDate || '');
    } else {
      setDueDate('');
    }
  }, [pregnancyStartDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // Update user profile
      await updateUserProfile({
        full_name: fullName,
        pregnancy_start_date: pregnancyStartDate || null
      });
      
      setMessage('Profile updated successfully!');
      
      // Redirect to pregnancy tracking page
      setTimeout(() => {
        router.push('/pregnancy-tracking');
      }, 1500);
    } catch (error: unknown) {
      console.error('Profile update error:', error);
      setMessage(`Error: ${error instanceof Error ? error.message : 'An error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Complete Your Profile | SheBond</title>
      </Head>
      
      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Complete Your Profile</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We need a few details to personalize your experience
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="full-name"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  placeholder="Your Full Name"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="pregnancy-start-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Pregnancy Start Date
                </label>
                <input
                  id="pregnancy-start-date"
                  name="pregnancyStartDate"
                  type="date"
                  value={pregnancyStartDate}
                  onChange={(e) => setPregnancyStartDate(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">This is typically the first day of your last period.</p>
              </div>
              
              {dueDate && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Due Date
                  </label>
                  <div className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 bg-gray-50 text-gray-700 sm:text-sm">
                    {new Date(dueDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">This is calculated as 40 weeks from your pregnancy start date.</p>
                </div>
              )}
            </div>

            {message && (
              <div className={`p-3 rounded-md ${message.includes('Error') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
                {message}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 