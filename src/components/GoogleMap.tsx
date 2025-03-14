
import React, { useEffect, useRef } from 'react';
import { toast } from 'sonner';

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
  const apiLoadedRef = useRef<boolean>(false);
  
  useEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined' || !mapRef.current) return;

    // Initialize map only once
    const initMap = () => {
      if (mapInstanceRef.current) return;
      
      try {
        // Default coordinates for Richmond, London
        const defaultPosition = { lat: 51.461, lng: -0.306 };
        
        // Create the map instance
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          zoom,
          center: defaultPosition,
          mapTypeControl: false,
          streetViewControl: false,
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
        
        // Add a marker at the default location
        new google.maps.Marker({
          map: mapInstanceRef.current,
          position: defaultPosition,
          animation: google.maps.Animation.DROP,
        });
        
        // If we have an address, try to geocode it
        if (address) {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ address }, (results, status) => {
            if (status === "OK" && results?.[0]?.geometry?.location && mapInstanceRef.current) {
              const location = results[0].geometry.location;
              mapInstanceRef.current.setCenter(location);
              
              // Update marker position
              new google.maps.Marker({
                map: mapInstanceRef.current,
                position: location,
                animation: google.maps.Animation.DROP,
              });
            }
          });
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    // Load Google Maps API if it's not already loaded
    if (!window.google?.maps && !apiLoadedRef.current) {
      apiLoadedRef.current = true;
      
      // Ensure we're using the right API key from .env
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
      
      // Make sure we request geocoding explicitly
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geocoding&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      
      // Use a global callback function to initialize the map
      window.initGoogleMaps = initMap;
      
      script.onerror = () => {
        console.error("Failed to load Google Maps API");
        toast.error("Could not load Google Maps. Please try again later.");
        apiLoadedRef.current = false;
      };
      
      document.head.appendChild(script);
      
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
          apiLoadedRef.current = false;
          delete window.initGoogleMaps;
        }
      };
    } else if (window.google?.maps) {
      // If API is already loaded, initialize map directly
      initMap();
    }
  }, [address, zoom]);

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full rounded-lg shadow-lg" />
      <div className="text-xs text-center mt-2 text-posh-dark/60">
        <p>Viewing: Richmond, London</p>
      </div>
    </div>
  );
};

// Add this to allow the window.initGoogleMaps global callback
declare global {
  interface Window {
    initGoogleMaps: () => void;
  }
}

export default GoogleMap;
