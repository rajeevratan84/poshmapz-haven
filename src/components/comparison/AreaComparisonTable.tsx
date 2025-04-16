
import React from 'react';
import { AreaMatch } from '@/types/area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, X, MapPin, Home, Shield, Train, Coffee, Leaf } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface AreaComparisonTableProps {
  areas: AreaMatch[];
  onRemove: (areaId?: string) => void;
}

const AreaComparisonTable: React.FC<AreaComparisonTableProps> = ({ areas, onRemove }) => {
  if (areas.length === 0) return null;
  
  const renderPropertyPrices = (area: AreaMatch) => {
    if (!area.propertyPrices) return 'No data available';
    return (
      <div className="space-y-2">
        <div>
          <p className="text-sm text-muted-foreground">2 Bedroom Flat</p>
          <p className="font-medium">{formatCurrency(area.propertyPrices.flatTwoBed)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">3 Bedroom House</p>
          <p className="font-medium">{formatCurrency(area.propertyPrices.houseThreeBed)}</p>
        </div>
      </div>
    );
  };
  
  const renderAreaStats = (area: AreaMatch) => {
    const stats = area.areaStats;
    if (!stats) return 'No data available';
    
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">Safety</p>
            <p>{stats.crimeRate}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Train className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">Transport</p>
            <p>{stats.transportScore}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Coffee className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">Walkability</p>
            <p>{stats.walkability}</p>
          </div>
        </div>
      </div>
    );
  };
  
  const renderAmenities = (area: AreaMatch) => {
    if (!area.amenities || area.amenities.length === 0) return 'No amenities listed';
    
    return (
      <div className="flex flex-wrap gap-1">
        {area.amenities.slice(0, 5).map((amenity, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {amenity}
          </Badge>
        ))}
        {area.amenities.length > 5 && (
          <Badge variant="outline" className="text-xs">
            +{area.amenities.length - 5} more
          </Badge>
        )}
      </div>
    );
  };
  
  const renderPropertyGrowth = (area: AreaMatch) => {
    const growth = area.areaStats?.propertyGrowth;
    if (!growth) return 'No data available';
    
    return (
      <div className="space-y-2">
        <div>
          <p className="text-sm text-muted-foreground">Houses</p>
          <p className={`font-medium ${
            growth.houses.includes('+') 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-rose-600 dark:text-rose-400'
            }`}>
            {growth.houses}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Flats</p>
          <p className={`font-medium ${
            growth.flats.includes('+') 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-rose-600 dark:text-rose-400'
            }`}>
            {growth.flats}
          </p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full">
      {/* Area Headers */}
      <div className="grid" style={{ gridTemplateColumns: `180px repeat(${areas.length}, 1fr)` }}>
        <div className="p-3 font-medium text-muted-foreground border-b">Category</div>
        {areas.map((area, index) => (
          <div key={area.id || index} className="p-3 border-b">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h3 className="font-bold">{area.name}</h3>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-0">
                    {area.matchPercentage}%
                  </Badge>
                  <div className="flex items-center">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span className="text-xs ml-0.5">{area.poshScore}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(area.id)}
                className="h-7 w-7 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Description Row */}
      <div className="grid" style={{ gridTemplateColumns: `180px repeat(${areas.length}, 1fr)` }}>
        <div className="p-3 font-medium text-muted-foreground border-b flex items-center">
          Description
        </div>
        {areas.map((area, index) => (
          <div key={area.id || index} className="p-3 border-b">
            <p className="text-sm">{area.description}</p>
          </div>
        ))}
      </div>
      
      {/* Property Prices Row */}
      <div className="grid" style={{ gridTemplateColumns: `180px repeat(${areas.length}, 1fr)` }}>
        <div className="p-3 font-medium text-muted-foreground border-b flex items-center gap-2">
          <Home className="h-4 w-4" />
          Property Prices
        </div>
        {areas.map((area, index) => (
          <div key={area.id || index} className="p-3 border-b">
            {renderPropertyPrices(area)}
          </div>
        ))}
      </div>
      
      {/* Area Stats Row */}
      <div className="grid" style={{ gridTemplateColumns: `180px repeat(${areas.length}, 1fr)` }}>
        <div className="p-3 font-medium text-muted-foreground border-b flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Area Stats
        </div>
        {areas.map((area, index) => (
          <div key={area.id || index} className="p-3 border-b">
            {renderAreaStats(area)}
          </div>
        ))}
      </div>
      
      {/* Property Growth Row */}
      <div className="grid" style={{ gridTemplateColumns: `180px repeat(${areas.length}, 1fr)` }}>
        <div className="p-3 font-medium text-muted-foreground border-b flex items-center gap-2">
          <Leaf className="h-4 w-4" />
          Property Growth
        </div>
        {areas.map((area, index) => (
          <div key={area.id || index} className="p-3 border-b">
            {renderPropertyGrowth(area)}
          </div>
        ))}
      </div>
      
      {/* Amenities Row */}
      <div className="grid" style={{ gridTemplateColumns: `180px repeat(${areas.length}, 1fr)` }}>
        <div className="p-3 font-medium text-muted-foreground border-b flex items-center gap-2">
          <Coffee className="h-4 w-4" />
          Amenities
        </div>
        {areas.map((area, index) => (
          <div key={area.id || index} className="p-3 border-b">
            {renderAmenities(area)}
          </div>
        ))}
      </div>
      
      {/* Pros & Cons (if available) */}
      {areas.some(area => area.pros && area.pros.length > 0) && (
        <div className="grid" style={{ gridTemplateColumns: `180px repeat(${areas.length}, 1fr)` }}>
          <div className="p-3 font-medium text-muted-foreground border-b">
            Pros
          </div>
          {areas.map((area, index) => (
            <div key={area.id || index} className="p-3 border-b">
              {area.pros && area.pros.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {area.pros.map((pro, i) => (
                    <li key={i} className="text-sm">{pro}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No data available</p>
              )}
            </div>
          ))}
        </div>
      )}
      
      {areas.some(area => area.cons && area.cons.length > 0) && (
        <div className="grid" style={{ gridTemplateColumns: `180px repeat(${areas.length}, 1fr)` }}>
          <div className="p-3 font-medium text-muted-foreground border-b">
            Cons
          </div>
          {areas.map((area, index) => (
            <div key={area.id || index} className="p-3 border-b">
              {area.cons && area.cons.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {area.cons.map((con, i) => (
                    <li key={i} className="text-sm">{con}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No data available</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AreaComparisonTable;
