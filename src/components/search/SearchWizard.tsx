import React, { useState, useRef } from 'react';
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
}

const SearchWizard: React.FC<SearchWizardProps> = ({ onSearch, isSearching, onCancel }) => {
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
  const [tempTime, setTempTime] = useState('30');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const wizardRef = useRef<HTMLDivElement>(null);

  const totalSteps = 6;

  const popularLocations = [
    { name: "Canary Wharf", defaultTime: "30" },
    { name: "Kings Cross", defaultTime: "30" },
    { name: "Waterloo", defaultTime: "30" },
    { name: "Liverpool Street", defaultTime: "30" },
    { name: "The City", defaultTime: "30" },
    { name: "Hammersmith", defaultTime: "30" },
    { name: "Westminster", defaultTime: "30" },
    { name: "Victoria", defaultTime: "30" },
    { name: "Paddington", defaultTime: "30" },
    { name: "Shoreditch", defaultTime: "30" },
  ];

  const additionalInfoSuggestions = [
    "I need a quiet area with low crime rates and good access to healthcare facilities.",
    "I'm looking for a property with outdoor space and within walking distance to local shops.",
    "I would prefer an area with a strong sense of community and regular local events."
  ];

  const rentBudgetOptions = [
    { value: 'very-low', label: 'Up to £1,000 per month' },
    { value: 'low', label: '£1,000–£1,500 per month' },
    { value: 'medium-low', label: '£1,500–£2,000 per month' },
    { value: 'medium', label: '£2,000–£2,500 per month' },
    { value: 'medium-high', label: '£2,500–£3,000 per month' },
    { value: 'high', label: '£3,000–£3,500 per month' },
    { value: 'very-high', label: '£3,500–£5,000 per month' },
    { value: 'luxury', label: 'Over £5,000 per month' }
  ];

  const buyBudgetOptions = [
    { value: 'very-low', label: 'Up to £300,000' },
    { value: 'low', label: '£300,000–£500,000' },
    { value: 'medium-low', label: '£500,000–£750,000' },
    { value: 'medium', label: '£750,000–£1,000,000' },
    { value: 'medium-high', label: '£1,000,000–£1,500,000' },
    { value: 'high', label: '£1,500,000–£2,000,000' },
    { value: 'very-high', label: '£2,000,000–£3,000,000' },
    { value: 'luxury', label: 'Over £3,000,000' }
  ];

  const lifestyleColors = {
    amenities: '#9b87f5',
    nightlife: '#FF7F50',
    community: '#4CAF50',
    environment: '#2196F3',
    activities: '#FFC107',
    special: '#E91E63'
  };

  const lifestyleOptions = [
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
    
    { value: 'bars', label: 'Bars & pubs', category: 'nightlife' },
    { value: 'clubs', label: 'Nightclubs', category: 'nightlife' },
    { value: 'live-music', label: 'Live music venues', category: 'nightlife' },
    { value: 'theatres', label: 'Theatres', category: 'nightlife' },
    { value: 'comedy', label: 'Comedy clubs', category: 'nightlife' },
    
    { value: 'family-friendly', label: 'Family-friendly', category: 'community' },
    { value: 'lgbt-friendly', label: 'LGBT+ friendly', category: 'community' },
    { value: 'dog-friendly', label: 'Dog-friendly', category: 'community' },
    { value: 'international', label: 'International community', category: 'community' },
    { value: 'young-professionals', label: 'Young professionals', category: 'community' },
    { value: 'students', label: 'Student population', category: 'community' },
    { value: 'retirees', label: 'Retirement community', category: 'community' },
    
    { value: 'quiet', label: 'Quiet streets', category: 'environment' },
    { value: 'green-spaces', label: 'Green spaces', category: 'environment' },
    { value: 'riverside', label: 'Riverside', category: 'environment' },
    { value: 'suburban', label: 'Suburban feel', category: 'environment' },
    { value: 'urban', label: 'Urban lifestyle', category: 'environment' },
    { value: 'historic', label: 'Historic architecture', category: 'environment' },
    { value: 'modern', label: 'Modern developments', category: 'environment' },
    
    { value: 'cycling', label: 'Cycling-friendly', category: 'activities' },
    { value: 'running', label: 'Running paths', category: 'activities' },
    { value: 'water-sports', label: 'Water sports', category: 'activities' },
    { value: 'tennis', label: 'Tennis courts', category: 'activities' },
    { value: 'football', label: 'Football pitches', category: 'activities' },
    { value: 'golf', label: 'Golf courses', category: 'activities' },
    { value: 'swimming', label: 'Swimming pools', category: 'activities' },
    
    { value: 'independent', label: 'Independent shops', category: 'special' },
    { value: 'artistic', label: 'Artistic community', category: 'special' },
    { value: 'tech-hub', label: 'Tech hub', category: 'special' },
    { value: 'foodie-scene', label: 'Foodie scene', category: 'special' },
    { value: 'vegan-friendly', label: 'Vegan-friendly', category: 'special' },
    { value: 'craft-beer', label: 'Craft beer scene', category: 'special' }
  ];

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

  const allLifestyleOptions = [...lifestyleOptions, ...culturalCommunities];

  const groupedLifestyleOptions = allLifestyleOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, typeof lifestyleOptions>);

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      const scrollPosition = window.scrollY;
      
      setCurrentStep(prev => prev + 1);
      
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
        
        if (wizardRef.current) {
          const wizardRect = wizardRef.current.getBoundingClientRect();
          if (wizardRect.top < 0) {
            window.scrollBy(0, wizardRect.top - 20);
          }
        }
      }, 0);
    } else {
      submitWizard();
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      const scrollPosition = window.scrollY;
      
      setCurrentStep(prev => prev - 1);
      
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 0);
    }
  };

  const addLocation = () => {
    if (tempLocation.trim()) {
      setLocations([...locations, {place: tempLocation.trim(), time: tempTime || '30'}]);
      setTempLocation('');
      setTempTime('30');
    }
  };

  const addPopularLocation = (location: {name: string, defaultTime: string}) => {
    if (!locations.some(loc => loc.place === location.name)) {
      setLocations([...locations, {place: location.name, time: location.defaultTime}]);
    }
  };

  const removeLocation = (index: number) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const updateLocationTime = (index: number, newTime: string) => {
    const updatedLocations = [...locations];
    updatedLocations[index] = { ...updatedLocations[index], time: newTime };
    setLocations(updatedLocations);
  };

  const applyAdditionalInfoSuggestion = (suggestion: string) => {
    setAdditionalInfo(suggestion);
  };

  const submitWizard = () => {
    const lifestylePreferences = lifestyle.join(', ');
    const prioritiesText = priorities.join(', ');
    
    const budgetOptions = type === 'rent' ? rentBudgetOptions : buyBudgetOptions;
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

    const propertyDetailsText = `I'm looking to ${type} a ${bedrooms}-bedroom ${propertyType} in London. `;

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
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-white/80 bg-black/30 p-2 rounded">Property type:</label>
              <Tabs 
                defaultValue="flat" 
                value={propertyType} 
                onValueChange={(v) => setPropertyType(v as 'flat' | 'house')} 
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-black/30">
                  <TabsTrigger value="flat" className="data-[state=active]:bg-coral data-[state=active]:text-white text-gray-400 data-[state=inactive]:text-gray-400">
                    <Building className="mr-2 h-4 w-4" />
                    Flat/Apartment
                  </TabsTrigger>
                  <TabsTrigger value="house" className="data-[state=active]:bg-coral data-[state=active]:text-white text-gray-400 data-[state=inactive]:text-gray-400">
                    <Home className="mr-2 h-4 w-4" />
                    House
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-white/80 bg-black/30 p-2 rounded">Number of bedrooms:</label>
              <Tabs 
                defaultValue="2" 
                value={bedrooms} 
                onValueChange={(v) => setBedrooms(v as '1' | '2' | '3' | '4+')} 
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4 bg-black/30">
                  <TabsTrigger value="1" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-gray-400 data-[state=inactive]:text-gray-400">
                    <Bed className="mr-1 h-3 w-3" />
                    1
                  </TabsTrigger>
                  <TabsTrigger value="2" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-gray-400 data-[state=inactive]:text-gray-400">
                    <Bed className="mr-1 h-3 w-3" />
                    2
                  </TabsTrigger>
                  <TabsTrigger value="3" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-gray-400 data-[state=inactive]:text-gray-400">
                    <Bed className="mr-1 h-3 w-3" />
                    3
                  </TabsTrigger>
                  <TabsTrigger value="4+" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-gray-400 data-[state=inactive]:text-gray-400">
                    <Bed className="mr-1 h-3 w-3" />
                    4+
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-white/80 bg-black/30 p-2 rounded">Budget:</label>
              <RadioGroup value={budget} onValueChange={setBudget} className="space-y-3">
                {(type === 'rent' ? rentBudgetOptions : buyBudgetOptions).map(option => (
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
              
              <div className="space-y-2">
                <p className="text-sm text-white/70 bg-black/30 p-2 rounded">Popular locations:</p>
                <div className="flex flex-wrap gap-2">
                  {popularLocations.map((location, index) => (
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
                        <span className="text-white text-sm">{loc.place}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Input
                              value={loc.time}
                              onChange={(e) => updateLocationTime(index, e.target.value)}
                              className="w-16 h-7 text-sm text-white bg-gray-700 border-gray-600"
                              type="number"
                              min="1"
                              max="120"
                            />
                            <span className="text-white text-sm ml-1">min</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0 text-white/70 hover:text-white"
                            onClick={() => removeLocation(index)}
                          >
                            ×
                          </Button>
                        </div>
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
                <div className="w-24 flex items-center">
                  <Input
                    value={tempTime}
                    onChange={(e) => setTempTime(e.target.value)}
                    placeholder="Minutes"
                    type="number"
                    min="1"
                    max="120"
                    className="bg-white/10 text-white border-white/20 placeholder:text-white/40"
                  />
                  <span className="text-white ml-1">min</span>
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
                  <div key={category} className="space-y-2">
                    <h4 className="text-sm font-medium capitalize bg-black/30 p-2 rounded" style={{ color: lifestyleColors[category as keyof typeof lifestyleColors] || '#ffffff' }}>
                      {category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {options.map(option => (
                        <Button
                          key={option.value}
                          type="button"
                          variant="outline"
                          size="sm"
                          className={`
                            transition-colors
                            ${lifestyle.includes(option.value) 
                              ? 'bg-opacity-40 border-opacity-100' 
                              : 'bg-black/40 border-white/20 text-gray-400'}
                          `}
                          style={{ 
                            backgroundColor: lifestyle.includes(option.value) 
                              ? `${lifestyleColors[option.category as keyof typeof lifestyleColors]}40` 
                              : 'rgba(0,0,0,0.4)',
                            borderColor: lifestyle.includes(option.value)
                              ? lifestyleColors[option.category as keyof typeof lifestyleColors]
                              : 'rgba(255,255,255,0.2)',
                            color: lifestyle.includes(option.value) ? 'white' : '#888888'
                          }}
                          onClick={() => {
                            if (lifestyle.includes(option.value)) {
                              setLifestyle(lifestyle.filter(item => item !== option.value));
                            } else {
                              setLifestyle([...lifestyle, option.value]);
                            }
                          }}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-medium text-white bg-black/40 p-3 rounded-lg">Daily Routine</h3>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-white/80 bg-black/30 p-2 rounded">
                Envision your typical day in your new neighbourhood. Which scenario best describes it?
              </label>
              
              <RadioGroup value={dailyRoutine} onValueChange={setDailyRoutine} className="space-y-3">
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 bg-gray-800/70 hover:bg-white/10 transition-colors">
                  <RadioGroupItem value="walk" id="routine-walk" className="border-white/30 text-purple-600" />
                  <label htmlFor="routine-walk" className="w-full text-white cursor-pointer">
                    Most daily errands done on foot
                  </label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 bg-gray-800/70 hover:bg-white/10 transition-colors">
                  <RadioGroupItem value="transit" id="routine-transit" className="border-white/30 text-purple-600" />
                  <label htmlFor="routine-transit" className="w-full text-white cursor-pointer">
                    Frequent use of public transport or cycling
                  </label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 bg-gray-800/70 hover:bg-white/10 transition-colors">
                  <RadioGroupItem value="drive" id="routine-drive" className="border-white/30 text-purple-600" />
                  <label htmlFor="routine-drive" className="w-full text-white cursor-pointer">
                    Driving for the majority of errands
                  </label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 bg-gray-800/70 hover:bg-white/10 transition-colors">
                  <RadioGroupItem value="home" id="routine-home" className="border-white/30 text-purple-600" />
                  <label htmlFor="routine-home" className="w-full text-white cursor-pointer">
                    Working from home and venturing out only occasionally
                  </label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );
      
      case 6:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-medium text-white bg-black/40 p-3 rounded-lg">Additional Requirements</h3>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-white/80 bg-black/30 p-2 rounded">
                Is there anything else you would like to mention about your ideal area?
              </label>
              
              <Textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="E.g., I need a garden, I want to be close to my children's school, I prefer a quiet area, etc."
                className="min-h-[120px] bg-gray-800/70 border-white/20 text-white placeholder:text-white/40"
              />
              
              <div className="space-y-2">
                <p className="text-sm text-white/70">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {additionalInfoSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={() => applyAdditionalInfoSuggestion(suggestion)}
                    >
                      {suggestion.length > 60 ? suggestion.substring(0, 60) + '...' : suggestion}
                    </Button>
                  ))}
                </div>
              </div>
              
              <p className="text-xs text-white/60">
                This is your chance to add any specific requirements that haven't been covered by the previous steps.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!budget;
      case 2: return priorities.length > 0;
      case 3: return true;
      case 4: return lifestyle.length > 0;
      case 5: return !!dailyRoutine;
      case 6: return true;
      default: return false;
    }
  };

  return (
    <div ref={wizardRef} className="bg-gradient-to-br from-black/60 to-black/40 rounded-xl p-6 shadow-xl border border-purple-600/30 max-w-3xl mx-auto mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-semibold text-white flex items-center">
          <Lightbulb className="h-5 w-5 text-amber-400 mr-2" />
          Area Search Wizard
        </h2>
        <Button variant="outline" size="sm" onClick={onCancel} className="text-white/70 border-white/20 hover:bg-white/10">
          Cancel
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div 
              key={step}
              className={`relative flex h-10 w-10 items-center justify-center rounded-full border ${
                step < currentStep 
                  ? 'bg-purple-600 border-purple-600 text-white' 
                  : step === currentStep 
                    ? 'bg-black/50 border-purple-600 text-white'
                    : 'bg-black/20 border-white/20 text-gray-400'
              }`}
            >
              {step < currentStep ? (
                <Check className="h-5 w-5" />
              ) : (
                <span>{step}</span>
              )}
            </div>
          ))}
        </div>
        <div className="overflow-hidden h-1 flex rounded bg-black/20">
          <div
            className="bg-purple-600 transition-all duration-300"
            style={{ width: `${(currentStep - 1) * 20}%` }}
          />
        </div>
      </div>
      
      <form onSubmit={(e) => { e.preventDefault(); }}>
        <div className="min-h-[350px]">
          {renderStepContent()}
        </div>
        
        <div className="mt-6 flex justify-between">
          <Button
            type="button"
            onClick={goToPrevStep}
            disabled={currentStep === 1}
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10 disabled:opacity-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <Button
            type="button"
            onClick={goToNextStep}
            disabled={!canProceed() || isSearching}
            variant="glow"
            size="lg"
            className="bg-purple-600 hover:bg-purple-700"
          >
            {currentStep === totalSteps ? (
              isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Finding Areas
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Find Areas
                </>
              )
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchWizard;
