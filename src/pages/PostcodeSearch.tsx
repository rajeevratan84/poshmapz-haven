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
import { formatCurrency } from '@/utils/formatters';
import { getAreaDetails } from '@/services/openaiService';
import { AreaMatch } from '@/types/area';

const PostcodeSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [areaData, setAreaData] = useState<AreaMatch | null>(null);
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
      // Get API key from environment variable
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey) {
        toast.error('API key not found. Please ensure your environment is properly configured.');
        setIsSearching(false);
        return;
      }
      
      // Make hardcoded examples more responsive
      let result: AreaMatch | null = null;
      
      // Check for specific areas to return detailed mock data first
      const lowercaseQuery = searchQuery.toLowerCase();
      if (lowercaseQuery.includes('hampstead') || lowercaseQuery.toUpperCase() === 'NW3') {
        result = getHampsteadData();
      } else if (lowercaseQuery.includes('shoreditch') || lowercaseQuery.toUpperCase().includes('E2')) {
        result = getShoreditchData();
      } else if (lowercaseQuery.includes('kensington') || lowercaseQuery.toUpperCase().includes('W8')) {
        result = getKensingtonData();
      } else if (lowercaseQuery.includes('brixton') || lowercaseQuery.toUpperCase().includes('SW2')) {
        result = getBrixtonData();
      } else {
        // Get data from OpenAI for any other query
        toast.loading('Analyzing area data with AI...');
        result = await getAreaDetails(searchQuery, apiKey);
        toast.dismiss();
      }
      
      if (result) {
        setAreaData(result);
        toast.success(`Found data for ${result.name}`);
      } else {
        toast.error('Could not find data for this location');
      }
    } catch (error) {
      console.error('Error searching for postcode:', error);
      toast.error('Could not find data for this location');
    } finally {
      setIsSearching(false);
    }
  };
  
  // Mock data functions for specific areas
  const getHampsteadData = (): AreaMatch => {
    return {
      name: "Hampstead",
      poshScore: 90,
      matchPercentage: 98,
      areaType: "Village-like suburb",
      description: "Hampstead is a picturesque area in North London known for its elegant houses and proximity to Hampstead Heath. It offers a village-like atmosphere with a wealth of cultural and historic attractions. This affluent neighborhood has attracted artists, writers and intellectuals for centuries and maintains its bohemian charm alongside considerable wealth.",
      history: "Dating back to the 17th century, Hampstead developed as a spa town and later became known for its artistic communities. Notable residents throughout history have included John Keats, George Orwell, and Sigmund Freud.",
      demographics: "Home to affluent professionals, celebrities, and established families. The area has a significant international population with many residents working in finance, media, and the arts.",
      attractions: "Hampstead Heath, Kenwood House, Hampstead Ponds, historic pubs, and independent boutiques.",
      recentTrends: "Increasing demand from wealthy international buyers seeking green space and village charm while maintaining proximity to central London.",
      gentrificationIndex: 85,
      coordinates: {
        lat: 51.556,
        lng: -0.178
      },
      propertyPrices: {
        flatTwoBed: 950000,
        houseThreeBed: 2400000
      },
      amenities: [
        "Hampstead Heath",
        "Boutique shops",
        "Art galleries",
        "Gourmet restaurants",
        "Independent cafes"
      ],
      areaStats: {
        crimeRate: "Low - 25% below London average",
        transportScore: "Excellent - 15 min to central via Northern Line",
        walkability: "Very Walkable - 90/100",
        propertyGrowth: {
          flats: "+2.8%",
          houses: "+3.5%"
        },
        areaVibe: ["Historic", "Affluent", "Leafy"]
      },
      pros: [
        "High prestige area",
        "Excellent transport links",
        "Very walkable"
      ],
      cons: [
        "Higher property prices"
      ],
      matchingAmenities: [
        "Hampstead Heath",
        "Boutique shops",
        "Art galleries",
        "Gourmet restaurants"
      ]
    };
  };
  
  const getShoreditchData = (): AreaMatch => {
    return {
      name: "Shoreditch",
      poshScore: 75,
      matchPercentage: 85,
      areaType: "Urban hipster hub",
      description: "Shoreditch is East London's creative and tech hub, known for its vibrant street art, trendy bars, and converted industrial spaces. Once a working-class neighborhood, it has transformed into one of London's coolest districts with a unique mix of edgy creativity and gentrified sophistication.",
      history: "Originally a working-class area and center of London's furniture industry, Shoreditch began its transformation in the 1990s when artists and creatives moved in for the cheap rents and warehouse spaces. It has since become a symbol of urban regeneration and hipster culture.",
      demographics: "Young professionals, creatives, tech workers, and entrepreneurs. The area has a diverse mix of long-term residents and newcomers working in creative industries and tech startups.",
      attractions: "Boxpark, Brick Lane, Spitalfields Market, street art tours, independent galleries, and a thriving nightlife scene.",
      recentTrends: "Continued development of luxury apartments and office spaces for tech companies, with increasing tensions between original creative communities and corporate influx.",
      gentrificationIndex: 78,
      coordinates: {
        lat: 51.5246,
        lng: -0.0795
      },
      propertyPrices: {
        flatTwoBed: 650000,
        houseThreeBed: 1200000
      },
      amenities: [
        "Street art",
        "Tech hubs",
        "Trendy bars",
        "Independent galleries",
        "Food markets"
      ],
      areaStats: {
        crimeRate: "Average for London",
        transportScore: "Good - Multiple tube and overground options",
        walkability: "Very Walkable - 88/100",
        propertyGrowth: {
          flats: "+5.4%",
          houses: "+7.1%"
        },
        areaVibe: ["Hipster", "Trendy", "Creative"]
      },
      pros: [
        "Vibrant nightlife",
        "Creative atmosphere",
        "Excellent food scene"
      ],
      cons: [
        "Noisy at weekends",
        "Limited green spaces"
      ],
      matchingAmenities: [
        "Artisan coffee shops",
        "Independent galleries",
        "Tech hubs",
        "Craft breweries"
      ]
    };
  };
  
  const getKensingtonData = (): AreaMatch => {
    return {
      name: "Kensington",
      poshScore: 95,
      matchPercentage: 92,
      areaType: "Ultra-premium royal district",
      description: "Kensington is synonymous with luxury living in London, home to embassies, museums, royal parks, and some of the city's most expensive properties. With its pristine garden squares and white stucco-fronted townhouses, it represents the epitome of upscale London living.",
      history: "Once rural countryside, Kensington was developed in the 17th century as an aristocratic suburb. It became increasingly prestigious after Kensington Palace became a royal residence, and the area has maintained its elite status ever since.",
      demographics: "Wealthy international residents, old money British families, diplomats, and ultra-high-net-worth individuals. The area has a significant number of second homes owned by overseas investors.",
      attractions: "Kensington Palace, Hyde Park, V&A Museum, Natural History Museum, Science Museum, High Street Kensington shopping.",
      recentTrends: "Resilient prime property market despite broader London fluctuations, with continued interest from international ultra-wealthy buyers seeking safe haven investments.",
      gentrificationIndex: 100,
      coordinates: {
        lat: 51.5018,
        lng: -0.1925
      },
      propertyPrices: {
        flatTwoBed: 1450000,
        houseThreeBed: 4200000
      },
      amenities: [
        "Royal parks",
        "Museums",
        "Luxury shops",
        "Michelin-starred restaurants",
        "Embassy district"
      ],
      areaStats: {
        crimeRate: "Low - 30% below London average",
        transportScore: "Excellent - Multiple tube lines and bus routes",
        walkability: "Very Walkable - 86/100",
        propertyGrowth: {
          flats: "+2.1%",
          houses: "+4.3%"
        },
        areaVibe: ["Prestigious", "Refined", "International"]
      },
      pros: [
        "Ultra-premium status",
        "Royal parks access",
        "Cultural institutions"
      ],
      cons: [
        "Extremely high property prices",
        "Tourist crowds in some areas"
      ],
      matchingAmenities: [
        "Michelin-starred restaurants",
        "Designer boutiques",
        "Museums",
        "Royal parks"
      ]
    };
  };
  
  const getBrixtonData = (): AreaMatch => {
    return {
      name: "Brixton",
      poshScore: 68,
      matchPercentage: 75,
      areaType: "Diverse urban district",
      description: "Brixton is one of London's most culturally diverse and vibrant neighborhoods, famous for its Afro-Caribbean heritage, bustling market, and dynamic music scene. Once associated with social challenges, it has undergone significant regeneration while striving to maintain its unique multicultural character.",
      history: "Brixton's character was shaped by waves of immigration, particularly the Windrush generation of Caribbean immigrants who settled there in the 1940s and 50s. After periods of social unrest in the 1980s, the area has experienced substantial regeneration since the early 2000s.",
      demographics: "One of London's most diverse communities with strong Afro-Caribbean, African, Portuguese and Latin American influences. Increasingly popular with young professionals attracted to the area's cultural vibrancy and relative affordability.",
      attractions: "Brixton Market, Electric Avenue, Brixton Academy, Pop Brixton, street art, diverse culinary scene.",
      recentTrends: "Rapid gentrification has sparked debates about preserving local character while embracing positive development. New dining concepts and apartment developments continue to transform the area.",
      gentrificationIndex: 65,
      coordinates: {
        lat: 51.4613,
        lng: -0.1156
      },
      propertyPrices: {
        flatTwoBed: 490000,
        houseThreeBed: 850000
      },
      amenities: [
        "Brixton Market",
        "Music venues",
        "Diverse restaurants",
        "Street art",
        "Community centers"
      ],
      areaStats: {
        crimeRate: "Above London average in some areas",
        transportScore: "Good - Victoria Line offers fast access to central London",
        walkability: "Very Walkable - 83/100",
        propertyGrowth: {
          flats: "+6.7%",
          houses: "+8.9%"
        },
        areaVibe: ["Multicultural", "Vibrant", "Eclectic"]
      },
      pros: [
        "Vibrant culture",
        "Excellent food market",
        "Good transport links"
      ],
      cons: [
        "Higher crime in some areas",
        "Rapid gentrification concerns"
      ],
      matchingAmenities: [
        "Brixton Market",
        "Music venues",
        "Independent restaurants",
        "Community spaces"
      ]
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
              <p className="mt-1 italic">Try "Hampstead", "Shoreditch", "Kensington" or "Brixton" for faster results</p>
              <div className="mt-2 p-2 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200 rounded-md text-xs">
                <strong>Note:</strong> This uses AI to generate area insights. For frequently searched areas, cached results are shown instantly.
              </div>
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
