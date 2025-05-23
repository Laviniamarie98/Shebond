import { FaCalendarAlt, FaChartLine, FaUsers, FaBookMedical } from 'react-icons/fa';
import Link from 'next/link';

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-amber-900 font-lovelace mb-4">Key Features</h2>
          <p className="text-lg text-amber-800 max-w-3xl mx-auto">
            Everything you need to track and celebrate your pregnancy journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-amber-50 p-6 rounded-xl shadow-md border border-amber-100 hover:shadow-lg transition-shadow">
            <div className="text-amber-700 mb-4">
              <FaCalendarAlt className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-amber-900 font-lovelace mb-2">Pregnancy Tracker</h3>
            <p className="text-amber-800 mb-4">
              Track your pregnancy week by week with personalized insights and baby development updates.
            </p>
            <Link 
              href="/pregnancy-tracker"
              className="inline-flex items-center text-amber-700 hover:text-amber-800 font-medium"
            >
              Start Tracking
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="bg-amber-50 p-6 rounded-xl shadow-md border border-amber-100 hover:shadow-lg transition-shadow">
            <div className="text-amber-700 mb-4">
              <FaChartLine className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-amber-900 font-lovelace mb-2">Baby Milestones</h3>
            <p className="text-amber-800 mb-4">
              Record and celebrate your baby's developmental milestones with our easy-to-use tracker.
            </p>
            <Link 
              href="/baby-milestones"
              className="inline-flex items-center text-amber-700 hover:text-amber-800 font-medium"
            >
              View Milestones
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="bg-amber-50 p-6 rounded-xl shadow-md border border-amber-100 hover:shadow-lg transition-shadow">
            <div className="text-amber-700 mb-4">
              <FaUsers className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-amber-900 font-lovelace mb-2">Community Support</h3>
            <p className="text-amber-800 mb-4">
              Connect with other mothers and share experiences in our supportive community.
            </p>
            <Link 
              href="/login"
              className="inline-flex items-center text-amber-700 hover:text-amber-800 font-medium"
            >
              Join Community
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="bg-amber-50 p-6 rounded-xl shadow-md border border-amber-100 hover:shadow-lg transition-shadow">
            <div className="text-amber-700 mb-4">
              <FaBookMedical className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-amber-900 font-lovelace mb-2">Health Tips</h3>
            <p className="text-amber-800 mb-4">
              Access expert-curated health tips and advice for a healthy pregnancy journey.
            </p>
            <Link 
              href="/login"
              className="inline-flex items-center text-amber-700 hover:text-amber-800 font-medium"
            >
              Read Tips
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 