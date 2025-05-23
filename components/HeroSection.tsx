import { useRouter } from 'next/router';
import Image from 'next/image';
import { FaHeart, FaStar } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

export default function HeroSection() {
  const router = useRouter();

  const handleGetStarted = async () => {
        const { data: { session } } = await supabase.auth.getSession();
    if (session) {
    router.push('/pregnancy-tracker');
    } else {
      router.push('/login');
    }
  };

  const handleLearnMore = () => {
    // Smooth scroll to features section
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2">
            <div className="mb-4">
              <h1 className="text-4xl md:text-5xl font-bold text-amber-900 font-lovelace mb-2">
                Your Pregnancy Journey,
              </h1>
              <h1 className="text-4xl md:text-5xl font-bold text-red-600 font-lovelace">
                Beautifully Tracked
              </h1>
            </div>
            <p className="mt-3 text-lg text-gray-600 max-w-3xl">
              Connect with daily insights about your pregnancy and celebrate your baby&apos;s milestones with confidence, all through our thoughtfully designed tracker.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4">
              <button
                onClick={handleGetStarted}
                className="px-6 py-3 mb-4 sm:mb-0 text-lg font-medium rounded-md text-white bg-gradient-to-r from-amber-900 to-red-700 hover:from-amber-950 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Start Tracking Now
              </button>
              <button
                onClick={handleLearnMore}
                className="px-6 py-3 text-lg font-medium rounded-md text-amber-900 bg-white border border-amber-600 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Learn More
              </button>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-amber-900 font-lovelace">10k+</h3>
                <p className="text-gray-600">Happy Moms</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-amber-900 font-lovelace">4.9</h3>
                <p className="text-gray-600">App Rating</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-amber-900 font-lovelace">24/7</h3>
                <p className="text-gray-600">Support</p>
              </div>
            </div>
          </div>
          <div className="mt-10 lg:mt-0 lg:w-1/2 flex justify-center">
            <div className="relative">
              <Image
                src="https://foxcqbvnyzwoemhofrci.supabase.co/storage/v1/object/sign/images/Pregnant%20woman%202.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2ZjYjBkMTU3LWQxNjUtNDBmMi1hNmY3LWYwOTgwMGU2MjQ2MSJ9.eyJ1cmwiOiJpbWFnZXMvUHJlZ25hbnQgd29tYW4gMi5wbmciLCJpYXQiOjE3NDczMjI0MDMsImV4cCI6MTc3ODg1ODQwM30.xprh8uavtsuerYwhY9Ucx2oIoNYudqQvs52LHAjQeXk"
                alt="Pregnant woman tracking her pregnancy journey"
                width={500}
                height={600}
                className="rounded-lg shadow-2xl"
                priority
              />
              <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                <div className="bg-white px-4 py-2 rounded-full shadow-md flex items-center">
                  <FaHeart className="text-amber-700 mr-2" />
                  <span className="text-sm font-medium">Week by Week</span>
                </div>
                <div className="bg-white px-4 py-2 rounded-full shadow-md flex items-center">
                  <FaStar className="text-amber-700 mr-2" />
                  <span className="text-sm font-medium">Personalized</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 