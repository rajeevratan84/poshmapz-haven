
import React from 'react';
import { AreaMatch } from '@/types/area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PoshScoreChart from '@/components/posh/PoshScoreChart';
import { MapPin, Home, Shield, Train, Coffee, Tree, Star, Bookmark, BookmarkCheck } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useSavedResults } from '@/context/SavedResultsContext';

interface PoshScoreCardProps {
  areaData: AreaMatch;
}

const PoshScoreCard: React.FC<PoshScoreCardProps> = ({ areaData }) => {
  const { saveArea, isSaved, removeArea } = useSavedResults();
  
  const isAreaSaved = isSaved(areaData.name);
  
  const handleSaveToggle = () => {
    if (isAreaSaved) {
      // Find the ID of the saved area
      const areaId = areaData.id;
      if (areaId) {
        removeArea(areaId);
      }
    } else {
      saveArea(areaData, 'postcode');
    }
  };
  
  // Create a score breakdown if it doesn't exist
  const scoreBreakdown = {
    property: areaData.scoreBreakdown?.property || Math.round(areaData.poshScore * 0.8),
    safety: areaData.scoreBreakdown?.safety || Math.round(areaData.poshScore * 1.1),
    transport: areaData.scoreBreakdown?.transport || Math.round(areaData.poshScore * 0.9),
    lifestyle: areaData.scoreBreakdown?.lifestyle || Math.round(areaData.poshScore * 1.2),
    environment: areaData.scoreBreakdown?.environment || Math.round(areaData.poshScore),
  };

  // Ensure no score is above 100
  Object.keys(scoreBreakdown).forEach(key => {
    scoreBreakdown[key as keyof typeof scoreBreakdown] = Math.min(scoreBreakdown[key as keyof typeof scoreBreakdown], 100);
  });
  
  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle className="text-3xl font-display">{areaData.name}</CardTitle>
              {areaData.areaType && (
                <Badge variant="outline" className="ml-2">
                  {areaData.areaType}
                </Badge>
              )}
            </div>
            
            {areaData.matchPercentage && (
              <span className="text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded-full">
                {areaData.matchPercentage}% Match
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className={isAreaSaved ? "bg-primary/10 border-primary text-primary" : ""}
              onClick={handleSaveToggle}
            >
              {isAreaSaved ? (
                <>
                  <BookmarkCheck className="mr-2 h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>
            
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 text-white px-3 py-2 rounded-lg flex items-center">
                <Star className="h-5 w-5 text-white fill-white mr-1" />
                <span className="text-2xl font-bold">{areaData.poshScore}</span>
              </div>
              <span className="text-xs text-center mt-1">PoshScore™</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="property">Property</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="transport">Transport</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Area Overview</h3>
                <p className="text-muted-foreground">{areaData.description}</p>
                
                {areaData.livingDescription && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Living in {areaData.name}</h4>
                    <p className="text-sm text-muted-foreground">{areaData.livingDescription}</p>
                  </div>
                )}
                
                {areaData.postcodeSpecifics && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Postcode Specifics</h4>
                    <p className="text-sm text-muted-foreground">{areaData.postcodeSpecifics}</p>
                  </div>
                )}
                
                {areaData.pros && areaData.pros.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium">Pros</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {areaData.pros.map((pro, index) => (
                        <li key={index} className="text-sm">{pro}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {areaData.cons && areaData.cons.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium">Cons</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {areaData.cons.map((con, index) => (
                        <li key={index} className="text-sm text-muted-foreground">{con}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">PoshScore™ Breakdown</h3>
                <PoshScoreChart scoreBreakdown={scoreBreakdown} />
                
                {areaData.amenities && areaData.amenities.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Notable Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {areaData.amenities.map((amenity, index) => (
                        <Badge key={index} variant="secondary">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="property">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Property Information</h3>
              </div>
              
              {areaData.propertyPrices ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h4 className="text-sm text-muted-foreground">Average 2 Bedroom Flat</h4>
                        <p className="text-2xl font-bold mt-2">
                          {formatCurrency(areaData.propertyPrices.flatTwoBed)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h4 className="text-sm text-muted-foreground">Average 3 Bedroom House</h4>
                        <p className="text-2xl font-bold mt-2">
                          {formatCurrency(areaData.propertyPrices.houseThreeBed)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <p className="text-muted-foreground">Property price data not available for this area.</p>
              )}
              
              {areaData.areaStats?.propertyGrowth && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Property Growth</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-4 rounded-md">
                      <span className="text-sm text-muted-foreground">Flats</span>
                      <p className={`text-lg font-medium ${
                        areaData.areaStats.propertyGrowth.flats.includes('+') 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-rose-600 dark:text-rose-400'
                        }`}>
                        {areaData.areaStats.propertyGrowth.flats}
                      </p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-md">
                      <span className="text-sm text-muted-foreground">Houses</span>
                      <p className={`text-lg font-medium ${
                        areaData.areaStats.propertyGrowth.houses.includes('+') 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-rose-600 dark:text-rose-400'
                        }`}>
                        {areaData.areaStats.propertyGrowth.houses}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="lifestyle">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Coffee className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Lifestyle</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {areaData.areaStats?.walkability && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-1">Walkability</h4>
                      <p className="text-muted-foreground">{areaData.areaStats.walkability}</p>
                    </div>
                  )}
                  
                  {areaData.areaStats?.areaVibe && areaData.areaStats.areaVibe.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Area Vibe</h4>
                      <div className="flex flex-wrap gap-2">
                        {areaData.areaStats.areaVibe.map((vibe, index) => (
                          <Badge key={index} variant="outline">
                            {vibe}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  {areaData.amenities && (
                    <div>
                      <h4 className="font-medium mb-2">Local Amenities</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {areaData.amenities.map((amenity, index) => (
                          <li key={index} className="text-sm text-muted-foreground">{amenity}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="transport">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Train className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Transport</h3>
              </div>
              
              {areaData.areaStats?.transportScore && (
                <div className="bg-muted/30 p-6 rounded-lg max-w-md">
                  <h4 className="font-medium mb-2">Transport Score</h4>
                  <p className="text-lg">{areaData.areaStats.transportScore}</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="safety">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Safety</h3>
              </div>
              
              {areaData.areaStats?.crimeRate && (
                <div className="bg-muted/30 p-6 rounded-lg max-w-md">
                  <h4 className="font-medium mb-2">Crime Rate</h4>
                  <p className="text-lg">{areaData.areaStats.crimeRate}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PoshScoreCard;
