
import React, { useState, useEffect } from 'react';
import { MapPin, Search, Map, Lightbulb, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchLoadingAnimationProps {
  isVisible: boolean;
}

const SearchLoadingAnimation: React.FC<SearchLoadingAnimationProps> = ({ isVisible }) => {
  const [tipIndex, setTipIndex] = useState(0);
  
  const tips = [
    "Consider commute times to work or school when choosing an area",
    "Areas with multiple transport options often have more stable property values",
    "Local cafés and independent shops can indicate an up-and-coming neighborhood",
    "Check school catchment areas if you have or plan to have children",
    "Green spaces contribute significantly to quality of life in urban areas",
    "Look beyond the area itself to nearby neighborhoods that might be gentrifying",
    "Research local rental yields if you're considering an investment property",
    "The 'posh score' considers local amenities, property values, and neighborhood prestige"
  ];
  
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isVisible, tips.length]);
  
  if (!isVisible) return null;
  
  return (
    <div className="w-full bg-black/30 rounded-xl p-8 my-8 border border-white/10 animate-fade-in">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-posh-green/20 rounded-full animate-ping"></div>
          <div className="relative bg-gradient-to-r from-posh-green to-emerald-600 p-4 rounded-full shadow-lg shadow-emerald-500/30">
            <Search className="h-8 w-8 text-white animate-pulse" />
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="w-2 h-2 bg-posh-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-posh-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-posh-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          <div className="w-2 h-2 bg-posh-green rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></div>
        </div>
        
        <h3 className="text-xl font-display font-medium text-white">AI is analyzing your preferences</h3>
        
        <div className="flex items-center space-x-4 max-w-md">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-500/20">
            <MapPin className="h-5 w-5 text-posh-green" />
          </div>
          <div className="flex-1">
            <div className="h-2 bg-white/20 rounded-full w-full mb-2 animate-pulse"></div>
            <div className="h-2 bg-white/20 rounded-full w-3/4 animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 max-w-md">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-500/20">
            <Map className="h-5 w-5 text-posh-green" />
          </div>
          <div className="flex-1">
            <div className="h-2 bg-white/20 rounded-full w-full mb-2 animate-pulse"></div>
            <div className="h-2 bg-white/20 rounded-full w-2/3 animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 max-w-md">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-500/20">
            <Sparkles className="h-5 w-5 text-posh-green" />
          </div>
          <div className="flex-1">
            <div className="h-2 bg-white/20 rounded-full w-full mb-2 animate-pulse"></div>
            <div className="h-2 bg-white/20 rounded-full w-1/2 animate-pulse"></div>
          </div>
        </div>
        
        <div className="max-w-md bg-white/5 px-6 py-4 rounded-lg mt-2 border border-white/10">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-white mb-1">Area Selection Tip:</div>
              <div key={tipIndex} className="text-white/70 text-sm animate-fade-in">
                {tips[tipIndex]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchLoadingAnimation;
