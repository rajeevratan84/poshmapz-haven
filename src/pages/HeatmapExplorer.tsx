
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Search, Map, Home, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import HeatmapComponent from '@/components/heatmap/HeatmapComponent';
import { translateToOverpassQuery, fetchOverpassData, HeatmapPoint } from '@/services/overpassService';
import { useTheme } from '@/context/ThemeContext';

const HeatmapExplorer = () => {
  const [query, setQuery] = useState('');
  const [points, setPoints] = useState<HeatmapPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Sample queries for demonstration - focused on specific place types
  const sampleQueries = [
    "Coffee shops",
    "Sushi restaurants", 
    "Indian restaurants",
    "Pubs and bars",
    "Gyms and fitness centers",
    "Pharmacies",
    "Bookstores",
    "Pizza places"
  ];
  
  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter what you want to find (e.g., "coffee shops")');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use a placeholder API key for now - in a real app this would come from context/auth
      const apiKey = localStorage.getItem('openai_api_key') || 'placeholder-key';
      
      if (apiKey === 'placeholder-key') {
        // For demo purposes, create some sample data based on the query
        const samplePoints = generateSamplePoints(query);
        setPoints(samplePoints);
        toast.success(`Found ${samplePoints.length} ${query.toLowerCase()} locations!`);
        return;
      }
      
      // Step 1: Translate natural language to Overpass query
      const overpassQuery = await translateToOverpassQuery(query, apiKey);
      
      if (!overpassQuery) {
        toast.error('Could not understand your query. Please try something like "coffee shops" or "sushi restaurants".');
        return;
      }
      
      // Step 2: Fetch data from Overpass API
      const heatmapPoints = await fetchOverpassData(overpassQuery);
      
      if (heatmapPoints.length === 0) {
        toast.warning(`No ${query.toLowerCase()} found. Try a different search term.`);
      } else {
        toast.success(`Found ${heatmapPoints.length} ${query.toLowerCase()} locations!`);
        setPoints(heatmapPoints);
      }
      
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateSamplePoints = (query: string): HeatmapPoint[] => {
    // Generate sample data for demo purposes
    const basePoints = [
      { lat: 51.5074, lng: -0.1278, name: "Central London" },
      { lat: 51.5154, lng: -0.1419, name: "Fitzrovia" },
      { lat: 51.5023, lng: -0.1405, name: "Covent Garden" },
      { lat: 51.5097, lng: -0.1340, name: "Bloomsbury" },
      { lat: 51.5155, lng: -0.0922, name: "Shoreditch" },
      { lat: 51.5388, lng: -0.1426, name: "Camden" },
      { lat: 51.4875, lng: -0.1687, name: "South Kensington" },
      { lat: 51.4934, lng: -0.2191, name: "Hammersmith" },
      { lat: 51.4622, lng: -0.1636, name: "Clapham" },
      { lat: 51.4814, lng: -0.0092, name: "Greenwich" }
    ];
    
    return basePoints.map((point, index) => ({
      ...point,
      intensity: Math.floor(Math.random() * 5) + 1,
      name: `${query} ${index + 1}`,
      type: query.toLowerCase().includes('coffee') ? 'cafe' : 
            query.toLowerCase().includes('restaurant') ? 'restaurant' :
            query.toLowerCase().includes('pub') ? 'pub' : 'amenity'
    }));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80">
              <Home size={20} />
              <span className="text-sm">Back to PoshMaps</span>
            </Link>
            <div className="flex items-center gap-2">
              <Map size={28} className="text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold">London Heatmap Explorer</h1>
                <p className="text-sm text-muted-foreground">
                  See where your favorite places cluster in London
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <HelpCircle size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">
              Powered by OpenStreetMap
            </span>
          </div>
        </div>
      </header>
      
      {/* Search Section */}
      <div className="p-4 md:p-6 border-b bg-muted/30">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Search Input */}
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., 'Coffee shops', 'Sushi restaurants', 'Indian restaurants'"
              className="flex-grow"
            />
            <Button 
              onClick={handleSearch}
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Searching...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>Find Places</span>
                </div>
              )}
            </Button>
          </div>
          
          {/* Sample Queries */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {sampleQueries.map((sample, idx) => (
                <button
                  key={idx}
                  className="text-xs px-3 py-1.5 bg-background border rounded-full hover:bg-accent transition-colors"
                  onClick={() => setQuery(sample)}
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="flex-1 h-[calc(100vh-300px)] p-4 md:p-6">
        <div className="h-full max-w-7xl mx-auto">
          <HeatmapComponent 
            points={points}
            isLoading={isLoading}
          />
        </div>
      </div>
      
      {/* Instructions */}
      {points.length === 0 && !isLoading && (
        <div className="p-6 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <Map size={48} className="mx-auto text-muted-foreground" />
            <h3 className="text-lg font-semibold">Explore London's Hotspots</h3>
            <p className="text-sm text-muted-foreground">
              Search for any type of place to see where they cluster in London. 
              Try "coffee shops", "sushi restaurants", or "bookstores" to get started!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeatmapExplorer;
