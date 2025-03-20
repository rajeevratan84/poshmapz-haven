
import React from 'react';
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import AreaDetailCard from '@/components/AreaDetailCard';

interface AreaStats {
  crimeRate: string;
  transportScore: string;
  walkability: string;
  propertyGrowth: {
    flats: string;
    houses: string;
  };
  areaVibe: string[];
}

interface AreaMatch {
  name: string;
  matchPercentage: number;
  description: string;
  poshScore: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  amenities: string[];
  areaStats: AreaStats;
}

interface AreaResultsListProps {
  results: AreaMatch[];
  selectedArea: AreaMatch | null;
  onAreaClick: (area: AreaMatch) => void;
  isSearching: boolean;
  userInput: string;
  locationType?: 'london' | 'uk' | 'world';
  country?: string;
}

const AreaResultsList: React.FC<AreaResultsListProps> = ({ 
  results, 
  selectedArea, 
  onAreaClick, 
  isSearching,
  userInput,
  locationType = 'london',
  country
}) => {
  const locationName = locationType === 'london' 
    ? 'London' 
    : locationType === 'uk'
    ? 'the UK'
    : country || 'Global';
  
  return (
    <div className="mt-6">
      <h2 className="text-xl font-display font-semibold mb-4 text-white flex items-center gap-2">
        {results.length > 0 ? (
          <>
            <MapPin className="h-5 w-5 text-coral" />
            <span>Recommended Areas in {locationName}</span>
            <span className="text-sm bg-posh-green text-white px-2 py-0.5 rounded-full ml-2">
              {results.length} matches
            </span>
          </>
        ) : (
          !isSearching && `Enter your preferences to see ${locationName} matches`
        )}
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {results.map((area) => (
          <div 
            key={area.name}
            id={`area-${area.name.replace(/\s+/g, '-').toLowerCase()}`}
          >
            <AreaDetailCard 
              areaName={area.name}
              matchPercentage={area.matchPercentage}
              description={area.description}
              poshScore={area.poshScore}
              amenities={area.amenities}
              areaStats={area.areaStats}
              isSelected={selectedArea?.name === area.name}
              onClick={() => onAreaClick(area)}
            />
          </div>
        ))}
      </div>
      
      {results.length === 0 && !isSearching && userInput && (
        <div className="bg-white/10 rounded-lg p-6 text-center">
          <p className="text-white/80">No areas matching your criteria were found. Try broadening your search.</p>
        </div>
      )}
      
      {!results.length && !userInput && (
        <div className="bg-gradient-to-br from-black/40 to-black/20 rounded-lg p-8 text-center border border-white/10">
          <MapPin className="h-12 w-12 text-coral mx-auto mb-4 opacity-80" />
          <h3 className="text-xl font-display font-medium text-white mb-2">
            Discover Your Perfect {locationName} Area
          </h3>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Get detailed area insights including {locationType === 'london' ? 'transport links' : 'local amenities'}, 
            walkability scores, property growth forecasts, and more - tailored to your unique lifestyle preferences.
          </p>
          <Button
            onClick={() => {
              const inputEl = document.querySelector('input');
              if (inputEl) inputEl.focus();
            }}
            variant="glow"
            size="lg"
            className="mx-auto"
          >
            <Search className="h-4 w-4" />
            <span>Start Your Search</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default AreaResultsList;
