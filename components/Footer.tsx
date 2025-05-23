import Link from 'next/link';
import { FaHeart, FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center text-4xl font-bold text-amber-900 font-lovelace">
              <FaHeart className="text-amber-600 mr-2 w-10 h-10" />
              SheBond
            </div>
            <p className="text-amber-800">
              Supporting mothers through every step of their pregnancy journey with love, care, and beautiful design.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/shebond" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800">
                <FaInstagram className="w-6 h-6" />
              </a>
              <a href="https://facebook.com/shebond" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800">
                <FaFacebook className="w-6 h-6" />
              </a>
              <a href="https://twitter.com/shebond" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800">
                <FaTwitter className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com/company/shebond" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800">
                <FaLinkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-amber-900 mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/pregnancy-tracker" className="text-amber-800 hover:text-amber-900">
                  Pregnancy Tracking
                </Link>
              </li>
              <li>
                <Link href="/baby-milestones" className="text-amber-800 hover:text-amber-900">
                  Baby Milestones
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-amber-800 hover:text-amber-900">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/health-tips" className="text-amber-800 hover:text-amber-900">
                  Health Tips
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-amber-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-amber-800 hover:text-amber-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-amber-800 hover:text-amber-900">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-amber-800 hover:text-amber-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-amber-800 hover:text-amber-900">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-amber-900 mb-4">Stay Updated</h3>
            <p className="text-amber-800 mb-4">
              Subscribe to our newsletter for the latest pregnancy tips and app updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 border border-amber-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button className="bg-gradient-to-r from-amber-700 to-red-700 text-white px-4 py-2 rounded-r-md hover:from-amber-800 hover:to-red-800 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-amber-100 text-center">
          <p className="text-amber-800">
            © {new Date().getFullYear()} SheBond. All rights reserved. Made with{' '}
            <FaHeart className="inline text-amber-600" /> for mothers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
} 