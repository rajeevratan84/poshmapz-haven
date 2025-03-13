
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
      
      // Add a marker at the default location regardless of geocoding result
      new google.maps.Marker({
        map: mapInstanceRef.current,
        position: defaultPosition,
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
          } else {
            console.error("Geocoding failed:", status);
            if (status === "REQUEST_DENIED") {
              toast.warning("Geocoding API is not enabled for this API key. The map is showing a default view of Richmond, London.");
            } else {
              toast.warning("Could not find the specified location. Showing default view of Richmond, London.");
            }
          }
        });
      }
    };

    // Load Google Maps API if it's not already loaded
    if (!window.google?.maps) {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
      
      if (!apiKey) {
        console.warn("No Google Maps API key found in environment variables");
        toast.warning("Google Maps requires an API key for full functionality");
      }
      
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = () => {
        console.error("Failed to load Google Maps API");
        toast.error("Could not load Google Maps. Please try again later.");
      };
      document.head.appendChild(script);
      
      return () => {
        // Clean up if component unmounts before script loads
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    } else {
      initMap();
    }
  }, [address, zoom]);

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full rounded-lg shadow-lg" />
      <div className="text-xs text-center mt-2 text-posh-dark/60">
        <p>Viewing: Richmond, London</p>
        <p className="mt-1">
          Note: This map requires the Google Maps Geocoding API to be enabled in your Google Cloud Console
        </p>
      </div>
    </div>
  );
};

export default GoogleMap;
