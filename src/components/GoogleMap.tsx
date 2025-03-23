
import React, { useEffect, useRef } from 'react';
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
  
  useEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined' || !mapRef.current) return;

    // Initialize map only once
    const initMap = () => {
      if (!mapRef.current) return;
      
      try {
        // Create the map instance
        const mapOptions = {
          zoom,
          center: showNorthLondonAreas ? 
            { lat: 51.5485, lng: -0.0900 } : // Center on North London when showing those areas
            DEFAULT_COORDINATES,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          styles: mapStyles,
        };
        
        mapInstanceRef.current = new google.maps.Map(mapRef.current, mapOptions);
        
        // Create info window for tooltips
        infoWindowRef.current = new google.maps.InfoWindow();
        
        console.log("Map initialized successfully", mapInstanceRef.current);
        
        // Force an update for child components since map is ready
        setTimeout(() => {
          // This is a hack to ensure the child components render after map is ready
          mapInstanceRef.current?.setZoom(mapInstanceRef.current.getZoom() || zoom);
        }, 100);
        
      } catch (error) {
        console.error("Error initializing map:", error);
        toast.error("Could not initialize Google Maps.");
      }
    };

    // Load Google Maps API if it's not already loaded
    if (!window.google?.maps && !apiLoadedRef.current) {
      apiLoadedRef.current = true;
      
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
      
      const cleanup = loadGoogleMapsScript(
        apiKey, 
        initMap, 
        () => { apiLoadedRef.current = false; }
      );
      
      return cleanup;
    } else if (window.google?.maps) {
      // If API is already loaded, initialize map directly
      initMap();
    }
  }, [zoom, showNorthLondonAreas]);

  // Force re-render of map components when dependencies change
  useEffect(() => {
    if (mapInstanceRef.current && infoWindowRef.current) {
      // This will force a re-render of the child components
      try {
        // Instead of using getCenter which may not exist, use a safer approach
        const currentZoom = mapInstanceRef.current.getZoom() || zoom;
        google.maps.event.trigger(mapInstanceRef.current, 'resize');
        
        // Recenter using the current center or default
        const currentCenter = mapInstanceRef.current.getCenter();
        if (currentCenter) {
          mapInstanceRef.current.setCenter(currentCenter);
        } else {
          mapInstanceRef.current.setCenter(showNorthLondonAreas ? 
            { lat: 51.5485, lng: -0.0900 } : 
            DEFAULT_COORDINATES);
        }
        
        mapInstanceRef.current.setZoom(currentZoom);
        
        console.log("Map resized and recentered", currentCenter);
      } catch (error) {
        console.error("Error resizing map:", error);
      }
    }
  }, [showNorthLondonAreas, address, zoom]);

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full rounded-lg shadow-lg" />
      
      {/* Render map markers based on props */}
      {mapInstanceRef.current && infoWindowRef.current && (
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
