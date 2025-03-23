
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
      // which should re-create the markers
      const currentCenter = mapInstanceRef.current.getCenter?.();
      if (currentCenter) {
        google.maps.event.trigger(mapInstanceRef.current, 'resize');
        mapInstanceRef.current.setCenter(currentCenter);
      }
    }
  }, [showNorthLondonAreas, address]);

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full rounded-lg shadow-lg" />
      
      {/* Render map markers based on props */}
      {mapInstanceRef.current && infoWindowRef.current && (
        showNorthLondonAreas ? (
          <NorthLondonAreas 
            map={mapInstanceRef.current} 
            infoWindow={infoWindowRef.current} 
          />
        ) : (
          <AddressMarker 
            address={address} 
            map={mapInstanceRef.current} 
          />
        )
      )}
      
      <div className="text-xs text-center mt-2 text-posh-dark/60">
        <p>Viewing: {showNorthLondonAreas ? "North London Areas" : address}</p>
      </div>
    </div>
  );
};

export default GoogleMap;
