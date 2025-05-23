import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaHeart, FaBars, FaTimes } from 'react-icons/fa';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="flex items-center text-4xl font-bold text-amber-900 font-lovelace">
                <FaHeart className="text-amber-600 mr-2 w-10 h-10" />
                SheBond
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/pregnancy-tracker" className="text-amber-800 hover:text-amber-900 font-medium">
              Pregnancy Tracker
            </Link>
            <Link href="/baby-milestones" className="text-amber-800 hover:text-amber-900 font-medium">
              Baby Milestones
            </Link>
            <Link href="/blog" className="text-amber-800 hover:text-amber-900 font-medium">
              Blog
            </Link>
            <Link href="/community" className="text-amber-800 hover:text-amber-900 font-medium">
              Community
            </Link>
            <div className="relative group">
              <button className="text-amber-800 hover:text-amber-900 font-medium flex items-center">
                Policies
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
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
            <Link 
              href="/login"
              className="bg-gradient-to-r from-amber-700 to-red-700 text-white px-6 py-2 rounded-md font-medium hover:from-amber-800 hover:to-red-800 transition-colors"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-amber-800 hover:text-amber-900 focus:outline-none"
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/pregnancy-tracker"
              className="block px-3 py-2 text-amber-800 hover:text-amber-900 font-medium"
              onClick={toggleMenu}
            >
              Pregnancy Tracker
            </Link>
            <Link 
              href="/baby-milestones"
              className="block px-3 py-2 text-amber-800 hover:text-amber-900 font-medium"
              onClick={toggleMenu}
            >
              Baby Milestones
            </Link>
            <Link 
              href="/blog"
              className="block px-3 py-2 text-amber-800 hover:text-amber-900 font-medium"
              onClick={toggleMenu}
            >
              Blog
            </Link>
            <Link 
              href="/community"
              className="block px-3 py-2 text-amber-800 hover:text-amber-900 font-medium"
              onClick={toggleMenu}
            >
              Community
            </Link>
            <div className="px-3 py-2">
              <div className="text-amber-800 font-medium mb-2">Policies</div>
              <div className="pl-4 space-y-1">
                <Link 
                  href="/privacy-policy"
                  className="block py-1 text-amber-800 hover:text-amber-900"
                  onClick={toggleMenu}
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/terms"
                  className="block py-1 text-amber-800 hover:text-amber-900"
                  onClick={toggleMenu}
                >
                  Terms of Service
                </Link>
                <Link 
                  href="/data-usage"
                  className="block py-1 text-amber-800 hover:text-amber-900"
                  onClick={toggleMenu}
                >
                  Data Usage
                </Link>
              </div>
            </div>
            <Link 
              href="/login"
              className="block px-3 py-2 text-amber-800 hover:text-amber-900 font-medium"
              onClick={toggleMenu}
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
} 