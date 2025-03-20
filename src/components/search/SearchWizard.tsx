import React, { useState } from 'react';
import { Check, Home, MapPin, ArrowRight, ArrowLeft, PoundSterling, Lightbulb, Building, Activity, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SearchWizardProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  onCancel: () => void;
}

const SearchWizard: React.FC<SearchWizardProps> = ({ onSearch, isSearching, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [type, setType] = useState<'rent' | 'buy'>('rent');
  const [priorities, setPriorities] = useState<string[]>([]);
  const [locations, setLocations] = useState<{place: string, time: string}[]>([]);
  const [budget, setBudget] = useState('');
  const [lifestyle, setLifestyle] = useState<string[]>([]);
  const [dailyRoutine, setDailyRoutine] = useState('');
  const [tempLocation, setTempLocation] = useState('');
  const [tempTime, setTempTime] = useState('');

  const totalSteps = 5;

  // More granular budget options
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

  // Combine all lifestyle options
  const allLifestyleOptions = [...lifestyleOptions, ...culturalCommunities];

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

  const removeLocation = (index: number) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const submitWizard = () => {
    // Construct a natural language query from the wizard inputs
    const lifestylePreferences = lifestyle.join(', ');
    const prioritiesText = priorities.join(', ');
    
    // Map budget to text based on selected option and property type
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

    const queryText = `I'm looking to ${type} a property in London. I value ${prioritiesText}. ${locationsText}My budget is ${budgetText}. I want an area with the following lifestyle elements: ${lifestylePreferences}. I need a ${routineText}.`;

    onSearch(queryText);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-medium text-white">Property Type</h3>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-white/80">I'm looking to:</label>
              <Tabs defaultValue="rent" value={type} onValueChange={(v) => setType(v as 'rent' | 'buy')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-black/30">
                  <TabsTrigger value="rent" className="data-[state=active]:bg-posh-green data-[state=active]:text-white">
                    <Home className="mr-2 h-4 w-4" />
                    Rent
                  </TabsTrigger>
                  <TabsTrigger value="buy" className="data-[state=active]:bg-posh-green data-[state=active]:text-white">
                    <PoundSterling className="mr-2 h-4 w-4" />
                    Buy
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-white/80">Budget:</label>
              <RadioGroup value={budget} onValueChange={setBudget} className="space-y-3">
                {(type === 'rent' ? rentBudgetOptions : buyBudgetOptions).map(option => (
                  <div key={option.value} className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 hover:bg-white/5 transition-colors">
                    <RadioGroupItem 
                      value={option.value} 
                      id={`budget-${option.value}`} 
                      className="border-white/30 text-posh-green"
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
            <h3 className="text-xl font-medium text-white">Important Neighborhood Aspects</h3>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-white/80">
                Which aspects of a neighbourhood are important to you? (Select all that apply)
              </label>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 hover:bg-white/5 transition-colors">
                  <Checkbox 
                    id="priority-green" 
                    className="text-posh-green border-white/30"
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
                
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 hover:bg-white/5 transition-colors">
                  <Checkbox 
                    id="priority-nightlife" 
                    className="text-posh-green border-white/30"
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
                
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 hover:bg-white/5 transition-colors">
                  <Checkbox 
                    id="priority-culture" 
                    className="text-posh-green border-white/30"
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
                
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 hover:bg-white/5 transition-colors">
                  <Checkbox 
                    id="priority-family" 
                    className="text-posh-green border-white/30"
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
                
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 hover:bg-white/5 transition-colors">
                  <Checkbox 
                    id="priority-transport" 
                    className="text-posh-green border-white/30"
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
                
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 hover:bg-white/5 transition-colors">
                  <Checkbox 
                    id="priority-shopping" 
                    className="text-posh-green border-white/30"
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
            <h3 className="text-xl font-medium text-white">Location & Commute</h3>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/80">
                Add key locations you need to be close to:
              </label>
              
              {locations.length > 0 && (
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-white/70">Your locations:</p>
                  <div className="space-y-2">
                    {locations.map((loc, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/10 p-2 px-3 rounded-lg">
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
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-grow">
                  <Input
                    value={tempLocation}
                    onChange={(e) => setTempLocation(e.target.value)}
                    placeholder="e.g., Canary Wharf, UCL, Big Ben"
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
            <h3 className="text-xl font-medium text-white">Lifestyle & Community</h3>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-white/80">
                What lifestyle features and community aspects are important to you? (Select all that apply)
              </label>
              
              <div className="space-y-5">
                {Object.entries(groupedLifestyleOptions).map(([category, options]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-sm font-medium capitalize" style={{ color: lifestyleColors[category as keyof typeof lifestyleColors] || '#ffffff' }}>
                      {category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {options.map(option => (
                        <ToggleGroupItem 
                          key={option.value}
                          value={option.value} 
                          className="bg-black/20 border border-white/10 text-white hover:bg-black/30"
                          style={{ 
                            backgroundColor: lifestyle.includes(option.value) 
                              ? `${lifestyleColors[option.category as keyof typeof lifestyleColors]}40` 
                              : 'rgba(0,0,0,0.2)',
                            borderColor: lifestyle.includes(option.value)
                              ? lifestyleColors[option.category as keyof typeof lifestyleColors]
                              : 'rgba(255,255,255,0.1)'
                          }}
                          data-state={lifestyle.includes(option.value) ? 'on' : 'off'}
                          onClick={() => {
                            if (lifestyle.includes(option.value)) {
                              setLifestyle(lifestyle.filter(item => item !== option.value));
                            } else {
                              setLifestyle([...lifestyle, option.value]);
                            }
                          }}
                        >
                          {option.label}
                        </ToggleGroupItem>
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
            <h3 className="text-xl font-medium text-white">Daily Routine</h3>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-white/80">
                Envision your typical day in your new neighbourhood. Which scenario best describes it?
              </label>
              
              <RadioGroup value={dailyRoutine} onValueChange={setDailyRoutine} className="space-y-3">
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 hover:bg-white/5 transition-colors">
                  <RadioGroupItem value="walk" id="routine-walk" className="border-white/30 text-posh-green" />
                  <label htmlFor="routine-walk" className="w-full text-white cursor-pointer">
                    Most daily errands done on foot
                  </label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 hover:bg-white/5 transition-colors">
                  <RadioGroupItem value="transit" id="routine-transit" className="border-white/30 text-posh-green" />
                  <label htmlFor="routine-transit" className="w-full text-white cursor-pointer">
                    Frequent use of public transport or cycling
                  </label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 hover:bg-white/5 transition-colors">
                  <RadioGroupItem value="drive" id="routine-drive" className="border-white/30 text-posh-green" />
                  <label htmlFor="routine-drive" className="w-full text-white cursor-pointer">
                    Driving for the majority of errands
                  </label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 hover:bg-white/5 transition-colors">
                  <RadioGroupItem value="home" id="routine-home" className="border-white/30 text-posh-green" />
                  <label htmlFor="routine-home" className="w-full text-white cursor-pointer">
                    Working from home and venturing out only occasionally
                  </label>
                </div>
              </RadioGroup>
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
      case 3: return true; // Optional fields
      case 4: return lifestyle.length > 0;
      case 5: return !!dailyRoutine;
      default: return false;
    }
  };

  return (
    <div className="bg-gradient-to-br from-black/60 to-black/40 rounded-xl p-6 shadow-xl border border-posh-green/30 max-w-3xl mx-auto mb-8">
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
          {[1, 2, 3, 4, 5].map((step) => (
            <div 
              key={step}
              className={`relative flex h-10 w-10 items-center justify-center rounded-full border ${
                step < currentStep 
                  ? 'bg-posh-green border-posh-green text-white' 
                  : step === currentStep 
                    ? 'bg-black/50 border-posh-green text-white'
                    : 'bg-black/20 border-white/20 text-white/50'
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
            className="bg-posh-green transition-all duration-300"
            style={{ width: `${(currentStep - 1) * 25}%` }}
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
