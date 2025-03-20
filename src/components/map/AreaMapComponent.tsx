
import React, { useState, useEffect } from 'react';
import GoogleMap from '@/components/GoogleMap';
import AddressMarker from './AddressMarker';
import AreaMarker from './AreaMarker';
import { AreaMatch } from '@/types/area';

export interface AreaMapComponentProps {
  results: AreaMatch[];
  selectedArea: AreaMatch | null;
  onAreaSelected: (area: AreaMatch) => void;
  locationType?: 'london' | 'world';
  country?: string;
}

const AreaMapComponent: React.FC<AreaMapComponentProps> = ({ 
  results, 
  selectedArea, 
  onAreaSelected,
  locationType = 'london',
  country
}) => {
  // If we have a selectedArea, center on it, otherwise use default center
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(
    // Default center for London
    { lat: 51.509865, lng: -0.118092 }
  );
  
  // Update the map center when a different country is selected or when results change
  useEffect(() => {
    if (locationType === 'london') {
      // Default for London
      setMapCenter({ lat: 51.509865, lng: -0.118092 });
    } else if (results.length > 0) {
      // Use the first result's coordinates
      setMapCenter(results[0].coordinates);
    } else {
      // Default centers for common countries
      const defaultCenters: Record<string, google.maps.LatLngLiteral> = {
        'United States': { lat: 37.0902, lng: -95.7129 },
        'Canada': { lat: 56.1304, lng: -106.3468 },
        'Australia': { lat: -25.2744, lng: 133.7751 },
        'France': { lat: 46.2276, lng: 2.2137 },
        'Germany': { lat: 51.1657, lng: 10.4515 },
        'Spain': { lat: 40.4637, lng: -3.7492 },
        'Italy': { lat: 41.8719, lng: 12.5674 },
        'Japan': { lat: 36.2048, lng: 138.2529 },
        'Brazil': { lat: -14.2350, lng: -51.9253 },
        'Mexico': { lat: 23.6345, lng: -102.5528 },
        'South Africa': { lat: -30.5595, lng: 22.9375 },
        'India': { lat: 20.5937, lng: 78.9629 },
        'China': { lat: 35.8617, lng: 104.1954 },
        'Singapore': { lat: 1.3521, lng: 103.8198 },
        'United Arab Emirates': { lat: 23.4241, lng: 53.8478 },
        'New Zealand': { lat: -40.9006, lng: 174.8860 },
        'Thailand': { lat: 15.8700, lng: 100.9925 },
        'Portugal': { lat: 39.3999, lng: -8.2245 },
        'Netherlands': { lat: 52.1326, lng: 5.2913 }
      };
      
      if (country && defaultCenters[country]) {
        setMapCenter(defaultCenters[country]);
      } else {
        // Fallback to a world-centric view
        setMapCenter({ lat: 20, lng: 0 });
      }
    }
  }, [locationType, country, results]);

  // Update map center when a new area is selected
  useEffect(() => {
    if (selectedArea) {
      setMapCenter(selectedArea.coordinates);
    }
  }, [selectedArea]);
  
  // Calculate appropriate zoom level
  const getZoomLevel = () => {
    if (results.length === 0) {
      // Default zoom for different location types
      return locationType === 'london' ? 11 : 5;
    }
    
    if (selectedArea) {
      // Zoom in when an area is selected
      return 14;
    }
    
    // Default zoom when results are available but none selected
    return locationType === 'london' ? 11 : 10;
  };

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <GoogleMap
        center={mapCenter}
        zoom={getZoomLevel()}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          styles: [
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#ffffff" }]
            },
            {
              featureType: "all",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#000000" }, { lightness: 13 }]
            },
            {
              featureType: "administrative",
              elementType: "geometry.fill",
              stylers: [{ color: "#000000" }]
            },
            {
              featureType: "administrative",
              elementType: "geometry.stroke",
              stylers: [{ color: "#144b53" }, { lightness: 14 }, { weight: 1.4 }]
            },
            {
              featureType: "landscape",
              elementType: "all",
              stylers: [{ color: "#08304b" }]
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [{ color: "#0c4152" }, { lightness: 5 }]
            },
            {
              featureType: "road.highway",
              elementType: "geometry.fill",
              stylers: [{ color: "#000000" }]
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [{ color: "#0b434f" }, { lightness: 25 }]
            },
            {
              featureType: "road.arterial",
              elementType: "geometry.fill",
              stylers: [{ color: "#000000" }]
            },
            {
              featureType: "road.arterial",
              elementType: "geometry.stroke",
              stylers: [{ color: "#0b3d51" }, { lightness: 16 }]
            },
            {
              featureType: "road.local",
              elementType: "geometry",
              stylers: [{ color: "#000000" }]
            },
            {
              featureType: "transit",
              elementType: "all",
              stylers: [{ color: "#146474" }]
            },
            {
              featureType: "water",
              elementType: "all",
              stylers: [{ color: "#021019" }]
            }
          ]
        }}
      >
        {results.map((area) => (
          <AreaMarker
            key={area.name}
            area={area}
            isSelected={selectedArea?.name === area.name}
            onClick={() => onAreaSelected(area)}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default AreaMapComponent;
