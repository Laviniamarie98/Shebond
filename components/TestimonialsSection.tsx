import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import Image from 'next/image';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'First-time Mom',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=150&q=60',
      quote: 'SheBond has been an incredible companion throughout my pregnancy. The week-by-week tracking helps me understand exactly what\'s happening with my baby\'s development.',
      stars: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Mom of Two',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=150&q=60',
      quote: 'I used SheBond for both of my pregnancies and it\'s amazing how much it helped me stay organized and informed. The community support feature connected me with other moms due around the same time.',
      stars: 5
    },
    {
      name: 'Michelle Lee',
      role: 'Expecting Mom',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=150&q=60',
      quote: 'The health monitoring features have been so valuable for me. I can easily track my symptoms and share them with my doctor during appointments.',
      stars: 4
    }
  ];

  return (
    <section id="testimonials-section" className="py-16 bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-amber-900 sm:text-4xl font-lovelace">
            What Our Users Say
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            Join thousands of moms who trust SheBond for their pregnancy journey.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-amber-100">
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 mr-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <FaQuoteLeft className="text-amber-200 h-6 w-6 mb-2" />
                <p className="text-gray-600 italic">{testimonial.quote}</p>
              </div>
              
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.stars ? 'text-amber-500' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 