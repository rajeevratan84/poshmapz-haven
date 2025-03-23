
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
    if (!map) {
      console.error("Map not provided to AreaMarker");
      return;
    }

    console.log(`Creating/updating marker for ${name} at`, position);

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
        animation: google.maps.Animation.DROP,
        visible: true,
        zIndex: isSelected ? 100 : 10
      });

      // Add click event listener
      markerRef.current.addListener('click', () => {
        infoWindow.setContent(contentString);
        infoWindow.open(map, markerRef.current);
        if (onClick) onClick();
      });
      
      // Add mouseover/mouseout for better UX
      markerRef.current.addListener('mouseover', () => {
        infoWindow.setContent(contentString);
        infoWindow.open(map, markerRef.current);
      });
      
      markerRef.current.addListener('mouseout', () => {
        if (!isSelected) {
          setTimeout(() => infoWindow.close(), 1000);
        }
      });
      
      console.log(`Marker created for ${name}`);
    } else {
      // Update existing marker
      markerRef.current.setPosition(position);
      markerRef.current.setTitle(name);
      
      // For the setVisible and setZIndex methods, we need to check if they exist
      if (markerRef.current.setVisible) {
        markerRef.current.setVisible(true);
      }
      console.log(`Marker updated for ${name}`);
    }

    // Apply styling for selected state
    if (markerRef.current) {
      if (markerRef.current.setZIndex) {
        markerRef.current.setZIndex(isSelected ? 100 : 10);
      }
      
      if (isSelected) {
        // Use a different icon or label for selected marker
        if (markerRef.current.setIcon) {
          markerRef.current.setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#22c55e', // green-600
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          });
        }
        
        // Open info window for selected marker
        infoWindow.setContent(contentString);
        infoWindow.open(map, markerRef.current);
      } else {
        // Reset to default marker
        if (markerRef.current.setIcon) {
          markerRef.current.setIcon(null);
        }
      }
    }

    // Clean up on unmount
    return () => {
      if (markerRef.current) {
        if (markerRef.current.setVisible) {
          markerRef.current.setVisible(false);
        }
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
    };
  }, [map, position, name, matchPercentage, poshScore, description, onClick, isSelected, infoWindow]);

  return null; // This is a non-visual component
};

export default AreaMarker;
