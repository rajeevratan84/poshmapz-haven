
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

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
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  
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

  // Clear markers when component unmounts
  useEffect(() => {
    return () => {
      markers.forEach(marker => {
        if (marker) marker.setMap(null);
      });
    };
  }, [markers]);

  useEffect(() => {
    // Log to ensure component is rendering with valid props
    console.log("NorthLondonAreas rendering with map:", !!map, "and infoWindow:", !!infoWindow);
    
    if (!map || !infoWindow) {
      console.warn("Map or InfoWindow not available for NorthLondonAreas");
      return;
    }

    // Clear existing markers
    markers.forEach(marker => {
      if (marker) marker.setMap(null);
    });
    
    // Create new markers
    const newMarkers: google.maps.Marker[] = [];
    
    areas.forEach((area) => {
      try {
        console.log(`Creating marker for ${area.name} at:`, area.coordinates);
        
        // Create marker content
        const contentString = `
          <div class="p-3 max-w-xs">
            <div class="flex justify-between items-center mb-1">
              <div class="font-medium text-gray-800">${area.name}</div>
              <div class="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded">${area.matchPercentage}% match</div>
            </div>
            <div class="text-xs font-semibold text-green-600 mb-1">Posh Score: ${area.poshScore}/100</div>
            ${area.description ? `<div class="text-xs text-gray-600">${area.description}</div>` : ''}
          </div>
        `;
        
        // Create marker
        const marker = new google.maps.Marker({
          position: area.coordinates,
          map: map,
          title: area.name,
          animation: google.maps.Animation.DROP,
          zIndex: selectedArea === area.name ? 100 : 10
        });
        
        // Add click event
        marker.addListener("click", () => {
          setSelectedArea(area.name);
          infoWindow.setContent(contentString);
          infoWindow.open(map, marker);
        });
        
        // Add hover events
        marker.addListener("mouseover", () => {
          infoWindow.setContent(contentString);
          infoWindow.open(map, marker);
        });
        
        marker.addListener("mouseout", () => {
          if (selectedArea !== area.name) {
            setTimeout(() => infoWindow.close(), 1000);
          }
        });
        
        // Style selected marker
        if (selectedArea === area.name) {
          const icon = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#22c55e',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          };
          
          marker.setIcon(icon);
          infoWindow.setContent(contentString);
          infoWindow.open(map, marker);
        }
        
        newMarkers.push(marker);
        console.log(`Successfully created marker for ${area.name}`);
      } catch (error) {
        console.error(`Error creating marker for ${area.name}:`, error);
      }
    });
    
    setMarkers(newMarkers);
    console.log(`Created ${newMarkers.length} markers for North London areas`);
    
    // Fit map bounds to show all markers
    if (newMarkers.length > 0) {
      try {
        const bounds = new google.maps.LatLngBounds();
        newMarkers.forEach(marker => {
          const position = marker.getPosition();
          if (position) bounds.extend(position);
        });
        map.fitBounds(bounds);
      } catch (error) {
        console.error("Error adjusting map bounds:", error);
      }
    }
  }, [map, infoWindow, selectedArea, areas]);
  
  return null; // This component doesn't render any UI elements
};

export default NorthLondonAreas;
