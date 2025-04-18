
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Search, RefreshCw } from "lucide-react";
import GoogleMap from './GoogleMap';
import { useTheme } from '@/context/ThemeContext';

const AnimatedSearchExample: React.FC = () => {
  const [searchPhase, setSearchPhase] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [animationRunning, setAnimationRunning] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Updated search query with more specific preferences
  const searchQuery = "I want to live somewhere in North London that's within 10 mins of a park, tube station, good Turkish restaurants, gyms, cozy cafes and bakeries and with a family-friendly atmosphere";
  
  const resetAnimation = () => {
    setSearchPhase(0);
    setSearchText('');
    setIsThinking(false);
    setShowResults(false);
    setAnimationRunning(true);
  };
  
  useEffect(() => {
    if (!animationRunning) return;
    
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
      setAnimationComplete(true);
      setAnimationRunning(false);
    }
  }, [searchPhase, animationRunning, searchQuery]);
  
  return (
    <div id="search-demo" className={`relative p-4 ${isDark ? 'bg-white/90' : 'bg-black/5'} backdrop-blur-sm rounded-xl shadow-lg w-full max-w-4xl mx-auto`}>
      <div className="flex items-center gap-2 mb-3">
        <Search className="h-5 w-5 text-posh-green" />
        <div className="flex-1 font-medium text-sm text-gray-800">PoshMaps AI Search <span className="text-xs text-posh-green">(London Only)</span></div>
        
        {animationComplete && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 text-xs"
            onClick={resetAnimation}
          >
            <RefreshCw className="h-3 w-3" />
            Watch Again
          </Button>
        )}
      </div>
      
      <div className="relative">
        <textarea 
          className={`w-full p-3 border ${isDark ? 'border-gray-200' : 'border-gray-300'} rounded-lg text-sm h-24 ${isDark ? 'bg-white' : 'bg-white'} resize-none text-gray-800`}
          value={searchText}
          readOnly
        />
        
        {searchPhase === 0 && searchText.length === 0 && (
          <div className="absolute top-3 left-3 text-sm text-gray-400">
            Describe your ideal area in London...
          </div>
        )}
        
        {isThinking && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
            <div className="w-4 h-4 border-2 border-posh-green border-t-transparent rounded-full animate-spin"></div>
            <span>AI is analyzing your preferences...</span>
          </div>
        )}
        
        {/* Placeholder div with fixed height to prevent layout shift */}
        <div className={`${(!showResults && !isThinking) ? 'h-0' : ''} transition-all duration-300`}>
          {showResults && (
            <div className="mt-3 bg-green-50 p-4 rounded-lg">
              <div className="text-sm font-medium mb-2 text-posh-green">PoshMaps has found 3 areas matching your criteria:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div className="bg-white p-3 rounded border border-green-100">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-medium text-gray-800">Highbury</div>
                    <div className="text-xs text-white bg-posh-green px-1.5 py-0.5 rounded">Match: 94%</div>
                  </div>
                  <div className="text-xs font-semibold text-posh-green mb-1">Posh Score: 80/100</div>
                  <div className="text-xs text-gray-600">Leafy, affluent, and home to professionals. Less flashy than neighbouring Islington but still well-regarded. Perfect match for families seeking green spaces with easy tube access and Turkish restaurants.</div>
                </div>
                <div className="bg-white p-3 rounded border border-green-100">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-medium text-gray-800">Islington</div>
                    <div className="text-xs text-white bg-posh-green px-1.5 py-0.5 rounded">Match: 91%</div>
                  </div>
                  <div className="text-xs font-semibold text-posh-green mb-1">Posh Score: 85/100</div>
                  <div className="text-xs text-gray-600">Trendy, wealthy, and full of period townhouses, upscale restaurants, and boutique shops. A strong mix of old wealth and gentrification. Matches your desire for bakeries, cafes, and convenient transport links.</div>
                </div>
                <div className="bg-white p-3 rounded border border-green-100">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-medium text-gray-800">Stoke Newington</div>
                    <div className="text-xs text-white bg-posh-green px-1.5 py-0.5 rounded">Match: 87%</div>
                  </div>
                  <div className="text-xs font-semibold text-posh-green mb-1">Posh Score: 75/100</div>
                  <div className="text-xs text-gray-600">Bohemian area with a village feel, diverse population, and a mix of Victorian houses and new builds. Popular with young families and creatives. Ideal for your needs with excellent Turkish cuisine and family-friendly parks nearby.</div>
                </div>
              </div>
              <div className="border rounded overflow-hidden h-80 bg-white">
                <GoogleMap showNorthLondonAreas={true} zoom={13} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimatedSearchExample;
