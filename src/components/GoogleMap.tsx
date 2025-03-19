
import React, { useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface GoogleMapProps {
  address?: string;
  zoom?: number;
  className?: string;
  showNorthLondonAreas?: boolean;
}

interface AreaInfo {
  position: { lat: number, lng: number };
  label: string;
  title: string;
  match: string;
  description: string;
  poshScore: string;
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
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  
  useEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined' || !mapRef.current) return;

    // Initialize map only once
    const initMap = () => {
      if (!mapRef.current) return;
      
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
        
        // Create info window for tooltips
        infoWindowRef.current = new google.maps.InfoWindow();

        // If we're showing North London areas, add those markers
        if (showNorthLondonAreas && mapInstanceRef.current) {
          const northLondonAreas: AreaInfo[] = [
            {
              position: { lat: 51.5485, lng: -0.1019 },
              label: "H",
              title: "Highbury",
              match: "94% match",
              description: "Leafy, affluent, and home to professionals. Less flashy than neighbouring Islington but still well-regarded.",
              poshScore: "Posh Score: 80/100"
            },
            {
              position: { lat: 51.5362, lng: -0.1033 },
              label: "I",
              title: "Islington",
              match: "91% match",
              description: "Trendy, wealthy, and full of period townhouses, upscale restaurants, and boutique shops. A strong mix of old wealth and gentrification.",
              poshScore: "Posh Score: 85/100"
            },
            {
              position: { lat: 51.5629, lng: -0.0798 },
              label: "S",
              title: "Stoke Newington",
              match: "87% match",
              description: "Bohemian area with a village feel, diverse population, and a mix of Victorian houses and new builds. Popular with young families and creatives.",
              poshScore: "Posh Score: 75/100"
            }
          ];
          
          northLondonAreas.forEach(area => {
            const marker = new google.maps.Marker({
              position: area.position,
              map: mapInstanceRef.current,
              animation: google.maps.Animation.DROP,
              label: area.label,
              title: `${area.title} - ${area.match}`
            });
            
            // Create HTML content for info window
            const contentString = `
              <div class="p-3 max-w-xs">
                <div class="flex justify-between items-center mb-1">
                  <div class="font-medium text-gray-800">${area.title}</div>
                  <div class="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded">${area.match}</div>
                </div>
                <div class="text-xs font-semibold text-green-600 mb-1">${area.poshScore}</div>
                <div class="text-xs text-gray-600">${area.description}</div>
              </div>
            `;
            
            // Add event listeners for hover
            marker.addListener("mouseover", () => {
              if (infoWindowRef.current && mapInstanceRef.current) {
                infoWindowRef.current.setContent(contentString);
                infoWindowRef.current.open(mapInstanceRef.current, marker);
              }
            });
            
            // Optional: close on mouseout
            marker.addListener("mouseout", () => {
              setTimeout(() => {
                if (infoWindowRef.current) {
                  infoWindowRef.current.close();
                }
              }, 1000);
            });
            
            // Also show info on click for mobile devices
            marker.addListener("click", () => {
              if (infoWindowRef.current && mapInstanceRef.current) {
                infoWindowRef.current.setContent(contentString);
                infoWindowRef.current.open(mapInstanceRef.current, marker);
              }
            });
          });
          
          // Center between the three areas
          mapInstanceRef.current.setCenter({ lat: 51.5492, lng: -0.0950 });
          mapInstanceRef.current.setZoom(13);
        } 
        // If we're showing Richmond (default)
        else if (mapInstanceRef.current) {
          // Single marker for Richmond
          markerRef.current = new google.maps.Marker({
            map: mapInstanceRef.current,
            animation: google.maps.Animation.DROP,
            position: defaultPosition,
            title: "Richmond, London"
          });
          
          // If we have an address, try to geocode it
          if (address) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address }, (results, status) => {
              if (status === "OK" && results?.[0]?.geometry?.location && mapInstanceRef.current && markerRef.current) {
                const location = results[0].geometry.location;
                mapInstanceRef.current.setCenter(location);
                markerRef.current.setPosition(location);
              }
            });
          }
        }
      } catch (error) {
        console.error("Error initializing map:", error);
        toast.error("Could not initialize Google Maps.");
      }
    };

    // Load Google Maps API if it's not already loaded
    if (!window.google?.maps && !apiLoadedRef.current) {
      apiLoadedRef.current = true;
      
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
      
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geocoding`;
      script.async = true;
      script.defer = true;
      
      script.onload = initMap;
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
        <p>Viewing: {showNorthLondonAreas ? "North London Areas" : address}</p>
      </div>
    </div>
  );
};

export default GoogleMap;
