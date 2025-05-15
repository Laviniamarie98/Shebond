import { useRouter } from 'next/router';
import { FaArrowRight } from 'react-icons/fa';

export default function CtaSection() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/pregnancy-tracker');
  };

  return (
    <section className="bg-gradient-to-r from-amber-700 to-red-700 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl font-lovelace">
          Ready to start your pregnancy journey?
        </h2>
        <p className="mt-4 text-xl text-amber-100 max-w-2xl mx-auto">
          Join thousands of expecting mothers who are tracking their pregnancy with SheBond.
        </p>
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-amber-800 bg-white hover:bg-amber-50"
          >
            Track Your Pregnancy
            <FaArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
} 