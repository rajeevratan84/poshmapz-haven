
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { loadGoogleMapsScript, mapStyles, DEFAULT_COORDINATES } from '@/utils/mapUtils';
import NorthLondonAreas from './map/NorthLondonAreas';
import AddressMarker from './map/AddressMarker';

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
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  
  // Determine the initial map center based on showNorthLondonAreas
  const getInitialCenter = () => {
    return showNorthLondonAreas ? 
      { lat: 51.5485, lng: -0.0900 } : // Center on North London
      DEFAULT_COORDINATES; // Default coordinates (Richmond)
  };
  
  // Initialize the map
  useEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined' || !mapRef.current) return;
    
    console.log("GoogleMap initializing with showNorthLondonAreas:", showNorthLondonAreas);

    // Initialize map only once
    const initMap = () => {
      if (!mapRef.current) return;
      
      try {
        // Create the map instance
        const center = getInitialCenter();
        console.log("Setting up map with center:", center);
        
        const mapOptions = {
          zoom,
          center,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          styles: mapStyles,
        };
        
        // Create the map
        mapInstanceRef.current = new google.maps.Map(mapRef.current, mapOptions);
        
        // Create info window for tooltips
        infoWindowRef.current = new google.maps.InfoWindow();
        
        console.log("Map initialized successfully");
        
        // Mark map as ready
        setIsMapReady(true);
        
      } catch (error) {
        console.error("Error initializing map:", error);
        toast.error("Could not initialize Google Maps.");
      }
    };

    // Load Google Maps API if it's not already loaded
    if (!window.google?.maps && !apiLoadedRef.current) {
      apiLoadedRef.current = true;
      
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
      console.log("Loading Google Maps API with key:", apiKey ? "Valid key present" : "No API key");
      
      const cleanup = loadGoogleMapsScript(
        apiKey, 
        initMap, 
        () => { apiLoadedRef.current = false; }
      );
      
      return cleanup;
    } else if (window.google?.maps) {
      // If API is already loaded, initialize map directly
      console.log("Google Maps API already loaded, initializing map");
      initMap();
    }
  }, [zoom]);

  // Handle changes to showNorthLondonAreas or address
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;
    
    console.log("Updating map view: showNorthLondonAreas =", showNorthLondonAreas, "address =", address);
    
    try {
      const center = getInitialCenter();
      console.log("Setting map center to:", center);
      
      // Update the center and zoom
      mapInstanceRef.current.setCenter(center);
      mapInstanceRef.current.setZoom(zoom);
      
      // Trigger resize to ensure map renders correctly
      google.maps.event.trigger(mapInstanceRef.current, 'resize');
      console.log("Map resized and settings updated");
    } catch (error) {
      console.error("Error updating map view:", error);
    }
  }, [showNorthLondonAreas, address, zoom, isMapReady]);

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full rounded-lg shadow-lg" />
      
      {/* Render map markers based on props */}
      {isMapReady && mapInstanceRef.current && infoWindowRef.current && (
        <>
          {showNorthLondonAreas ? (
            <NorthLondonAreas 
              map={mapInstanceRef.current} 
              infoWindow={infoWindowRef.current} 
            />
          ) : (
            <AddressMarker 
              address={address} 
              map={mapInstanceRef.current} 
            />
          )}
        </>
      )}
      
      <div className="text-xs text-center mt-2 text-posh-dark/60">
        <p>Viewing: {showNorthLondonAreas ? "North London Areas" : address}</p>
      </div>
    </div>
  );
};

export default GoogleMap;
