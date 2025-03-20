
import React, { useState } from 'react';
import { MapPin, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { analyzeAreaPreferences } from '@/services/openaiService';
import { AreaMatch } from '@/types/area';
import SearchBar from '@/components/search/SearchBar';
import SearchWizard from '@/components/search/SearchWizard';
import AreaMapComponent from '@/components/map/AreaMapComponent';
import AreaResultsList from '@/components/search/AreaResultsList';
import SearchLoadingAnimation from '@/components/SearchLoadingAnimation';

const DemoPage: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<AreaMatch[]>([]);
  const [selectedArea, setSelectedArea] = useState<AreaMatch | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  
  // Use the VITE_ environment variable for the API key
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const searchSuggestions = [
    "Family-friendly area with good schools and parks",
    "Young professional area with great nightlife and transport",
    "Quiet residential area with good amenities",
    "Trendy area with cafes and cultural activities"
  ];

  const processSearch = async (searchInput: string) => {
    if (!searchInput.trim()) {
      toast.error("Please enter your preferences");
      return;
    }

    setUserInput(searchInput);
    setIsSearching(true);
    setResults([]);
    setSelectedArea(null);
    // Hide the wizard when search starts
    setShowWizard(false);
    
    try {
      console.log("Sending request to analyze:", searchInput);
      
      const startTime = Date.now();
      const areas = await analyzeAreaPreferences(searchInput, apiKey);
      const elapsedTime = Date.now() - startTime;
      
      // Ensure we show the loading animation for at least 25 seconds
      if (elapsedTime < 25000) {
        await new Promise(resolve => setTimeout(resolve, 25000 - elapsedTime));
      }
      
      if (areas && areas.length > 0) {
        console.log("Received area matches:", areas);
        setResults(areas);
        toast.success(`Found ${areas.length} matching areas in London!`);
      } else {
        toast.error("No matching areas found. Try adjusting your search criteria.");
      }
    } catch (error) {
      console.error("Error processing search:", error);
      toast.error("Failed to process your request. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  function handleAreaClick(area: AreaMatch) {
    setSelectedArea(area);
  }

  function toggleWizard(show: boolean) {
    setShowWizard(show);
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      <header className="w-full bg-black/90 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-1 text-white">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-coral" />
            <span className="font-display text-xl font-semibold text-white">PoshMaps London</span>
          </div>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="container mx-auto px-6 mt-8">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
            Find Your Perfect London Neighbourhood
          </h1>
          <p className="text-lg text-white/80 mb-8">
            Tell us what you're looking for in a neighborhood, and our AI will find the best matches in London
          </p>
          
          <SearchBar 
            onSearch={processSearch}
            isSearching={isSearching}
            suggestions={searchSuggestions}
            onWizardToggle={toggleWizard}
          />
          
          {showWizard && (
            <SearchWizard 
              onSearch={processSearch}
              isSearching={isSearching}
              onCancel={() => setShowWizard(false)}
            />
          )}
          
          <div className="flex items-center justify-center gap-2 text-xs text-posh-green font-semibold bg-black/30 py-2 px-4 rounded-full mx-auto w-fit">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Early Access Beta - London areas only</span>
          </div>
        </div>
        
        <div className="bg-black/20 rounded-xl p-4 shadow-lg">
          {isSearching && <SearchLoadingAnimation isVisible={isSearching} />}
          
          <AreaMapComponent 
            results={results}
            onAreaSelected={handleAreaClick}
            selectedArea={selectedArea}
          />
          
          <AreaResultsList 
            results={results}
            selectedArea={selectedArea}
            onAreaClick={handleAreaClick}
            isSearching={isSearching}
            userInput={userInput}
          />
        </div>
      </main>
    </div>
  );
};

export default DemoPage;
