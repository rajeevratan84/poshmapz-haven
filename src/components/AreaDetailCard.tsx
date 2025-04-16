
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, ChevronRight, Bookmark, BookmarkCheck, ArrowRightLeft } from "lucide-react";
import { useSavedResults } from '@/context/SavedResultsContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  poshScore: number;
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
  onClick
}) => {
  const { saveArea, isSaved, removeArea, savedAreas, addToCompare, isInCompare } = useSavedResults();
  
  const savedArea = savedAreas.find(area => area.name === areaName);
  const isAreaSaved = isSaved(areaName);
  const isAreaInCompare = savedArea ? isInCompare(savedArea.id) : false;

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();  // Prevent triggering the card click
    
    if (isAreaSaved && savedArea?.id) {
      removeArea(savedArea.id);
    } else {
      // Construct a proper area object for saving
      const areaToSave = {
        name: areaName,
        matchPercentage,
        description,
        poshScore,
        amenities,
        areaStats,
        coordinates: { lat: 0, lng: 0 }, // Default coordinates, should be replaced with actual if available
      };
      
      saveArea(areaToSave, 'ai-search');
    }
  };

  const handleAddToCompare = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    
    if (!savedArea) {
      const areaToCompare = {
        name: areaName,
        matchPercentage,
        description,
        poshScore,
        amenities,
        areaStats,
        coordinates: { lat: 0, lng: 0 },
      };
      
      // First save the area if it's not saved
      if (!isAreaSaved) {
        saveArea(areaToCompare, 'ai-search');
      }
      
      // Then add to comparison
      addToCompare(savedArea || areaToCompare);
    } else {
      addToCompare(savedArea);
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md mb-2 ${
        isSelected ? "border-primary ring-1 ring-primary" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="border-b p-4 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-primary" />
              <h3 className="font-bold text-lg">{areaName}</h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-0">
                {matchPercentage}% Match
              </Badge>
              <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs font-medium">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span>PoshScore: {poshScore}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${isAreaInCompare ? "text-primary bg-primary/10" : ""}`}
                    onClick={handleAddToCompare}
                    disabled={isAreaInCompare}
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isAreaInCompare ? "Already in comparison" : "Add to comparison"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${isAreaSaved ? "text-primary bg-primary/10" : ""}`}
                    onClick={handleSaveToggle}
                  >
                    {isAreaSaved ? (
                      <BookmarkCheck className="h-4 w-4" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isAreaSaved ? "Remove from saved" : "Save area"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="p-4">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {description}
          </p>
          
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div>
              <span className="text-muted-foreground block mb-1">Transport</span>
              <span className="font-medium">{areaStats.transportScore}</span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Safety</span>
              <span className="font-medium">{areaStats.crimeRate}</span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Walkability</span>
              <span className="font-medium">{areaStats.walkability}</span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Property Growth</span>
              <span className="font-medium text-green-600">{areaStats.propertyGrowth.houses}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{amenities.length - 3} more
              </Badge>
            )}
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            <div className="flex flex-wrap gap-1">
              {areaStats.areaVibe.slice(0, 3).map((vibe, index) => (
                <span key={index} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {vibe}
                </span>
              ))}
            </div>
            <Button size="sm" variant="ghost" className={isSelected ? "text-primary" : ""}>
              {isSelected ? "Selected" : "View"}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AreaDetailCard;
