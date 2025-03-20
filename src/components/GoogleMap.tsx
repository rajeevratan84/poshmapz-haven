
import React, { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { loadGoogleMapsScript, mapStyles, DEFAULT_COORDINATES, AreaInfo } from '@/utils/mapUtils';
import NorthLondonAreas from './map/NorthLondonAreas';
import AddressMarker from './map/AddressMarker';
import { AreaMatch } from '@/types/area';
import AreaMarker from './map/AreaMarker';

interface GoogleMapProps {
  address?: string;
  zoom?: number;
  className?: string;
  showNorthLondonAreas?: boolean;
  center?: google.maps.LatLngLiteral;
  mapContainerStyle?: React.CSSProperties;
  options?: google.maps.MapOptions;
  areas?: AreaMatch[];
  onAreaSelected?: (area: AreaMatch) => void;
  selectedArea?: AreaMatch | null;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  address = "",
  zoom = 14,
  className = "h-[400px] md:h-[500px] w-full rounded-lg",
  showNorthLondonAreas = false,
  center,
  mapContainerStyle,
  options,
  areas = [],
  onAreaSelected,
  selectedArea
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const apiLoadedRef = useRef<boolean>(false);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  
  // Log props for debugging
  useEffect(() => {
    console.log("GoogleMap areas prop:", areas);
    console.log("GoogleMap areas count:", areas.length);
  }, [areas]);
  
  useEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined' || !mapRef.current) return;

    // Initialize map only once
    const initMap = () => {
      if (!mapRef.current) return;
      
      try {
        // Create the map instance
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          zoom: zoom,
          center: center || DEFAULT_COORDINATES,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          styles: options?.styles || mapStyles,
          ...options
        });
        
        // Create info window for tooltips
        infoWindowRef.current = new google.maps.InfoWindow();
        
        console.log("Map initialized successfully");
        
      } catch (error) {
        console.error("Error initializing map:", error);
        toast.error("Could not initialize Google Maps.");
      }
    };

    // Load Google Maps API if it's not already loaded
    if (!window.google?.maps && !apiLoadedRef.current) {
      apiLoadedRef.current = true;
      
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
      console.log("Loading Google Maps with API key:", apiKey ? "Key available" : "No API key");
      
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
  }, [zoom, center, options]);

  const containerStyle = mapContainerStyle || { width: '100%', height: '100%' };

  return (
    <div className={className}>
      <div ref={mapRef} style={containerStyle} className="w-full h-full rounded-lg shadow-lg" />
      
      {/* Render map markers based on props */}
      {mapInstanceRef.current && infoWindowRef.current && (
        <>
          {showNorthLondonAreas && (
            <NorthLondonAreas 
              map={mapInstanceRef.current} 
              infoWindow={infoWindowRef.current} 
            />
          )}
          
          {address && !showNorthLondonAreas && areas.length === 0 && (
            <AddressMarker 
              address={address} 
              map={mapInstanceRef.current} 
            />
          )}
          
          {/* Render area markers if areas are provided */}
          {Array.isArray(areas) && areas.length > 0 && (
            <>
              {console.log(`Rendering ${areas.length} area markers`)}
              {areas.map((area, index) => (
                <AreaMarker
                  key={`${area.name}-${index}`}
                  area={area}
                  map={mapInstanceRef.current!}
                  infoWindow={infoWindowRef.current!}
                  isSelected={selectedArea?.name === area.name}
                  onClick={() => onAreaSelected && onAreaSelected(area)}
                />
              ))}
            </>
          )}
        </>
      )}
      
      <div className="text-xs text-center mt-2 text-posh-dark/60">
        <p>Viewing: {showNorthLondonAreas ? "North London Areas" : address || "Map"}</p>
        {areas && areas.length > 0 && (
          <p>Showing {areas.length} area markers</p>
        )}
      </div>
    </div>
  );
};

export default GoogleMap;
