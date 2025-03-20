
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

    // Get first letter of the area name to display in marker
    const areaFirstLetter = area.title.charAt(0);
    
    // Create a custom marker with SVG
    const markerSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="16" fill="#FF7F50" stroke="white" stroke-width="2" />
        <text 
          x="18" 
          y="22" 
          font-family="Arial" 
          font-size="14" 
          font-weight="bold" 
          text-anchor="middle" 
          fill="white"
        >
          ${areaFirstLetter}
        </text>
      </svg>
    `;

    // Create marker with custom icon - use object literals instead of constructors
    const marker = new google.maps.Marker({
      position: area.position,
      map: map,
      animation: google.maps.Animation.DROP,
      title: `${area.title} - ${area.match}`,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(markerSvg),
        // Use object literals instead of Size constructor
        scaledSize: { width: 36, height: 36 } as google.maps.Size,
        // Use object literals instead of Point constructor
        anchor: { x: 18, y: 18 } as google.maps.Point
      }
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
