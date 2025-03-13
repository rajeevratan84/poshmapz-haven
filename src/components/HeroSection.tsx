
import React from 'react';
import { Button } from "@/components/ui/button";
import MapVisualization from "./MapVisualization";
import { MapPin, Search, Building, Star } from "lucide-react";
import ScrollAnimation from './animations/ScrollAnimation';

const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 hero-gradient z-0"></div>
      <div className="absolute inset-0 opacity-20 z-0">
        <MapVisualization />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <ScrollAnimation type="fade-down" duration={600}>
            <div className="inline-block mb-4 px-3 py-1 bg-posh-green/10 rounded-full">
              <span className="text-sm font-medium text-posh-green">AI-Powered Property Research</span>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation type="fade-up" delay={200} duration={800}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-balance">
              Find Your Dream Area – <span className="text-gradient">AI-Powered Local Insights</span>
            </h1>
          </ScrollAnimation>
          
          <ScrollAnimation type="fade-up" delay={400} duration={800}>
            <p className="text-lg md:text-xl text-posh-dark/80 mb-8 text-balance max-w-2xl mx-auto">
              Posh Maps combines real-time data, AI analysis, and community reviews to help you find the best place to live – beyond just house prices.
            </p>
          </ScrollAnimation>
          
          <ScrollAnimation type="fade-up" delay={600} duration={800}>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button className="w-full sm:w-auto bg-posh-green hover:bg-green-500 text-white rounded-full px-8 py-6 text-base">
                Start Your Search
              </Button>
              <Button variant="outline" className="w-full sm:w-auto rounded-full px-8 py-6 text-base">
                Watch Demo
              </Button>
            </div>
          </ScrollAnimation>
        </div>
        
        <ScrollAnimation type="zoom-in" delay={800} className="max-w-4xl mx-auto">
          <div className="relative w-full h-[360px] md:h-[480px] rounded-2xl overflow-hidden shadow-glass bg-white/20 backdrop-blur-xs">
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="w-20 h-20 text-posh-green/40 animate-pulse-subtle" />
            </div>
            <div className="absolute top-4 left-4 glass-panel px-3 py-2 rounded-lg flex items-center space-x-2">
              <Building className="w-4 h-4 text-posh-green" />
              <span className="text-xs font-medium">Property Insights</span>
            </div>
            <div className="absolute bottom-4 right-4 glass-panel px-3 py-2 rounded-lg flex items-center space-x-2">
              <Star className="w-4 h-4 text-posh-green" />
              <span className="text-xs font-medium">Area Reviews</span>
            </div>
          </div>
        </ScrollAnimation>

        <ScrollAnimation type="fade-up" delay={1000} className="mt-16 text-center">
          <p className="text-sm text-posh-dark/60 mb-6">Trusted by homebuyers and investors nationwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {['Rightmove', 'Zoopla', 'OnTheMarket', 'OpenRent', 'Savills'].map((company, index) => (
              <ScrollAnimation key={company} type="fade-up" delay={1000 + (index * 100)} className="text-posh-dark/40 font-display font-medium text-lg">
                {company}
              </ScrollAnimation>
            ))}
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default HeroSection;
