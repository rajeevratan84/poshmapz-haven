
import React, { useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface GoogleMapProps {
  address?: string;
  zoom?: number;
  className?: string;
  showNorthLondonAreas?: boolean;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  address = "Richmond, London, UK",
  zoom = 14,
  className = "h-[400px] md:h-[500px] w-full rounded-lg",
  showNorthLondonAreas = false,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const apiLoadedRef = useRef<boolean>(false);
  const markerRef = useRef<google.maps.Marker | null>(null);
  
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
        
        // Create a marker but don't set position yet (we'll do that after geocoding)
        markerRef.current = new google.maps.Marker({
          map: mapInstanceRef.current,
          animation: google.maps.Animation.DROP,
        });
        
        // If we're showing North London areas, add those markers
        if (showNorthLondonAreas && mapInstanceRef.current) {
          const highbury = { lat: 51.5485, lng: -0.1019 };
          const islington = { lat: 51.5362, lng: -0.1033 };
          const stokeNewington = { lat: 51.5629, lng: -0.0798 };
          
          new google.maps.Marker({
            position: highbury,
            map: mapInstanceRef.current,
            animation: google.maps.Animation.DROP,
            label: "H",
            title: "Highbury - 94% match"
          });
          
          new google.maps.Marker({
            position: islington,
            map: mapInstanceRef.current,
            animation: google.maps.Animation.DROP,
            label: "I",
            title: "Islington - 91% match"
          });
          
          new google.maps.Marker({
            position: stokeNewington,
            map: mapInstanceRef.current,
            animation: google.maps.Animation.DROP,
            label: "S",
            title: "Stoke Newington - 87% match"
          });
          
          // Center between the three areas
          mapInstanceRef.current.setCenter({ lat: 51.5492, lng: -0.0950 });
          mapInstanceRef.current.setZoom(13);
          
          // If showing North London areas, we don't need to geocode the address
          return;
        }
        
        // If we have an address and we're not showing North London areas, try to geocode it
        if (address && markerRef.current) {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ address }, (results, status) => {
            if (status === "OK" && results?.[0]?.geometry?.location && mapInstanceRef.current && markerRef.current) {
              const location = results[0].geometry.location;
              mapInstanceRef.current.setCenter(location);
              
              // Update marker position instead of creating a new one
              markerRef.current.setPosition(location);
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
  }, [address, zoom, showNorthLondonAreas]);

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full rounded-lg shadow-lg" />
      <div className="text-xs text-center mt-2 text-posh-dark/60">
        <p>Viewing: {showNorthLondonAreas ? "North London Areas" : "Richmond, London"}</p>
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
