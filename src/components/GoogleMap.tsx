
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
  const scriptLoadedRef = useRef<boolean>(false);

  useEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined' || !mapRef.current) return;

    // Initialize map only once
    const initMap = () => {
      if (mapInstanceRef.current) return;
      
      // Default coordinates for Richmond, London
      const defaultPosition = { lat: 51.461, lng: -0.306 };
      
      try {
        // Create the map instance
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          zoom,
          center: defaultPosition,
          mapTypeControl: false, // Reducing UI elements for performance
          streetViewControl: false, // Reducing UI elements for performance
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
    if (!window.google?.maps && !scriptLoadedRef.current) {
      scriptLoadedRef.current = true;
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
      
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`; // Added async loading
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = () => {
        console.error("Failed to load Google Maps API");
        toast.error("Could not load Google Maps. Please try again later.");
        scriptLoadedRef.current = false;
      };
      document.head.appendChild(script);
      
      return () => {
        // Clean up if component unmounts before script loads
        if (script.parentNode) {
          script.parentNode.removeChild(script);
          scriptLoadedRef.current = false;
        }
      };
    } else if (window.google?.maps) {
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

export default GoogleMap;
