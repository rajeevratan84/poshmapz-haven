
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Search, Building, Star, RefreshCw, Sparkles, Rocket } from "lucide-react";
import ScrollAnimation from './animations/ScrollAnimation';
import GoogleMap from './GoogleMap';
import AnimatedSearchExample from './AnimatedSearchExample';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const HeroSection: React.FC = () => {
  const searchDemoRef = useRef<HTMLDivElement>(null);
  const { user, signInWithGoogle } = useAuth();
  
  const handleDemoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('search-demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('richmond-example')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDemoButtonClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      toast.info('Please sign in to access the interactive demo');
      signInWithGoogle();
    }
    // If user is logged in, the Link will navigate to /demo naturally
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
              <span className="text-sm font-medium text-posh-green">AI-Powered Local Insights</span>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation type="fade-up" delay={200} duration={800}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 max-w-3xl mx-auto tracking-wide leading-tight text-white">
              Find Your Perfect Neighbourhood with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-pink-500">AI-Enhanced Insights</span>
            </h1>
          </ScrollAnimation>
          
          <ScrollAnimation type="fade-up" delay={400} duration={800}>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Find your ideal area with PoshMaps—combining crime data, schools, transport, and local amenities in one intuitive map to <span className="text-coral font-medium">match your perfect lifestyle</span>.
            </p>
          </ScrollAnimation>
          
          <ScrollAnimation type="fade-up" delay={600} duration={800}>
            <div className="flex justify-center items-center">
              <div className="relative w-full sm:w-auto group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-posh-green to-pink-500 rounded-full opacity-70 blur-md group-hover:opacity-100 transition duration-300"></div>
                <Link 
                  to="/demo" 
                  className="w-full relative"
                  onClick={handleDemoButtonClick}
                >
                  <Button variant="highlight" size="xl" className="w-full relative flex items-center gap-3 px-8 py-7">
                    <Rocket className="h-5 w-5" />
                    <span className="font-bold">Use AI to find your Ideal Neighborhood</span>
                    <span className="absolute -top-3 -right-3 bg-coral text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse-subtle">BETA</span>
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollAnimation>
        </div>
        
        <ScrollAnimation type="zoom-in" delay={800} className="max-w-5xl mx-auto">
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
