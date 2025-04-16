
import React from 'react';
import { AreaMatch } from '@/types/area';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Trash2, Calendar, Star, ArrowRightLeft } from 'lucide-react';
import { useSavedResults } from '@/context/SavedResultsContext';
import { formatCurrency } from '@/utils/formatters';
import PoshScoreChart from '@/components/posh/PoshScoreChart';
import { Link } from 'react-router-dom';

interface SavedAreaCardProps {
  area: AreaMatch;
}

const SavedAreaCard: React.FC<SavedAreaCardProps> = ({ area }) => {
  const { removeArea, addToCompare, isInCompare } = useSavedResults();
  const savedDate = area.savedAt ? new Date(area.savedAt) : null;

  const sourceLabel = area.savedFrom === 'postcode' 
    ? 'Postcode Search' 
    : 'AI Neighborhood Search';
    
  const isAreaInCompare = area.id ? isInCompare(area.id) : false;

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {area.name}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs">
                {savedDate ? savedDate.toLocaleDateString() : 'Date unknown'}
              </span>
              <Badge variant="outline" className="ml-2">
                {sourceLabel}
              </Badge>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 border-0 flex items-center gap-1">
              <Star className="h-3 w-3 fill-white text-white" />
              <span className="font-bold">{area.poshScore}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-0 flex-grow">
        <div className="flex flex-col gap-4">
          <p className="text-sm line-clamp-3">{area.description}</p>
          
          {area.propertyPrices && (
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">2 Bed Flat</p>
                <p className="font-medium">{formatCurrency(area.propertyPrices.flatTwoBed)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">3 Bed House</p>
                <p className="font-medium">{formatCurrency(area.propertyPrices.houseThreeBed)}</p>
              </div>
            </div>
          )}
          
          {area.amenities && (
            <div className="flex flex-wrap gap-1">
              {area.amenities.slice(0, 3).map((amenity, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {area.amenities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{area.amenities.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={area.savedFrom === 'postcode' ? `/postcode?area=${area.name}` : `/demo?area=${area.name}`}>
              View Details
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => addToCompare(area)}
            disabled={isAreaInCompare}
            className={isAreaInCompare ? "bg-primary/10 text-primary" : ""}
          >
            <ArrowRightLeft className="h-4 w-4 mr-1" />
            {isAreaInCompare ? "In Compare" : "Compare"}
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
          onClick={() => area.id && removeArea(area.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SavedAreaCard;
