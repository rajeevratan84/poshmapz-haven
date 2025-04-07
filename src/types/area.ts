
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
}
