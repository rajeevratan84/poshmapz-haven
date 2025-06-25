
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Search, Map, Home, HelpCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import HeatmapComponent from '@/components/heatmap/HeatmapComponent';
import { translateToOverpassQuery, fetchOverpassData, HeatmapPoint } from '@/services/overpassService';
import { useTheme } from '@/context/ThemeContext';

const HeatmapExplorer = () => {
  const [query, setQuery] = useState('');
  const [points, setPoints] = useState<HeatmapPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Sample queries for demonstration
  const sampleQueries = [
    "Show me safe areas in London",
    "Family-friendly neighborhoods with schools and parks",
    "Areas with good nightlife and restaurants",
    "Places near tube stations and transport hubs",
    "Shopping districts and commercial areas"
  ];
  
  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }
    
    if (!apiKey.trim()) {
      toast.error('Please enter your OpenAI API key');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Step 1: Translate natural language to Overpass query
      const overpassQuery = await translateToOverpassQuery(query, apiKey);
      
      if (!overpassQuery) {
        toast.error('Could not understand your query. Please try rephrasing it.');
        return;
      }
      
      // Step 2: Fetch data from Overpass API
      const heatmapPoints = await fetchOverpassData(overpassQuery);
      
      if (heatmapPoints.length === 0) {
        toast.warning('No data found for your query. Try a different search term.');
      } else {
        toast.success(`Found ${heatmapPoints.length} locations!`);
        setPoints(heatmapPoints);
      }
      
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
                  Discover London using natural language queries
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <HelpCircle size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">
              Powered by OpenAI & OpenStreetMap
            </span>
          </div>
        </div>
      </header>
      
      {/* Search Section */}
      <div className="p-4 md:p-6 border-b bg-muted/30">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* API Key Input */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-yellow-500" />
              <span className="font-medium">OpenAI API Key Required</span>
            </div>
            <Input
              type="password"
              placeholder="Enter your OpenAI API key (sk-...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mb-2"
            />
            <p className="text-xs text-muted-foreground">
              Your API key is used locally and never stored. Get one at{' '}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                platform.openai.com
              </a>
            </p>
          </Card>
          
          {/* Search Input */}
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., 'Show me safe areas with good schools and parks'"
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
                  <span>Explore</span>
                </div>
              )}
            </Button>
          </div>
          
          {/* Sample Queries */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Try these examples:</p>
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
            <h3 className="text-lg font-semibold">Start Exploring London</h3>
            <p className="text-sm text-muted-foreground">
              Enter your OpenAI API key and describe what you're looking for in London. 
              Our AI will find relevant locations and display them as an interactive heatmap.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeatmapExplorer;
