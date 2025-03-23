
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
      try {
        markerRef.current = new google.maps.Marker({
          position,
          map,
          title: name,
          animation: google.maps.Animation.DROP,
          // Remove optimized property as it's not recognized
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
      } catch (error) {
        console.error(`Error creating marker for ${name}:`, error);
      }
    } else {
      // Update existing marker
      try {
        markerRef.current.setPosition(position);
        markerRef.current.setTitle(name);
        console.log(`Marker updated for ${name}`);
      } catch (error) {
        console.error(`Error updating marker for ${name}:`, error);
      }
    }

    // Apply styling for selected state
    if (markerRef.current) {
      try {
        // Set zIndex for selected marker
        markerRef.current.setZIndex(isSelected ? 100 : 10);
        
        if (isSelected) {
          // Use a custom icon for selected marker - safer approach
          const icon = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#22c55e', // green-600
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          };
          
          // Only call setIcon if it exists
          markerRef.current.setIcon(icon);
          
          // Open info window for selected marker
          infoWindow.setContent(contentString);
          infoWindow.open(map, markerRef.current);
        } else {
          // Reset to default marker if not selected
          markerRef.current.setIcon(null);
        }
      } catch (error) {
        console.error(`Error styling marker for ${name}:`, error);
      }
    }

    // Clean up on unmount
    return () => {
      if (markerRef.current) {
        try {
          markerRef.current.setMap(null);
          markerRef.current = null;
        } catch (error) {
          console.error(`Error cleaning up marker for ${name}:`, error);
        }
      }
    };
  }, [map, position, name, matchPercentage, poshScore, description, onClick, isSelected, infoWindow]);

  return null; // This is a non-visual component
};

export default AreaMarker;
