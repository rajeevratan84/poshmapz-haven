
import React from 'react';
import { MapPin, Shield, Train, Footprints, TrendingUp, Smile, ShoppingBag, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

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

  // Generate a more varied amenities score based on amenities length and area name
  const getHashValue = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  // Get a consistent variation based on area name
  const areaNameHash = getHashValue(areaName);
  const variationFactor = (areaNameHash % 30) - 15; // -15 to +15 variation
  
  // Calculate amenities score based on number of amenities with some randomness
  const baseScore = Math.min(Math.round((amenities.length / 5) * 70), 90);
  const amenitiesScore = Math.min(Math.max(baseScore + variationFactor, 35), 95);

  // Helper functions for styling and colors
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const getCrimeRateColor = (crimeRate: string) => {
    const lowerCrime = crimeRate.toLowerCase();
    if (lowerCrime.includes('above') || lowerCrime.includes('high')) return 'text-red-500 bg-red-500/10';
    if (lowerCrime.includes('below') || lowerCrime.includes('low')) return 'text-green-500 bg-green-500/10';
    return 'text-amber-500 bg-amber-500/10';
  };

  const getTransportColor = (transport: string) => {
    const lowerTransport = transport.toLowerCase();
    if (lowerTransport.includes('excellent')) return 'text-green-500 bg-green-500/10';
    if (lowerTransport.includes('good')) return 'text-blue-500 bg-blue-500/10';
    if (lowerTransport.includes('poor')) return 'text-red-500 bg-red-500/10';
    return 'text-amber-500 bg-amber-500/10';
  };

  const getWalkabilityColor = (walkability: string) => {
    const lowerWalk = walkability.toLowerCase();
    if (lowerWalk.includes('very walkable')) return 'text-green-500 bg-green-500/10';
    if (lowerWalk.includes('moderately')) return 'text-amber-500 bg-amber-500/10';
    if (lowerWalk.includes('not walkable')) return 'text-red-500 bg-red-500/10';
    return 'text-gray-500';
  };

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
    
    // Colors for immigrant communities
    if (vibeLower.includes('indian')) return 'bg-orange-600';
    if (vibeLower.includes('pakistani')) return 'bg-emerald-600';
    if (vibeLower.includes('polish')) return 'bg-red-600';
    if (vibeLower.includes('caribbean')) return 'bg-yellow-600';
    if (vibeLower.includes('turkish')) return 'bg-red-700';
    if (vibeLower.includes('chinese')) return 'bg-red-500';
    if (vibeLower.includes('jewish')) return 'bg-blue-800';
    
    return 'bg-gray-600';
  };

  // Generate pros and cons based on area stats and other data
  const generateProsAndCons = () => {
    const pros = [];
    const cons = [];

    // Generate pros based on high scores and positive factors
    if (poshScoreNumber >= 80) pros.push("High prestige area");
    if (areaStats.transportScore.toLowerCase().includes('excellent')) pros.push("Excellent transport links");
    if (areaStats.walkability.toLowerCase().includes('very walkable')) pros.push("Very walkable");
    if (areaStats.crimeRate.toLowerCase().includes('below')) pros.push("Low crime rate");
    if (amenitiesScore >= 75) pros.push("Great local amenities");
    if (areaStats.propertyGrowth.flats.includes('+') || areaStats.propertyGrowth.houses.includes('+')) {
      pros.push("Good investment potential");
    }

    // Generate cons based on low scores and negative factors
    if (poshScoreNumber < 70) cons.push("Less prestigious location");
    if (areaStats.transportScore.toLowerCase().includes('poor')) cons.push("Limited transport options");
    if (areaStats.walkability.toLowerCase().includes('not walkable')) cons.push("Car-dependent area");
    if (areaStats.crimeRate.toLowerCase().includes('above')) cons.push("Higher crime rate");
    if (amenitiesScore < 50) cons.push("Fewer local amenities");
    if (areaStats.propertyGrowth.flats.includes('-') || areaStats.propertyGrowth.houses.includes('-')) {
      cons.push("Possible property value decline");
    }

    // Ensure we have at least one pro and one con
    if (pros.length === 0) pros.push("Balanced location");
    if (cons.length === 0) cons.push("Higher property prices");

    // Limit to max 3 pros and 3 cons
    return {
      pros: pros.slice(0, 3),
      cons: cons.slice(0, 2)
    };
  };

  const { pros, cons } = generateProsAndCons();

  return (
    <Card 
      className={cn(
        "transition-all duration-200 cursor-pointer h-full",
        isSelected 
          ? "bg-gray-800 border border-posh-green shadow-[0_0_10px_rgba(34,197,94,0.3)]" 
          : "bg-gray-800 border border-gray-700 hover:border-gray-600"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2 space-y-1.5">
        <div className="flex justify-between items-center">
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
        <div className="flex items-center gap-1.5">
          <div className={cn("text-sm font-medium", getScoreColor(poshScoreNumber))}>
            PoshMap Index: {poshScoreNumber}%
          </div>
          <span className="text-sm text-white/60">- {poshScoreNumber >= 85 ? 'Excellent' : poshScoreNumber >= 70 ? 'Good' : 'Average'} area rating</span>
        </div>
        <p className="text-sm text-white/70 text-left border border-white/10 p-2 rounded-md bg-black/20">{description}</p>
        
        {/* Pros and Cons Section */}
        <div className="border border-white/10 p-2 rounded-md bg-black/20">
          <div className="mb-2">
            <div className="flex gap-1.5 items-center mb-1">
              <ThumbsUp className="h-3.5 w-3.5 text-green-500" />
              <span className="text-xs text-white/90 font-medium">Pros:</span>
            </div>
            <div className="flex flex-col gap-1 ml-6">
              {pros.map((pro, idx) => (
                <span key={`pro-${idx}`} className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full w-fit">
                  {pro}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex gap-1.5 items-center mb-1">
              <ThumbsDown className="h-3.5 w-3.5 text-red-500" />
              <span className="text-xs text-white/90 font-medium">Cons:</span>
            </div>
            <div className="flex flex-col gap-1 ml-6">
              {cons.map((con, idx) => (
                <span key={`con-${idx}`} className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full w-fit">
                  {con}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4 pt-0">
        {/* Stats Grid - Condensed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Crime Rate */}
          <div className="flex gap-2 border border-white/10 p-2 rounded-md bg-black/20">
            <Shield className="h-4 w-4 text-coral shrink-0 mt-0.5" />
            <div>
              <div className="text-white font-medium text-sm mb-0.5">Crime Rate</div>
              <div className={cn(
                "text-xs px-2 py-1 rounded-md font-medium",
                getCrimeRateColor(areaStats.crimeRate)
              )}>
                {areaStats.crimeRate}
              </div>
            </div>
          </div>
          
          {/* Transport Score */}
          <div className="flex gap-2 border border-white/10 p-2 rounded-md bg-black/20">
            <Train className="h-4 w-4 text-coral shrink-0 mt-0.5" />
            <div>
              <div className="text-white font-medium text-sm mb-0.5">Transport Score</div>
              <div className={cn(
                "text-xs px-2 py-1 rounded-md font-medium",
                getTransportColor(areaStats.transportScore)
              )}>
                {areaStats.transportScore}
              </div>
            </div>
          </div>
          
          {/* Walkability */}
          <div className="flex gap-2 border border-white/10 p-2 rounded-md bg-black/20">
            <Footprints className="h-4 w-4 text-coral shrink-0 mt-0.5" />
            <div>
              <div className="text-white font-medium text-sm mb-0.5">Walkability</div>
              <div className={cn(
                "text-xs px-2 py-1 rounded-md font-medium",
                getWalkabilityColor(areaStats.walkability)
              )}>
                {areaStats.walkability}
              </div>
            </div>
          </div>
          
          {/* Amenities Score */}
          <div className="flex gap-2 border border-white/10 p-2 rounded-md bg-black/20">
            <ShoppingBag className="h-4 w-4 text-coral shrink-0 mt-0.5" />
            <div className="w-full">
              <div className="text-white font-medium text-sm mb-0.5">Amenities Score</div>
              <div className={cn(
                "text-xs rounded-md font-medium",
                getAmenitiesScoreColor(amenitiesScore)
              )}>
                <div className="flex justify-between items-center mb-1">
                  <span>{amenitiesScore}/100</span>
                  {/* Removed text about number of amenities within 15 min walk */}
                </div>
                <Progress 
                  value={amenitiesScore} 
                  className="h-1.5 bg-white/10" 
                  indicatorClassName={cn(
                    amenitiesScore >= 80 ? "bg-green-500" : 
                    amenitiesScore >= 60 ? "bg-blue-500" : 
                    amenitiesScore >= 40 ? "bg-amber-500" : "bg-red-500"
                  )}
                />
              </div>
            </div>
          </div>
          
          {/* Future Property Growth */}
          <div className="flex gap-2 col-span-1 sm:col-span-2 border border-white/10 p-2 rounded-md bg-black/20">
            <TrendingUp className="h-4 w-4 text-coral shrink-0 mt-0.5" />
            <div className="w-full">
              <div className="text-white font-medium text-sm mb-0.5">Future Property Growth</div>
              <div className="flex justify-between gap-4">
                <div className={cn(
                  "text-xs px-2 py-1 rounded-md font-medium flex-1 flex justify-between",
                  getPropertyGrowthColor(areaStats.propertyGrowth.flats)
                )}>
                  <span>Flats:</span> 
                  <span>{formatPropertyGrowth(areaStats.propertyGrowth.flats)}</span>
                </div>
                <div className={cn(
                  "text-xs px-2 py-1 rounded-md font-medium flex-1 flex justify-between",
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
        <div className="flex flex-col gap-1 border border-white/10 p-2 rounded-md bg-black/20">
          <div className="flex gap-2">
            <Smile className="h-4 w-4 text-coral shrink-0 mt-0.5" />
            <div className="text-white font-medium text-sm">Area Vibe</div>
          </div>
          <div className="flex flex-wrap gap-1 ml-6">
            {areaStats.areaVibe.map((vibe, index) => (
              <span 
                key={index} 
                className={cn(
                  "text-xs text-white px-2 py-0.5 rounded-full",
                  getVibeTagColor(vibe)
                )}
              >
                {vibe}
              </span>
            ))}
          </div>
        </div>
        
        {/* Amenities */}
        <div className="pt-1 border border-white/10 p-2 rounded-md bg-black/20">
          <div className="text-xs text-white/90 font-medium mb-1.5">Matching Amenities</div>
          <div className="flex flex-wrap gap-1">
            {amenities.map((amenity, idx) => (
              <span key={idx} className="text-xs bg-black/30 border border-gray-700 px-1.5 py-0.5 rounded-full">
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
