
import React, { useEffect } from 'react';

interface AreaMarkerProps {
  map: google.maps.Map;
  position: google.maps.LatLngLiteral;
  name: string;
  matchPercentage: number;
  poshScore: number;
  onClick?: () => void;
  isSelected?: boolean;
}

const AreaMarker: React.FC<AreaMarkerProps> = ({
  map,
  position,
  name,
  matchPercentage,
  poshScore,
  onClick,
  isSelected = false
}) => {
  useEffect(() => {
    if (!map) return;

    const contentString = `
      <div class="p-3 max-w-xs">
        <div class="flex justify-between items-center mb-1">
          <div class="font-medium text-gray-800">${name}</div>
          <div class="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded">${matchPercentage}% match</div>
        </div>
        <div class="text-xs font-semibold text-green-600 mb-1">Posh Score: ${poshScore}/100</div>
      </div>
    `;

    const infoWindow = new google.maps.InfoWindow({
      content: contentString,
    });

    // Create custom marker icon - use constructors directly
    const markerIcon = {
      url: '/placeholder.svg',
      scaledSize: new google.maps.Size(36, 36),
      anchor: new google.maps.Point(18, 18)
    };

    // Create marker with correct options
    const marker = new google.maps.Marker({
      position,
      map,
      title: name,
      icon: markerIcon,
      animation: google.maps.Animation.DROP
    });
    
    // Set marker z-index separately
    if (isSelected) {
      marker.setZIndex(100);
      
      // Set label only if selected
      const label = {
        text: matchPercentage.toString() + '%',
        color: 'white',
        fontSize: '10px',
        fontWeight: 'bold'
      };
      marker.setLabel(label);
      
      infoWindow.open(map, marker);
    }

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
      if (onClick) onClick();
    });

    return () => {
      marker.setMap(null);
    };
  }, [map, position, name, matchPercentage, poshScore, onClick, isSelected]);

  return null;
};

export default AreaMarker;
