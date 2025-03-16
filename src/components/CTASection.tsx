
import React from 'react';
import { Button } from "@/components/ui/button";
import FadeIn from './animations/FadeIn';
import { ArrowRight, Mail } from 'lucide-react';

const CTASection: React.FC = () => {
  return (
    <section id="cta" className="section-padding bg-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-5"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-4 px-3 py-1 bg-white/20 rounded-full">
              <span className="text-sm font-medium text-white">Ready to Explore?</span>
            </div>
            <h2 className="text-3xl md:text-4xl text-white font-display font-bold mb-6">
              Join PoshMaps Today
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Ready to explore your next neighbourhood? Join our waitlist to experience PoshMaps. Have questions about investing? Get in touch to discuss partnership opportunities.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-gold hover:bg-gold/90 text-navy rounded-full px-8 py-6 text-base">
                Get Early Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8 py-6 text-base">
                Investors—Contact Us
                <Mail className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default CTASection;
