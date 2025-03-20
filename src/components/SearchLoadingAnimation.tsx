
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
    <div className="w-full bg-black/20 rounded-xl p-4 mt-4 mb-6 border border-white/10 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-posh-green/20 rounded-full animate-ping"></div>
            <div className="relative bg-gradient-to-r from-posh-green to-emerald-600 p-2 rounded-full shadow-lg shadow-emerald-500/20">
              <Search className="h-5 w-5 text-white animate-pulse" />
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-posh-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-1.5 bg-posh-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1.5 h-1.5 bg-posh-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <div className="w-1.5 h-1.5 bg-posh-green rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></div>
          </div>
          
          <span className="text-white font-medium">AI is analyzing your preferences</span>
        </div>

        <div className="flex-1 max-w-xl flex items-center gap-3 bg-black/30 px-4 py-2 rounded-lg">
          <Lightbulb className="h-4 w-4 text-amber-400 flex-shrink-0" />
          <div key={tipIndex} className="text-white/90 text-sm animate-fade-in">
            <span className="font-medium text-amber-400">Tip:</span> {tips[tipIndex]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchLoadingAnimation;
