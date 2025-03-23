
import React, { useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface AddressMarkerProps {
  address: string;
  map: google.maps.Map | null;
}

const AddressMarker: React.FC<AddressMarkerProps> = ({ address, map }) => {
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!map) {
      console.error("Map not provided to AddressMarker");
      return;
    }

    console.log(`Setting up address marker for: ${address}`);

    // Clean up function to remove marker on unmount
    const cleanUp = () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
    };

    // Clear any existing marker
    cleanUp();

    // Fixed coordinates for specific locations
    const fixedCoordinates: Record<string, google.maps.LatLngLiteral> = {
      'Richmond, London, UK': { lat: 51.461, lng: -0.306 },
      'London, UK': { lat: 51.507, lng: -0.127 }
    };

    try {
      // Create a marker with default position
      const initialPosition = fixedCoordinates[address] || { lat: 51.507, lng: -0.127 }; // London center as default
      
      console.log(`Creating initial marker at position:`, initialPosition);
      
      markerRef.current = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: initialPosition,
        title: address
      });

      // Center map on the marker
      map.setCenter(initialPosition);
      
      console.log(`Map centered on position:`, initialPosition);

      // If address doesn't have fixed coordinates, try geocoding
      if (!fixedCoordinates[address]) {
        const geocoder = new google.maps.Geocoder();
        
        geocoder.geocode({ address }, (results, status) => {
          try {
            console.log("Geocode results:", results, "status:", status);
            
            if (status === "OK" && results && results.length > 0 && results[0].geometry?.location) {
              const location = results[0].geometry.location;
              const lat = location.lat();
              const lng = location.lng();
              
              console.log(`Successfully geocoded ${address} to:`, { lat, lng });
              
              if (map && markerRef.current) {
                map.setCenter({ lat, lng });
                markerRef.current.setPosition({ lat, lng });
                console.log("Map centered and marker positioned at:", { lat, lng });
              }
            } else {
              console.warn(`Geocoding failed for ${address}: ${status}`);
              // We're already using the default position, so no need for further fallback
            }
          } catch (error) {
            console.error("Error processing geocode results:", error);
          }
        });
      }
    } catch (error) {
      console.error("Error in AddressMarker:", error);
      toast.error("Failed to display location marker");
    }

    // Clean up on unmount
    return cleanUp;
  }, [address, map]);

  return null; // This is a non-visual component
};

export default AddressMarker;
