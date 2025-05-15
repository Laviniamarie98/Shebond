import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaArrowRight, FaSpinner, FaCheckCircle, FaTrophy } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import { calculatePregnancyWeek } from '@/lib/api';

interface UserProfile {
  id: string;
  full_name?: string;
  email: string;
  pregnancy_start_date: string;
  due_date?: string;
  week: number;
}

interface MilestoneStats {
  total: number;
  completed: number;
  lastAchieved?: {
    title: string;
    date: string;
  };
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [milestoneStats, setMilestoneStats] = useState<MilestoneStats>({
    total: 32, // Total number of milestones across all categories
    completed: 0
  });

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        // Verify the user with getUser to ensure authentication is valid
        const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !authUser) {
          router.push('/login');
          return;
        }

        // Get user profile
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (error) throw error;

        // Calculate current week
        const currentWeek = calculatePregnancyWeek(profile.pregnancy_start_date);

        setUser({
          ...profile,
          week: currentWeek || 0
        });

        // Fetch milestone stats
        await fetchMilestoneStats(authUser.id);
      } catch (error) {
        console.error('Error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  // Fetch milestone statistics from the database
  const fetchMilestoneStats = async (userId: string) => {
    try {
      // Get completed milestones
      const { data: milestones, error } = await supabase
        .from('baby_milestones')
        .select('*')
        .eq('user_id', userId)
        .order('date_achieved', { ascending: false });

      if (error) throw error;

      const stats: MilestoneStats = {
        total: 32, // Total from all categories (physical, cognitive, social, language - 8 each)
        completed: milestones?.length || 0
      };

      // Get the most recently achieved milestone
      if (milestones && milestones.length > 0) {
        stats.lastAchieved = {
          title: milestones[0].title,
          date: milestones[0].date_achieved
        };
      }

      setMilestoneStats(stats);
    } catch (error) {
      console.error('Error fetching milestone stats:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Dashboard | SheBond</title>
        </Head>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <FaSpinner className="animate-spin h-10 w-10 text-amber-600 mb-4" />
          <p className="text-gray-700">Loading your dashboard...</p>
        </div>
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Dashboard | SheBond</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-8 font-lovelace">Welcome, {user.full_name || 'User'}!</h1>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-amber-100">
              <h2 className="text-xl font-semibold text-amber-800 mb-4 font-lovelace">Your Pregnancy Journey</h2>
            
            <div>
                {user.pregnancy_start_date ? (
                  <>
                    <p className="text-gray-600 mb-1">Current Week</p>
                    <p className="text-3xl font-bold text-amber-700 mb-2">Week {user.week}</p>
              
                    {user.due_date && (
                      <p className="text-gray-700 mb-4">
                        Due date: {new Date(user.due_date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                    
                    <Link 
                      href="/pregnancy-tracker" 
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-700 to-red-700 hover:from-amber-800 hover:to-red-800 text-white font-medium rounded-md"
                    >
                      Update pregnancy tracker <FaArrowRight className="ml-2" />
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 mb-4">You haven&apos;t set your pregnancy start date yet.</p>
                    <Link 
                      href="/profile-setup"
                      className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md"
                    >
                      Set Pregnancy Date
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-amber-100">
              <h2 className="text-xl font-semibold text-amber-800 mb-4 font-lovelace">Baby Milestones</h2>
              
              {milestoneStats.completed > 0 ? (
                <div>
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-amber-600 h-2.5 rounded-full" 
                        style={{ width: `${(milestoneStats.completed / milestoneStats.total) * 100}%` }}
                      />
                    </div>
                    <p className="text-gray-700 mt-2 flex items-center">
                      <FaCheckCircle className="text-amber-600 mr-2" />
                      {milestoneStats.completed} of {milestoneStats.total} milestones achieved
                    </p>
                  </div>
                  
                  {milestoneStats.lastAchieved && (
                    <div className="mb-4 p-3 bg-amber-50 rounded-lg flex items-start">
                      <div className="text-amber-700 mr-3 mt-1">
                        <FaTrophy />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Latest milestone:</p>
                        <p className="font-medium text-amber-900">{milestoneStats.lastAchieved.title}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(milestoneStats.lastAchieved.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <Link 
                    href="/baby-milestones"
                    className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md"
                  >
                    View All Milestones <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">You haven&apos;t recorded any baby milestones yet.</p>
                  <Link 
                    href="/baby-milestones"
                    className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md"
                  >
                    Add Milestones
                  </Link>
                </>
              )}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-amber-100">
              <h2 className="text-xl font-semibold text-amber-800 mb-4 font-lovelace">Weekly Report</h2>
              
              <p className="text-gray-600 mb-4">
                View your weekly pregnancy tracking summary and insights.
              </p>
              
              <Link 
                href="/weekly-report"
                className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md"
              >
                View Weekly Report
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-amber-100">
              <h2 className="text-xl font-semibold text-amber-800 mb-4 font-lovelace">Community Forum</h2>
            
              <p className="text-gray-600 mb-4">
              Connect with other moms, share experiences, and get advice.
            </p>
            
              <button 
                className="inline-flex items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md"
                onClick={() => alert('Coming soon!')}
                aria-label="Browse Forum - Feature coming soon"
              >
                Browse Forum
              </button>
            </div>
          </div>
        </div>
    </div>
    </>
  );
} 