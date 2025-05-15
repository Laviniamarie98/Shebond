import { FaBaby, FaCalendarAlt, FaHeartbeat, FaUsers, FaChartLine, FaBookMedical } from 'react-icons/fa';

export default function FeaturesSection() {
  const features = [
    {
      icon: <FaCalendarAlt className="h-8 w-8 text-amber-700" />,
      title: 'Week-by-Week Tracking',
      description: 'Follow your pregnancy journey with detailed weekly updates on your baby&apos;s development and what to expect.'
    },
    {
      icon: <FaHeartbeat className="h-8 w-8 text-amber-700" />,
      title: 'Health Monitoring',
      description: 'Track your weight, symptoms, mood, and other health indicators throughout your pregnancy.'
    },
    {
      icon: <FaChartLine className="h-8 w-8 text-amber-700" />,
      title: 'Personalized Insights',
      description: 'Receive customized recommendations and insights based on your pregnancy progress.'
    },
    {
      icon: <FaUsers className="h-8 w-8 text-amber-700" />,
      title: 'Community Support',
      description: 'Connect with other expecting mothers at similar stages in their pregnancy journey.'
    },
    {
      icon: <FaBaby className="h-8 w-8 text-amber-700" />,
      title: 'Baby Milestones',
      description: 'Record and celebrate your baby&apos;s important milestones and development progress.'
    },
    {
      icon: <FaBookMedical className="h-8 w-8 text-amber-700" />,
      title: 'Expert Resources',
      description: 'Access a library of articles and resources written by pregnancy and childcare experts.'
    }
  ];

  return (
    <section id="features-section" className="py-16 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-amber-900 sm:text-4xl font-lovelace">
            Features Designed for Your Pregnancy Journey
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            Everything you need to track, monitor, and celebrate your pregnancy and baby&apos;s development.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-amber-100">
              <div className="bg-amber-50 rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 