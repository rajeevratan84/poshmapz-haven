
import React from 'react';
import FadeIn from './animations/FadeIn';
import { Star } from 'lucide-react';

const testimonials = [
  {
    content: "PoshMaps revolutionized how we analyze customer locations. The AI insights have helped us optimize our delivery routes and save thousands in logistics costs.",
    author: "Sarah Johnson",
    position: "Operations Director, Deliveright Inc.",
    rating: 5
  },
  {
    content: "The elegant interface combined with powerful data visualization changed our approach to market analysis. Our team can now make location-based decisions with confidence.",
    author: "Michael Chen",
    position: "VP of Strategy, MarketPulse",
    rating: 5
  },
  {
    content: "I've used many mapping solutions, but PoshMaps stands apart with its attention to detail and intuitive design. It's simply the most elegant mapping tool available today.",
    author: "Emily Watkins",
    position: "Chief Design Officer, Visionary Tech",
    rating: 5
  }
];

const TestimonialSection: React.FC = () => {
  return (
    <section id="testimonials" className="section-padding bg-white">
      <div className="container mx-auto px-6">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-4 px-3 py-1 bg-green-50 rounded-full">
              <span className="text-sm font-medium text-posh-green">Customer Stories</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="text-lg text-posh-dark/80">
              See how organizations are transforming their approach to location intelligence with PoshMaps.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <FadeIn 
              key={index} 
              delay={index === 0 ? "delay-0" : 
                     index === 1 ? "delay-200" : 
                     "delay-400"}
            >
              <div className="testimonial-card h-full flex flex-col">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-5 w-5 text-yellow-400 fill-yellow-400" 
                    />
                  ))}
                </div>
                <p className="text-posh-dark/90 italic mb-6 flex-grow">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-posh-dark/70">{testimonial.position}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
