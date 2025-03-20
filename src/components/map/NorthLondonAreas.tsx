
import React, { useEffect } from 'react';
import AreaMarker from './AreaMarker';
import { getNorthLondonAreas } from '@/utils/mapUtils';

interface NorthLondonAreasProps {
  map: google.maps.Map | null;
  infoWindow: google.maps.InfoWindow | null;
}

const NorthLondonAreas: React.FC<NorthLondonAreasProps> = ({ map, infoWindow }) => {
  useEffect(() => {
    if (!map || !infoWindow) return;
    
    // Center between the three areas
    map.setCenter({ lat: 51.5492, lng: -0.0950 });
    map.setZoom(13);

    return () => {
      // No cleanup needed here since AreaMarker components handle their own cleanup
    };
  }, [map, infoWindow]);

  if (!map || !infoWindow) return null;

  const areas = getNorthLondonAreas();

  return (
    <>
      {areas.map((area) => (
        <AreaMarker 
          key={area.title} 
          area={area} 
          map={map} 
          infoWindow={infoWindow} 
        />
      ))}
    </>
  );
};

export default NorthLondonAreas;
