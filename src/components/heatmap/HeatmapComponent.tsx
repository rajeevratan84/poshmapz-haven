
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { HeatmapPoint } from '@/services/overpassService';
import { useTheme } from '@/context/ThemeContext';

interface HeatmapComponentProps {
  points: HeatmapPoint[];
  isLoading: boolean;
}

declare global {
  interface Window {
    maplibregl: typeof maplibregl;
  }
}

const HeatmapComponent: React.FC<HeatmapComponentProps> = ({ points, isLoading }) => {
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
      console.log("Initializing heatmap...");
      const mapStyle = isDark ? DARK_STYLE : LIGHT_STYLE;
      
      mapInstanceRef.current = new window.maplibregl.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center: LONDON_CENTER,
        zoom: 10,
        attributionControl: true,
      });
      
      mapInstanceRef.current.addControl(
        new window.maplibregl.NavigationControl(),
        'top-right'
      );
      
      mapInstanceRef.current.on('load', () => {
        console.log("Heatmap loaded");
        setMapLoaded(true);
      });
      
    } catch (error) {
      console.error("Error initializing heatmap:", error);
      toast.error("Could not initialize heatmap");
    }
  };
  
  const addHeatmapLayer = () => {
    if (!mapInstanceRef.current || !mapLoaded || points.length === 0) {
      return;
    }
    
    console.log(`Adding heatmap with ${points.length} points`);
    
    try {
      // Remove existing layers and sources
      if (mapInstanceRef.current.getSource('heatmap-source')) {
        if (mapInstanceRef.current.getLayer('heatmap-layer')) {
          mapInstanceRef.current.removeLayer('heatmap-layer');
        }
        if (mapInstanceRef.current.getLayer('heatmap-points')) {
          mapInstanceRef.current.removeLayer('heatmap-points');
        }
        mapInstanceRef.current.removeSource('heatmap-source');
      }
      
      // Create GeoJSON from points
      const geoJsonData = {
        type: 'FeatureCollection' as const,
        features: points.map(point => ({
          type: 'Feature' as const,
          properties: {
            intensity: point.intensity,
            name: point.name || 'Unknown',
            type: point.type || 'poi'
          },
          geometry: {
            type: 'Point' as const,
            coordinates: [point.lng, point.lat]
          }
        }))
      };
      
      mapInstanceRef.current.addSource('heatmap-source', {
        type: 'geojson',
        data: geoJsonData
      });
      
      // Add heatmap layer
      mapInstanceRef.current.addLayer({
        id: 'heatmap-layer',
        type: 'heatmap',
        source: 'heatmap-source',
        maxzoom: 15,
        paint: {
          // Increase the heatmap weight based on intensity
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'intensity'],
            0, 0,
            6, 1
          ],
          // Increase the heatmap color weight by zoom level
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 1,
            15, 3
          ],
          // Color ramp for heatmap
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(33,102,172,0)',
            0.2, 'rgb(103,169,207)',
            0.4, 'rgb(209,229,240)',
            0.6, 'rgb(253,219,199)',
            0.8, 'rgb(239,138,98)',
            1, 'rgb(178,24,43)'
          ],
          // Adjust the heatmap radius by zoom level
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 2,
            15, 20
          ],
          // Transition from heatmap to circle layer by zoom level
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 1,
            15, 0
          ],
        }
      });
      
      // Add circle layer for individual points at high zoom
      mapInstanceRef.current.addLayer({
        id: 'heatmap-points',
        type: 'circle',
        source: 'heatmap-source',
        minzoom: 14,
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 1,
            16, 4
          ],
          'circle-color': [
            'case',
            ['==', ['get', 'type'], 'police'], '#dc2626',
            ['==', ['get', 'type'], 'hospital'], '#059669',
            ['==', ['get', 'type'], 'school'], '#7c3aed',
            '#f59e0b'
          ],
          'circle-stroke-color': 'white',
          'circle-stroke-width': 1,
          'circle-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 0,
            15, 1
          ]
        }
      });
      
      // Add click handler for individual points (fixed signature)
      mapInstanceRef.current.on('click', (e: any) => {
        const features = mapInstanceRef.current?.queryRenderedFeatures(e.point, {
          layers: ['heatmap-points']
        });
        
        if (features && features.length > 0) {
          const feature = features[0];
          const props = feature.properties;
          const coords = (feature.geometry as any).coordinates;
          
          const popupContent = `
            <div class="p-2">
              <h3 class="font-bold">${props?.name || 'Unknown'}</h3>
              <p class="text-sm">Type: ${props?.type || 'POI'}</p>
              <p class="text-sm">Intensity: ${props?.intensity || 1}</p>
            </div>
          `;
          
          new window.maplibregl.Popup()
            .setLngLat(coords)
            .setHTML(popupContent)
            .addTo(mapInstanceRef.current!);
        }
      });
      
      // Change cursor on hover for points layer (fixed signature)
      mapInstanceRef.current.on('mouseenter', (e: any) => {
        const features = mapInstanceRef.current?.queryRenderedFeatures(e.point, {
          layers: ['heatmap-points']
        });
        
        if (features && features.length > 0 && mapInstanceRef.current) {
          mapInstanceRef.current.getCanvas().style.cursor = 'pointer';
        }
      });
      
      mapInstanceRef.current.on('mouseleave', (e: any) => {
        const features = mapInstanceRef.current?.queryRenderedFeatures(e.point, {
          layers: ['heatmap-points']
        });
        
        if (features && features.length === 0 && mapInstanceRef.current) {
          mapInstanceRef.current.getCanvas().style.cursor = '';
        }
      });
      
    } catch (error) {
      console.error('Error adding heatmap layer:', error);
      toast.error('Error displaying heatmap data');
    }
  };
  
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;
    
    const initMapLibre = async () => {
      if (!window.maplibregl) {
        console.log("Loading MapLibre script for heatmap...");
        
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
          
          console.log("MapLibre loaded successfully for heatmap");
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
        console.log("Cleaning up heatmap");
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    
    console.log("Updating heatmap style based on theme");
    const mapStyle = isDark ? DARK_STYLE : LIGHT_STYLE;
    mapInstanceRef.current.setStyle(mapStyle);
    
    mapInstanceRef.current.once('style.load', () => {
      if (points.length > 0) {
        addHeatmapLayer();
      }
    });
  }, [theme, mapLoaded]);
  
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;
    
    console.log("Points changed, updating heatmap");
    addHeatmapLayer();
  }, [points, mapLoaded]);
  
  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0 rounded-lg"
      />
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 p-3 bg-background/90 backdrop-blur-sm rounded-lg border shadow-sm z-10">
        <div className="text-xs font-medium">
          <h4 className="font-semibold mb-2">Heatmap Legend</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Low Density</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Medium Density</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>High Density</span>
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">
              Zoom in to see individual points
            </p>
          </div>
        </div>
      </div>
      
      {/* Point count indicator */}
      {points.length > 0 && (
        <div className="absolute top-4 left-4 p-2 bg-background/90 backdrop-blur-sm rounded-lg border shadow-sm z-10">
          <p className="text-sm font-medium">{points.length} data points</p>
        </div>
      )}
      
      {/* Loading overlay */}
      {(isLoading || !mapLoaded) && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-sm font-medium">
              {isLoading ? 'Loading heatmap data...' : 'Initializing map...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeatmapComponent;
