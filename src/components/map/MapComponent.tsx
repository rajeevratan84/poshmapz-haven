
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { MapFilters } from '@/pages/Maps';
import { useTheme } from '@/context/ThemeContext';
import { Circle } from 'lucide-react';

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
  
  // London's center coordinates
  const LONDON_CENTER: [number, number] = [-0.118, 51.509];
  
  // Free OpenStreetMap tile servers
  const LIGHT_STYLE = 'https://api.maptiler.com/maps/streets/style.json?key=85SXWZQit3New3rvMQHb';
  const DARK_STYLE = 'https://api.maptiler.com/maps/streets-dark/style.json?key=85SXWZQit3New3rvMQHb';
  
  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;
    
    const initMapLibre = () => {
      if (!window.maplibregl) {
        console.log("Loading MapLibre script...");
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.js';
        script.async = true;
        
        // Add MapLibre CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css';
        
        document.head.appendChild(link);
        document.body.appendChild(script);
        
        script.onload = () => {
          console.log("MapLibre loaded successfully");
          initializeMap();
        };
        
        script.onerror = () => {
          console.error("Failed to load MapLibre");
          toast.error("Failed to load map library");
        };
      } else {
        console.log("MapLibre already loaded");
        initializeMap();
      }
    };
    
    initMapLibre();
    
    return () => {
      if (mapInstanceRef.current) {
        console.log("Cleaning up map");
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);
  
  // Initialize the map
  const initializeMap = () => {
    if (!mapContainerRef.current || !window.maplibregl) {
      console.error("Map container not found or MapLibre not loaded");
      return;
    }
    
    try {
      console.log("Initializing map...");
      const mapStyle = isDark ? DARK_STYLE : LIGHT_STYLE;
      
      // Create map instance
      mapInstanceRef.current = new window.maplibregl.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center: LONDON_CENTER,
        zoom: 11,
        attributionControl: true,
        pitch: 0,
        bearing: 0
      });
      
      // Add navigation control
      mapInstanceRef.current.addControl(
        new window.maplibregl.NavigationControl(),
        'top-right'
      );
      
      // Log when map is finished loading
      mapInstanceRef.current.on('load', () => {
        console.log("Map loaded");
        setMapLoaded(true);
        addDataLayers();
      });
      
    } catch (error) {
      console.error("Error initializing map:", error);
      toast.error("Could not initialize map");
    }
  };
  
  // Update map style when theme changes
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    
    console.log("Updating map style based on theme");
    const mapStyle = isDark ? DARK_STYLE : LIGHT_STYLE;
    mapInstanceRef.current.setStyle(mapStyle);
    
    // Need to add the data layers again after style change
    mapInstanceRef.current.once('style.load', () => {
      addDataLayers();
    });
  }, [theme, mapLoaded]);
  
  // Add data layers to map - for now just showing London boroughs with mock data
  const addDataLayers = () => {
    if (!mapInstanceRef.current || !mapLoaded) {
      console.log("Map not ready for adding layers");
      return;
    }
    
    console.log("Adding data layers");
    
    // Remove existing sources and layers if they exist
    try {
      if (mapInstanceRef.current.getSource('london-heatmap')) {
        mapInstanceRef.current.removeLayer('heatmap-layer');
        mapInstanceRef.current.removeSource('london-heatmap');
      }
      
      if (mapInstanceRef.current.getSource('points-source')) {
        mapInstanceRef.current.removeLayer('points-circle');
        mapInstanceRef.current.removeSource('points-source');
      }
    } catch (error) {
      console.warn("Error cleaning up previous layers:", error);
    }
    
    // Sample points for London (simplified)
    const samplePoints = [
      { name: "Westminster", coord: [-0.1278, 51.5074], score: 95, price: 1200000, crime: 40, green: 75 },
      { name: "Camden", coord: [-0.1426, 51.5390], score: 85, price: 900000, crime: 45, green: 65 },
      { name: "Hackney", coord: [-0.0702, 51.5444], score: 79, price: 750000, crime: 50, green: 60 },
      { name: "Islington", coord: [-0.1029, 51.5362], score: 88, price: 850000, crime: 42, green: 50 },
      { name: "Hammersmith", coord: [-0.2192, 51.4931], score: 82, price: 820000, crime: 35, green: 70 },
      { name: "Lambeth", coord: [-0.1099, 51.4923], score: 75, price: 680000, crime: 55, green: 45 },
      { name: "Greenwich", coord: [0.0098, 51.4810], score: 78, price: 550000, crime: 38, green: 80 }
    ];
    
    // Filter the points based on user filters
    const filteredPoints = samplePoints.filter(point => {
      return (
        point.price >= filters.priceRange[0] &&
        point.price <= filters.priceRange[1] &&
        point.crime <= filters.crimeIndex &&
        point.green >= filters.greenSpaceScore
      );
    });
    
    console.log("Filtered points:", filteredPoints.length);
    
    // Add a GeoJSON source with the filtered points
    mapInstanceRef.current.addSource('points-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: filteredPoints.map(point => ({
          type: 'Feature',
          properties: {
            name: point.name,
            score: point.score,
            price: point.price,
            crime: point.crime,
            green: point.green
          },
          geometry: {
            type: 'Point',
            coordinates: point.coord
          }
        }))
      }
    });
    
    // Add circle layer for standard view
    mapInstanceRef.current.addLayer({
      id: 'points-circle',
      type: 'circle',
      source: 'points-source',
      paint: {
        'circle-radius': [
          'interpolate', ['linear'], ['zoom'],
          10, 6,
          15, 20
        ],
        'circle-color': [
          'interpolate', ['linear'], ['get', 'score'],
          60, '#FF9800',  // Lower scores: orange
          75, '#FF7F50',  // Medium scores: coral
          90, '#4CAF50'   // Higher scores: green
        ],
        'circle-opacity': mapMode === 'heatmap' ? 0.6 : 0.8,
        'circle-stroke-width': 1.5,
        'circle-stroke-color': 'white'
      }
    });
    
    // Configure popup on click
    // FIX: The event handler was using incorrect arguments
    mapInstanceRef.current.on('click', 'points-circle', (e) => {
      if (!e.features || e.features.length === 0 || !mapInstanceRef.current) return;
      
      const feature = e.features[0];
      const props = feature.properties;
      const coords = feature.geometry.coordinates.slice();
      
      // Create popup content
      const popupContent = `
        <div class="p-2">
          <h3 class="font-bold">${props.name}</h3>
          <p>Match Score: ${props.score}/100</p>
          <p>Price: £${props.price.toLocaleString()}</p>
          <p>Crime Index: ${props.crime}/100</p>
          <p>Green Space: ${props.green}/100</p>
        </div>
      `;
      
      // Create the popup
      new window.maplibregl.Popup()
        .setLngLat(coords)
        .setHTML(popupContent)
        .addTo(mapInstanceRef.current);
    });
    
    // Change cursor on hover
    // FIX: The event handlers were using incorrect arguments
    mapInstanceRef.current.on('mouseenter', 'points-circle', () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.getCanvas().style.cursor = 'pointer';
      }
    });
    
    mapInstanceRef.current.on('mouseleave', 'points-circle', () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.getCanvas().style.cursor = '';
      }
    });
    
    // Add heatmap source and layer
    if (mapMode === 'heatmap') {
      // Add heatmap-like layer (simulated with circles for maplibre)
      mapInstanceRef.current.addLayer({
        id: 'heatmap-layer',
        type: 'circle',
        source: 'points-source',
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            10, 20,
            15, 40
          ],
          'circle-color': [
            'interpolate', ['linear'], ['get', 'score'],
            60, '#FF9800',
            75, '#FF7F50',
            90, '#4CAF50'
          ],
          'circle-opacity': 0.4,
          'circle-blur': 1
        }
      });
      
      // Place the heatmap layer underneath the point layer
      if (mapInstanceRef.current) {
        mapInstanceRef.current.moveLayer('heatmap-layer', 'points-circle');
      }
    }
  };
  
  // Update map when filters or map mode changes
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;
    
    console.log("Filters or map mode changed, updating data layers");
    addDataLayers();
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
          <p className="flex items-center gap-1">
            <Circle className="h-3 w-3 text-green-500" fill="#4CAF50" />
            <span>High Score</span>
          </p>
          <p className="flex items-center gap-1">
            <Circle className="h-3 w-3 text-orange-400" fill="#FF9800" />
            <span>Low Score</span>
          </p>
          <p className="mt-1">Mode: {mapMode === 'standard' ? 'Standard' : 'Heat Map'}</p>
        </div>
      </div>
      
      {/* Loading state */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-sm font-medium">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
