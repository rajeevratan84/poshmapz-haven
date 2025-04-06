
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { MapFilters } from '@/pages/Maps';
import { useTheme } from '@/context/ThemeContext';

interface MapComponentProps {
  filters: MapFilters;
  searchQuery: string;
  mapMode: 'standard' | 'heatmap';
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  filters, 
  searchQuery,
  mapMode
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Mock data for demonstration
  const mockData = {
    points: [
      { name: "High-priced Area", lat: 51.507, lng: -0.127, price: 900000, crime: 20, green: 80 },
      { name: "Mid-range Area", lat: 51.517, lng: -0.097, price: 600000, crime: 40, green: 60 },
      { name: "Affordable Area", lat: 51.527, lng: -0.147, price: 350000, crime: 60, green: 30 },
    ]
  };
  
  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;
    
    // We'll use a try-catch to handle potential issues with map initialization
    try {
      // Check if MapLibre script has been added
      if (!window.maplibregl) {
        // Add MapLibre script dynamically
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.js';
        script.async = true;
        
        // Add MapLibre CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css';
        
        document.head.appendChild(link);
        document.body.appendChild(script);
        
        script.onload = initializeMap;
        script.onerror = () => {
          toast.error("Failed to load map library");
        };
      } else {
        initializeMap();
      }
    } catch (error) {
      console.error("Error setting up map:", error);
      toast.error("There was an error setting up the map");
    }
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);
  
  // Initialize the map
  const initializeMap = () => {
    if (!mapContainerRef.current || !window.maplibregl) return;
    
    try {
      // Create map instance
      mapInstanceRef.current = new window.maplibregl.Map({
        container: mapContainerRef.current,
        style: isDark 
          ? 'https://api.maptiler.com/maps/6d9296b5-f15b-43cc-9547-a5af89ae18aa/style.json?key=85SXWZQit3New3rvMQHb'
          : 'https://api.maptiler.com/maps/bright-v2/style.json?key=85SXWZQit3New3rvMQHb',
        center: [-0.118, 51.509], // London
        zoom: 12
      });
      
      mapInstanceRef.current.on('load', () => {
        setMapLoaded(true);
        addMockDataLayers();
      });
      
      mapInstanceRef.current.addControl(new window.maplibregl.NavigationControl(), 'top-right');
      
    } catch (error) {
      console.error("Error initializing map:", error);
      toast.error("Could not initialize map");
    }
  };
  
  // Update map style when theme changes
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    
    const newStyle = isDark
      ? 'https://api.maptiler.com/maps/6d9296b5-f15b-43cc-9547-a5af89ae18aa/style.json?key=85SXWZQit3New3rvMQHb'
      : 'https://api.maptiler.com/maps/bright-v2/style.json?key=85SXWZQit3New3rvMQHb';
      
    mapInstanceRef.current.setStyle(newStyle);
  }, [theme, mapLoaded]);
  
  // Add mock data layers to map
  const addMockDataLayers = () => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    
    // Clear existing sources and layers
    if (mapInstanceRef.current.getSource('areas')) {
      mapInstanceRef.current.removeLayer('area-layer');
      mapInstanceRef.current.removeSource('areas');
    }
    
    // Add GeoJSON source with mock data
    mapInstanceRef.current.addSource('areas', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: mockData.points.map(point => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [point.lng, point.lat]
          },
          properties: {
            name: point.name,
            price: point.price,
            crime: point.crime,
            green: point.green
          }
        }))
      }
    });
    
    // Add areas layer
    mapInstanceRef.current.addLayer({
      id: 'area-layer',
      type: 'circle',
      source: 'areas',
      paint: {
        'circle-radius': [
          'interpolate', ['linear'], ['zoom'],
          12, 8,
          16, 25
        ],
        'circle-color': [
          'case',
          ['all', 
            ['>=', ['get', 'price'], filters.priceRange[0]],
            ['<=', ['get', 'price'], filters.priceRange[1]],
            ['>=', ['get', 'green'], filters.greenSpaceScore],
            ['<=', ['get', 'crime'], filters.crimeIndex]
          ],
          '#FF7F50', // Areas that match filters
          '#888888' // Areas that don't match
        ],
        'circle-opacity': 0.7,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#ffffff'
      }
    });
    
    // Add click event to show area information
    mapInstanceRef.current.on('click', 'area-layer', (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const props = feature.properties;
        
        new window.maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`
            <div class="p-2">
              <h3 class="font-bold">${props.name}</h3>
              <p>Price: £${props.price.toLocaleString()}</p>
              <p>Crime Index: ${props.crime}/100</p>
              <p>Green Space: ${props.green}/100</p>
            </div>
          `)
          .addTo(mapInstanceRef.current);
      }
    });
    
    // Change cursor on hover
    mapInstanceRef.current.on('mouseenter', 'area-layer', () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.getCanvas().style.cursor = 'pointer';
      }
    });
    
    mapInstanceRef.current.on('mouseleave', 'area-layer', () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.getCanvas().style.cursor = '';
      }
    });
  };
  
  // Update layers when filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    
    // Update the filter expression for the area layer
    mapInstanceRef.current.setPaintProperty('area-layer', 'circle-color', [
      'case',
      ['all', 
        ['>=', ['get', 'price'], filters.priceRange[0]],
        ['<=', ['get', 'price'], filters.priceRange[1]],
        ['>=', ['get', 'green'], filters.greenSpaceScore],
        ['<=', ['get', 'crime'], filters.crimeIndex]
      ],
      '#FF7F50', // Areas that match filters
      '#888888' // Areas that don't match
    ]);
    
    // If in heatmap mode, adjust layer styling
    if (mapMode === 'heatmap') {
      mapInstanceRef.current.setPaintProperty('area-layer', 'circle-blur', 1);
      mapInstanceRef.current.setPaintProperty('area-layer', 'circle-radius', [
        'interpolate', ['linear'], ['zoom'],
        12, 15,
        16, 40
      ]);
    } else {
      mapInstanceRef.current.setPaintProperty('area-layer', 'circle-blur', 0);
      mapInstanceRef.current.setPaintProperty('area-layer', 'circle-radius', [
        'interpolate', ['linear'], ['zoom'],
        12, 8,
        16, 25
      ]);
    }
    
  }, [filters, mapMode, mapLoaded]);
  
  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0"
      />
      
      {/* Map overlay with information */}
      <div className="absolute bottom-4 right-4 p-3 bg-background/60 backdrop-blur-sm rounded-lg border shadow-sm z-10">
        <div className="text-xs font-medium">
          <p>Map Mode: {mapMode === 'standard' ? 'Standard' : 'Heat Map'}</p>
          <p className="mt-1">Filters: {filters.activeAmenities.join(', ')}</p>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
