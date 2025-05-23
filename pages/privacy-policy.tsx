import Head from 'next/head';
import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - SheBond</title>
      </Head>

      <div className="min-h-screen bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Link href="/" className="inline-block mb-8">
              <div className="flex items-center text-4xl font-bold text-amber-900 font-lovelace">
                <FaHeart className="text-amber-600 mr-2 w-10 h-10" />
                SheBond
              </div>
            </Link>
            <h1 className="text-4xl font-bold text-amber-900 font-lovelace mb-4">Privacy Policy</h1>
            <p className="text-lg text-amber-800">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 space-y-8">
            <section>
              <p className="text-amber-800 mb-4">
                At Shebond, your privacy is important to us. This policy explains how we collect, use, and protect your data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-900 font-lovelace mb-4">1. What we collect</h2>
              <p className="text-amber-800 mb-4">We may collect:</p>
              <ul className="list-disc pl-6 text-amber-800 space-y-2">
                <li>Name and contact info (e.g., email address)</li>
                <li>Pregnancy and baby-related data (e.g., milestones, due dates)</li>
                <li>Usage information (via cookies or analytics tools)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-900 font-lovelace mb-4">2. How we use your data</h2>
              <p className="text-amber-800 mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 text-amber-800 space-y-2">
                <li>Provide personalised tools (e.g., pregnancy and baby trackers)</li>
                <li>Improve our platform experience</li>
                <li>Communicate updates and helpful content (opt-in only)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-900 font-lovelace mb-4">3. How we protect your data</h2>
              <ul className="list-disc pl-6 text-amber-800 space-y-2">
                <li>All data is stored securely and encrypted where necessary</li>
                <li>We do not sell or share your personal data with third parties</li>
                <li>You can request access to, correction of, or deletion of your data at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-900 font-lovelace mb-4">4. Cookies</h2>
              <p className="text-amber-800 mb-4">
                Our website uses cookies to improve your experience. You can manage your cookie preferences through your browser.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-900 font-lovelace mb-4">5. Your rights</h2>
              <p className="text-amber-800 mb-4">
                Under the UK GDPR, you have the right to access, update, or delete your personal data. Contact us at{' '}
                <a href="mailto:privacy@shebond.com" className="text-amber-700 hover:text-amber-800">
                  privacy@shebond.com
                </a>{' '}
                for any requests.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
} 