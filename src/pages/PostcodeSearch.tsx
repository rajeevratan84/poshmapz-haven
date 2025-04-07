
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
    
    // Check for specific areas to return detailed mock data
    if (formattedQuery.toLowerCase().includes('hampstead') || formattedQuery.toUpperCase() === 'NW3') {
      return getHampsteadData();
    } else if (formattedQuery.toLowerCase().includes('shoreditch') || formattedQuery.toUpperCase().includes('E2')) {
      return getShoreditchData();
    } else if (formattedQuery.toLowerCase().includes('kensington') || formattedQuery.toUpperCase().includes('W8')) {
      return getKensingtonData();
    } else if (formattedQuery.toLowerCase().includes('brixton') || formattedQuery.toUpperCase().includes('SW2')) {
      return getBrixtonData();
    }
    
    // Generate a score between 60-95 based on the length of the query (just for demo)
    const baseScore = 60 + (query.length * 2) % 36;
    const basePrice = (baseScore * 20000) + 300000;
    
    return {
      name: formattedQuery,
      poshScore: baseScore,
      averagePrice: Math.round(basePrice),
      propertyPrices: {
        flatTwoBed: Math.round(basePrice * 0.9),
        houseThreeBed: Math.round(basePrice * 1.4)
      },
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
  
  // Detailed mock data for specific areas
  const getHampsteadData = () => {
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
      averagePrice: 1750000,
      propertyPrices: {
        flatTwoBed: 950000,
        houseThreeBed: 2400000
      },
      crimeIndex: 35,
      crimeRateDescription: "Low - 25% below London average",
      transportScore: 82,
      transportDescription: "Excellent - 15 min to central via Northern Line",
      greenSpaceAccess: 92,
      amenityDensity: 78,
      walkability: 90,
      walkabilityDescription: "Very Walkable - 90/100",
      priceGrowth: 4.7,
      propertyGrowthDetails: {
        flats: "+2.8%",
        houses: "+3.5%"
      },
      scoreBreakdown: {
        property: 95,
        safety: 86,
        transport: 82,
        lifestyle: 90,
        environment: 94
      },
      pros: [
        "High prestige area",
        "Excellent transport links",
        "Very walkable"
      ],
      cons: [
        "Higher property prices"
      ],
      areaVibe: [
        "Historic",
        "Affluent",
        "Leafy"
      ],
      matchingAmenities: [
        "Hampstead Heath",
        "Boutique shops",
        "Art galleries",
        "Gourmet restaurants"
      ]
    };
  };
  
  const getShoreditchData = () => {
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
      averagePrice: 750000,
      propertyPrices: {
        flatTwoBed: 650000,
        houseThreeBed: 1200000
      },
      crimeIndex: 55,
      crimeRateDescription: "Average for London",
      transportScore: 79,
      transportDescription: "Good - Multiple tube and overground options",
      greenSpaceAccess: 45,
      amenityDensity: 90,
      walkability: 88,
      walkabilityDescription: "Very Walkable - 88/100",
      priceGrowth: 6.2,
      propertyGrowthDetails: {
        flats: "+5.4%",
        houses: "+7.1%"
      },
      scoreBreakdown: {
        property: 70,
        safety: 65,
        transport: 79,
        lifestyle: 92,
        environment: 45
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
      areaVibe: [
        "Hipster",
        "Trendy",
        "Creative"
      ],
      matchingAmenities: [
        "Artisan coffee shops",
        "Independent galleries",
        "Tech hubs",
        "Craft breweries"
      ]
    };
  };
  
  const getKensingtonData = () => {
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
      averagePrice: 2950000,
      propertyPrices: {
        flatTwoBed: 1450000,
        houseThreeBed: 4200000
      },
      crimeIndex: 30,
      crimeRateDescription: "Low - 30% below London average",
      transportScore: 85,
      transportDescription: "Excellent - Multiple tube lines and bus routes",
      greenSpaceAccess: 88,
      amenityDensity: 82,
      walkability: 86,
      walkabilityDescription: "Very Walkable - 86/100",
      priceGrowth: 3.2,
      propertyGrowthDetails: {
        flats: "+2.1%",
        houses: "+4.3%"
      },
      scoreBreakdown: {
        property: 98,
        safety: 90,
        transport: 85,
        lifestyle: 93,
        environment: 87
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
      areaVibe: [
        "Prestigious",
        "Refined",
        "International"
      ],
      matchingAmenities: [
        "Michelin-starred restaurants",
        "Designer boutiques",
        "Museums",
        "Royal parks"
      ]
    };
  };
  
  const getBrixtonData = () => {
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
      averagePrice: 580000,
      propertyPrices: {
        flatTwoBed: 490000,
        houseThreeBed: 850000
      },
      crimeIndex: 62,
      crimeRateDescription: "Above London average in some areas",
      transportScore: 76,
      transportDescription: "Good - Victoria Line offers fast access to central London",
      greenSpaceAccess: 58,
      amenityDensity: 85,
      walkability: 83,
      walkabilityDescription: "Very Walkable - 83/100",
      priceGrowth: 7.8,
      propertyGrowthDetails: {
        flats: "+6.7%",
        houses: "+8.9%"
      },
      scoreBreakdown: {
        property: 65,
        safety: 58,
        transport: 76,
        lifestyle: 88,
        environment: 60
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
      areaVibe: [
        "Multicultural",
        "Vibrant",
        "Eclectic"
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
              <p className="mt-1 italic">Try "Hampstead", "Shoreditch", "Kensington" or "Brixton" for detailed area profiles</p>
              <div className="mt-2 p-2 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200 rounded-md text-xs">
                <strong>Note:</strong> This is a demonstration using mock data. In a production app, this would use real-time property data from APIs and AI-powered analysis.
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
