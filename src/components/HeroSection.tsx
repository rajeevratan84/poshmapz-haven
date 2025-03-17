
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Search, Building, Star, RefreshCw } from "lucide-react";
import ScrollAnimation from './animations/ScrollAnimation';
import GoogleMap from './GoogleMap';
import AnimatedSearchExample from './AnimatedSearchExample';

const HeroSection: React.FC = () => {
  const searchDemoRef = useRef<HTMLDivElement>(null);
  const handleDemoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('search-demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('richmond-example')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEarlyAccessClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInvestorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('investor-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-black">
      <div className="absolute inset-0 hero-gradient z-0"></div>
      
      {/* Decorative images */}
      <div className="absolute top-40 -left-16 w-40 h-40 opacity-10 rounded-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1486726708062-8ba7d8fa06c5" 
          alt="British row houses" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute bottom-20 -right-16 w-40 h-40 opacity-10 rounded-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1472396961693-142e6e269027" 
          alt="London park" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <ScrollAnimation type="fade-down" duration={600}>
            <div className="inline-block mb-4 px-3 py-1 bg-posh-green/20 rounded-full">
              <span className="text-sm font-medium text-posh-green">Coming Soon - AI-Powered Local Insights</span>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation type="fade-up" delay={200} duration={800}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-balance text-white">
              Find Your Perfect Neighbourhood with <span className="text-gradient">Real-Time, AI-Enhanced Insights</span>
            </h1>
          </ScrollAnimation>
          
          <ScrollAnimation type="fade-up" delay={400} duration={800}>
            <p className="text-lg md:text-xl text-white/90 mb-8 text-balance max-w-2xl mx-auto">
              PoshMaps empowers you to make confident property decisions by combining local crime statistics, school performance, transport links, and more—delivered in one intuitive map to help you <span className="text-coral font-medium">find the neighborhood vibe that perfectly matches your lifestyle</span>.
            </p>
          </ScrollAnimation>
          
          <ScrollAnimation type="fade-up" delay={600} duration={800}>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button onClick={handleEarlyAccessClick} className="w-full sm:w-auto bg-posh-green hover:bg-green-500 text-white rounded-full px-8 py-6 text-base">
                Get Early Access
              </Button>
              <Button onClick={handleInvestorClick} variant="outline" className="w-full sm:w-auto rounded-full px-8 py-6 text-base text-white border-white/20 hover:bg-white/10">
                Investor Relations
              </Button>
            </div>
          </ScrollAnimation>
        </div>
        
        <ScrollAnimation type="zoom-in" delay={800} className="max-w-4xl mx-auto">
          <AnimatedSearchExample />
        </ScrollAnimation>

        <ScrollAnimation type="fade-up" delay={1000} className="mt-16 text-center">
          <p className="text-sm text-white/70 mb-6">Trusted by homebuyers and investors nationwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {['Rightmove', 'Zoopla', 'OnTheMarket', 'OpenRent', 'Savills'].map((company, index) => (
              <ScrollAnimation key={company} type="fade-up" delay={1000 + (index * 100)} className="text-white/60 font-display font-medium text-lg">
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
