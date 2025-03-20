
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
    
    let budgetText = '';
    switch (budget) {
      case 'low': budgetText = type === 'rent' ? 'up to £1,500 per month' : 'up to £500,000'; break;
      case 'medium': budgetText = type === 'rent' ? '£1,500-£2,500 per month' : '£500,000-£750,000'; break;
      case 'high': budgetText = type === 'rent' ? '£2,500-£3,500 per month' : '£750,000-£1,000,000'; break;
      case 'luxury': budgetText = type === 'rent' ? 'over £3,500 per month' : 'over £1,000,000'; break;
    }
    
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
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 hover:bg-white/5 transition-colors">
                  <RadioGroupItem value="low" id="budget-low" className="border-white/30 text-posh-green" />
                  <label htmlFor="budget-low" className="w-full text-white cursor-pointer">
                    {type === 'rent' ? 'Up to £1,500 per month' : 'Up to £500,000'}
                  </label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 hover:bg-white/5 transition-colors">
                  <RadioGroupItem value="medium" id="budget-medium" className="border-white/30 text-posh-green" />
                  <label htmlFor="budget-medium" className="w-full text-white cursor-pointer">
                    {type === 'rent' ? '£1,500–£2,500 per month' : '£500,000–£750,000'}
                  </label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 hover:bg-white/5 transition-colors">
                  <RadioGroupItem value="high" id="budget-high" className="border-white/30 text-posh-green" />
                  <label htmlFor="budget-high" className="w-full text-white cursor-pointer">
                    {type === 'rent' ? '£2,500–£3,500 per month' : '£750,000–£1,000,000'}
                  </label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 hover:bg-white/5 transition-colors">
                  <RadioGroupItem value="luxury" id="budget-luxury" className="border-white/30 text-posh-green" />
                  <label htmlFor="budget-luxury" className="w-full text-white cursor-pointer">
                    {type === 'rent' ? 'Over £3,500 per month' : 'Over £1,000,000'}
                  </label>
                </div>
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
              
              <ToggleGroup 
                type="multiple" 
                className="flex flex-wrap gap-2"
                value={lifestyle}
                onValueChange={setLifestyle}
              >
                <ToggleGroupItem value="good-schools" className="bg-black/20 border border-white/10 text-white data-[state=on]:bg-posh-green">
                  School catchment
                </ToggleGroupItem>
                <ToggleGroupItem value="cultural-venues" className="bg-black/20 border border-white/10 text-white data-[state=on]:bg-posh-green">
                  Cultural hotspots
                </ToggleGroupItem>
                <ToggleGroupItem value="restaurants" className="bg-black/20 border border-white/10 text-white data-[state=on]:bg-posh-green">
                  Fine dining
                </ToggleGroupItem>
                <ToggleGroupItem value="markets" className="bg-black/20 border border-white/10 text-white data-[state=on]:bg-posh-green">
                  Local markets
                </ToggleGroupItem>
                <ToggleGroupItem value="quiet" className="bg-black/20 border border-white/10 text-white data-[state=on]:bg-posh-green">
                  Quiet streets
                </ToggleGroupItem>
                <ToggleGroupItem value="fitness" className="bg-black/20 border border-white/10 text-white data-[state=on]:bg-posh-green">
                  Fitness facilities
                </ToggleGroupItem>
                <ToggleGroupItem value="coffee" className="bg-black/20 border border-white/10 text-white data-[state=on]:bg-posh-green">
                  Cafés & coffee
                </ToggleGroupItem>
                <ToggleGroupItem value="bars" className="bg-black/20 border border-white/10 text-white data-[state=on]:bg-posh-green">
                  Bars & pubs
                </ToggleGroupItem>
                <ToggleGroupItem value="shopping" className="bg-black/20 border border-white/10 text-white data-[state=on]:bg-posh-green">
                  Shopping areas
                </ToggleGroupItem>
                <ToggleGroupItem value="transport" className="bg-black/20 border border-white/10 text-white data-[state=on]:bg-posh-green">
                  Transport links
                </ToggleGroupItem>
                <ToggleGroupItem value="suburban" className="bg-black/20 border border-white/10 text-white data-[state=on]:bg-posh-green">
                  Suburban feel
                </ToggleGroupItem>
                <ToggleGroupItem value="urban" className="bg-black/20 border border-white/10 text-white data-[state=on]:bg-posh-green">
                  Urban lifestyle
                </ToggleGroupItem>
                <ToggleGroupItem value="gritty" className="bg-black/20 border border-white/10 text-white data-[state=on]:bg-posh-green">
                  Gritty character
                </ToggleGroupItem>
                <ToggleGroupItem value="upscale" className="bg-black/20 border border-white/10 text-white data-[state=on]:bg-posh-green">
                  Upscale living
                </ToggleGroupItem>
                <ToggleGroupItem value="independent" className="bg-black/20 border border-white/10 text-white data-[state=on]:bg-posh-green">
                  Independent shops
                </ToggleGroupItem>
                <ToggleGroupItem value="artistic" className="bg-black/20 border border-white/10 text-white data-[state=on]:bg-posh-green">
                  Artistic community
                </ToggleGroupItem>
                <ToggleGroupItem value="indian" className="bg-black/20 border border-white/10 text-white data-[state=on]:bg-posh-green">
                  Indian community
                </ToggleGroupItem>
                <ToggleGroupItem value="pakistani" className="bg-black/20 border border-white/10 text-white data-[state=on]:bg-posh-green">
                  Pakistani community
                </ToggleGroupItem>
                <ToggleGroupItem value="polish" className="bg-black/20 border border-white/10 text-white data-[state=on]:bg-posh-green">
                  Polish community
                </ToggleGroupItem>
                <ToggleGroupItem value="caribbean" className="bg-black/20 border border-white/10 text-white data-[state=on]:bg-posh-green">
                  Caribbean community
                </ToggleGroupItem>
                <ToggleGroupItem value="chinese" className="bg-black/20 border border-white/10 text-white data-[state=on]:bg-posh-green">
                  Chinese community
                </ToggleGroupItem>
                <ToggleGroupItem value="jewish" className="bg-black/20 border border-white/10 text-white data-[state=on]:bg-posh-green">
                  Jewish community
                </ToggleGroupItem>
                <ToggleGroupItem value="turkish" className="bg-black/20 border border-white/10 text-white data-[state=on]:bg-posh-green">
                  Turkish community
                </ToggleGroupItem>
              </ToggleGroup>
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
