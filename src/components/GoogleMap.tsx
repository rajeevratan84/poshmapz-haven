
import React, { useEffect, useRef } from 'react';

interface GoogleMapProps {
  address?: string;
  zoom?: number;
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  address = "Richmond, London, UK",
  zoom = 14,
  className = "h-[400px] md:h-[500px] w-full rounded-lg",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined' || !mapRef.current) return;

    // Initialize map only once
    const initMap = () => {
      if (mapInstanceRef.current) return;
      
      // Default coordinates for Richmond, London
      const defaultPosition = { lat: 51.461, lng: -0.306 };
      
      // Create the map instance
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        zoom,
        center: defaultPosition,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "administrative.neighborhood",
            elementType: "labels",
            stylers: [{ visibility: "on" }],
          },
          {
            featureType: "transit",
            elementType: "labels",
            stylers: [{ visibility: "on" }],
          },
        ],
      });
      
      // If we have an address, geocode it
      if (address) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
          if (status === "OK" && results?.[0]?.geometry?.location && mapInstanceRef.current) {
            const location = results[0].geometry.location;
            mapInstanceRef.current.setCenter(location);
            
            // Add a marker
            new google.maps.Marker({
              map: mapInstanceRef.current,
              position: location,
              animation: google.maps.Animation.DROP,
            });
            
            // Add an info window
            const infoWindow = new google.maps.InfoWindow({
              content: `<div><strong>Richmond, London</strong><p>A beautiful riverside area with excellent parks and quality of life.</p></div>`,
            });
            
            // Open info window on marker click
            mapInstanceRef.current.addListener("click", () => {
              infoWindow.open(mapInstanceRef.current);
            });
          }
        });
      }
    };

    // Load Google Maps API if it's not already loaded
    if (!window.google?.maps) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    } else {
      initMap();
    }
  }, [address, zoom]);

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full rounded-lg shadow-lg" />
      <p className="text-xs text-center mt-2 text-posh-dark/60">
        Note: You'll need to replace YOUR_API_KEY with a valid Google Maps API key.
      </p>
    </div>
  );
};

export default GoogleMap;
