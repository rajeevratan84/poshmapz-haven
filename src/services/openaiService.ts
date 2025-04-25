
import { AreaMatch } from '@/types/area';

// Helper function to create area matches
const createAreaMatches = (count: number): AreaMatch[] => {
  const areas: AreaMatch[] = [];
  
  for (let i = 0; i < count; i++) {
    areas.push({
      name: `Example Area ${i + 1}`,
      matchPercentage: Math.floor(Math.random() * 30) + 70,
      description: "A sample area description for demonstration purposes.",
      poshScore: Math.floor(Math.random() * 40) + 60,
      coordinates: {
        lat: 51.5 + (Math.random() * 0.1 - 0.05),
        lng: -0.1 + (Math.random() * 0.2 - 0.1)
      },
      amenities: ["Parks", "Restaurants", "Schools", "Transport"],
      areaStats: {
        crimeRate: "Low to medium",
        transportScore: "Excellent",
        walkability: "Very good",
        propertyGrowth: {
          flats: "+3% per year",
          houses: "+4.2% per year"
        },
        areaVibe: ["Family-friendly", "Trendy", "Cultural"]
      },
      pros: ["Good schools", "Excellent transport links", "Plenty of green spaces"],
      cons: ["Higher than average property prices", "Some busy roads"],
      propertyPrices: {
        flatTwoBed: 450000 + (Math.random() * 100000),
        houseThreeBed: 750000 + (Math.random() * 200000)
      }
    });
  }
  
  return areas;
};

// Simulate OpenAI API call
export const analyzeAreaPreferences = async (
  userInput: string, 
  apiKey: string,
  mapMode: 'london' | 'uk' | 'europe' = 'london',
  nearestCity: string = 'none'
): Promise<AreaMatch[]> => {
  // This is a mock implementation
  console.log(`Analyzing preferences for: ${userInput}`);
  console.log(`Map mode: ${mapMode}, Nearest city: ${nearestCity}`);
  
  if (!apiKey) {
    console.warn("No API key provided. Using mock data.");
  }
  
  // Wait to simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  let numberOfResults = 5; // Default for London
  
  if (mapMode === 'uk') {
    numberOfResults = 8; // More results for UK
  } else if (mapMode === 'europe') {
    numberOfResults = 10; // Even more results for Europe
    
    // Return European areas if mode is Europe
    return [
      {
        name: "Bucharest - Primăverii",
        matchPercentage: 95,
        description: "Upscale residential area with embassies and luxury properties",
        poshScore: 92,
        coordinates: { lat: 44.4677, lng: 26.0896 },
        amenities: ["Parks", "Luxury Restaurants", "International Schools", "Diplomatic Area"],
        areaStats: {
          crimeRate: "Very low",
          transportScore: "Good",
          walkability: "Excellent",
          propertyGrowth: { flats: "+5.5% per year", houses: "+7.2% per year" },
          areaVibe: ["Exclusive", "Diplomatic", "Quiet"]
        },
        pros: ["Elite neighborhood", "Green spaces", "Security"],
        cons: ["High cost of living", "Tourist presence in summer"],
        propertyPrices: { flatTwoBed: 350000, houseThreeBed: 850000 },
        livingDescription: "Home to diplomatic residences and affluent locals"
      },
      {
        name: "Cluj-Napoca - Bună Ziua",
        matchPercentage: 88,
        description: "Modern residential district with tech influence",
        poshScore: 85,
        coordinates: { lat: 46.7538, lng: 23.6221 },
        amenities: ["Tech Hubs", "Modern Restaurants", "International Schools", "Shopping Centers"],
        areaStats: {
          crimeRate: "Low",
          transportScore: "Good",
          walkability: "Very good",
          propertyGrowth: { flats: "+6.5% per year", houses: "+8.0% per year" },
          areaVibe: ["Modern", "Tech-oriented", "Cosmopolitan"]
        },
        pros: ["IT hub", "Modern infrastructure", "International atmosphere"],
        cons: ["New development areas", "Growing traffic"],
        propertyPrices: { flatTwoBed: 180000, houseThreeBed: 380000 },
        livingDescription: "Popular among tech professionals and expats"
      },
      {
        name: "Brasov - Schei",
        matchPercentage: 86,
        description: "Historic district with traditional Romanian architecture",
        poshScore: 83,
        coordinates: { lat: 45.6358, lng: 25.5848 },
        amenities: ["Historic Sites", "Traditional Restaurants", "Cultural Venues", "Mountain Views"],
        areaStats: {
          crimeRate: "Very low",
          transportScore: "Moderate",
          walkability: "Excellent",
          propertyGrowth: { flats: "+4.5% per year", houses: "+6.2% per year" },
          areaVibe: ["Historic", "Cultural", "Picturesque"]
        },
        pros: ["Rich history", "Mountain proximity", "Authentic experience"],
        cons: ["Tourist crowds", "Limited parking"],
        propertyPrices: { flatTwoBed: 140000, houseThreeBed: 300000 },
        livingDescription: "Charming neighborhood with traditional Saxon influence"
      },
      {
        name: "Timisoara - Fabric",
        matchPercentage: 80,
        description: "Rejuvenated historic district with bohemian vibes",
        poshScore: 78,
        coordinates: { lat: 45.7511, lng: 21.2372 },
        amenities: ["Art Galleries", "Cafes", "Universities", "Urban Parks"],
        areaStats: {
          crimeRate: "Low",
          transportScore: "Good",
          walkability: "Very good",
          propertyGrowth: { flats: "+5.0% per year", houses: "+6.0% per year" },
          areaVibe: ["Bohemian", "Artistic", "Diverse"]
        },
        pros: ["Cultural scene", "Affordability", "European Capital of Culture 2023"],
        cons: ["Some areas needing renovation", "Mixed development"],
        propertyPrices: { flatTwoBed: 120000, houseThreeBed: 250000 },
        livingDescription: "Artistic neighborhood with multicultural heritage"
      },
      {
        name: "Constanta - Mamaia Nord",
        matchPercentage: 78,
        description: "Premium beachfront area with resort atmosphere",
        poshScore: 80,
        coordinates: { lat: 44.2418, lng: 28.6326 },
        amenities: ["Beaches", "Seafood Restaurants", "Beach Clubs", "Water Sports"],
        areaStats: {
          crimeRate: "Low",
          transportScore: "Moderate",
          walkability: "Very good",
          propertyGrowth: { flats: "+7.0% per year", houses: "+8.5% per year" },
          areaVibe: ["Resort-like", "Seasonal", "Modern"]
        },
        pros: ["Black Sea views", "Summer entertainment", "Investment potential"],
        cons: ["Seasonal popularity", "Quieter in winter"],
        propertyPrices: { flatTwoBed: 200000, houseThreeBed: 450000 },
        livingDescription: "Luxury beachfront living on the Black Sea coast"
      }
    ];
  }
  
  // Generate random area matches
  return createAreaMatches(numberOfResults);
};
