
import React, { useEffect, useRef } from 'react';

interface AreaMarkerProps {
  map: google.maps.Map;
  position: google.maps.LatLngLiteral;
  name: string;
  matchPercentage: number;
  poshScore: number;
  description?: string;
  onClick?: () => void;
  isSelected?: boolean;
  infoWindow: google.maps.InfoWindow;
}

const AreaMarker: React.FC<AreaMarkerProps> = ({
  map,
  position,
  name,
  matchPercentage,
  poshScore,
  description = "",
  onClick,
  isSelected = false,
  infoWindow
}) => {
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    // Create the HTML content for the info window
    const contentString = `
      <div class="p-3 max-w-xs">
        <div class="flex justify-between items-center mb-1">
          <div class="font-medium text-gray-800">${name}</div>
          <div class="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded">${matchPercentage}% match</div>
        </div>
        <div class="text-xs font-semibold text-green-600 mb-1">Posh Score: ${poshScore}/100</div>
        ${description ? `<div class="text-xs text-gray-600">${description}</div>` : ''}
      </div>
    `;

    // Create marker if it doesn't exist
    if (!markerRef.current) {
      markerRef.current = new google.maps.Marker({
        position,
        map,
        title: name,
        animation: google.maps.Animation.DROP
      });

      // Add click event listener
      markerRef.current.addListener('click', () => {
        infoWindow.setContent(contentString);
        infoWindow.open(map, markerRef.current);
        if (onClick) onClick();
      });
    }

    // Update marker properties
    if (markerRef.current) {
      markerRef.current.setPosition(position);
      
      // Apply styling for selected state
      if (isSelected) {
        markerRef.current.setZIndex(100);
        
        const labelOptions = {
          text: matchPercentage.toString() + '%',
          color: 'white',
          fontSize: '10px',
          fontWeight: 'bold'
        };
        
        markerRef.current.setLabel(labelOptions);
        
        // Open info window
        infoWindow.setContent(contentString);
        infoWindow.open(map, markerRef.current);
      } else {
        markerRef.current.setZIndex(undefined);
        markerRef.current.setLabel(null);
      }
    }

    // Clean up on unmount
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
    };
  }, [map, position, name, matchPercentage, poshScore, description, onClick, isSelected, infoWindow]);

  return null; // This is a non-visual component
};

export default AreaMarker;
