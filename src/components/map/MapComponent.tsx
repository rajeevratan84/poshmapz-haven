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

// Declare MapLibre globally to avoid TypeScript errors
declare global {
  interface Window {
    maplibregl: typeof maplibregl;
  }
}

// Import GeoJSON types for TypeScript
import type { Feature, FeatureCollection, Point, Position } from 'geojson';

// Custom event interface for MapLibre events - modified to match expected parameters
interface MapMouseEvent {
  type: string;
  target: maplibregl.Map;
  originalEvent: MouseEvent;
  point: maplibregl.Point;
  lngLat: maplibregl.LngLat;
  features?: Feature[];
  preventDefault: () => void;
  defaultPrevented: boolean;
}

// Define a more specific feature type for our points
interface PointFeature extends Feature {
  geometry: {
    type: "Point";
    coordinates: Position;
  };
  properties: {
    name: string;
    score: number;
    price: number;
    crime: number;
    green: number;
  };
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
  
  const LONDON_CENTER: [number, number] = [-0.118, 51.509];
  
  const LIGHT_STYLE = 'https://api.maptiler.com/maps/streets/style.json?key=85SXWZQit3New3rvMQHb';
  const DARK_STYLE = 'https://api.maptiler.com/maps/streets-dark/style.json?key=85SXWZQit3New3rvMQHb';
  
  const initializeMap = () => {
    if (!mapContainerRef.current || !window.maplibregl) {
      console.error("Map container not found or MapLibre not loaded");
      return;
    }
    
    try {
      console.log("Initializing map...");
      const mapStyle = isDark ? DARK_STYLE : LIGHT_STYLE;
      
      mapInstanceRef.current = new window.maplibregl.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center: LONDON_CENTER,
        zoom: 11,
        attributionControl: true,
        pitch: 0,
        bearing: 0
      });
      
      mapInstanceRef.current.addControl(
        new window.maplibregl.NavigationControl(),
        'top-right'
      );
      
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
  
  const addDataLayers = () => {
    if (!mapInstanceRef.current || !mapLoaded) {
      console.log("Map not ready for adding layers");
      return;
    }
    
    console.log("Adding data layers");
    
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
    
    const samplePoints = [
      { name: "Westminster", coord: [-0.1278, 51.5074], score: 95, price: 1200000, crime: 40, green: 75 },
      { name: "Camden", coord: [-0.1426, 51.5390], score: 85, price: 900000, crime: 45, green: 65 },
      { name: "Hackney", coord: [-0.0702, 51.5444], score: 79, price: 750000, crime: 50, green: 60 },
      { name: "Islington", coord: [-0.1029, 51.5362], score: 88, price: 850000, crime: 42, green: 50 },
      { name: "Hammersmith", coord: [-0.2192, 51.4931], score: 82, price: 820000, crime: 35, green: 70 },
      { name: "Lambeth", coord: [-0.1099, 51.4923], score: 75, price: 680000, crime: 55, green: 45 },
      { name: "Greenwich", coord: [0.0098, 51.4810], score: 78, price: 550000, crime: 38, green: 80 }
    ];
    
    const filteredPoints = samplePoints.filter(point => {
      return (
        point.price >= filters.priceRange[0] &&
        point.price <= filters.priceRange[1] &&
        point.crime <= filters.crimeIndex &&
        point.green >= filters.greenSpaceScore
      );
    });
    
    console.log("Filtered points:", filteredPoints.length);
    
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
    
    mapInstanceRef.current.on('click', 'points-circle', (e: MapMouseEvent) => {
      if (!mapInstanceRef.current || !e.features || e.features.length === 0) return;
      
      const feature = e.features[0] as PointFeature;
      const props = feature.properties;
      const coords = feature.geometry.coordinates;
      
      const popupContent = `
        <div class="p-2">
          <h3 class="font-bold">${props.name}</h3>
          <p>Match Score: ${props.score}/100</p>
          <p>Price: £${Number(props.price).toLocaleString()}</p>
          <p>Crime Index: ${props.crime}/100</p>
          <p>Green Space: ${props.green}/100</p>
        </div>
      `;
      
      new window.maplibregl.Popup()
        .setLngLat(coords as [number, number])
        .setHTML(popupContent)
        .addTo(mapInstanceRef.current);
    });
    
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
    
    if (mapMode === 'heatmap') {
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
      
      if (mapInstanceRef.current) {
        mapInstanceRef.current.moveLayer('heatmap-layer', 'points-circle');
      }
    }
  };
  
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;
    
    const initMapLibre = async () => {
      if (!window.maplibregl) {
        console.log("Loading MapLibre script...");
        
        try {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css';
          document.head.appendChild(link);
          
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.js';
          script.async = true;
          document.body.appendChild(script);
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = () => {
              reject(new Error("Failed to load MapLibre script"));
            };
          });
          
          console.log("MapLibre loaded successfully");
          setTimeout(initializeMap, 100);
        } catch (error) {
          console.error("Failed to load MapLibre:", error);
          toast.error("Failed to load map library");
        }
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
  
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    
    console.log("Updating map style based on theme");
    const mapStyle = isDark ? DARK_STYLE : LIGHT_STYLE;
    mapInstanceRef.current.setStyle(mapStyle);
    
    mapInstanceRef.current.once('style.load', () => {
      addDataLayers();
    });
  }, [theme, mapLoaded]);
  
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
