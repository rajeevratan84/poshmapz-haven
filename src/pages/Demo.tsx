import React, { useState, useEffect } from 'react';
import { MapPin, ArrowLeft, Sparkles, MapIcon, HomeIcon, Globe } from "lucide-react";
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { analyzeAreaPreferences, getEuropeanCountriesAndRegions } from '@/services/openaiService';
import { AreaMatch } from '@/types/area';
import SearchBar from '@/components/search/SearchBar';
import SearchWizard from '@/components/search/SearchWizard';
import AreaMapComponent from '@/components/map/AreaMapComponent';
import AreaResultsList from '@/components/search/AreaResultsList';
import SearchLoadingAnimation from '@/components/SearchLoadingAnimation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import LoginButton from '@/components/auth/LoginButton';

interface RegionOption {
  value: string;
  label: string;
}

const DemoPage: React.FC = () => {
  const { user } = useAuth();
  const [userInput, setUserInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<AreaMatch[]>([]);
  const [selectedArea, setSelectedArea] = useState<AreaMatch | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [mapMode, setMapMode] = useState<'london' | 'uk' | 'europe'>('london');
  const [nearestCity, setNearestCity] = useState<string>('none');
  const [selectedCountry, setSelectedCountry] = useState<string>('none');
  const [selectedRegion, setSelectedRegion] = useState<string>('none');
  const [europeanCountries, setEuropeanCountries] = useState<{[key: string]: string[]}>({});
  const [regionOptions, setRegionOptions] = useState<RegionOption[]>([{ value: 'none', label: 'No preference (anywhere in the country)' }]);
  const isMobile = useIsMobile();
  
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  useEffect(() => {
    const countries = getEuropeanCountriesAndRegions();
    setEuropeanCountries(countries);
  }, []);

  useEffect(() => {
    setSelectedRegion('none');
    
    if (selectedCountry === 'none') {
      setRegionOptions([{ value: 'none', label: 'Select a country first' }]);
    } else {
      const regions = europeanCountries[selectedCountry] || [];
      setRegionOptions([
        { value: 'none', label: `All of ${selectedCountry}` },
        ...regions.map(region => ({ value: region, label: region }))
      ]);
    }
  }, [selectedCountry, europeanCountries]);

  const searchSuggestions = [
    "Family-friendly area with good schools and parks",
    "Young professional area with great nightlife and transport",
    "Quiet residential area with good amenities",
    "Trendy area with cafes and cultural activities"
  ];

  const ukCities = [
    { value: 'none', label: 'No preference (anywhere in the UK)' },
    { value: 'manchester', label: 'Manchester' },
    { value: 'birmingham', label: 'Birmingham' },
    { value: 'leeds', label: 'Leeds' },
    { value: 'liverpool', label: 'Liverpool' },
    { value: 'newcastle', label: 'Newcastle' },
    { value: 'edinburgh', label: 'Edinburgh' },
    { value: 'glasgow', label: 'Glasgow' },
    { value: 'cardiff', label: 'Cardiff' },
    { value: 'belfast', label: 'Belfast' },
    { value: 'bristol', label: 'Bristol' },
    { value: 'sheffield', label: 'Sheffield' },
    { value: 'nottingham', label: 'Nottingham' },
    { value: 'southampton', label: 'Southampton' },
    { value: 'brighton', label: 'Brighton' }
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
    setShowWizard(false);
    
    try {
      console.log("Sending request to analyze:", searchInput);
      console.log("Mode:", mapMode);
      console.log("Near city:", nearestCity);
      
      if (mapMode === 'europe') {
        console.log("Country:", selectedCountry);
        console.log("Region:", selectedRegion);
      }
      
      const startTime = Date.now();
      const areas = await analyzeAreaPreferences(searchInput, apiKey, mapMode, mapMode === 'europe' ? selectedCountry + (selectedRegion !== 'none' ? ':' + selectedRegion : '') : nearestCity);
      const elapsedTime = Date.now() - startTime;
      
      if (elapsedTime < 25000) {
        await new Promise(resolve => setTimeout(resolve, 25000 - elapsedTime));
      }
      
      if (areas && areas.length > 0) {
        console.log("Received area matches:", areas);
        setResults(areas);
        
        let locationName = "";
        if (mapMode === 'london') locationName = "London";
        else if (mapMode === 'uk') locationName = "the UK";
        else if (mapMode === 'europe') {
          if (selectedCountry !== 'none') {
            locationName = selectedRegion !== 'none' ? `${selectedRegion}, ${selectedCountry}` : selectedCountry;
          } else {
            locationName = "Europe";
          }
        }
        
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
  }

  return (
    <div className="min-h-screen bg-black pb-12">
      <header className="w-full bg-black/90 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-1 text-white">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-coral" />
            <span className="font-display text-xl font-semibold text-white">PoshMaps</span>
          </div>
          <div>
            <LoginButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 mt-6">
        <div className={`max-w-3xl mx-auto text-center ${isMobile ? 'mb-4' : 'mb-8'}`}>
          <h1 className="text-2xl md:text-4xl font-display font-bold mb-2 md:mb-4 text-white">
            Find Your Perfect Neighbourhood
          </h1>
          <p className={`text-base md:text-lg text-white/80 ${isMobile ? 'mb-4' : 'mb-8'}`}>
            Tell us what you're looking for, and our AI will find the best matches
          </p>
          
          <Tabs defaultValue="london" className="w-full mb-6" onValueChange={(value) => {
            setMapMode(value as 'london' | 'uk' | 'europe');
            if (value === 'london') {
              setNearestCity('none');
              setSelectedCountry('none');
              setSelectedRegion('none');
            }
          }}>
            <TabsList className="grid grid-cols-3 w-full bg-black/40 border border-white/10">
              <TabsTrigger value="london" className="data-[state=active]:bg-posh-green data-[state=active]:text-white">
                <MapPin className="h-4 w-4 mr-2" />
                London
              </TabsTrigger>
              <TabsTrigger value="uk" className="data-[state=active]:bg-posh-green data-[state=active]:text-white">
                <HomeIcon className="h-4 w-4 mr-2" />
                United Kingdom
              </TabsTrigger>
              <TabsTrigger value="europe" className="data-[state=active]:bg-posh-green data-[state=active]:text-white">
                <Globe className="h-4 w-4 mr-2" />
                Europe
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="uk">
              <div className="mb-4">
                <Select value={nearestCity} onValueChange={setNearestCity}>
                  <SelectTrigger className="bg-black/30 border-white/10 text-white w-full">
                    <SelectValue placeholder="Select nearest city (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white max-h-60">
                    {ukCities.map(city => (
                      <SelectItem key={city.value} value={city.value} className="focus:bg-zinc-800 focus:text-white">
                        {city.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="europe">
              <div className="mb-4">
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="bg-black/30 border-white/10 text-white w-full">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white max-h-60">
                    <SelectItem value="none" className="focus:bg-zinc-800 focus:text-white">
                      All of Europe (no preference)
                    </SelectItem>
                    {Object.keys(europeanCountries).sort().map(country => (
                      <SelectItem key={country} value={country} className="focus:bg-zinc-800 focus:text-white">
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedCountry !== 'none' && (
                <div className="mb-4">
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="bg-black/30 border-white/10 text-white w-full">
                      <SelectValue placeholder="Select a region (optional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10 text-white max-h-60">
                      {regionOptions.map(option => (
                        <SelectItem key={option.value} value={option.value} className="focus:bg-zinc-800 focus:text-white">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
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
          
          <div className="flex items-center justify-center gap-2 text-xs text-purple-400 font-semibold bg-black/30 py-2 px-4 rounded-full mx-auto w-fit">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Beta {mapMode === 'london' ? 'London' : mapMode === 'uk' ? 'UK' : 'Europe'} Mode</span>
          </div>
        </div>
        
        <div className="bg-black/20 rounded-xl p-3 md:p-4 shadow-lg">
          {isSearching && <SearchLoadingAnimation isVisible={isSearching} />}
          
          <AreaMapComponent 
            results={results}
            onAreaSelected={handleAreaClick}
            selectedArea={selectedArea}
            mapMode={mapMode}
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
