import { FaHeart, FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function AboutUsSection() {
  return (
    <section className="py-16 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-amber-900 font-lovelace mb-4">About SheBond</h2>
          <p className="text-lg text-amber-800 max-w-3xl mx-auto">
            SheBond was created with a simple mission: to support and empower mothers through their pregnancy journey with love, care, and beautiful design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-md border border-amber-100">
            <h3 className="text-2xl font-bold text-amber-900 font-lovelace mb-4">Our Story</h3>
            <p className="text-amber-800 mb-4">
              Born from a passion for maternal health and technology, SheBond combines medical expertise with user-friendly design to create a supportive space for expectant mothers.
            </p>
            <p className="text-amber-800">
              We believe every mother deserves access to reliable information and tools to track their pregnancy journey with confidence and joy.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md border border-amber-100">
            <h3 className="text-2xl font-bold text-amber-900 font-lovelace mb-4">Our Values</h3>
            <ul className="space-y-3 text-amber-800">
              <li className="flex items-start">
                <FaHeart className="text-amber-600 mt-1 mr-2" />
                <span>Empowering mothers with knowledge and support</span>
              </li>
              <li className="flex items-start">
                <FaHeart className="text-amber-600 mt-1 mr-2" />
                <span>Creating a safe and nurturing community</span>
              </li>
              <li className="flex items-start">
                <FaHeart className="text-amber-600 mt-1 mr-2" />
                <span>Providing accurate, evidence-based information</span>
              </li>
              <li className="flex items-start">
                <FaHeart className="text-amber-600 mt-1 mr-2" />
                <span>Designing with care and attention to detail</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-amber-900 font-lovelace mb-6">Connect With Us</h3>
          <div className="flex justify-center space-x-6">
            <a href="https://instagram.com/shebond" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 transition-colors">
              <FaInstagram className="w-8 h-8" />
            </a>
            <a href="https://facebook.com/shebond" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 transition-colors">
              <FaFacebook className="w-8 h-8" />
            </a>
            <a href="https://twitter.com/shebond" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 transition-colors">
              <FaTwitter className="w-8 h-8" />
            </a>
            <a href="https://linkedin.com/company/shebond" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 transition-colors">
              <FaLinkedin className="w-8 h-8" />
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-700 to-red-700 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold font-lovelace mb-4">Join Our Community</h3>
          <p className="mb-6 max-w-2xl mx-auto">
            Be part of our growing community of mothers supporting each other through their pregnancy journey.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="/login" className="bg-white text-amber-900 hover:bg-amber-50 px-6 py-2 rounded-md font-medium transition-colors">
              Sign Up Now
            </a>
            <a href="#contact" className="border border-white hover:bg-white/10 px-6 py-2 rounded-md font-medium transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 