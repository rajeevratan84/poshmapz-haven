
import React, { useEffect, useState } from 'react';
import AreaMarker from './AreaMarker';

export interface AreaInfo {
  name: string;
  coordinates: { lat: number, lng: number };
  description?: string;
  matchPercentage: number;
  poshScore: number;
}

interface NorthLondonAreasProps {
  map: google.maps.Map | null;
  infoWindow: google.maps.InfoWindow | null;
}

const NorthLondonAreas: React.FC<NorthLondonAreasProps> = ({ map, infoWindow }) => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  
  // Define areas with clearer coordinates
  const areas: AreaInfo[] = [
    { 
      name: "Highbury", 
      coordinates: { lat: 51.5485, lng: -0.1028 }, 
      matchPercentage: 94, 
      poshScore: 80,
      description: "Leafy, affluent, and home to professionals. Less flashy than neighbouring Islington but still well-regarded."
    },
    { 
      name: "Islington", 
      coordinates: { lat: 51.5331, lng: -0.1054 }, 
      matchPercentage: 91, 
      poshScore: 85,
      description: "Trendy, wealthy, and full of period townhouses, upscale restaurants, and boutique shops. A strong mix of old wealth and gentrification."
    },
    { 
      name: "Stoke Newington", 
      coordinates: { lat: 51.5624, lng: -0.0792 }, 
      matchPercentage: 87, 
      poshScore: 75,
      description: "Bohemian area with a village feel, diverse population, and a mix of Victorian houses and new builds. Popular with young families and creatives."
    }
  ];

  useEffect(() => {
    // Log to ensure component is rendering with valid props
    console.log("NorthLondonAreas rendering with map:", !!map, "and infoWindow:", !!infoWindow);
    console.log("Areas to be displayed:", areas);
  }, [map, infoWindow]);
  
  if (!map || !infoWindow) {
    console.warn("Map or InfoWindow not available for NorthLondonAreas");
    return null;
  }
  
  return (
    <>
      {areas.map((area) => (
        <AreaMarker
          key={area.name}
          map={map}
          position={area.coordinates}
          name={area.name}
          matchPercentage={area.matchPercentage}
          poshScore={area.poshScore}
          description={area.description}
          onClick={() => setSelectedArea(area.name)}
          isSelected={selectedArea === area.name}
          infoWindow={infoWindow}
        />
      ))}
    </>
  );
};

export default NorthLondonAreas;
