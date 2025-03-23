import React, { useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface AddressMarkerProps {
  address: string;
  map: google.maps.Map | null;
}

const AddressMarker: React.FC<AddressMarkerProps> = ({ address, map }) => {
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    // Clear any existing marker
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }

    // Create a marker at the default position initially
    const defaultPosition = { lat: 51.461, lng: -0.306 }; // Richmond, London
    
    markerRef.current = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: defaultPosition,
      title: address
    });

    // If we have an address, try to geocode it
    if (address) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results?.[0]?.geometry?.location && map && markerRef.current) {
          const location = results[0].geometry.location;
          map.setCenter(location);
          markerRef.current.setPosition(location);
        } else {
          console.error("Geocoding failed:", status);
          // Keep default location if geocoding fails
        }
      });
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
