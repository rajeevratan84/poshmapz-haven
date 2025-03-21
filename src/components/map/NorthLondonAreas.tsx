
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
}

const NorthLondonAreas: React.FC<NorthLondonAreasProps> = ({ map }) => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  
  const areas: AreaInfo[] = [
    { name: "Highbury", coordinates: { lat: 51.5485, lng: -0.1028 }, matchPercentage: 94, poshScore: 80 },
    { name: "Islington", coordinates: { lat: 51.5331, lng: -0.1054 }, matchPercentage: 91, poshScore: 85 },
    { name: "Stoke Newington", coordinates: { lat: 51.5624, lng: -0.0792 }, matchPercentage: 87, poshScore: 75 }
  ];
  
  if (!map) return null;
  
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
          onClick={() => setSelectedArea(area.name)}
          isSelected={selectedArea === area.name}
        />
      ))}
    </>
  );
};

export default NorthLondonAreas;
