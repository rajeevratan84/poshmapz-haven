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
import { useSavedResults } from '@/context/SavedResultsContext';

const PostcodeSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [areaData, setAreaData] = useState<AreaMatch | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { saveSearchToHistory } = useSavedResults();
  
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
      } else if (lowercaseQuery.includes('deptford') || lowercaseQuery.toUpperCase().includes('SE8')) {
        result = getDeptfordData();
      } else {
        // Get data from OpenAI for any other query
        toast.loading('Analyzing area data with AI...');
        result = await getAreaDetails(searchQuery, apiKey);
        toast.dismiss();
      }
      
      if (result) {
        // Add postcode-specific data if possible
        if (lowercaseQuery.length >= 3 && result.name) {
          result.postcodeSpecifics = generatePostcodeSpecifics(lowercaseQuery, result.name);
        }
        
        // Add living description if not present
        if (!result.livingDescription) {
          result.livingDescription = generateLivingDescription(result);
        }
        
        setAreaData(result);
        
        // Save search to history
        saveSearchToHistory(searchQuery, [result], 'postcode');
        
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
  
  // Function to generate postcode-specific details
  const generatePostcodeSpecifics = (postcode: string, areaName: string): string => {
    const postcodeSegments = postcode.match(/^([A-Za-z]{1,2})([0-9]{1,2})([A-Za-z]?)$/i);
    
    if (!postcodeSegments) {
      // If not a standard postcode format, return generic info
      return `This particular part of ${areaName} shares the general characteristics of the wider area but may have its own unique microclimate of amenities and community feel.`;
    }
    
    const district = postcodeSegments[1].toUpperCase();
    const sector = postcodeSegments[2];
    
    // London postcodes with specific characteristics
    const postcodeLookup: Record<string, string> = {
      'N': 'North London',
      'NW': 'North West London',
      'W': 'West London',
      'SW': 'South West London',
      'SE': 'South East London',
      'E': 'East London',
      'EC': 'East Central London',
      'WC': 'West Central London'
    };
    
    const districtDescription = postcodeLookup[district] || 'This area';
    
    return `This specific ${district}${sector} postcode area within ${areaName} is located in ${districtDescription}. Properties here may vary from the broader ${areaName} averages. This particular postcode might have more specific access to local amenities such as schools, shops, and transport links than other parts of ${areaName}.`;
  };
  
  // Function to generate living description
  const generateLivingDescription = (area: AreaMatch): string => {
    const transportQuality = area.areaStats?.transportScore?.toLowerCase().includes('excellent') ? 
      'excellent transport links' : 
      area.areaStats?.transportScore?.toLowerCase().includes('good') ?
      'good transport options' :
      'limited transport connections';
    
    const safetyLevel = area.areaStats?.crimeRate?.toLowerCase().includes('low') ?
      'low crime rates make it a safe place to live' :
      area.areaStats?.crimeRate?.toLowerCase().includes('high') ?
      'residents should be mindful of higher than average crime rates' :
      'average safety levels compared to similar areas';
    
    const propertyTrend = area.areaStats?.propertyGrowth?.houses?.includes('+') ?
      'property values are on an upward trend' :
      'property values have been relatively stable';
    
    const amenitiesDescription = area.amenities && area.amenities.length > 3 ?
      `The area offers a good range of amenities including ${area.amenities.slice(0, 3).join(', ')}` :
      'Local amenities are adequate for daily needs';
    
    return `Living in ${area.name} offers residents ${transportQuality}, and ${safetyLevel}. ${amenitiesDescription}. In terms of property investment, ${propertyTrend}. ${area.areaStats?.walkability || 'The area has average walkability.'} ${area.attractions ? `Nearby attractions include ${area.attractions}.` : ''}`;
  };
  
  // Mock data functions for specific areas
  const getHampsteadData = (): AreaMatch => {
    return {
      name: "Hampstead",
      poshScore: 90,
      matchPercentage: 98,
      areaType: "Village-like suburb",
      description: "Hampstead is a picturesque area in North London known for its elegant houses and proximity to Hampstead Heath. It offers a village-like atmosphere with a wealth of cultural and historic attractions. This affluent neighborhood has attracted artists, writers and intellectuals for centuries and maintains its bohemian charm alongside considerable wealth.",
      livingDescription: "Living in Hampstead offers residents an exceptional quality of life with easy access to the vast green spaces of Hampstead Heath while maintaining excellent connections to central London. The local high street provides upscale shopping options with artisan food stores, boutiques, and charming cafés. Residents enjoy a strong sense of community despite the area's wealthy reputation.",
      demographics: "Home to affluent professionals, celebrities, and established families. The area has a significant international population with many residents working in finance, media, and the arts. There's a mix of long-term residents who've lived in the area for generations alongside newer wealthy arrivals.",
      history: "Dating back to the 17th century, Hampstead developed as a spa town and later became known for its artistic communities. Notable residents throughout history have included John Keats, George Orwell, and Sigmund Freud.",
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
        "Very walkable",
        "Access to Hampstead Heath"
      ],
      cons: [
        "Higher property prices",
        "Tourist crowds at weekends"
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
      livingDescription: "Living in Shoreditch means being at the heart of London's most dynamic creative scene with an endless array of bars, restaurants, and entertainment options. The converted warehouses and new builds offer industrial-chic living spaces, though often at a premium. The area never sleeps, with vibrant nightlife continuing throughout the week.",
      demographics: "Young professionals, creatives, tech workers, and entrepreneurs. The area has a diverse mix of long-term residents and newcomers working in creative industries and tech startups. There's a notable contingent of digital nomads and international tech workers.",
      history: "Originally a working-class area and center of London's furniture industry, Shoreditch began its transformation in the 1990s when artists and creatives moved in for the cheap rents and warehouse spaces. It has since become a symbol of urban regeneration and hipster culture.",
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
        "Excellent food scene",
        "Good investment potential"
      ],
      cons: [
        "Noisy at weekends",
        "Limited green spaces",
        "Increasingly corporate feel"
      ],
      matchingAmenities: [
        "Artisan coffee shops",
        "Independent galleries",
        "Tech hubs",
        "Craft breweries",
        "Street food markets"
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
      livingDescription: "Living in Kensington provides residents with an exceptionally high standard of living with beautiful period properties, pristine streets, and world-class amenities. The area offers easy access to Hyde Park, high-end shopping on Kensington High Street, and some of London's best museums. The neighborhood has a refined, international atmosphere.",
      demographics: "Wealthy international residents, old money British families, diplomats, and ultra-high-net-worth individuals. The area has a significant number of second homes owned by overseas investors, particularly from the Middle East, Russia, and China.",
      history: "Once rural countryside, Kensington was developed in the 17th century as an aristocratic suburb. It became increasingly prestigious after Kensington Palace became a royal residence, and the area has maintained its elite status ever since.",
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
        "Cultural institutions",
        "Excellent schools"
      ],
      cons: [
        "Extremely high property prices",
        "Tourist crowds in some areas",
        "Some areas can feel quiet in evenings"
      ],
      matchingAmenities: [
        "Michelin-starred restaurants",
        "Designer boutiques",
        "Museums",
        "Royal parks",
        "Luxury spas"
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
      livingDescription: "Living in Brixton offers residents a culturally rich experience with outstanding food options, vibrant nightlife, and strong community spirit. The Victoria line provides quick access to central London, while local amenities cater to all needs. The mix of period housing and new developments offers varied living options, though prices have risen substantially in recent years.",
      demographics: "One of London's most diverse communities with strong Afro-Caribbean, African, Portuguese and Latin American influences. Increasingly popular with young professionals attracted to the area's cultural vibrancy and relative affordability. There's tension between long-established communities and newer arrivals.",
      history: "Brixton's character was shaped by waves of immigration, particularly the Windrush generation of Caribbean immigrants who settled there in the 1940s and 50s. After periods of social unrest in the 1980s, the area has experienced substantial regeneration since the early 2000s.",
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
        "Good transport links",
        "Strong community"
      ],
      cons: [
        "Higher crime in some areas",
        "Rapid gentrification concerns",
        "Can be noisy"
      ],
      matchingAmenities: [
        "Brixton Market",
        "Music venues",
        "Independent restaurants",
        "Community spaces",
        "Craft breweries"
      ]
    };
  };
  
  const getDeptfordData = (): AreaMatch => {
    return {
      name: "Deptford",
      poshScore: 78,
      matchPercentage: 100,
      areaType: "Regenerating riverside district",
      description: "Deptford is a vibrant area in southeast London known for its artistic community, diverse population, and proximity to the River Thames. It boasts a mix of historical architecture and modern developments, with a lively high street and a thriving arts scene.",
      livingDescription: "Living in Deptford offers residents excellent value compared to neighboring areas, with great transport connections via Overground and DLR services. The area has seen significant regeneration with new residential developments along the riverfront. The mix of creative venues, independent cafés, and authentic markets creates a dynamic living environment with strong community spirit.",
      demographics: "Deptford is home to a diverse mix of communities, including long-established working-class residents, young professionals, students, and a growing creative class. The area has significant Black British, Vietnamese, and Eastern European populations, alongside newer arrivals drawn by lower property prices compared to nearby Greenwich and Bermondsey.",
      history: "Once a major naval dockyard established by Henry VIII, Deptford has a rich maritime history. The area experienced industrial decline in the mid-20th century but has undergone significant regeneration since the early 2000s, balancing new development with preservation of its heritage buildings.",
      attractions: "Deptford Market, Albany Theatre, Deptford High Street, Deptford Creek, Laban Dance Centre, and Deptford Market Yard.",
      recentTrends: "Ongoing regeneration projects are transforming the area with new apartment complexes, creative workspaces, and riverside developments. Property prices have seen steady growth as the area becomes increasingly recognized as an up-and-coming location.",
      gentrificationIndex: 60,
      coordinates: {
        lat: 51.479,
        lng: -0.022
      },
      propertyPrices: {
        flatTwoBed: 480000,
        houseThreeBed: 820000
      },
      amenities: [
        "Independent restaurants",
        "Art galleries",
        "Riverside parks",
        "Creative studios",
        "Street markets"
      ],
      areaStats: {
        crimeRate: "Average for London",
        transportScore: "Excellent - Overground, DLR, and trains to central London",
        walkability: "Very Walkable - 85/100",
        propertyGrowth: {
          flats: "+4.8%",
          houses: "+5.3%"
        },
        areaVibe: ["Creative", "Diverse", "Up-and-coming"]
      },
      pros: [
        "Excellent transport links",
        "Rich cultural scene",
        "Diverse community",
        "Good investment potential"
      ],
      cons: [
        "Higher crime rate than average",
        "Ongoing gentrification pressure",
        "Some areas still need regeneration"
      ],
      matchingAmenities: [
        "Deptford Market",
        "Art galleries",
        "Independent cafés",
        "Riverside walks",
        "Creative spaces"
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
              <p className="mt-1 italic">Try "Hampstead", "Shoreditch", "Kensington", "Brixton" or "Deptford" for faster results</p>
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
