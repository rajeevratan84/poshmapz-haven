
import React, { useState, useEffect } from 'react';
import GoogleMap from '@/components/GoogleMap';
import { AreaMatch } from '@/types/area';
import { LocationType } from '@/utils/mapUtils';

export interface AreaMapComponentProps {
  results: AreaMatch[];
  selectedArea: AreaMatch | null;
  onAreaSelected: (area: AreaMatch) => void;
  locationType?: LocationType;
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
  
  // Log results to debug
  useEffect(() => {
    console.log("Map results:", results);
    console.log("Map results count:", results.length);
  }, [results]);
  
  // Update the map center when a different country is selected or when results change
  useEffect(() => {
    if (locationType === 'london') {
      // Default for London
      setMapCenter({ lat: 51.509865, lng: -0.118092 });
    } else if (locationType === 'uk') {
      // Default for UK
      setMapCenter({ lat: 54.7023545, lng: -3.2765753 });
    } else if (results.length > 0) {
      // Use the first result's coordinates
      setMapCenter(results[0].coordinates);
    } else {
      // Default centers for common countries
      const defaultCenters: Record<string, google.maps.LatLngLiteral> = {
        'United Kingdom': { lat: 54.7023545, lng: -3.2765753 },
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
        'Netherlands': { lat: 52.1326, lng: 5.2913 },
        'Trinidad and Tobago': { lat: 10.6918, lng: -61.2225 }
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
      if (locationType === 'london') return 11;
      if (locationType === 'uk') return 6;
      return 5;
    }
    
    if (selectedArea) {
      // Zoom in when an area is selected
      return 14;
    }
    
    // Default zoom when results are available but none selected
    if (locationType === 'london') return 11;
    if (locationType === 'uk') return 8;
    return 10;
  };

  // Map styles - using a light mode style
  const mapStyles = [
    {
      "featureType": "administrative",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#444444"
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
        {
          "color": "#f2f2f2"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [
        {
          "saturation": -100
        },
        {
          "lightness": 45
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
        {
          "color": "#c4e8ff"
        },
        {
          "visibility": "on"
        }
      ]
    }
  ];

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
          styles: mapStyles
        }}
        areas={results}
        onAreaSelected={onAreaSelected}
        selectedArea={selectedArea}
      />
    </div>
  );
};

export default AreaMapComponent;
