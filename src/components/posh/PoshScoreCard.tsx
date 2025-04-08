
import React from 'react';
import { MapPin, Banknote, Shield, Train, Trees, Coffee, Footprints, TrendingUp, ThumbsUp, ThumbsDown, Smile, History, Home, Building, Users, HomeIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/context/ThemeContext';
import PoshScoreChart from './PoshScoreChart';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';
import { AreaMatch, AreaData, AreaStats } from '@/types/area';

interface ScoreBreakdown {
  property: number;
  safety: number;
  transport: number;
  lifestyle: number;
  environment: number;
}

interface PoshScoreCardProps {
  areaData: AreaMatch | AreaData;
}

const PoshScoreCard: React.FC<PoshScoreCardProps> = ({ areaData }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Type guard function to check if we have an AreaMatch
  const isAreaMatch = (area: AreaMatch | AreaData): area is AreaMatch => {
    return 'matchPercentage' in area && 'areaStats' in area;
  };

  const scoreBreakdown: ScoreBreakdown = 'scoreBreakdown' in areaData 
    ? areaData.scoreBreakdown
    : {
        property: areaData.poshScore * 0.8,
        safety: areaData.poshScore * 0.9,
        transport: areaData.poshScore * 0.7,
        lifestyle: areaData.poshScore * 0.85,
        environment: areaData.poshScore * 0.75
      };

  const getAmenityDensity = (): number => {
    if ('amenityDensity' in areaData) return areaData.amenityDensity;
    if (areaData.amenities) return Math.min(areaData.amenities.length * 10, 90);
    return 70;
  };

  const getCrimeIndex = (): number => {
    if ('crimeIndex' in areaData) return areaData.crimeIndex;
    
    if (isAreaMatch(areaData) && areaData.areaStats) {
      const crimeRateDesc = areaData.areaStats.crimeRate.toLowerCase();
      if (crimeRateDesc.includes('low')) return 30;
      if (crimeRateDesc.includes('medium')) return 50;
      if (crimeRateDesc.includes('high')) return 75;
    }
    return 45;
  };

  const getTransportScore = (): number => {
    if ('transportScore' in areaData && typeof areaData.transportScore === 'number') return areaData.transportScore;
    
    if (isAreaMatch(areaData) && areaData.areaStats) {
      const transportDesc = areaData.areaStats.transportScore.toLowerCase();
      if (transportDesc.includes('excellent')) return 85;
      if (transportDesc.includes('good')) return 70;
      if (transportDesc.includes('poor')) return 40;
    }
    return 65;
  };

  const getWalkabilityScore = (): number => {
    if ('walkability' in areaData && typeof areaData.walkability === 'number') return areaData.walkability;
    
    if (isAreaMatch(areaData) && areaData.areaStats) {
      const walkDesc = areaData.areaStats.walkability;
      const match = walkDesc.match(/(\d+)\/100/);
      if (match && match[1]) return parseInt(match[1], 10);
      
      if (walkDesc.toLowerCase().includes('very')) return 85;
      if (walkDesc.toLowerCase().includes('moderately')) return 65;
    }
    return 50;
  };

  const getGreenSpaceAccess = (): number => {
    if ('greenSpaceAccess' in areaData) return areaData.greenSpaceAccess;
    
    const hasGreenSpace = areaData.amenities?.some(a => 
      a.toLowerCase().includes('park') || 
      a.toLowerCase().includes('green') || 
      a.toLowerCase().includes('garden') ||
      a.toLowerCase().includes('heath')
    );
    
    return hasGreenSpace ? 75 : 50;
  };

  const getPriceGrowth = (): number => {
    if ('priceGrowth' in areaData) return areaData.priceGrowth;
    
    if (isAreaMatch(areaData) && areaData.areaStats?.propertyGrowth) {
      const houseGrowth = areaData.areaStats.propertyGrowth.houses;
      if (houseGrowth) {
        const match = houseGrowth.match(/([+-]?\d+(?:\.\d+)?)/);
        if (match && match[1]) return parseFloat(match[1]);
      }
    }
    
    return 3.0;
  };

  const getAreaStats = (): {
    crimeRateDescription?: string;
    transportDescription?: string;
    walkabilityDescription?: string;
    propertyGrowthDetails?: { flats: string; houses: string };
    areaVibe?: string[];
  } => {
    if (isAreaMatch(areaData)) {
      return {
        crimeRateDescription: areaData.areaStats?.crimeRate,
        transportDescription: areaData.areaStats?.transportScore,
        walkabilityDescription: areaData.areaStats?.walkability,
        propertyGrowthDetails: areaData.areaStats?.propertyGrowth,
        areaVibe: areaData.areaStats?.areaVibe
      };
    }
    
    return {
      crimeRateDescription: areaData.crimeRateDescription,
      transportDescription: areaData.transportDescription,
      walkabilityDescription: areaData.walkabilityDescription,
      propertyGrowthDetails: areaData.propertyGrowthDetails,
      areaVibe: areaData.areaVibe
    };
  };

  const processedAreaData = {
    ...areaData,
    scoreBreakdown,
    amenityDensity: getAmenityDensity(),
    crimeIndex: getCrimeIndex(),
    transportScore: getTransportScore(),
    walkability: getWalkabilityScore(),
    greenSpaceAccess: getGreenSpaceAccess(),
    priceGrowth: getPriceGrowth(),
    averagePrice: 'averagePrice' in areaData ? areaData.averagePrice : 
      (areaData.propertyPrices ? 
        Math.round((areaData.propertyPrices.flatTwoBed + areaData.propertyPrices.houseThreeBed) / 2) : 
        750000),
    ...getAreaStats()
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Premium';
    if (score >= 70) return 'Very Good';
    if (score >= 60) return 'Good';
    if (score >= 50) return 'Average';
    if (score >= 40) return 'Below Average';
    return 'Needs Improvement';
  };

  const getGentrificationLabel = (score?: number) => {
    if (!score) return 'Not Available';
    if (score >= 90) return 'Fully Gentrified';
    if (score >= 70) return 'Highly Gentrified';
    if (score >= 50) return 'Ongoing Gentrification';
    if (score >= 30) return 'Early Signs';
    return 'Minimal Gentrification';
  };

  const getVibeTagColor = (vibe: string) => {
    const vibeLower = vibe.toLowerCase();
    if (vibeLower.includes('historic')) return 'bg-amber-600';
    if (vibeLower.includes('affluent')) return 'bg-blue-600';
    if (vibeLower.includes('leafy')) return 'bg-green-600';
    if (vibeLower.includes('family')) return 'bg-green-700';
    if (vibeLower.includes('hipster')) return 'bg-purple-600';
    if (vibeLower.includes('trendy')) return 'bg-pink-600';
    if (vibeLower.includes('diverse')) return 'bg-indigo-600';
    if (vibeLower.includes('creative') || vibeLower.includes('artsy')) return 'bg-indigo-600';
    return 'bg-gray-600';
  };

  const getCrimeRateColor = (description?: string) => {
    if (!description) return 'bg-gray-600';
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('low') || lowerDesc.includes('below')) return 'bg-green-600';
    if (lowerDesc.includes('average')) return 'bg-amber-600';
    return 'bg-red-600';
  };

  const getTransportColor = (description?: string) => {
    if (!description) return 'bg-gray-600';
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('excellent')) return 'bg-green-600';
    if (lowerDesc.includes('good')) return 'bg-blue-600';
    return 'bg-amber-600';
  };

  const getWalkabilityColor = (description?: string) => {
    if (!description) return 'bg-gray-600';
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('very')) return 'bg-green-600';
    if (lowerDesc.includes('moderately')) return 'bg-blue-600';
    return 'bg-amber-600';
  };

  const getPropertyGrowthColor = (growth: string) => {
    if (growth.includes('+')) {
      const percentage = parseFloat(growth.match(/\+(\d+\.?\d*)%/)?.[1] || "0");
      if (percentage >= 3) return 'bg-green-600';
      if (percentage > 0) return 'bg-blue-600';
    }
    return 'bg-red-600';
  };

  const formatPropertyGrowth = (growth: number) => {
    return `${growth > 0 ? '+' : ''}${growth}%`;
  };

  const hasRichData = !!processedAreaData.description;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold">{processedAreaData.name}</h2>
        </div>
      </div>
      
      <Card className="shadow-md bg-gray-800 border border-gray-700 mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="flex flex-col items-center bg-gray-900 p-6 rounded-lg border border-gray-700 w-full md:w-auto">
              <h3 className="text-xl font-medium text-white mb-2">PoshScore™</h3>
              <div className="text-6xl font-bold text-primary mb-2">{processedAreaData.poshScore}%</div>
              <div className="text-xl font-medium text-white">{getScoreLabel(processedAreaData.poshScore)}</div>
              {processedAreaData.matchPercentage && (
                <div className="mt-2 text-sm text-white/60">
                  {processedAreaData.matchPercentage}% Match to Your Preferences
                </div>
              )}
            </div>
            
            <div className="w-full md:w-2/3 lg:w-3/4">
              <h3 className="text-xl font-medium text-white mb-4 text-center">PoshScore™ Breakdown</h3>
              <PoshScoreChart scoreBreakdown={processedAreaData.scoreBreakdown} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Area Description Card */}
      <Card className="shadow-md bg-gray-800 border border-gray-700 mb-6">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl text-white">Area Overview</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-5 pt-4">
          {/* General Description */}
          <div className="border border-white/10 p-4 rounded-md bg-black/20">
            <h4 className="text-lg font-medium text-white mb-2 flex items-center">
              <MapPin className="h-4 w-4 text-coral mr-2" />
              About {processedAreaData.name}
            </h4>
            <p className="text-sm text-white/80">{processedAreaData.description}</p>
          </div>
          
          {/* What it's like to live here */}
          <div className="border border-white/10 p-4 rounded-md bg-black/20">
            <h4 className="text-lg font-medium text-white mb-2 flex items-center">
              <HomeIcon className="h-4 w-4 text-coral mr-2" />
              What It's Like To Live Here
            </h4>
            <p className="text-sm text-white/80">
              {processedAreaData.livingDescription || 
              processedAreaData.history || 
              `${processedAreaData.name} offers ${processedAreaData.propertyGrowthDetails?.houses.includes('+') ? 'growing' : 'stable'} property values with ${processedAreaData.transportDescription?.toLowerCase() || 'good transport links'} and ${processedAreaData.walkabilityDescription?.toLowerCase() || 'moderate walkability'}. ${processedAreaData.areaStats?.areaVibe?.join(' and ') ? `The area has a ${processedAreaData.areaStats?.areaVibe?.join(' and ').toLowerCase()} feel.` : ''} ${processedAreaData.attractions || ''}`}
            </p>
          </div>
          
          {/* Who lives here */}
          <div className="border border-white/10 p-4 rounded-md bg-black/20">
            <h4 className="text-lg font-medium text-white mb-2 flex items-center">
              <Users className="h-4 w-4 text-coral mr-2" />
              Who Lives Here
            </h4>
            <p className="text-sm text-white/80">
              {processedAreaData.demographics || 
              `${processedAreaData.name} is home to a ${processedAreaData.areaStats?.areaVibe?.some(v => v.toLowerCase().includes('diverse')) ? 'diverse' : 'mixed'} community, with ${processedAreaData.propertyPrices?.flatTwoBed && processedAreaData.propertyPrices.flatTwoBed > 600000 ? 'affluent' : processedAreaData.propertyPrices?.flatTwoBed && processedAreaData.propertyPrices.flatTwoBed > 400000 ? 'middle-class' : 'working and middle-class'} residents including ${processedAreaData.areaStats?.areaVibe?.some(v => v.toLowerCase().includes('family')) ? 'many families' : 'young professionals, couples, and some families'}.`}
            </p>
          </div>
          
          {/* Postcode Specifics - if available */}
          {processedAreaData.postcodeSpecifics && (
            <div className="border border-white/10 p-4 rounded-md bg-black/20">
              <h4 className="text-lg font-medium text-white mb-2 flex items-center">
                <MapPin className="h-4 w-4 text-coral mr-2" />
                Postcode Specifics
              </h4>
              <p className="text-sm text-white/80">
                {processedAreaData.postcodeSpecifics}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Property Prices Card */}
      {processedAreaData.propertyPrices && (
        <Card className="shadow-md bg-gray-800 border border-gray-700 mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-white flex items-center">
              <Banknote className="h-5 w-5 text-coral mr-2" />
              Property Prices
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-black/20 p-4 rounded-md border border-white/10">
              <Building className="h-7 w-7 text-blue-400" />
              <div className="flex-1">
                <div className="text-sm text-white/70">2-Bed Flat</div>
                <div className="text-xl font-semibold text-white">{formatCurrency(processedAreaData.propertyPrices.flatTwoBed)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-black/20 p-4 rounded-md border border-white/10">
              <Home className="h-7 w-7 text-green-400" />
              <div className="flex-1">
                <div className="text-sm text-white/70">3-Bed House</div>
                <div className="text-xl font-semibold text-white">{formatCurrency(processedAreaData.propertyPrices.houseThreeBed)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Key Stats */}
      <Card className="shadow-md bg-gray-800 border border-gray-700 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-white">Key Area Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Crime Rate */}
          <div className="bg-black/20 p-4 rounded-md border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <Shield className="h-5 w-5 text-coral" />
                <h4 className="text-white font-medium">Crime Rate</h4>
              </div>
              {processedAreaData.crimeRateDescription && (
                <span className={cn("text-sm text-white px-2 py-1 rounded-md", getCrimeRateColor(processedAreaData.crimeRateDescription))}>
                  {processedAreaData.crimeRateDescription}
                </span>
              )}
            </div>
          </div>
          
          {/* Transport Score */}
          <div className="bg-black/20 p-4 rounded-md border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <Train className="h-5 w-5 text-coral" />
                <h4 className="text-white font-medium">Transport</h4>
              </div>
              {processedAreaData.transportDescription && (
                <span className={cn("text-sm text-white px-2 py-1 rounded-md", getTransportColor(processedAreaData.transportDescription))}>
                  {processedAreaData.transportDescription}
                </span>
              )}
            </div>
          </div>
          
          {/* Walkability */}
          <div className="bg-black/20 p-4 rounded-md border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <Footprints className="h-5 w-5 text-coral" />
                <h4 className="text-white font-medium">Walkability</h4>
              </div>
              {processedAreaData.walkabilityDescription && (
                <span className={cn("text-sm text-white px-2 py-1 rounded-md", getWalkabilityColor(processedAreaData.walkabilityDescription))}>
                  {processedAreaData.walkabilityDescription}
                </span>
              )}
            </div>
          </div>
          
          {/* Amenities Score */}
          <div className="bg-black/20 p-4 rounded-md border border-white/10">
            <div className="flex gap-2 items-center mb-2">
              <Coffee className="h-5 w-5 text-coral" />
              <h4 className="text-white font-medium">Amenities</h4>
            </div>
            <div className="w-full">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/80">{processedAreaData.amenityDensity}/100</span>
              </div>
              <Progress 
                value={processedAreaData.amenityDensity} 
                className="h-2 bg-white/10" 
                indicatorClassName={processedAreaData.amenityDensity >= 70 ? "bg-green-600" : processedAreaData.amenityDensity >= 50 ? "bg-amber-600" : "bg-red-600"}
              />
            </div>
          </div>
          
          {/* Future Property Growth */}
          <div className="bg-black/20 p-4 rounded-md border border-white/10 col-span-1 md:col-span-2">
            <div className="flex gap-2 items-center mb-2">
              <TrendingUp className="h-5 w-5 text-coral" />
              <h4 className="text-white font-medium">Future Property Growth</h4>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              {processedAreaData.propertyGrowthDetails && (
                <>
                  <div className={cn("text-sm text-white px-3 py-2 rounded-md flex items-center justify-between flex-1", getPropertyGrowthColor(processedAreaData.propertyGrowthDetails.flats))}>
                    <span>Flats:</span>
                    <span className="font-medium">{processedAreaData.propertyGrowthDetails.flats}</span>
                  </div>
                  <div className={cn("text-sm text-white px-3 py-2 rounded-md flex items-center justify-between flex-1", getPropertyGrowthColor(processedAreaData.propertyGrowthDetails.houses))}>
                    <span>Houses:</span>
                    <span className="font-medium">{processedAreaData.propertyGrowthDetails.houses}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Pros and Cons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-md bg-gray-800 border border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-white flex items-center">
              <ThumbsUp className="h-5 w-5 text-green-500 mr-2" />
              Pros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {processedAreaData.pros?.map((pro, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-green-900/30 border border-green-800/30 p-2 rounded-md">
                  <ThumbsUp className="h-4 w-4 text-green-500 shrink-0" />
                  <span className="text-sm text-white">{pro}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md bg-gray-800 border border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-white flex items-center">
              <ThumbsDown className="h-5 w-5 text-red-500 mr-2" />
              Cons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {processedAreaData.cons?.map((con, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-red-900/30 border border-red-800/30 p-2 rounded-md">
                  <ThumbsDown className="h-4 w-4 text-red-500 shrink-0" />
                  <span className="text-sm text-white">{con}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Area Vibe and Amenities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Area Vibe */}
        {(processedAreaData.areaVibe || processedAreaData.areaStats?.areaVibe) && (
          <Card className="shadow-md bg-gray-800 border border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-white flex items-center">
                <Smile className="h-5 w-5 text-coral mr-2" />
                Area Vibe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(processedAreaData.areaVibe || processedAreaData.areaStats?.areaVibe)?.map((vibe, idx) => (
                  <span key={idx} className={cn("text-sm text-white px-3 py-2 rounded-full", getVibeTagColor(vibe))}>
                    {vibe}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Amenities */}
        {processedAreaData.matchingAmenities && processedAreaData.matchingAmenities.length > 0 && (
          <Card className="shadow-md bg-gray-800 border border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-white flex items-center">
                <Coffee className="h-5 w-5 text-coral mr-2" />
                Local Amenities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {processedAreaData.matchingAmenities.map((amenity, idx) => (
                  <span key={idx} className="text-sm bg-gray-700 text-white px-3 py-2 rounded-full">
                    {amenity}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Gentrification Index if available */}
      {processedAreaData.gentrificationIndex !== undefined && (
        <Card className="shadow-md bg-gray-800 border border-gray-700 mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-white flex items-center">
              <History className="h-5 w-5 text-coral mr-2" />
              Gentrification Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white/80">
                  {processedAreaData.gentrificationIndex}/100 - {getGentrificationLabel(processedAreaData.gentrificationIndex)}
                </span>
              </div>
              <Progress 
                value={processedAreaData.gentrificationIndex} 
                className="h-3 bg-white/10" 
                indicatorClassName={processedAreaData.gentrificationIndex >= 70 ? "bg-blue-600" : processedAreaData.gentrificationIndex >= 40 ? "bg-purple-600" : "bg-indigo-600"}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PoshScoreCard;
