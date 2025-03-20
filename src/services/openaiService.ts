
import { AreaMatch } from '@/types/area';
import { LocationType } from '@/utils/mapUtils';

export const analyzeAreaPreferences = async (
  userPreferences: string, 
  apiKey: string, 
  locationType: LocationType,
  country?: string
): Promise<AreaMatch[]> => {
  try {
    // Mock data for different location types
    if (locationType === 'london') {
      return getLondonMockData();
    } else if (locationType === 'uk') {
      return getUKMockData();
    } else {
      return getWorldMockData(country || 'United Kingdom');
    }
  } catch (error) {
    console.error("Error analyzing preferences:", error);
    throw error;
  }
};

// Helper function to get mock data for London
const getLondonMockData = (): AreaMatch[] => {
  return [
    {
      name: "Islington",
      matchPercentage: 95,
      description: "A vibrant, diverse area with a mix of Georgian townhouses and modern developments. Popular with young professionals and families.",
      poshScore: 85,
      coordinates: { lat: 51.5362, lng: -0.1033 },
      amenities: ["Parks", "Restaurants", "Boutiques", "Theatres", "Good schools"],
      areaStats: {
        crimeRate: "Low to medium",
        transportScore: "Excellent (Zone 1-2)",
        walkability: "Very high (92/100)",
        propertyGrowth: {
          flats: "+3.8% annually",
          houses: "+4.2% annually"
        },
        areaVibe: ["Trendy", "Upmarket", "Diverse", "Cultural"]
      }
    },
    {
      name: "Richmond",
      matchPercentage: 92,
      description: "Leafy suburban district with excellent parks and a village feel. Great for families and outdoor enthusiasts.",
      poshScore: 90,
      coordinates: { lat: 51.461, lng: -0.306 },
      amenities: ["Richmond Park", "River Thames", "Theatre", "Good schools", "Village green"],
      areaStats: {
        crimeRate: "Very low",
        transportScore: "Good (Zone 4)",
        walkability: "High (85/100)",
        propertyGrowth: {
          flats: "+3.5% annually",
          houses: "+4.0% annually"
        },
        areaVibe: ["Upmarket", "Village feel", "Leafy", "Relaxed"]
      }
    },
    {
      name: "Hackney",
      matchPercentage: 88,
      description: "Hip, creative area that's undergone significant regeneration. Popular with artists, young professionals and families.",
      poshScore: 75,
      coordinates: { lat: 51.5454, lng: -0.0554 },
      amenities: ["Victoria Park", "Broadway Market", "Independent shops", "Bars & cafes", "Cultural venues"],
      areaStats: {
        crimeRate: "Medium",
        transportScore: "Good (Zone 2)",
        walkability: "Very high (90/100)",
        propertyGrowth: {
          flats: "+4.5% annually",
          houses: "+5.1% annually"
        },
        areaVibe: ["Hipster", "Creative", "Diverse", "Gentrifying"]
      }
    }
  ];
};

// Helper function to get mock data for UK
const getUKMockData = (): AreaMatch[] => {
  return [
    {
      name: "Manchester (Northern Quarter)",
      matchPercentage: 94,
      description: "The creative heart of Manchester with independent shops, cafes, and a thriving arts scene.",
      poshScore: 78,
      coordinates: { lat: 53.4839, lng: -2.2373 },
      amenities: ["Cafes", "Bars", "Cultural venues", "Independent shops", "Good transport"],
      areaStats: {
        crimeRate: "Medium",
        transportScore: "Excellent",
        walkability: "Very high (93/100)",
        propertyGrowth: {
          flats: "+5.0% annually",
          houses: "+4.7% annually"
        },
        areaVibe: ["Creative", "Urban", "Trendy", "Diverse"]
      }
    },
    {
      name: "Edinburgh (New Town)",
      matchPercentage: 91,
      description: "Elegant Georgian architecture with upscale shopping, restaurants, and excellent cultural amenities.",
      poshScore: 92,
      coordinates: { lat: 55.9533, lng: -3.2055 },
      amenities: ["Historic architecture", "Fine dining", "Cultural venues", "Parks", "Boutiques"],
      areaStats: {
        crimeRate: "Very low",
        transportScore: "Excellent",
        walkability: "Very high (90/100)",
        propertyGrowth: {
          flats: "+3.8% annually",
          houses: "+4.0% annually"
        },
        areaVibe: ["Historic", "Upmarket", "Cultural", "Sophisticated"]
      }
    },
    {
      name: "Bath (Royal Crescent area)",
      matchPercentage: 88,
      description: "UNESCO World Heritage site with stunning Georgian architecture and a relaxed, cultural atmosphere.",
      poshScore: 89,
      coordinates: { lat: 51.3874, lng: -2.3621 },
      amenities: ["Roman Baths", "Thermae Spa", "Parks", "Independent shops", "Cultural venues"],
      areaStats: {
        crimeRate: "Very low",
        transportScore: "Good",
        walkability: "High (87/100)",
        propertyGrowth: {
          flats: "+3.5% annually",
          houses: "+3.9% annually"
        },
        areaVibe: ["Historic", "Cultural", "Relaxed", "Upmarket"]
      }
    }
  ];
};

