import React, { useState } from 'react';
import { Check, Home, MapPin, ArrowRight, ArrowLeft, PoundSterling, Lightbulb, Building, Activity, Plus, Search, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SearchWizardProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  onCancel: () => void;
  locationType?: 'london' | 'world';
  country?: string;
}

const SearchWizard: React.FC<SearchWizardProps> = ({ 
  onSearch, 
  isSearching, 
  onCancel,
  locationType = 'london',
  country
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [type, setType] = useState<'rent' | 'buy'>('rent');
  const [propertyType, setPropertyType] = useState<'flat' | 'house'>('flat');
  const [bedrooms, setBedrooms] = useState<'1' | '2' | '3' | '4+'>('2');
  const [priorities, setPriorities] = useState<string[]>([]);
  const [locations, setLocations] = useState<{place: string, time: string}[]>([]);
  const [budget, setBudget] = useState('');
  const [lifestyle, setLifestyle] = useState<string[]>([]);
  const [dailyRoutine, setDailyRoutine] = useState('');
  const [tempLocation, setTempLocation] = useState('');
  const [tempTime, setTempTime] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const totalSteps = 6;

  // Popular locations based on location type
  const getPopularLocations = () => {
    if (locationType === 'london') {
      return [
        { name: "Canary Wharf", defaultTime: "30" },
        { name: "Kings Cross", defaultTime: "25" },
        { name: "Waterloo", defaultTime: "20" },
        { name: "Liverpool Street", defaultTime: "25" },
        { name: "The City", defaultTime: "30" },
        { name: "Hammersmith", defaultTime: "35" },
        { name: "Westminster", defaultTime: "25" },
        { name: "Victoria", defaultTime: "20" },
        { name: "Paddington", defaultTime: "25" },
        { name: "Shoreditch", defaultTime: "30" },
      ];
    } else {
      // Generic popular locations that could apply to most countries
      return [
        { name: "City Center", defaultTime: "25" },
        { name: "Financial District", defaultTime: "30" },
        { name: "Main Train Station", defaultTime: "20" },
        { name: "University", defaultTime: "25" },
        { name: "Business Park", defaultTime: "30" },
        { name: "Shopping District", defaultTime: "25" },
        { name: "Airport", defaultTime: "40" },
        { name: "Harbor/Waterfront", defaultTime: "30" },
        { name: "Cultural District", defaultTime: "20" },
        { name: "Medical Center", defaultTime: "25" },
      ];
    }
  };

  // Currency symbols based on location
  const getCurrencySymbol = () => {
    if (locationType === 'london') return '£';
    
    // Common currency symbols for some countries
    const currencyMap: Record<string, string> = {
      'United States': '$',
      'Canada': 'C$',
      'Australia': 'A$',
      'France': '€',
      'Germany': '€',
      'Spain': '€',
      'Italy': '€',
      'Japan': '¥',
      'Brazil': 'R$',
      'Mexico': 'Mex$',
      'South Africa': 'R',
      'India': '₹',
      'China': '¥',
      'Singapore': 'S$',
      'United Arab Emirates': 'AED',
      'New Zealand': 'NZ$',
      'Thailand': '฿',
      'Portugal': '€',
      'Netherlands': '€'
    };
    
    return country && currencyMap[country] ? currencyMap[country] : '$';
  };

  // More granular budget options based on location
  const getRentBudgetOptions = () => {
    const currencySymbol = getCurrencySymbol();
    
    if (locationType === 'london') {
      return [
        { value: 'very-low', label: `Up to ${currencySymbol}1,000 per month` },
        { value: 'low', label: `${currencySymbol}1,000–${currencySymbol}1,500 per month` },
        { value: 'medium-low', label: `${currencySymbol}1,500–${currencySymbol}2,000 per month` },
        { value: 'medium', label: `${currencySymbol}2,000–${currencySymbol}2,500 per month` },
        { value: 'medium-high', label: `${currencySymbol}2,500–${currencySymbol}3,000 per month` },
        { value: 'high', label: `${currencySymbol}3,000–${currencySymbol}3,500 per month` },
        { value: 'very-high', label: `${currencySymbol}3,500–${currencySymbol}5,000 per month` },
        { value: 'luxury', label: `Over ${currencySymbol}5,000 per month` }
      ];
    } else {
      // Generic ranges that would work for most countries with USD as fallback
      return [
        { value: 'very-low', label: `Very affordable` },
        { value: 'low', label: `Below average for ${country || 'this area'}` },
        { value: 'medium-low', label: `Slightly below average` },
        { value: 'medium', label: `Average for ${country || 'this area'}` },
        { value: 'medium-high', label: `Slightly above average` },
        { value: 'high', label: `Above average` },
        { value: 'very-high', label: `Premium` },
        { value: 'luxury', label: `Luxury range` }
      ];
    }
  };

  const getBuyBudgetOptions = () => {
    const currencySymbol = getCurrencySymbol();
    
    if (locationType === 'london') {
      return [
        { value: 'very-low', label: `Up to ${currencySymbol}300,000` },
        { value: 'low', label: `${currencySymbol}300,000–${currencySymbol}500,000` },
        { value: 'medium-low', label: `${currencySymbol}500,000–${currencySymbol}750,000` },
        { value: 'medium', label: `${currencySymbol}750,000–${currencySymbol}1,000,000` },
        { value: 'medium-high', label: `${currencySymbol}1,000,000–${currencySymbol}1,500,000` },
        { value: 'high', label: `${currencySymbol}1,500,000–${currencySymbol}2,000,000` },
        { value: 'very-high', label: `${currencySymbol}2,000,000–${currencySymbol}3,000,000` },
        { value: 'luxury', label: `Over ${currencySymbol}3,000,000` }
      ];
    } else {
      // Generic ranges that would work for most countries
      return [
        { value: 'very-low', label: `Very affordable` },
        { value: 'low', label: `Below average for ${country || 'this area'}` },
        { value: 'medium-low', label: `Slightly below average` },
        { value: 'medium', label: `Average for ${country || 'this area'}` },
        { value: 'medium-high', label: `Slightly above average` },
        { value: 'high', label: `Above average` },
        { value: 'very-high', label: `Premium` },
        { value: 'luxury', label: `Luxury range` }
      ];
    }
  };

  // Colors for lifestyle categories
  const lifestyleColors = {
    amenities: '#9b87f5',      // Purple
    nightlife: '#FF7F50',      // Coral
    community: '#4CAF50',      // Green
    environment: '#2196F3',    // Blue
    activities: '#FFC107',     // Amber
    special: '#E91E63'         // Pink
  };

  // Updated lifestyle options with more choices and categories
  const lifestyleOptions = [
    // Amenities category (Purple)
    { value: 'good-schools', label: 'School catchment', category: 'amenities' },
    { value: 'cultural-venues', label: 'Cultural hotspots', category: 'amenities' },
    { value: 'restaurants', label: 'Fine dining', category: 'amenities' },
    { value: 'markets', label: 'Local markets', category: 'amenities' },
    { value: 'fitness', label: 'Fitness facilities', category: 'amenities' },
    { value: 'coffee', label: 'Cafés & coffee', category: 'amenities' },
    { value: 'shopping', label: 'Shopping areas', category: 'amenities' },
    { value: 'transport', label: 'Transport links', category: 'amenities' },
    { value: 'grocery', label: 'Quality grocery stores', category: 'amenities' },
    { value: 'healthcare', label: 'Healthcare facilities', category: 'amenities' },
    
    // Nightlife (Coral)
    { value: 'bars', label: 'Bars & pubs', category: 'nightlife' },
    { value: 'clubs', label: 'Nightclubs', category: 'nightlife' },
    { value: 'live-music', label: 'Live music venues', category: 'nightlife' },
    { value: 'theatres', label: 'Theatres', category: 'nightlife' },
    { value: 'comedy', label: 'Comedy clubs', category: 'nightlife' },
    
    // Community (Green)
    { value: 'family-friendly', label: 'Family-friendly', category: 'community' },
    { value: 'lgbt-friendly', label: 'LGBT+ friendly', category: 'community' },
    { value: 'dog-friendly', label: 'Dog-friendly', category: 'community' },
    { value: 'international', label: 'International community', category: 'community' },
    { value: 'young-professionals', label: 'Young professionals', category: 'community' },
    { value: 'students', label: 'Student population', category: 'community' },
    { value: 'retirees', label: 'Retirement community', category: 'community' },
    
    // Environment (Blue)
    { value: 'quiet', label: 'Quiet streets', category: 'environment' },
    { value: 'green-spaces', label: 'Green spaces', category: 'environment' },
    { value: 'riverside', label: 'Riverside', category: 'environment' },
    { value: 'suburban', label: 'Suburban feel', category: 'environment' },
    { value: 'urban', label: 'Urban lifestyle', category: 'environment' },
    { value: 'historic', label: 'Historic architecture', category: 'environment' },
    { value: 'modern', label: 'Modern developments', category: 'environment' },
    
    // Activities (Amber)
    { value: 'cycling', label: 'Cycling-friendly', category: 'activities' },
    { value: 'running', label: 'Running paths', category: 'activities' },
    { value: 'water-sports', label: 'Water sports', category: 'activities' },
    { value: 'tennis', label: 'Tennis courts', category: 'activities' },
    { value: 'football', label: 'Football pitches', category: 'activities' },
    { value: 'golf', label: 'Golf courses', category: 'activities' },
    { value: 'swimming', label: 'Swimming pools', category: 'activities' },
    
    // Special interests (Pink)
    { value: 'independent', label: 'Independent shops', category: 'special' },
    { value: 'artistic', label: 'Artistic community', category: 'special' },
    { value: 'tech-hub', label: 'Tech hub', category: 'special' },
    { value: 'foodie-scene', label: 'Foodie scene', category: 'special' },
    { value: 'vegan-friendly', label: 'Vegan-friendly', category: 'special' },
    { value: 'craft-beer', label: 'Craft beer scene', category: 'special' },
  ];

  // Existing cultural communities
  const culturalCommunities = [
    { value: 'indian', label: 'Indian community', category: 'community' },
    { value: 'pakistani', label: 'Pakistani community', category: 'community' },
    { value: 'polish', label: 'Polish community', category: 'community' },
    { value: 'caribbean', label: 'Caribbean community', category: 'community' },
    { value: 'chinese', label: 'Chinese community', category: 'community' },
    { value: 'jewish', label: 'Jewish community', category: 'community' },
    { value: 'turkish', label: 'Turkish community', category: 'community' },
    { value: 'italian', label: 'Italian community', category: 'community' },
    { value: 'greek', label: 'Greek community', category: 'community' },
  ];

  // Add location-specific lifestyle options
  const getLocationSpecificOptions = () => {
    if (locationType === 'london') {
      return [
        // London-specific options already included in lifestyleOptions
      ];
    } else {
      // Generic options that could apply to most countries
      return [
        { value: 'beach-access', label: 'Beach access', category: 'environment' },
        { value: 'mountain-views', label: 'Mountain views', category: 'environment' },
        { value: 'lake-access', label: 'Lake access', category: 'environment' },
        { value: 'wine-region', label: 'Wine region', category: 'special' },
        { value: 'skiing', label: 'Skiing facilities', category: 'activities' },
        { value: 'hiking', label: 'Hiking trails', category: 'activities' },
        { value: 'international-schools', label: 'International schools', category: 'amenities' },
        { value: 'expat-friendly', label: 'Expat friendly', category: 'community' },
        { value: 'tourism', label: 'Tourist attractions', category: 'special' },
        { value: 'local-cuisine', label: 'Local cuisine', category: 'special' },
      ];
    }
  };

  // Combine all lifestyle options
  const allLifestyleOptions = [...lifestyleOptions, ...culturalCommunities, ...getLocationSpecificOptions()];

  // Group lifestyle options by category
  const groupedLifestyleOptions = allLifestyleOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, typeof lifestyleOptions>);

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitWizard();
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const addLocation = () => {
    if (tempLocation.trim()) {
      setLocations([...locations, {place: tempLocation.trim(), time: tempTime || '30'}]);
      setTempLocation('');
      setTempTime('');
    }
  };

  const addPopularLocation = (location: {name: string, defaultTime: string}) => {
    // Avoid duplicates
    if (!locations.some(loc => loc.place === location.name)) {
      setLocations([...locations, {place: location.name, time: location.defaultTime}]);
    }
  };

  const removeLocation = (index: number) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const submitWizard = () => {
    // Construct a natural language query from the wizard inputs
    const lifestylePreferences = lifestyle.join(', ');
    const prioritiesText = priorities.join(', ');
    
    // Map budget to text based on selected option and property type
    const budgetOptions = type === 'rent' ? getRentBudgetOptions() : getBuyBudgetOptions();
    const selectedBudget = budgetOptions.find(option => option.value === budget);
    const budgetText = selectedBudget ? selectedBudget.label : '';
    
    let routineText = '';
    switch (dailyRoutine) {
      case 'walk': routineText = 'walkable neighborhood for daily errands'; break;
      case 'transit': routineText = 'good public transport connections'; break;
      case 'drive': routineText = 'driving-friendly area with parking'; break;
      case 'home': routineText = 'quiet work-from-home friendly area'; break;
    }
    
    let locationsText = '';
    if (locations.length > 0) {
      const locationPhrases = locations.map(loc => 
        `${loc.place} (max ${loc.time} min commute)`
      );
      locationsText = `I need to be near ${locationPhrases.join(' and ')}. `;
    }

    // Add property type and bedrooms information
    const propertyDetailsText = `I'm looking to ${type} a ${bedrooms}-bedroom ${propertyType} in ${locationType === 'london' ? 'London' : country || 'this country'}. `;

    // Add additional information if provided
    const additionalText = additionalInfo ? `Additional requirements: ${additionalInfo}. ` : '';
    
    const queryText = `${propertyDetailsText}I value ${prioritiesText}. ${locationsText}My budget is ${budgetText}. I want an area with the following lifestyle elements: ${lifestylePreferences}. I need a ${routineText}. ${additionalText}`;

    onSearch(queryText);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-medium text-white bg-black/40 p-3 rounded-lg">Property Type</h3>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-white/80 bg-black/30 p-2 rounded">I'm looking to:</label>
              <Tabs defaultValue="rent" value={type} onValueChange={(v) => setType(v as 'rent' | 'buy')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-black/30">
                  <TabsTrigger value="rent" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    <Home className="mr-2 h-4 w-4" />
                    Rent
                  </TabsTrigger>
                  <TabsTrigger value="buy" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    <PoundSterling className="mr-2 h-4 w-4" />
                    Buy
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Property type selection - flat or house */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-white/80 bg-black/30 p-2 rounded">Property type:</label>
              <Tabs 
                defaultValue="flat" 
                value={propertyType} 
                onValueChange={(v) => setPropertyType(v as 'flat' | 'house')} 
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-black/30">
                  <TabsTrigger value="flat" className="data-[state=active]:bg-coral data-[state=active]:text-white">
                    <Building className="mr-2 h-4 w-4" />
                    Flat/Apartment
                  </TabsTrigger>
                  <TabsTrigger value="house" className="data-[state=active]:bg-coral data-[state=active]:text-white">
                    <Home className="mr-2 h-4 w-4" />
                    House
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Number of bedrooms */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-white/80 bg-black/30 p-2 rounded">Number of bedrooms:</label>
              <Tabs 
                defaultValue="2" 
                value={bedrooms} 
                onValueChange={(v) => setBedrooms(v as '1' | '2' | '3' | '4+')} 
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4 bg-black/30">
                  <TabsTrigger value="1" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                    <Bed className="mr-1 h-3 w-3" />
                    1
                  </TabsTrigger>
                  <TabsTrigger value="2" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                    <Bed className="mr-1 h-3 w-3" />
                    2
                  </TabsTrigger>
                  <TabsTrigger value="3" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                    <Bed className="mr-1 h-3 w-3" />
                    3
                  </TabsTrigger>
                  <TabsTrigger value="4+" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                    <Bed className="mr-1 h-3 w-3" />
                    4+
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-white/80 bg-black/30 p-2 rounded">Budget:</label>
              <RadioGroup value={budget} onValueChange={setBudget} className="space-y-3">
                {(type === 'rent' ? getRentBudgetOptions() : getBuyBudgetOptions()).map(option => (
                  <div key={option.value} className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 bg-gray-800/70 hover:bg-white/10 transition-colors">
                    <RadioGroupItem 
                      value={option.value} 
                      id={`budget-${option.value}`} 
                      className="border-white/30 text-purple-600"
                    />
                    <label htmlFor={`budget-${option.value}`} className="w-full text-white cursor-pointer">
                      {option.label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-medium text-white bg-black/40 p-3 rounded-lg">Important Neighborhood Aspects</h3>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-white/80 bg-black/30 p-2 rounded">
                Which aspects of a neighbourhood are important to you? (Select all that apply)
              </label>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 bg-gray-800/70 hover:bg-white/10 transition-colors">
                  <Checkbox 
                    id="priority-green" 
                    className="text-purple-600 border-white/30"
                    checked={priorities.includes('green spaces and parks')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPriorities([...priorities, 'green spaces and parks']);
                      } else {
                        setPriorities(priorities.filter(p => p !== 'green spaces and parks'));
                      }
                    }}
                  />
                  <Label htmlFor="priority-green" className="w-full text-white cursor-pointer">
                    Proximity to green spaces and parks
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 bg-gray-800/70 hover:bg-white/10 transition-colors">
                  <Checkbox 
                    id="priority-nightlife" 
                    className="text-purple-600 border-white/30"
                    checked={priorities.includes('lively nightlife and entertainment')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPriorities([...priorities, 'lively nightlife and entertainment']);
                      } else {
                        setPriorities(priorities.filter(p => p !== 'lively nightlife and entertainment'));
                      }
                    }}
                  />
                  <Label htmlFor="priority-nightlife" className="w-full text-white cursor-pointer">
                    Lively nightlife and entertainment
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 bg-gray-800/70 hover:bg-white/10 transition-colors">
                  <Checkbox 
                    id="priority-culture" 
                    className="text-purple-600 border-white/30"
                    checked={priorities.includes('cultural venues')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPriorities([...priorities, 'cultural venues']);
                      } else {
                        setPriorities(priorities.filter(p => p !== 'cultural venues'));
                      }
                    }}
                  />
                  <Label htmlFor="priority-culture" className="w-full text-white cursor-pointer">
                    Access to cultural venues (museums, galleries)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 bg-gray-800/70 hover:bg-white/10 transition-colors">
                  <Checkbox 
                    id="priority-family" 
                    className="text-purple-600 border-white/30"
                    checked={priorities.includes('family-friendly atmosphere')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPriorities([...priorities, 'family-friendly atmosphere']);
                      } else {
                        setPriorities(priorities.filter(p => p !== 'family-friendly atmosphere'));
                      }
                    }}
                  />
                  <Label htmlFor="priority-family" className="w-full text-white cursor-pointer">
                    A family-friendly atmosphere with good schools
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 bg-gray-800/70 hover:bg-white/10 transition-colors">
                  <Checkbox 
                    id="priority-transport" 
                    className="text-purple-600 border-white/30"
                    checked={priorities.includes('excellent public transport')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPriorities([...priorities, 'excellent public transport']);
                      } else {
                        setPriorities(priorities.filter(p => p !== 'excellent public transport'));
                      }
                    }}
                  />
                  <Label htmlFor="priority-transport" className="w-full text-white cursor-pointer">
                    Excellent public transport connections
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 bg-gray-800/70 hover:bg-white/10 transition-colors">
                  <Checkbox 
                    id="priority-shopping" 
                    className="text-purple-600 border-white/30"
                    checked={priorities.includes('shopping and retail')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPriorities([...priorities, 'shopping and retail']);
                      } else {
                        setPriorities(priorities.filter(p => p !== 'shopping and retail'));
                      }
                    }}
                  />
                  <Label htmlFor="priority-shopping" className="w-full text-white cursor-pointer">
                    Good shopping and retail options
                  </Label>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-medium text-white bg-black/40 p-3 rounded-lg">Location & Commute</h3>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/80 bg-black/30 p-2 rounded">
                Add key locations you need to be close to:
              </label>
              
              {/* Popular locations for quick selection */}
              <div className="space-y-2">
                <p className="text-sm text-white/70 bg-black/30 p-2 rounded">Popular locations:</p>
                <div className="flex flex-wrap gap-2">
                  {getPopularLocations().map((location, index) => (
                    <Button 
                      key={index}
                      variant="outline" 
                      size="sm"
                      className="bg-black/40 border border-white/20 text-white hover:bg-white/10"
                      onClick={() => addPopularLocation(location)}
                    >
                      <MapPin className="h-3 w-3 mr-1 text-coral" />
                      {location.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              {locations.length > 0 && (
                <div className="space-y-2 mb-4 mt-4">
                  <p className="text-sm text-white/70 bg-black/30 p-2 rounded">Your locations:</p>
                  <div className="space-y-2">
                    {locations.map((loc, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-800/70 p-2 px-3 rounded-lg border border-white/10">
                        <span className="text-white text-sm">{loc.place} (max {loc.time} min)</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0 text-white/70 hover:text-white"
                          onClick={() => removeLocation(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <div className="flex-grow">
                  <Input
                    value={tempLocation}
                    onChange={(e) => setTempLocation(e.target.value)}
                    placeholder="Other location (e.g., workplace, school)"
                    className="bg-white/10 text-white border-white/20 placeholder:text-white/40"
                  />
                </div>
                <div className="w-24">
                  <Input
                    value={tempTime}
                    onChange={(e) => setTempTime(e.target.value)}
                    placeholder="Minutes"
                    type="number"
                    min="0"
                    max="120"
                    className="bg-white/10 text-white border-white/20 placeholder:text-white/40"
                  />
                </div>
                <Button 
                  onClick={addLocation} 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              <p className="text-xs text-white/50 italic">Add locations you regularly commute to, such as work, school, or family</p>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-medium text-white bg-black/40 p-3 rounded-lg">Lifestyle & Community</h3>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-white/80 bg-black/30 p-2 rounded">
                What lifestyle features and community aspects are important to you? (Select all that apply)
              </label>
              
              <div className="space-y-5">
                {Object.entries(groupedLifestyleOptions).map(([category, options]) => (
