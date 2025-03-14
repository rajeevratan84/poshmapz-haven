
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Search, Building, Star } from "lucide-react";
import ScrollAnimation from './animations/ScrollAnimation';
import GoogleMap from './GoogleMap';

// Animated search example component
const AnimatedSearchExample = () => {
  const [searchPhase, setSearchPhase] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const searchQuery = "I want to live somewhere in North London that's within 10 mins of a pet groomer, a pub, chicken shop, tube stop, turkish restaurant, a post office and a pure gym";
  
  useEffect(() => {
    if (searchPhase === 0) {
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= searchQuery.length) {
          setSearchText(searchQuery.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setSearchPhase(1);
        }
      }, 50);
      
      return () => clearInterval(typingInterval);
    }
    
    if (searchPhase === 1) {
      setIsThinking(true);
      const thinkingTimer = setTimeout(() => {
        setIsThinking(false);
        setSearchPhase(2);
      }, 2000);
      
      return () => clearTimeout(thinkingTimer);
    }
    
    if (searchPhase === 2) {
      setShowResults(true);
      
      const resetTimer = setTimeout(() => {
        setSearchPhase(0);
        setSearchText('');
        setIsThinking(false);
        setShowResults(false);
      }, 6000);
      
      return () => clearTimeout(resetTimer);
    }
  }, [searchPhase]);
  
  return (
    <div className="relative p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <Search className="h-5 w-5 text-posh-green" />
        <div className="flex-1 font-medium text-sm">PoshMaps AI Search</div>
      </div>
      
      <div className="relative">
        <textarea 
          className="w-full p-3 border border-gray-200 rounded-lg text-sm h-20 bg-white resize-none"
          value={searchText}
          readOnly
        />
        
        {searchPhase === 0 && searchText.length === 0 && (
          <div className="absolute top-3 left-3 text-sm text-gray-400">
            Describe your ideal area...
          </div>
        )}
        
        {isThinking && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <div className="w-4 h-4 border-2 border-posh-green border-t-transparent rounded-full animate-spin"></div>
            <span>AI is analyzing your preferences...</span>
          </div>
        )}
        
        {showResults && (
          <div className="mt-3 bg-green-50 p-4 rounded-lg">
            <div className="text-sm font-medium mb-2 text-posh-green">PoshMaps has found 3 areas matching your criteria:</div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="bg-white p-2 rounded border border-green-100 text-center">
                <div className="font-medium">Highbury</div>
                <div className="text-xs text-gray-500">Match: 94%</div>
              </div>
              <div className="bg-white p-2 rounded border border-green-100 text-center">
                <div className="font-medium">Islington</div>
                <div className="text-xs text-gray-500">Match: 91%</div>
              </div>
              <div className="bg-white p-2 rounded border border-green-100 text-center">
                <div className="font-medium">Stoke Newington</div>
                <div className="text-xs text-gray-500">Match: 87%</div>
              </div>
            </div>
            <div className="border rounded overflow-hidden h-64 bg-white">
              <GoogleMap showNorthLondonAreas={true} zoom={13} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 hero-gradient z-0"></div>
      
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
