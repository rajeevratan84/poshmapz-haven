
import React, { useState, useRef } from 'react';
import { MapPin, ArrowLeft, Sparkles, Globe } from "lucide-react";
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { analyzeAreaPreferences } from '@/services/openaiService';
import { AreaMatch } from '@/types/area';
import SearchBar from '@/components/search/SearchBar';
import SearchWizard from '@/components/search/SearchWizard';
import AreaMapComponent from '@/components/map/AreaMapComponent';
import AreaResultsList from '@/components/search/AreaResultsList';
import SearchLoadingAnimation from '@/components/SearchLoadingAnimation';
import { Tabs, TabsContent, CountryTabsList, CountryTabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type LocationType = 'london' | 'uk' | 'world';
type CountryType = string;

const DemoPage: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<AreaMatch[]>([]);
  const [selectedArea, setSelectedArea] = useState<AreaMatch | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [locationType, setLocationType] = useState<LocationType>('london');
  const [selectedCountry, setSelectedCountry] = useState<CountryType>('United Kingdom');
  const pageTopRef = useRef<HTMLDivElement>(null);
  
  // Use the VITE_ environment variable for the API key
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const worldCountries = [
    "United States", "Canada", "Australia", "France", "Germany", "Spain", "Italy",
    "Japan", "Brazil", "Mexico", "South Africa", "India", "China", "Singapore",
    "United Arab Emirates", "New Zealand", "Thailand", "Portugal", "Netherlands",
    "Trinidad and Tobago"
  ];

  const searchSuggestions = {
    london: [
      "Family-friendly area with good schools and parks",
      "Young professional area with great nightlife and transport",
      "Quiet residential area with good amenities",
      "Trendy area with cafes and cultural activities"
    ],
    uk: [
      "Vibrant city with good connections to London",
      "Peaceful countryside area with good local amenities",
      "University town with cultural activities",
      "Coastal area with good quality of life"
    ],
    world: [
      "Area with good work-life balance",
      "Family-friendly neighborhood with parks and schools",
      "Vibrant area with nightlife and cultural activities",
      "Quiet suburb with good transport links to the city center"
    ]
  };

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
      console.log("Selected location type:", locationType);
      console.log("Selected country (if world):", locationType === 'world' ? selectedCountry : 'N/A');
      
      const startTime = Date.now();
      const areas = await analyzeAreaPreferences(searchInput, apiKey, locationType, locationType === 'world' ? selectedCountry : undefined);
      const elapsedTime = Date.now() - startTime;
      
      // Ensure we show the loading animation for at least 25 seconds
      if (elapsedTime < 25000) {
        await new Promise(resolve => setTimeout(resolve, 25000 - elapsedTime));
      }
      
      if (areas && areas.length > 0) {
        console.log("Received area matches:", areas);
        setResults(areas);
        const locationName = locationType === 'london' ? 'London' : selectedCountry;
        toast.success(`Found ${areas.length} matching areas in ${locationName}!`);
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
    // Reset scroll position to top when opening wizard
    if (show && pageTopRef.current) {
      pageTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className="min-h-screen bg-black pb-20" ref={pageTopRef}>
      <header className="w-full bg-black/90 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-1 text-white">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-coral" />
            <span className="font-display text-xl font-semibold text-white">PoshMaps</span>
          </div>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="container mx-auto px-6 mt-8">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <Tabs 
            defaultValue="london" 
            value={locationType}
            onValueChange={(value) => {
              setLocationType(value as LocationType);
              setResults([]);
              setSelectedArea(null);
            }}
            className="mb-6"
          >
            <div className="flex justify-center">
              <CountryTabsList>
                <CountryTabsTrigger value="london" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>London</span>
                </CountryTabsTrigger>
                <CountryTabsTrigger value="uk" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>UK</span>
                </CountryTabsTrigger>
                <CountryTabsTrigger value="world" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>Rest of World</span>
                </CountryTabsTrigger>
              </CountryTabsList>
            </div>
            
            <TabsContent value="london">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
                Find Your Perfect London Neighbourhood
              </h1>
              <p className="text-lg text-white/80 mb-8">
                Tell us what you're looking for in a neighborhood, and our AI will find the best matches in London
              </p>
            </TabsContent>
            
            <TabsContent value="uk">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
                Discover Your Ideal UK Location
              </h1>
              <p className="text-lg text-white/80 mb-8">
                Share your preferences, and our AI will match you with the perfect areas across the United Kingdom
              </p>
            </TabsContent>
            
            <TabsContent value="world">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
                Discover Your Ideal Location Worldwide
              </h1>
              <p className="text-lg text-white/80 mb-4">
                Share your lifestyle preferences, and our AI will match you with the perfect areas in your chosen country
              </p>
              
              <div className="max-w-xs mx-auto mb-6">
                <Select 
                  value={selectedCountry}
                  onValueChange={setSelectedCountry}
                >
                  <SelectTrigger className="bg-white/10 text-white border-white/20">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white border-white/20">
                    {worldCountries.map((country) => (
                      <SelectItem key={country} value={country} className="text-white focus:bg-gray-700 focus:text-white">
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
          
          <SearchBar 
            onSearch={processSearch}
            isSearching={isSearching}
            suggestions={locationType === 'london' ? searchSuggestions.london : 
                         locationType === 'uk' ? searchSuggestions.uk : 
                         searchSuggestions.world}
            onWizardToggle={toggleWizard}
          />
          
          {showWizard && (
            <SearchWizard 
              onSearch={processSearch}
              isSearching={isSearching}
              onCancel={() => setShowWizard(false)}
              locationType={locationType}
              country={locationType === 'world' ? selectedCountry : undefined}
            />
          )}
          
          <div className="flex items-center justify-center gap-2 text-xs text-purple-400 font-semibold bg-black/30 py-2 px-4 rounded-full mx-auto w-fit">
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              {locationType === 'london' 
                ? 'Early Access Beta - London areas only' 
                : locationType === 'uk'
                ? 'Coming soon - UK cities and towns'
                : `Now exploring: ${selectedCountry}`}
            </span>
          </div>
        </div>
        
        <div className="bg-black/20 rounded-xl p-4 shadow-lg">
          {isSearching && <SearchLoadingAnimation isVisible={isSearching} />}
          
          <AreaMapComponent 
            results={results}
            onAreaSelected={handleAreaClick}
            selectedArea={selectedArea}
            locationType={locationType}
            country={locationType === 'world' ? selectedCountry : undefined}
          />
          
          <AreaResultsList 
            results={results}
            selectedArea={selectedArea}
            onAreaClick={handleAreaClick}
            isSearching={isSearching}
            userInput={userInput}
            locationType={locationType}
            country={locationType === 'world' ? selectedCountry : undefined}
          />
        </div>
      </main>
    </div>
  );
};

export default DemoPage;
