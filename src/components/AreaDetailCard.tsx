
import React from 'react';
import { MapPin, Shield, Train, Footprints, TrendingUp, Smile, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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

interface AreaDetailCardProps {
  areaName: string;
  matchPercentage: number;
  description: string;
  poshScore: number | string;
  amenities: string[];
  areaStats: AreaStats;
  isSelected: boolean;
  onClick: () => void;
}

const AreaDetailCard: React.FC<AreaDetailCardProps> = ({
  areaName,
  matchPercentage,
  description,
  poshScore,
  amenities,
  areaStats,
  isSelected,
  onClick,
}) => {
  // Get the percentage number from the posh score
  const poshScoreNumber = typeof poshScore === 'number' 
    ? poshScore 
    : typeof poshScore === 'string' 
      ? parseInt(poshScore.toString().split('/')[0]) || 0
      : 0;

  // Calculate amenities score based on number of amenities
  const amenitiesScore = Math.min(Math.round((amenities.length / 7) * 100), 100);

  // Helper function to determine text color based on score value
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-gray-500';
  };

  // Get the crime rate color based on text content
  const getCrimeRateColor = (crimeRate: string) => {
    const lowerCrime = crimeRate.toLowerCase();
    if (lowerCrime.includes('above') || lowerCrime.includes('high')) return 'text-red-500 bg-red-500/10';
    if (lowerCrime.includes('below') || lowerCrime.includes('low')) return 'text-green-500 bg-green-500/10';
    return 'text-amber-500 bg-amber-500/10';
  };

  // Get the transport score color
  const getTransportColor = (transport: string) => {
    const lowerTransport = transport.toLowerCase();
    if (lowerTransport.includes('excellent')) return 'text-green-500 bg-green-500/10';
    if (lowerTransport.includes('good')) return 'text-blue-500 bg-blue-500/10';
    if (lowerTransport.includes('poor')) return 'text-red-500 bg-red-500/10';
    return 'text-amber-500 bg-amber-500/10';
  };

  // Get the walkability color
  const getWalkabilityColor = (walkability: string) => {
    const lowerWalk = walkability.toLowerCase();
    if (lowerWalk.includes('very walkable')) return 'text-green-500 bg-green-500/10';
    if (lowerWalk.includes('moderately')) return 'text-amber-500 bg-amber-500/10';
    if (lowerWalk.includes('not walkable')) return 'text-red-500 bg-red-500/10';
    return 'text-gray-500';
  };

  // Get property growth color
  const getPropertyGrowthColor = (growth: string) => {
    if (growth.includes('+')) {
      const percentage = parseFloat(growth.match(/\+(\d+\.?\d*)%/)?.[1] || "0");
      if (percentage >= 3) return 'text-green-600 bg-green-500/10';
      if (percentage >= 1) return 'text-blue-600 bg-blue-500/10';
      return 'text-amber-500 bg-amber-500/10';
    } else if (growth.includes('-')) {
      return 'text-red-500 bg-red-500/10';
    }
    return 'text-gray-500';
  };
  
  // Format property growth to be less wordy
  const formatPropertyGrowth = (growth: string) => {
    const match = growth.match(/([+-]\d+\.?\d*)%/);
    return match ? match[0] : growth;
  };

  // Get amenities score color
  const getAmenitiesScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500 bg-green-500/10';
    if (score >= 60) return 'text-blue-500 bg-blue-500/10';
    if (score >= 40) return 'text-amber-500 bg-amber-500/10';
    return 'text-red-500 bg-red-500/10';
  };

  // Get the vibe tag color
  const getVibeTagColor = (vibe: string) => {
    const vibeLower = vibe.toLowerCase();
    if (vibeLower.includes('family')) return 'bg-green-600';
    if (vibeLower.includes('upscale') || vibeLower.includes('luxury')) return 'bg-blue-600';
    if (vibeLower.includes('river') || vibeLower.includes('water')) return 'bg-purple-600';
    if (vibeLower.includes('trendy') || vibeLower.includes('hip')) return 'bg-pink-600';
    if (vibeLower.includes('historic') || vibeLower.includes('heritage')) return 'bg-amber-600';
    if (vibeLower.includes('creative') || vibeLower.includes('artsy')) return 'bg-indigo-600';
    return 'bg-gray-600';
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-200 cursor-pointer h-full",
        isSelected 
          ? "bg-black border border-posh-green shadow-[0_0_10px_rgba(34,197,94,0.3)]" 
          : "bg-black/80 border border-gray-800 hover:border-gray-700"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-coral" />
            <h3 className="font-semibold text-white text-lg">{areaName}</h3>
          </div>
          <div className={cn(
            "text-xs px-2 py-1 rounded-full font-medium",
            matchPercentage > 90 ? "bg-green-600 text-white" :
            matchPercentage > 80 ? "bg-green-500 text-white" :
            "bg-green-400 text-white"
          )}>
            {matchPercentage}% Match
          </div>
        </div>
        <div className="flex items-center gap-1.5 mb-2">
          <div className={cn("text-sm font-medium", getScoreColor(poshScoreNumber))}>
            PoshMap Index: {poshScoreNumber}%
          </div>
          <span className="text-sm text-white/60">- {poshScoreNumber >= 85 ? 'Excellent' : poshScoreNumber >= 70 ? 'Good' : 'Average'} area rating</span>
        </div>
        <p className="text-sm text-white/70 mb-5">{description}</p>
      </CardHeader>

      <CardContent className="space-y-4 pb-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Crime Rate */}
          <div className="flex gap-3">
            <Shield className="h-5 w-5 text-coral shrink-0 mt-0.5" />
            <div>
              <div className="text-white font-medium mb-0.5">Crime Rate</div>
              <div className={cn(
                "text-sm px-2 py-1 rounded-md font-medium",
                getCrimeRateColor(areaStats.crimeRate)
              )}>
                {areaStats.crimeRate}
              </div>
            </div>
          </div>
          
          {/* Transport Score */}
          <div className="flex gap-3">
            <Train className="h-5 w-5 text-coral shrink-0 mt-0.5" />
            <div>
              <div className="text-white font-medium mb-0.5">Transport Score</div>
              <div className={cn(
                "text-sm px-2 py-1 rounded-md font-medium",
                getTransportColor(areaStats.transportScore)
              )}>
                {areaStats.transportScore}
              </div>
            </div>
          </div>
          
          {/* Walkability */}
          <div className="flex gap-3">
            <Footprints className="h-5 w-5 text-coral shrink-0 mt-0.5" />
            <div>
              <div className="text-white font-medium mb-0.5">Walkability</div>
              <div className={cn(
                "text-sm px-2 py-1 rounded-md font-medium",
                getWalkabilityColor(areaStats.walkability)
              )}>
                {areaStats.walkability}
              </div>
            </div>
          </div>
          
          {/* Amenities Score - NEW */}
          <div className="flex gap-3">
            <ShoppingBag className="h-5 w-5 text-coral shrink-0 mt-0.5" />
            <div>
              <div className="text-white font-medium mb-0.5">Amenities Score</div>
              <div className={cn(
                "text-sm px-2 py-1 rounded-md font-medium",
                getAmenitiesScoreColor(amenitiesScore)
              )}>
                {amenitiesScore}/100 - {amenities.length} essentials nearby
              </div>
            </div>
          </div>
          
          {/* Future Property Growth */}
          <div className="flex gap-3 col-span-1 sm:col-span-2">
            <TrendingUp className="h-5 w-5 text-coral shrink-0 mt-0.5" />
            <div className="w-full">
              <div className="text-white font-medium mb-0.5">Future Property Growth</div>
              <div className="flex justify-between gap-4">
                <div className={cn(
                  "text-sm px-2 py-1 rounded-md font-medium flex-1 flex justify-between",
                  getPropertyGrowthColor(areaStats.propertyGrowth.flats)
                )}>
                  <span>Flats:</span> 
                  <span>{formatPropertyGrowth(areaStats.propertyGrowth.flats)}</span>
                </div>
                <div className={cn(
                  "text-sm px-2 py-1 rounded-md font-medium flex-1 flex justify-between",
                  getPropertyGrowthColor(areaStats.propertyGrowth.houses)
                )}>
                  <span>Houses:</span> 
                  <span>{formatPropertyGrowth(areaStats.propertyGrowth.houses)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Area Vibe */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-3">
            <Smile className="h-5 w-5 text-coral shrink-0 mt-0.5" />
            <div className="text-white font-medium">Area Vibe</div>
          </div>
          <div className="flex flex-wrap gap-2 ml-8">
            {areaStats.areaVibe.map((vibe, index) => (
              <span 
                key={index} 
                className={cn(
                  "text-xs text-white px-3 py-1 rounded-full",
                  getVibeTagColor(vibe)
                )}
              >
                {vibe}
              </span>
            ))}
          </div>
        </div>
        
        {/* Amenities */}
        <div className="pt-2">
          <div className="text-sm text-white/90 font-medium mb-2">Matching Amenities</div>
          <div className="flex flex-wrap gap-1.5">
            {amenities.map((amenity, idx) => (
              <span key={idx} className="text-xs bg-black/30 border border-gray-700 px-2 py-1 rounded-full">
                {amenity}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AreaDetailCard;
