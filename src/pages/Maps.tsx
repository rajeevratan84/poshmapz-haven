
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Layers, Map as MapIcon, Search } from 'lucide-react';
import MapComponent from '@/components/map/MapComponent';
import FilterPanel from '@/components/map/FilterPanel';
import NaturalLanguageSearch from '@/components/map/NaturalLanguageSearch';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/context/ThemeContext';

// Types for filter state
export interface MapFilters {
  priceRange: [number, number];
  crimeIndex: number;
  greenSpaceScore: number;
  amenityDensity: number;
  nearSchool: boolean;
  nearTransport: boolean;
  activeAmenities: string[];
}

// Default filter values
const defaultFilters: MapFilters = {
  priceRange: [200000, 800000],
  crimeIndex: 50,
  greenSpaceScore: 50,
  amenityDensity: 50,
  nearSchool: false,
  nearTransport: true,
  activeAmenities: ['cafe']
};

const Maps = () => {
  const [filters, setFilters] = useState<MapFilters>(defaultFilters);
  const [activeTab, setActiveTab] = useState<string>('filters');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mapMode, setMapMode] = useState<'standard' | 'heatmap'>('standard');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const handleFilterChange = (updatedFilters: Partial<MapFilters>) => {
    setFilters(prev => ({ ...prev, ...updatedFilters }));
  };
  
  const handleNaturalLanguageSearch = (query: string) => {
    setSearchQuery(query);
    
    // In a real implementation, this would call an API to parse the query
    // For now, let's simulate setting some filters based on common phrases
    if (query.toLowerCase().includes('low crime')) {
      handleFilterChange({ crimeIndex: 20 });
      toast.success('Filtered for low crime areas');
    }
    
    if (query.toLowerCase().includes('green') || query.toLowerCase().includes('park')) {
      handleFilterChange({ greenSpaceScore: 80 });
      toast.success('Filtered for green spaces');
    }
    
    if (query.toLowerCase().includes('café') || query.toLowerCase().includes('cafe')) {
      handleFilterChange({ 
        amenityDensity: 70,
        activeAmenities: ['cafe']
      });
      toast.success('Filtered for areas with cafés');
    }
  };
  
  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="w-full p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MapIcon size={28} className="text-secondary" />
            PoshMaps
          </h1>
          <p className="text-sm md:text-base mt-1 text-muted-foreground">
            Discover your perfect neighborhood based on your lifestyle preferences
          </p>
        </div>
        
        <NaturalLanguageSearch 
          onSearch={handleNaturalLanguageSearch}
          className="w-full md:w-96"
        />
      </header>
      
      {/* Main content */}
      <main className="flex flex-col md:flex-row h-[calc(100vh-130px)]">
        {/* Sidebar */}
        <Card className={`w-full md:w-80 p-4 h-full border shadow-sm ${isDark ? 'dark-card' : 'light:bg-white'}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="filters" className="flex-1">
                <Layers size={16} className="mr-2" />
                Filters
              </TabsTrigger>
              <TabsTrigger value="search" className="flex-1">
                <Search size={16} className="mr-2" />
                Search
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="filters">
              <FilterPanel 
                filters={filters} 
                onChange={handleFilterChange} 
                mapMode={mapMode}
                onMapModeChange={setMapMode}
              />
            </TabsContent>
            
            <TabsContent value="search">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Try searching for areas using natural language:
                </p>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs italic">Example searches:</p>
                  <ul className="text-xs mt-2 space-y-1.5 list-disc pl-4">
                    <li>"Areas under £500k with low crime"</li>
                    <li>"Family friendly with good schools"</li>
                    <li>"Near parks with cafés and transport"</li>
                  </ul>
                </div>
                
                {searchQuery && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Current search:</h3>
                    <div className="bg-accent/10 p-2 rounded text-sm">
                      {searchQuery}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
        
        {/* Map area */}
        <div className="flex-1 h-full">
          <MapComponent 
            filters={filters}
            searchQuery={searchQuery}
            mapMode={mapMode}
          />
        </div>
      </main>
    </div>
  );
};

export default Maps;