// Helper function to get mock data for international locations
const getWorldMockData = (country: string): AreaMatch[] => {
  if (country === "United States") {
    return [
      {
        name: "Brooklyn Heights, NYC",
        matchPercentage: 96,
        description: "Historic neighborhood with brownstone buildings, tree-lined streets, and Manhattan views.",
        poshScore: 88,
        coordinates: { lat: 40.6959, lng: -73.9952 },
        amenities: ["Parks", "Cafes", "Historic architecture", "Waterfront", "Good schools"],
        areaStats: {
          crimeRate: "Low",
          transportScore: "Excellent",
          walkability: "Very high (95/100)",
          propertyGrowth: {
            flats: "+4.2% annually",
            houses: "+3.9% annually"
          },
          areaVibe: ["Historic", "Family-friendly", "Upmarket", "Relaxed"]
        }
      },
      {
        name: "Lincoln Park, Chicago",
        matchPercentage: 92,
        description: "Affluent neighborhood with historic homes, great shopping, and a large park.",
        poshScore: 85,
        coordinates: { lat: 41.9214, lng: -87.6513 },
        amenities: ["Large park", "Zoo", "Shopping", "Restaurants", "Lake Michigan"],
        areaStats: {
          crimeRate: "Low",
          transportScore: "Very good",
          walkability: "High (88/100)",
          propertyGrowth: {
            flats: "+3.8% annually",
            houses: "+4.1% annually"
          },
          areaVibe: ["Upmarket", "Family-friendly", "Vibrant", "Green"]
        }
      },
      {
        name: "Pacific Heights, San Francisco",
        matchPercentage: 89,
        description: "Elevated neighborhood with stunning views, large mansions, and upscale shops.",
        poshScore: 93,
        coordinates: { lat: 37.7925, lng: -122.4382 },
        amenities: ["Panoramic views", "Parks", "Fine dining", "Boutiques", "Historic architecture"],
        areaStats: {
          crimeRate: "Very low",
          transportScore: "Good",
          walkability: "High (85/100)",
          propertyGrowth: {
            flats: "+4.0% annually",
            houses: "+3.5% annually"
          },
          areaVibe: ["Affluent", "Scenic", "Quiet", "Prestigious"]
        }
      }
    ];
  } else if (country === "Trinidad and Tobago") {
    return [
      {
        name: "Westmoorings, Port of Spain",
        matchPercentage: 95,
        description: "Upscale waterfront community with modern houses and excellent amenities.",
        poshScore: 90,
        coordinates: { lat: 10.6655, lng: -61.5576 },
        amenities: ["Shopping mall", "Waterfront", "Marina", "Restaurants", "Security"],
        areaStats: {
          crimeRate: "Very low",
          transportScore: "Medium",
          walkability: "Medium (60/100)",
          propertyGrowth: {
            flats: "+3.0% annually",
            houses: "+3.5% annually"
          },
          areaVibe: ["Upmarket", "Secure", "Waterfront", "Family-friendly"]
        }
      },
      {
        name: "Goodwood Park, Port of Spain",
        matchPercentage: 90,
        description: "Prestigious gated community with large homes and lush surroundings.",
        poshScore: 92,
        coordinates: { lat: 10.6566, lng: -61.5168 },
        amenities: ["Security", "Green spaces", "Community facilities", "Near shopping", "Schools"],
        areaStats: {
          crimeRate: "Very low",
          transportScore: "Medium",
          walkability: "Low (50/100)",
          propertyGrowth: {
            flats: "+2.5% annually",
            houses: "+3.2% annually"
          },
          areaVibe: ["Exclusive", "Tranquil", "Green", "Spacious"]
        }
      },
      {
        name: "Bacolet, Tobago",
        matchPercentage: 88,
        description: "Scenic coastal area with private villas and beautiful beaches.",
        poshScore: 85,
        coordinates: { lat: 11.1780, lng: -60.7330 },
        amenities: ["Beaches", "Ocean views", "Resorts", "Golf course", "Nature"],
        areaStats: {
          crimeRate: "Low",
          transportScore: "Low",
          walkability: "Medium (55/100)",
          propertyGrowth: {
            flats: "+2.8% annually",
            houses: "+3.0% annually"
          },
          areaVibe: ["Scenic", "Relaxed", "Vacation-like", "Tropical"]
        }
      }
    ];
  } else {
    // Default for other countries
    return [
      {
        name: `Popular Area in ${country}`,
        matchPercentage: 93,
        description: `A highly-rated neighborhood known for its excellent amenities and quality of life.`,
        poshScore: 85,
        coordinates: { lat: 0, lng: 0 }, // Default coordinates, would be replaced with actual data
        amenities: ["Parks", "Restaurants", "Shopping", "Cultural venues", "Good transport"],
        areaStats: {
          crimeRate: "Low",
          transportScore: "Good",
          walkability: "High (85/100)",
          propertyGrowth: {
            flats: "+3.5% annually",
            houses: "+4.0% annually"
          },
          areaVibe: ["Vibrant", "Well-maintained", "Safe", "Diverse"]
        }
      },
      {
        name: `Upmarket Area in ${country}`,
        matchPercentage: 88,
        description: `Prestigious neighborhood with upscale properties and excellent facilities.`,
        poshScore: 92,
        coordinates: { lat: 0.01, lng: 0.01 }, // Default coordinates, would be replaced with actual data
        amenities: ["Luxury shopping", "Fine dining", "Parks", "Private facilities", "Good schools"],
        areaStats: {
          crimeRate: "Very low",
          transportScore: "Good",
          walkability: "Medium (75/100)",
          propertyGrowth: {
            flats: "+3.0% annually",
            houses: "+3.5% annually"
          },
          areaVibe: ["Exclusive", "Prestigious", "Quiet", "Upmarket"]
        }
      }
    ];
  }
};
