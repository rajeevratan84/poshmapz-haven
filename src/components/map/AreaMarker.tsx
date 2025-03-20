
import React, { useEffect } from 'react';
import { AreaInfo, createAreaInfoContent } from '@/utils/mapUtils';

interface AreaMarkerProps {
  area: AreaInfo;
  map: google.maps.Map;
  infoWindow: google.maps.InfoWindow;
  matchPercentage?: number;
}

const AreaMarker: React.FC<AreaMarkerProps> = ({ area, map, infoWindow, matchPercentage = 0 }) => {
  useEffect(() => {
    if (!map) return;

    // Create marker (without custom styling)
    const marker = new google.maps.Marker({
      position: area.position,
      map: map,
      animation: google.maps.Animation.DROP,
      title: `${area.title} - ${area.match}`
    });

    const contentString = createAreaInfoContent(area);
    
    // Add event listeners for hover
    marker.addListener("mouseover", () => {
      infoWindow.setContent(contentString);
      infoWindow.open(map, marker);
    });
    
    // Optional: close on mouseout
    marker.addListener("mouseout", () => {
      setTimeout(() => {
        infoWindow.close();
      }, 1000);
    });
    
    // Also show info on click for mobile devices
    marker.addListener("click", () => {
      infoWindow.setContent(contentString);
      infoWindow.open(map, marker);
    });

    // Clean up
    return () => {
      marker.setMap(null);
    };
  }, [area, map, infoWindow, matchPercentage]);

  return null; // This is a non-visual component
};

export default AreaMarker;
