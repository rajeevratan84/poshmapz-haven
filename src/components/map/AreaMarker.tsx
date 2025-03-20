
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

    // Color the marker based on match percentage
    let markerColor = '#4ade80'; // Default green
    
    if (matchPercentage) {
      if (matchPercentage > 90) {
        markerColor = '#22c55e'; // Dark green for high match
      } else if (matchPercentage > 80) {
        markerColor = '#4ade80'; // Medium green
      } else if (matchPercentage > 70) {
        markerColor = '#86efac'; // Light green
      } else {
        markerColor = '#a3e635'; // Yellow-green for lower matches
      }
    }

    // Create custom marker with colored label background
    const marker = new google.maps.Marker({
      position: area.position,
      map: map,
      animation: google.maps.Animation.DROP,
      label: {
        text: area.label,
        color: 'white',
        fontWeight: 'bold',
        fontSize: '14px',
        className: 'marker-label'
      },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: markerColor,
        fillOpacity: 0.9,
        strokeWeight: 2,
        strokeColor: '#ffffff',
        scale: 12,
      },
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
