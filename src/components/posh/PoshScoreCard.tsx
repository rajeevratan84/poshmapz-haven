
import React from 'react';
import { MapPin, Banknote, Shield, Train, Trees, Coffee, Footprints, TrendingUp, ThumbsUp, ThumbsDown, Smile, History, Home, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/context/ThemeContext';
import PoshScoreChart from './PoshScoreChart';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';

interface ScoreBreakdown {
  property: number;
  safety: number;
  transport: number;
  lifestyle: number;
  environment: number;
}

interface PropertyPrices {
  flatTwoBed: number;
  houseThreeBed: number;
}

interface AreaData {
  name: string;
  poshScore: number;
  averagePrice: number;
  propertyPrices?: PropertyPrices;
  crimeIndex: number;
  transportScore: number;
  greenSpaceAccess: number;
  amenityDensity: number;
  walkability: number;
  priceGrowth: number;
  scoreBreakdown: ScoreBreakdown;
  // New fields for enhanced data
  areaType?: string;
  description?: string;
  history?: string;
  demographics?: string;
  attractions?: string;
  recentTrends?: string;
  gentrificationIndex?: number;
  matchPercentage?: number;
  pros?: string[];
  cons?: string[];
  areaVibe?: string[];
  crimeRateDescription?: string;
  transportDescription?: string;
  walkabilityDescription?: string;
  propertyGrowthDetails?: {
    flats: string;
    houses: string;
  };
  matchingAmenities?: string[];
}

interface PoshScoreCardProps {
  areaData: AreaData;
}

const PoshScoreCard: React.FC<PoshScoreCardProps> = ({ areaData }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
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
  
  // Function to get appropriate color for crime rate
  const getCrimeRateColor = (description?: string) => {
    if (!description) return 'bg-gray-600';
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('low') || lowerDesc.includes('below')) return 'bg-green-600';
    if (lowerDesc.includes('average')) return 'bg-amber-600';
    return 'bg-red-600';
  };
  
  // Function to get appropriate color for transport score
  const getTransportColor = (description?: string) => {
    if (!description) return 'bg-gray-600';
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('excellent')) return 'bg-green-600';
    if (lowerDesc.includes('good')) return 'bg-blue-600';
    return 'bg-amber-600';
  };
  
  // Function to get appropriate color for walkability
  const getWalkabilityColor = (description?: string) => {
    if (!description) return 'bg-gray-600';
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('very')) return 'bg-green-600';
    if (lowerDesc.includes('moderately')) return 'bg-blue-600';
    return 'bg-amber-600';
  };
  
  // Function to get color for property growth
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
  
  // If we have rich data with description, show the enhanced card
  const hasRichData = !!areaData.description;
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold">{areaData.name}</h2>
        </div>
      </div>
      
      {hasRichData ? (
        // Enhanced card with rich data
        <div className="grid grid-cols-1 gap-6">
          <Card className="shadow-md bg-gray-800 border border-gray-700">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-coral" />
                  <h3 className="text-xl font-bold text-white">{areaData.name}</h3>
                </div>
                {areaData.matchPercentage && (
                  <div className="bg-green-600 text-white text-sm px-3 py-1 rounded-full font-medium">
                    {areaData.matchPercentage}% Match
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <div className={cn("text-sm font-medium", getScoreColor(areaData.poshScore))}>
                  PoshMap Index: {areaData.poshScore}%
                </div>
                <span className="text-sm text-white/60">- {getScoreLabel(areaData.poshScore)} area rating</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4 pt-2">
              {/* Area Description */}
              <div className="border border-white/10 p-3 rounded-md bg-black/20">
                <p className="text-sm text-white/80">{areaData.description}</p>
              </div>
              
              {/* Property Prices Section */}
              {areaData.propertyPrices && (
                <div className="border border-white/10 p-3 rounded-md bg-black/20">
                  <div className="flex gap-2 items-center mb-3">
                    <Banknote className="h-4 w-4 text-coral" />
                    <h4 className="text-white font-medium">Property Prices</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 bg-black/30 p-2 rounded-md">
                      <Building className="h-4 w-4 text-blue-400" />
                      <div className="flex-1">
                        <div className="text-xs text-white/70">2-Bed Flat</div>
                        <div className="text-sm font-semibold text-white">{formatCurrency(areaData.propertyPrices.flatTwoBed)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-black/30 p-2 rounded-md">
                      <Home className="h-4 w-4 text-green-400" />
                      <div className="flex-1">
                        <div className="text-xs text-white/70">3-Bed House</div>
                        <div className="text-sm font-semibold text-white">{formatCurrency(areaData.propertyPrices.houseThreeBed)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Pros and Cons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Pros */}
                <div className="border border-white/10 p-3 rounded-md bg-black/20">
                  <div className="flex gap-2 items-center mb-2">
                    <ThumbsUp className="h-4 w-4 text-green-500" />
                    <h4 className="text-white font-medium">Pros:</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {areaData.pros?.map((pro, idx) => (
                      <span key={idx} className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                        {pro}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Cons */}
                <div className="border border-white/10 p-3 rounded-md bg-black/20">
                  <div className="flex gap-2 items-center mb-2">
                    <ThumbsDown className="h-4 w-4 text-red-500" />
                    <h4 className="text-white font-medium">Cons:</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {areaData.cons?.map((con, idx) => (
                      <span key={idx} className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">
                        {con}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Crime Rate */}
                <div className="border border-white/10 p-3 rounded-md bg-black/20">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <Shield className="h-4 w-4 text-coral" />
                      <h4 className="text-white font-medium">Crime Rate</h4>
                    </div>
                    {areaData.crimeRateDescription && (
                      <span className={cn("text-xs text-white px-2 py-1 rounded-md", getCrimeRateColor(areaData.crimeRateDescription))}>
                        {areaData.crimeRateDescription}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Transport Score */}
                <div className="border border-white/10 p-3 rounded-md bg-black/20">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <Train className="h-4 w-4 text-coral" />
                      <h4 className="text-white font-medium">Transport Score</h4>
                    </div>
                    {areaData.transportDescription && (
                      <span className={cn("text-xs text-white px-2 py-1 rounded-md", getTransportColor(areaData.transportDescription))}>
                        {areaData.transportDescription}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Walkability */}
                <div className="border border-white/10 p-3 rounded-md bg-black/20">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <Footprints className="h-4 w-4 text-coral" />
                      <h4 className="text-white font-medium">Walkability</h4>
                    </div>
                    {areaData.walkabilityDescription && (
                      <span className={cn("text-xs text-white px-2 py-1 rounded-md", getWalkabilityColor(areaData.walkabilityDescription))}>
                        {areaData.walkabilityDescription}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Amenities Score */}
                <div className="border border-white/10 p-3 rounded-md bg-black/20">
                  <div className="flex gap-2 items-center mb-2">
                    <Coffee className="h-4 w-4 text-coral" />
                    <h4 className="text-white font-medium">Amenities Score</h4>
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/80">{areaData.amenityDensity}/100</span>
                    </div>
                    <Progress 
                      value={areaData.amenityDensity} 
                      className="h-2 bg-white/10" 
                      indicatorClassName={areaData.amenityDensity >= 70 ? "bg-green-600" : areaData.amenityDensity >= 50 ? "bg-amber-600" : "bg-red-600"}
                    />
                  </div>
                </div>
              </div>
              
              {/* Future Property Growth */}
              <div className="border border-white/10 p-3 rounded-md bg-black/20">
                <div className="flex gap-2 items-center mb-2">
                  <TrendingUp className="h-4 w-4 text-coral" />
                  <h4 className="text-white font-medium">Future Property Growth</h4>
                </div>
                
                <div className="flex justify-between gap-4">
                  {areaData.propertyGrowthDetails && (
                    <>
                      <div className={cn("text-xs text-white px-2 py-1 rounded-md flex items-center justify-between flex-1", getPropertyGrowthColor(areaData.propertyGrowthDetails.flats))}>
                        <span>Flats:</span>
                        <span>{areaData.propertyGrowthDetails.flats}</span>
                      </div>
                      <div className={cn("text-xs text-white px-2 py-1 rounded-md flex items-center justify-between flex-1", getPropertyGrowthColor(areaData.propertyGrowthDetails.houses))}>
                        <span>Houses:</span>
                        <span>{areaData.propertyGrowthDetails.houses}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Area Vibe */}
              {areaData.areaVibe && areaData.areaVibe.length > 0 && (
                <div className="border border-white/10 p-3 rounded-md bg-black/20">
                  <div className="flex gap-2 items-center mb-2">
                    <Smile className="h-4 w-4 text-coral" />
                    <h4 className="text-white font-medium">Area Vibe</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {areaData.areaVibe.map((vibe, idx) => (
                      <span key={idx} className={cn("text-xs text-white px-2 py-1 rounded-full", getVibeTagColor(vibe))}>
                        {vibe}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Gentrification Index */}
              {areaData.gentrificationIndex !== undefined && (
                <div className="border border-white/10 p-3 rounded-md bg-black/20">
                  <div className="flex gap-2 items-center mb-2">
                    <History className="h-4 w-4 text-coral" />
                    <h4 className="text-white font-medium">Gentrification Index</h4>
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/80">{areaData.gentrificationIndex}/100 - {getGentrificationLabel(areaData.gentrificationIndex)}</span>
                    </div>
                    <Progress 
                      value={areaData.gentrificationIndex} 
                      className="h-2 bg-white/10 mt-1" 
                      indicatorClassName={areaData.gentrificationIndex >= 70 ? "bg-blue-600" : areaData.gentrificationIndex >= 40 ? "bg-purple-600" : "bg-indigo-600"}
                    />
                  </div>
                </div>
              )}
              
              {/* Matching Amenities */}
              {areaData.matchingAmenities && areaData.matchingAmenities.length > 0 && (
                <div className="border border-white/10 p-3 rounded-md bg-black/20">
                  <h4 className="text-white font-medium mb-2">Matching Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {areaData.matchingAmenities.map((amenity, idx) => (
                      <span key={idx} className="text-xs bg-gray-700 text-white px-2 py-1 rounded-full">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* PoshScore Chart */}
              <div className="border border-white/10 p-3 rounded-md bg-black/20">
                <h4 className="text-white font-medium mb-2">PoshScore™ Breakdown</h4>
                <div className="w-4/5 mx-auto">
                  <PoshScoreChart scoreBreakdown={areaData.scoreBreakdown} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Original simple card layout for basic data
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">PoshScore™</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="text-5xl font-bold mb-2 mt-2">
                  <span className={getScoreColor(areaData.poshScore)}>{areaData.poshScore}</span>
                  <span className="text-sm text-muted-foreground">/100</span>
                </div>
                <div className={`text-lg font-medium ${getScoreColor(areaData.poshScore)}`}>
                  {getScoreLabel(areaData.poshScore)}
                </div>
                <div className="mt-6 w-full">
                  <PoshScoreChart scoreBreakdown={areaData.scoreBreakdown} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Area Metrics</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div>
                {areaData.propertyPrices ? (
                  <>
                    <div className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-blue-500" />
                        <span>2-Bed Flat Price</span>
                      </div>
                      <span>{formatCurrency(areaData.propertyPrices.flatTwoBed)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-green-500" />
                        <span>3-Bed House Price</span>
                      </div>
                      <span>{formatCurrency(areaData.propertyPrices.houseThreeBed)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center gap-2">
                      <Banknote className="h-4 w-4 text-green-500" />
                      <span>Average Property Price</span>
                    </div>
                    <span>{formatCurrency(areaData.averagePrice)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span>Crime Index</span>
                  </div>
                  <span className={areaData.crimeIndex < 40 ? 'text-green-500' : areaData.crimeIndex < 60 ? 'text-amber-500' : 'text-red-500'}>
                    {areaData.crimeIndex}/100
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <Train className="h-4 w-4 text-indigo-500" />
                    <span>Transport Score</span>
                  </div>
                  <span className={areaData.transportScore > 70 ? 'text-green-500' : areaData.transportScore > 50 ? 'text-amber-500' : 'text-red-500'}>
                    {areaData.transportScore}/100
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    <span>5-Year Price Growth</span>
                  </div>
                  <span className="text-primary">
                    {formatPropertyGrowth(areaData.priceGrowth)}%
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <Trees className="h-4 w-4 text-green-600" />
                    <span>Green Space Access</span>
                  </div>
                  <span className={areaData.greenSpaceAccess > 70 ? 'text-green-500' : areaData.greenSpaceAccess > 50 ? 'text-amber-500' : 'text-red-500'}>
                    {areaData.greenSpaceAccess}/100
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <Coffee className="h-4 w-4 text-amber-600" />
                    <span>Amenity Density</span>
                  </div>
                  <span className={areaData.amenityDensity > 70 ? 'text-green-500' : areaData.amenityDensity > 50 ? 'text-amber-500' : 'text-red-500'}>
                    {areaData.amenityDensity}/100
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex items-center gap-2">
                    <Footprints className="h-4 w-4 text-cyan-600" />
                    <span>Walkability</span>
                  </div>
                  <span className={areaData.walkability > 70 ? 'text-green-500' : areaData.walkability > 50 ? 'text-amber-500' : 'text-red-500'}>
                    {areaData.walkability}/100
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PoshScoreCard;
