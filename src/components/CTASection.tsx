
import React from 'react';
import { Button } from "@/components/ui/button";
import FadeIn from './animations/FadeIn';
import { ArrowRight, Mail } from 'lucide-react';

const CTASection: React.FC = () => {
  return (
    <section id="cta" className="section-padding bg-gradient-to-br from-black to-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-10"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-4 px-3 py-1 bg-coral/20 rounded-full">
              <span className="text-sm font-medium text-white">Ready to Explore?</span>
            </div>
            <h2 className="text-3xl md:text-4xl text-white font-display font-bold mb-6">
              Join PoshMaps Today
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Ready to explore your next neighbourhood? Join our waitlist to experience PoshMaps and discover the perfect area <span className="text-coral font-medium">that matches your unique vibe</span>. Have questions about investing? Get in touch to discuss partnership opportunities.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-coral hover:bg-coral/90 text-white rounded-full px-8 py-6 text-base">
                Get Early Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button className="bg-white/10 hover:bg-white/20 text-white rounded-full px-8 py-6 text-base">
                Investors—Contact Us
                <Mail className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
      
      <div className="absolute -bottom-16 right-0 w-64 h-64 opacity-10">
        <img 
          src="https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace" 
          alt="British architecture" 
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
};

export default CTASection;
