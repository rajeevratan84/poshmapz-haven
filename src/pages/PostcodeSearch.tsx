
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Search, ArrowRight, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PoshScoreCard from '@/components/posh/PoshScoreCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTheme } from '@/context/ThemeContext';

const PostcodeSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [areaData, setAreaData] = useState<any>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error('Please enter a postcode or town name');
      return;
    }
    
    setIsSearching(true);
    
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate with mock data
      setTimeout(() => {
        // Mock data - this would come from the API in a real implementation
        const mockData = getMockDataForPostcode(searchQuery);
        
        setAreaData(mockData);
        setIsSearching(false);
        toast.success(`Found data for ${mockData.name}`);
      }, 1500);
    } catch (error) {
      console.error('Error searching for postcode:', error);
      toast.error('Could not find data for this location');
      setIsSearching(false);
    }
  };
  
  // Mock function to generate sample data based on the search query
  const getMockDataForPostcode = (query: string) => {
    // Uppercase postcodes, title case for town names
    const formattedQuery = query.includes(' ') 
      ? query.toUpperCase()
      : query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();
    
    // Generate a score between 60-95 based on the length of the query (just for demo)
    const baseScore = 60 + (query.length * 2) % 36;
    
    return {
      name: formattedQuery,
      poshScore: baseScore,
      averagePrice: Math.round((baseScore * 20000) + 300000),
      crimeIndex: Math.round(100 - baseScore * 0.8),
      transportScore: Math.round(50 + (baseScore % 30)),
      greenSpaceAccess: Math.round(40 + (baseScore % 50)),
      amenityDensity: Math.round(55 + (baseScore % 30)),
      walkability: Math.round(60 + (baseScore % 30)),
      priceGrowth: Math.round(3 + (baseScore % 15)),
      scoreBreakdown: {
        property: Math.round(50 + (baseScore % 40)),
        safety: Math.round(40 + (baseScore % 50)),
        transport: Math.round(60 + (baseScore % 30)),
        lifestyle: Math.round(55 + (baseScore % 35)),
        environment: Math.round(45 + (baseScore % 45))
      }
    };
  };
  
  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-background' : 'bg-slate-50'}`}>
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          How Posh Is My Postcode?
        </h1>
        
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover your area's PoshScore - our comprehensive rating of an area's desirability,
          based on property prices, amenities, safety, and more.
        </p>
        
        <Card className="max-w-xl mx-auto shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Enter a UK Postcode or Town
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="e.g. SW1A 1AA or Clapham"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow"
              />
              <Button 
                type="submit" 
                disabled={isSearching}
              >
                {isSearching ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                    <span>Searching</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                    <span>Search</span>
                  </div>
                )}
              </Button>
            </form>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Examples: "SW3 1AA", "Hampstead", "Richmond Upon Thames"</p>
            </div>
          </CardContent>
        </Card>
        
        {areaData && (
          <div className="mt-12">
            <PoshScoreCard areaData={areaData} />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default PostcodeSearch;
