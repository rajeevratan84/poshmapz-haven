
import React, { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { AreaMatch } from '@/types/area';

interface AreaMapComponentProps {
  results: AreaMatch[];
  onAreaSelected: (area: AreaMatch) => void;
  selectedArea: AreaMatch | null;
  mapMode?: 'london' | 'uk';
}

const AreaMapComponent: React.FC<AreaMapComponentProps> = ({ 
  results, 
  onAreaSelected, 
  selectedArea,
  mapMode = 'london'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Set initial coordinates and zoom based on map mode
  const getInitialMapSettings = () => {
    if (mapMode === 'london') {
      return {
        coordinates: { lat: 51.507, lng: -0.127 },
        zoom: 11
      };
    } else {
      return {
        coordinates: { lat: 54.093, lng: -2.89 }, // Center of UK
        zoom: 6
      };
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;
    
    // If map already exists but mode changed, update the view
    if (mapInstanceRef.current && infoWindowRef.current) {
      const { coordinates, zoom } = getInitialMapSettings();
      mapInstanceRef.current.setCenter(coordinates);
      mapInstanceRef.current.setZoom(zoom);
      return;
    }

    const initMap = () => {
      if (!mapRef.current) return;
      
      try {
        const { coordinates, zoom } = getInitialMapSettings();
        
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          zoom,
          center: coordinates,
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
        
        infoWindowRef.current = new google.maps.InfoWindow();
      } catch (error) {
        console.error("Error initializing map:", error);
        toast.error("Could not initialize Google Maps.");
      }
    };

    if (window.google?.maps) {
      initMap();
    } else {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
      
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geocoding`;
      script.async = true;
      script.defer = true;
      
      script.onload = initMap;
      script.onerror = () => {
        console.error("Failed to load Google Maps API");
        toast.error("Could not load Google Maps. Please try again later.");
      };
      
      document.head.appendChild(script);
    }
  }, [mapMode]);

  // Update map view when mapMode changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      const { coordinates, zoom } = getInitialMapSettings();
      mapInstanceRef.current.setCenter(coordinates);
      mapInstanceRef.current.setZoom(zoom);
    }
  }, [mapMode]);

  useEffect(() => {
    if (!mapInstanceRef.current || !infoWindowRef.current) return;
    
    // Clear previous markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    // Add new markers for each result
    results.forEach(area => addMarkerForArea(area));
    
    // Adjust map bounds if needed
    if (results.length && mapInstanceRef.current) {
      const bounds = new google.maps.LatLngBounds();
      markersRef.current.forEach(marker => {
        if (marker.getPosition()) {
          bounds.extend(marker.getPosition()!);
        }
      });
      mapInstanceRef.current.fitBounds(bounds);
      
      if (markersRef.current.length === 1 && mapInstanceRef.current) {
        mapInstanceRef.current.setZoom(14);
      }
    }
  }, [results]);

  useEffect(() => {
    if (selectedArea && mapInstanceRef.current) {
      const marker = markersRef.current.find(m => m.getTitle()?.startsWith(selectedArea.name));
      if (marker) {
        mapInstanceRef.current.panTo(marker.getPosition()!);
        mapInstanceRef.current.setZoom(14);
        google.maps.event.trigger(marker, 'click');
      }
    }
  }, [selectedArea]);

  const addMarkerForArea = (area: AreaMatch) => {
    if (!mapInstanceRef.current || !infoWindowRef.current) return;
    
    const contentString = `
      <div class="p-3 max-w-xs">
        <div class="flex justify-between items-center mb-1">
          <div class="font-medium text-gray-800">${area.name}</div>
          <div class="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded">${area.matchPercentage}% match</div>
        </div>
        <div class="text-xs font-semibold text-green-600 mb-1">Posh Score: ${area.poshScore}/100</div>
        <div class="text-xs text-gray-600">${area.description}</div>
      </div>
    `;
    
    const marker = new google.maps.Marker({
      position: area.coordinates,
      map: mapInstanceRef.current,
      animation: google.maps.Animation.DROP,
      title: `${area.name} - ${area.matchPercentage}% match`
    });
    
    marker.addListener("mouseover", () => {
      if (infoWindowRef.current && mapInstanceRef.current) {
        infoWindowRef.current.setContent(contentString);
        infoWindowRef.current.open(mapInstanceRef.current, marker);
      }
    });
    
    marker.addListener("mouseout", () => {
      setTimeout(() => {
        if (infoWindowRef.current && selectedArea?.name !== area.name) {
          infoWindowRef.current.close();
        }
      }, 1000);
    });
    
    marker.addListener("click", () => {
      if (infoWindowRef.current && mapInstanceRef.current) {
        infoWindowRef.current.setContent(contentString);
        infoWindowRef.current.open(mapInstanceRef.current, marker);
        onAreaSelected(area);
        
        const areaElement = document.getElementById(`area-${area.name.replace(/\s+/g, '-').toLowerCase()}`);
        if (areaElement && window.innerWidth < 768) {
          areaElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
    
    markersRef.current.push(marker);
  };

  return <div ref={mapRef} className="w-full h-[400px] md:h-[500px] rounded-lg mb-4 md:mb-6"></div>;
};

export default AreaMapComponent;
