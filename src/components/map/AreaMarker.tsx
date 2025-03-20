
import React, { useEffect } from 'react';
import { AreaInfo, createAreaInfoContent } from '@/utils/mapUtils';
import { AreaMatch } from '@/types/area';

interface AreaMarkerProps {
  area: AreaInfo | AreaMatch;
  map: google.maps.Map;
  infoWindow: google.maps.InfoWindow;
  isSelected?: boolean;
  onClick?: () => void;
  matchPercentage?: number;
}

const AreaMarker: React.FC<AreaMarkerProps> = ({ 
  area, 
  map, 
  infoWindow, 
  isSelected = false,
  onClick,
  matchPercentage = 0 
}) => {
  useEffect(() => {
    if (!map) return;

    // Determine if we're dealing with AreaInfo or AreaMatch
    const isAreaMatch = 'name' in area && 'matchPercentage' in area;
    
    // Define position, title, and match text based on the type
    const position = isAreaMatch 
      ? (area as AreaMatch).coordinates 
      : (area as AreaInfo).position;
      
    const title = isAreaMatch 
      ? (area as AreaMatch).name 
      : (area as AreaInfo).title;
      
    const matchText = isAreaMatch 
      ? `${(area as AreaMatch).matchPercentage}% match` 
      : (area as AreaInfo).match;

    // Get first letter of the area name to display in marker
    const areaFirstLetter = title.charAt(0);
    
    // Create a custom marker with SVG - highlight if selected
    const markerColor = isSelected ? '#22C55E' : '#FF7F50';
    const markerSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="16" fill="${markerColor}" stroke="white" stroke-width="2" />
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
      position: position,
      map: map,
      animation: google.maps.Animation.DROP,
      title: `${title} - ${matchText}`,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(markerSvg),
        // Use object literals instead of Size constructor
        scaledSize: { width: 36, height: 36 } as google.maps.Size,
        // Use object literals instead of Point constructor
        anchor: { x: 18, y: 18 } as google.maps.Point
      }
    });

    // Create content string based on the type
    let contentString;
    if (isAreaMatch) {
      const areaMatch = area as AreaMatch;
      contentString = `
        <div class="p-3 max-w-xs">
          <div class="flex justify-between items-center mb-1">
            <div class="font-medium text-gray-800">${areaMatch.name}</div>
            <div class="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded">${areaMatch.matchPercentage}% match</div>
          </div>
          <div class="text-xs font-semibold text-green-600 mb-1">Posh Score: ${areaMatch.poshScore}/100</div>
          <div class="text-xs text-gray-600">${areaMatch.description}</div>
        </div>
      `;
    } else {
      contentString = createAreaInfoContent(area as AreaInfo);
    }
    
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
    
    // Show info on click and trigger onClick if provided
    marker.addListener("click", () => {
      infoWindow.setContent(contentString);
      infoWindow.open(map, marker);
      if (onClick) onClick();
    });

    // Clean up
    return () => {
      marker.setMap(null);
    };
  }, [area, map, infoWindow, isSelected, onClick, matchPercentage]);

  return null; // This is a non-visual component
};

export default AreaMarker;
