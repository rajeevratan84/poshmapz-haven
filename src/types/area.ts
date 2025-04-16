
export interface AreaStats {
  crimeRate: string;
  transportScore: string;
  walkability: string;
  propertyGrowth: {
    flats: string;
    houses: string;
  };
  areaVibe: string[];
}

export interface AreaMatch {
  name: string;
  matchPercentage: number;
  description: string;
  poshScore: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  amenities: string[];
  areaStats: AreaStats;
  // Extended fields for enhanced data
  areaType?: string;
  history?: string;
  demographics?: string;
  attractions?: string;
  recentTrends?: string;
  gentrificationIndex?: number;
  pros?: string[];
  cons?: string[];
  matchingAmenities?: string[];
  propertyPrices?: {
    flatTwoBed: number;
    houseThreeBed: number;
  };
  // New fields for improved area description
  livingDescription?: string;
  postcodeSpecifics?: string;
  // Field to track if this result is saved
  savedAt?: string;
  savedFrom?: 'postcode' | 'ai-search';
  id?: string;
}

export interface AreaData {
  name: string;
  poshScore: number;
  averagePrice: number;
  propertyPrices?: {
    flatTwoBed: number;
    houseThreeBed: number;
  };
  crimeIndex: number;
  transportScore: number;
  greenSpaceAccess: number;
  amenityDensity: number;
  walkability: number;
  priceGrowth: number;
  scoreBreakdown: {
    property: number;
    safety: number;
    transport: number;
    lifestyle: number;
    environment: number;
  };
  areaType?: string;
  description?: string;
  history?: string;
  demographics?: string;
  attractions?: string;
  recentTrends?: string;
  gentrificationIndex?: number;
  matchPercentage?: number;
  pros?: string[];
  cons?: string[];
  amenities?: string[];
  areaStats?: AreaStats;
  areaVibe?: string[];
  crimeRateDescription?: string;
  transportDescription?: string;
  walkabilityDescription?: string;
  propertyGrowthDetails?: {
    flats: string;
    houses: string;
  };
  matchingAmenities?: string[];
  // New fields for improved area description
  livingDescription?: string;
  postcodeSpecifics?: string;
  // Field to track if this result is saved
  savedAt?: string;
  savedFrom?: 'postcode' | 'ai-search';
  id?: string;
}
