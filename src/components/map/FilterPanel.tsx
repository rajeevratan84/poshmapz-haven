
import React from 'react';
import { MapFilters } from '@/pages/Maps';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Layers, MapPin } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface FilterPanelProps {
  filters: MapFilters;
  onChange: (filters: Partial<MapFilters>) => void;
  mapMode: 'standard' | 'heatmap';
  onMapModeChange: (mode: 'standard' | 'heatmap') => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters, 
  onChange, 
  mapMode,
  onMapModeChange
}) => {
  const amenityOptions = [
    { id: 'cafe', label: 'Cafés' },
    { id: 'bar', label: 'Bars' },
    { id: 'restaurant', label: 'Restaurants' },
    { id: 'supermarket', label: 'Supermarkets' },
    { id: 'gym', label: 'Gyms' },
    { id: 'park', label: 'Parks' }
  ];
  
  // Handler for price range changes
  const handlePriceChange = (value: number[]) => {
    onChange({ priceRange: [value[0], value[1]] as [number, number] });
  };
  
  // Handler for amenity selection
  const handleAmenityChange = (value: string[]) => {
    onChange({ activeAmenities: value.length > 0 ? value : ['cafe'] });
  };
  
  return (
    <div className="space-y-6">
      {/* Map mode selector */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-2 block">Map View</Label>
        <ToggleGroup 
          type="single" 
          variant="outline" 
          value={mapMode} 
          onValueChange={(value) => value && onMapModeChange(value as any)}
          className="justify-start border rounded-md p-1"
        >
          <ToggleGroupItem value="standard" aria-label="Standard map view">
            <MapPin size={16} className="mr-1" />
            Standard
          </ToggleGroupItem>
          <ToggleGroupItem value="heatmap" aria-label="Heatmap view">
            <Layers size={16} className="mr-1" />
            Heat Map
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      {/* Price range slider */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-sm font-medium">Price Range</Label>
          <span className="text-xs text-muted-foreground">
            {formatCurrency(filters.priceRange[0])} - {formatCurrency(filters.priceRange[1])}
          </span>
        </div>
        <Slider
          min={100000}
          max={2000000}
          step={10000}
          value={filters.priceRange}
          onValueChange={handlePriceChange}
          className="my-4"
        />
      </div>
      
      {/* Crime index slider */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-sm font-medium">Crime Index</Label>
          <span className="text-xs text-muted-foreground">
            Max: {filters.crimeIndex}/100
          </span>
        </div>
        <Slider
          min={0}
          max={100}
          step={1}
          value={[filters.crimeIndex]}
          onValueChange={(value) => onChange({ crimeIndex: value[0] })}
          className="my-4"
        />
        <p className="text-xs text-muted-foreground">
          Lower values show areas with less crime
        </p>
      </div>
      
      {/* Green space score slider */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-sm font-medium">Green Space</Label>
          <span className="text-xs text-muted-foreground">
            Min: {filters.greenSpaceScore}/100
          </span>
        </div>
        <Slider
          min={0}
          max={100}
          step={1}
          value={[filters.greenSpaceScore]}
          onValueChange={(value) => onChange({ greenSpaceScore: value[0] })}
          className="my-4"
        />
        <p className="text-xs text-muted-foreground">
          Higher values show areas with more parks and green spaces
        </p>
      </div>
      
      {/* Amenity density slider */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-sm font-medium">Amenity Density</Label>
          <span className="text-xs text-muted-foreground">
            Min: {filters.amenityDensity}/100
          </span>
        </div>
        <Slider
          min={0}
          max={100}
          step={1}
          value={[filters.amenityDensity]}
          onValueChange={(value) => onChange({ amenityDensity: value[0] })}
          className="my-4"
        />
      </div>
      
      {/* Amenity type selector */}
      <div className="space-y-2">
        <Label className="text-sm font-medium block mb-2">Amenity Types</Label>
        <ToggleGroup 
          type="multiple" 
          value={filters.activeAmenities} 
          onValueChange={handleAmenityChange}
          className="flex flex-wrap gap-2"
        >
          {amenityOptions.map(option => (
            <ToggleGroupItem 
              key={option.id} 
              value={option.id}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      
      {/* Toggles for schools and transport */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="near-school" className="text-sm font-medium">Near Schools</Label>
          <Switch 
            id="near-school" 
            checked={filters.nearSchool}
            onCheckedChange={(checked) => onChange({ nearSchool: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="near-transport" className="text-sm font-medium">Near Transport</Label>
          <Switch 
            id="near-transport" 
            checked={filters.nearTransport}
            onCheckedChange={(checked) => onChange({ nearTransport: checked })}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
