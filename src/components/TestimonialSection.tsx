
import React from 'react';
import FadeIn from './animations/FadeIn';
import { Star } from 'lucide-react';

const testimonials = [
  {
    content: "Posh Maps helped us find the perfect family neighborhood. The crime stats and school information were incredibly accurate and saved us so much research time.",
    author: "Sarah Johnson",
    position: "First-time homebuyer, London",
    rating: 5
  },
  {
    content: "As a property investor, the future value predictions have been invaluable. I've used these insights to make three purchases that have already appreciated significantly.",
    author: "Michael Chen",
    position: "Property Investor, Manchester",
    rating: 5
  },
  {
    content: "The neighborhood vibe scores were spot on! After relocating for work, I found a community that perfectly matched my lifestyle preferences thanks to Posh Maps.",
    author: "Emily Watkins",
    position: "IT Professional, Bristol",
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
              <span className="text-sm font-medium text-posh-green">Success Stories</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Real People, Real Results
            </h2>
            <p className="text-lg text-posh-dark/80">
              See how homebuyers and investors are finding their perfect locations with Posh Maps.
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
