
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

    // Clear any existing marker
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }

    try {
      // Create a marker at the default position initially
      const defaultPosition = { lat: 51.461, lng: -0.306 }; // Richmond, London
      
      markerRef.current = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: defaultPosition,
        title: address
      });

      console.log("Created initial marker at default position", defaultPosition);

      // If we have an address, try to geocode it
      if (address) {
        const geocoder = new google.maps.Geocoder();
        
        geocoder.geocode({ address }, (results, status) => {
          try {
            console.log("Geocode results:", results, "status:", status);
            
            if (status === "OK" && results && results.length > 0 && results[0].geometry && results[0].geometry.location) {
              const location = results[0].geometry.location;
              
              console.log(`Successfully geocoded ${address} to:`, location.toString());
              
              if (map && markerRef.current) {
                map.setCenter(location);
                markerRef.current.setPosition(location);
                console.log("Map centered and marker positioned at:", location.toString());
              } else {
                console.error("Map or marker ref not available for setting position");
              }
            } else {
              console.warn(`Geocoding failed for ${address}: ${status}`);
              
              // Use the static coordinates as fallback
              const fallbackCoordinates = {
                'Richmond, London, UK': { lat: 51.461, lng: -0.306 }
              };
              
              if (fallbackCoordinates[address] && map && markerRef.current) {
                const fallbackLocation = fallbackCoordinates[address];
                map.setCenter(fallbackLocation);
                markerRef.current.setPosition(fallbackLocation);
                console.log("Using fallback location:", fallbackLocation);
              }
            }
          } catch (error) {
            console.error("Error processing geocode results:", error);
          }
        });
      }
    } catch (error) {
      console.error("Error in AddressMarker:", error);
    }

    // Clean up
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [address, map]);

  return null; // This is a non-visual component
};

export default AddressMarker;
