
import React, { useState } from 'react';
import { Check, Home, MapPin, ArrowRight, ArrowLeft, PoundSterling, Lightbulb, Building, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface SearchWizardProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  onCancel: () => void;
}

const SearchWizard: React.FC<SearchWizardProps> = ({ onSearch, isSearching, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [type, setType] = useState<'rent' | 'buy'>('rent');
  const [priority, setPriority] = useState('');
  const [location, setLocation] = useState('');
  const [commute, setCommute] = useState('');
  const [budget, setBudget] = useState('');
  const [lifestyle, setLifestyle] = useState<string[]>([]);
  const [dailyRoutine, setDailyRoutine] = useState('');

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

  const submitWizard = () => {
    // Construct a natural language query from the wizard inputs
    const lifestylePreferences = lifestyle.join(', ');
    
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
    
    let priorityText = '';
    switch (priority) {
      case 'green': priorityText = 'near parks and green spaces'; break;
      case 'nightlife': priorityText = 'with vibrant nightlife'; break;
      case 'culture': priorityText = 'near cultural venues like museums and galleries'; break;
      case 'family': priorityText = 'family-friendly with good schools'; break;
    }

    const queryText = `I'm looking to ${type} a property in London ${priorityText}. ${
      location ? `I need to be near ${location} with a commute of max ${commute} minutes. ` : ''
    }My budget is ${budgetText}. I want an area with ${lifestylePreferences}. I need a ${routineText}.`;

    onSearch(queryText);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-medium text-white">Property Type & Priority</h3>
            
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
              <label className="text-sm font-medium text-white/80">Which aspect of a neighbourhood is most important to you?</label>
              <RadioGroup value={priority} onValueChange={setPriority} className="space-y-3">
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 hover:bg-white/5 transition-colors">
                  <RadioGroupItem value="green" id="priority-green" className="border-white/30 text-posh-green" />
                  <label htmlFor="priority-green" className="w-full text-white cursor-pointer">Proximity to green spaces and parks</label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 hover:bg-white/5 transition-colors">
                  <RadioGroupItem value="nightlife" id="priority-nightlife" className="border-white/30 text-posh-green" />
                  <label htmlFor="priority-nightlife" className="w-full text-white cursor-pointer">Lively nightlife and entertainment</label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 hover:bg-white/5 transition-colors">
                  <RadioGroupItem value="culture" id="priority-culture" className="border-white/30 text-posh-green" />
                  <label htmlFor="priority-culture" className="w-full text-white cursor-pointer">Access to cultural venues (museums, galleries)</label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 p-3 hover:bg-white/5 transition-colors">
                  <RadioGroupItem value="family" id="priority-family" className="border-white/30 text-posh-green" />
                  <label htmlFor="priority-family" className="w-full text-white cursor-pointer">A family-friendly atmosphere with good schools</label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-medium text-white">Location & Commute</h3>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/80">
                Which key location do you need to be close to?
                <span className="text-white/50 ml-1">(optional)</span>
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Canary Wharf, UCL, Big Ben"
                className="bg-white/10 text-white border-white/20 placeholder:text-white/40"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/80">
                Maximum acceptable travel time (in minutes)
                <span className="text-white/50 ml-1">(optional)</span>
              </label>
              <Input
                value={commute}
                onChange={(e) => setCommute(e.target.value)}
                placeholder="e.g., 30"
                type="number"
                min="0"
                max="120"
                className="bg-white/10 text-white border-white/20 placeholder:text-white/40"
              />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-medium text-white">Budget</h3>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-white/80">Which of the following best describes your budget?</label>
              
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
      
      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-medium text-white">Lifestyle & Community</h3>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-white/80">
                What lifestyle features are important to you? (Select all that apply)
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
      case 1: return !!priority;
      case 2: return true; // Optional fields
      case 3: return !!budget;
      case 4: return lifestyle.length > 0;
      case 5: return !!dailyRoutine;
      default: return false;
    }
  };

  return (
    <div className="bg-black/30 rounded-xl p-6 shadow-xl border border-white/10 max-w-3xl mx-auto mb-8">
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
              className={`relative flex h-8 w-8 items-center justify-center rounded-full border ${
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
        <div className="min-h-[320px]">
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
          >
            {currentStep === totalSteps ? (
              isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Finding Areas
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
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
