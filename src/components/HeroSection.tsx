
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
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 hero-gradient z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <ScrollAnimation type="fade-down" duration={600}>
            <div className="inline-block mb-4 px-3 py-1 bg-posh-green/10 rounded-full">
              <span className="text-sm font-medium text-posh-green">Coming Soon - AI-Powered Property Research</span>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation type="fade-up" delay={200} duration={800}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-balance">
              Find Your Perfect Neighbourhood with <span className="text-gradient">Real-Time, AI-Enhanced Insights</span>
            </h1>
          </ScrollAnimation>
          
          <ScrollAnimation type="fade-up" delay={400} duration={800}>
            <p className="text-lg md:text-xl text-posh-dark/80 mb-8 text-balance max-w-2xl mx-auto">
              PoshMaps empowers you to make confident property decisions by combining local crime statistics, school performance, transport links, and more—delivered in one intuitive map.
            </p>
          </ScrollAnimation>
          
          <ScrollAnimation type="fade-up" delay={600} duration={800}>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button onClick={handleEarlyAccessClick} className="w-full sm:w-auto bg-posh-green hover:bg-green-500 text-white rounded-full px-8 py-6 text-base">
                Get Early Access
              </Button>
              <Button onClick={handleInvestorClick} variant="outline" className="w-full sm:w-auto rounded-full px-8 py-6 text-base">
                Investor Relations
              </Button>
            </div>
          </ScrollAnimation>
        </div>
        
        <ScrollAnimation type="zoom-in" delay={800} className="max-w-4xl mx-auto">
          <AnimatedSearchExample />
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
