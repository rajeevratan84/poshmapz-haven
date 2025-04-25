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

// Add European countries and their regions
const europeanCountriesAndRegions = {
  "Italy": ["Tuscany", "Lombardy", "Veneto", "Sicily", "Piedmont", "Lazio", "Campania"],
  "Spain": ["Catalonia", "Andalusia", "Madrid", "Valencia", "Balearic Islands", "Basque Country", "Galicia"],
  "Portugal": ["Lisbon", "Porto", "Algarve", "Madeira", "Azores", "Alentejo", "Central Portugal"],
  "Romania": ["Transylvania", "Bucharest", "Moldova", "Banat", "Oltenia", "Dobruja", "Crișana", "Maramureș"],
  "France": ["Île-de-France", "Provence", "Normandy", "Brittany", "Alsace", "French Riviera", "Loire Valley"],
  "Germany": ["Bavaria", "Berlin", "Baden-Württemberg", "North Rhine-Westphalia", "Hesse", "Saxony", "Hamburg"],
  "Netherlands": ["North Holland", "South Holland", "Utrecht", "Gelderland", "North Brabant", "Limburg", "Zeeland"],
  "Greece": ["Attica", "Central Macedonia", "Crete", "South Aegean", "Peloponnese", "Thessaly", "Ionian Islands"],
  "Austria": ["Vienna", "Tyrol", "Salzburg", "Styria", "Lower Austria", "Upper Austria", "Carinthia"],
  "Sweden": ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västra Götaland", "Skåne", "Norrland"],
  "Poland": ["Masovia", "Lesser Poland", "Greater Poland", "Pomerania", "Silesia", "Łódź", "Lower Silesia"],
  "Czechia": ["Prague", "Central Bohemia", "South Bohemia", "Moravia-Silesia", "South Moravia", "Pilsen", "Vysočina"],
  "Switzerland": ["Zurich", "Geneva", "Bern", "Vaud", "Ticino", "Basel", "Graubünden"],
  "Belgium": ["Brussels", "Flanders", "Wallonia", "Antwerp", "East Flanders", "Liège", "West Flanders"],
  "Ireland": ["Dublin", "Cork", "Galway", "Kerry", "Wicklow", "Clare", "Donegal"],
  "Denmark": ["Copenhagen", "Aarhus", "Odense", "Aalborg", "Zealand", "Funen", "Jutland"],
  "Finland": ["Uusimaa", "Pirkanmaa", "Southwest Finland", "Northern Ostrobothnia", "Central Finland", "Lapland", "North Karelia"],
  "Norway": ["Oslo", "Bergen", "Trondheim", "Stavanger", "Western Norway", "Northern Norway", "Trøndelag"],
  "Hungary": ["Budapest", "Pest County", "Debrecen", "Szeged", "Lake Balaton", "Western Transdanubia", "Northern Hungary"],
  "Bulgaria": ["Sofia", "Plovdiv", "Varna", "Burgas", "Veliko Tarnovo", "Ruse", "Stara Zagora"],
  "Croatia": ["Dalmatia", "Istria", "Zagreb", "Dubrovnik-Neretva", "Split-Dalmatia", "Zadar", "Kvarner"],
  "Serbia": ["Belgrade", "Novi Sad", "Niš", "Kragujevac", "Subotica", "Zlatibor", "Vojvodina"],
  "Slovenia": ["Ljubljana", "Maribor", "Bled", "Coastal–Karst", "Upper Carniola", "Lower Styria", "Prekmurje"],
  "Slovakia": ["Bratislava", "Košice", "Tatra Mountains", "Banská Bystrica", "Nitra", "Žilina", "Prešov"],
  "Estonia": ["Tallinn", "Tartu", "Pärnu", "Saaremaa", "Narva", "Viljandi", "Ida-Viru"],
  "Latvia": ["Riga", "Jurmala", "Liepāja", "Daugavpils", "Sigulda", "Ventspils", "Cēsis"],
  "Lithuania": ["Vilnius", "Kaunas", "Klaipėda", "Palanga", "Druskininkai", "Trakai", "Curonian Spit"],
  "Cyprus": ["Limassol", "Paphos", "Nicosia", "Larnaca", "Famagusta", "Kyrenia", "Troodos"],
  "Malta": ["Valletta", "Sliema", "St. Julian's", "Gozo", "Mdina", "Three Cities", "Northern Region"],
  "Luxembourg": ["Luxembourg City", "Esch-sur-Alzette", "Differdange", "Dudelange", "Ettelbruck", "Diekirch", "Echternach"],
  "Iceland": ["Reykjavík", "South Region", "Northeast Region", "East Region", "West Fjords", "Capital Region", "South Peninsula"],
  "Trinidad and Tobago": ["Port of Spain", "San Fernando", "Arima", "Chaguanas", "Point Fortin", "Tobago", "Diego Martin"]
};

// Get area details for postcode search
export const getAreaDetails = async (
  searchQuery: string, 
  apiKey: string
): Promise<AreaMatch> => {
  console.log(`Getting details for: ${searchQuery}`);
  
  // This is a mock implementation
  if (!apiKey) {
    console.warn("No API key provided. Using mock data.");
  }
  
  // Wait to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate generic area data
  return {
    name: searchQuery,
    matchPercentage: 85,
    description: `${searchQuery} is a residential area with a mix of properties and good amenities.`,
    poshScore: 75,
    coordinates: {
      lat: 51.5 + (Math.random() * 0.1 - 0.05),
      lng: -0.1 + (Math.random() * 0.2 - 0.1)
    },
    amenities: ["Parks", "Restaurants", "Schools", "Transport"],
    areaStats: {
      crimeRate: "Low to medium",
      transportScore: "Good",
      walkability: "Very good",
      propertyGrowth: {
        flats: "+3.2% per year",
        houses: "+4.1% per year"
      },
      areaVibe: ["Family-friendly", "Residential", "Convenient"]
    },
    pros: ["Good transport links", "Local amenities", "Residential feel"],
    cons: ["Average property prices", "Some busy roads"],
    propertyPrices: {
      flatTwoBed: 350000 + (Math.random() * 100000),
      houseThreeBed: 550000 + (Math.random() * 150000)
    }
  };
};

// Simulate OpenAI API call
export const analyzeAreaPreferences = async (
  userInput: string, 
  apiKey: string,
  mapMode: 'london' | 'uk' | 'europe' = 'london',
  nearestCity: string = 'none'
): Promise<AreaMatch[]> => {
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

// New function to get European countries and their regions
export const getEuropeanCountriesAndRegions = () => {
  return europeanCountriesAndRegions;
};
