import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        if (session?.user?.email) {
          setUserEmail(session.user.email);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setUserEmail(session?.user?.email || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className="bg-amber-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="https://foxcqbvnyzwoemhofrci.supabase.co/storage/v1/object/sign/images/SheBond.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2ZjYjBkMTU3LWQxNjUtNDBmMi1hNmY3LWYwOTgwMGU2MjQ2MSJ9.eyJ1cmwiOiJpbWFnZXMvU2hlQm9uZC5wbmciLCJpYXQiOjE3NDczMjI0NjIsImV4cCI6MTc3ODg1ODQ2Mn0.miDWkMRBDnvDw5Gp9niJ-4W_SN67JsfumKpUFHj71nA"
                alt="SheBond Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-white hover:bg-amber-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link href="/pregnancy-tracker" className="text-white hover:bg-amber-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Pregnancy Tracker
                </Link>
                {isAuthenticated && (
                  <Link href="/dashboard" className="text-white hover:bg-amber-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </Link>
                )}
                <Link href="/baby-milestones" className="text-white hover:bg-amber-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Baby Milestones
                </Link>
                <Link href="/blog" className="text-white hover:bg-amber-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Blog
                </Link>
                <div className="relative group">
                  <button className="text-white hover:bg-amber-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
                    Policies
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <Link href="/privacy-policy" className="block px-4 py-2 text-sm text-amber-800 hover:bg-amber-50">
                        Privacy Policy
                      </Link>
                      <Link href="/terms" className="block px-4 py-2 text-sm text-amber-800 hover:bg-amber-50">
                        Terms of Service
                      </Link>
                      <Link href="/data-usage" className="block px-4 py-2 text-sm text-amber-800 hover:bg-amber-50">
                        Data Usage
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-amber-100 text-sm">{userEmail}</span>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-700 text-white hover:bg-red-800 px-4 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => router.push('/?login=true')}
                  className="bg-amber-100 text-amber-900 hover:bg-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <FaUser className="mr-2" />
                  Login
                </button>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-amber-100 hover:text-white hover:bg-amber-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FaTimes className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FaBars className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, toggle visibility based on menu state */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-amber-900">
          <Link href="/" className="text-white hover:bg-amber-800 block px-3 py-2 rounded-md text-base font-medium">
            Home
          </Link>
          <Link href="/pregnancy-tracker" className="text-white hover:bg-amber-800 block px-3 py-2 rounded-md text-base font-medium">
            Pregnancy Tracker
          </Link>
          {isAuthenticated && (
            <Link href="/dashboard" className="text-white hover:bg-amber-800 block px-3 py-2 rounded-md text-base font-medium">
              Dashboard
            </Link>
          )}
          <Link href="/baby-milestones" className="text-white hover:bg-amber-800 block px-3 py-2 rounded-md text-base font-medium">
            Baby Milestones
          </Link>
          <Link href="/blog" className="text-white hover:bg-amber-800 block px-3 py-2 rounded-md text-base font-medium">
            Blog
          </Link>
          <div className="px-3 py-2">
            <div className="text-white font-medium mb-2">Policies</div>
            <div className="pl-4 space-y-1">
              <Link href="/privacy-policy" className="block py-1 text-amber-100 hover:text-white" onClick={() => setIsMenuOpen(false)}>
                Privacy Policy
              </Link>
              <Link href="/terms" className="block py-1 text-amber-100 hover:text-white" onClick={() => setIsMenuOpen(false)}>
                Terms of Service
              </Link>
              <Link href="/data-usage" className="block py-1 text-amber-100 hover:text-white" onClick={() => setIsMenuOpen(false)}>
                Data Usage
              </Link>
            </div>
          </div>
          {isAuthenticated ? (
            <>
              <div className="px-3 py-2 text-amber-100 text-sm">{userEmail}</div>
              <button
                onClick={handleSignOut}
                className="bg-red-700 text-white hover:bg-red-800 block w-full text-left px-3 py-2 rounded-md text-base font-medium mt-1"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push('/?login=true')}
              className="bg-amber-100 text-amber-900 hover:bg-white block px-3 py-2 rounded-md text-base font-medium mt-4 mx-2 flex items-center"
            >
              <FaUser className="mr-2" />
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
} 