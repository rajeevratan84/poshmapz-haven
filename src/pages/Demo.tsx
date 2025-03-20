
import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { MapPin, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { analyzeAreaPreferences } from '@/services/openaiService';
import { Link } from 'react-router-dom';

interface AreaMatch {
  name: string;
  matchPercentage: number;
  description: string;
  poshScore: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  amenities: string[];
}

const DemoPage: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<AreaMatch[]>([]);
  const [selectedArea, setSelectedArea] = useState<AreaMatch | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  
  // OpenAI API key (in a real production app, this would be stored securely on the server)
  // This is just for demo purposes
  const apiKey = "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";

  // Initialize Google Maps
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = () => {
      if (!mapRef.current) return;
      
      try {
        // Default coordinates for London
        const londonCoordinates = { lat: 51.507, lng: -0.127 };
        
        // Create the map instance
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          zoom: 11,
          center: londonCoordinates,
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
      } catch (error) {
        console.error("Error initializing map:", error);
        toast.error("Could not initialize Google Maps.");
      }
    };

    if (window.google?.maps) {
      initMap();
    } else {
      // Load Google Maps API if it's not already loaded
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
  }, []);

  // Process search with OpenAI
  const processSearch = async () => {
    if (!userInput.trim()) {
      toast.error("Please enter your preferences");
      return;
    }

    setIsSearching(true);
    setResults([]);
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    try {
      // Call OpenAI to analyze user preferences
      const areas = await analyzeAreaPreferences(userInput, apiKey);
      
      if (areas && areas.length > 0) {
        setResults(areas);
        
        // Add markers for each result
        if (mapInstanceRef.current) {
          areas.forEach(area => addMarkerForArea(area));
          
          // Center map to fit all markers
          if (areas.length && mapInstanceRef.current) {
            const bounds = new google.maps.LatLngBounds();
            markersRef.current.forEach(marker => {
              if (marker.getPosition()) {
                bounds.extend(marker.getPosition()!);
              }
            });
            mapInstanceRef.current.fitBounds(bounds);
            
            // If only one marker, zoom in closer
            if (markersRef.current.length === 1 && mapInstanceRef.current) {
              mapInstanceRef.current.setZoom(14);
            }
          }
        }
      } else {
        toast.error("No matching areas found. Try adjusting your search criteria.");
      }
    } catch (error) {
      console.error("Error processing search:", error);
      toast.error("Failed to process your request. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const addMarkerForArea = (area: AreaMatch) => {
    if (!mapInstanceRef.current) return;
    
    const marker = new google.maps.Marker({
      position: area.coordinates,
      map: mapInstanceRef.current,
      animation: google.maps.Animation.DROP,
      label: area.name.charAt(0),
      title: `${area.name} - ${area.matchPercentage}% match`
    });
    
    // Create HTML content for info window
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
    
    // Add event listeners for hover and click
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
        setSelectedArea(area);
      }
    });
    
    markersRef.current.push(marker);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processSearch();
    }
  };

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header */}
      <header className="w-full bg-black/90 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-1 text-white">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-coral" />
            <span className="font-display text-xl font-semibold text-white">PoshMaps Demo</span>
          </div>
          <div className="w-20"></div> {/* Placeholder for balance */}
        </div>
      </header>

      <main className="container mx-auto px-6 mt-8">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
            Find Your Perfect London Neighbourhood
          </h1>
          <p className="text-lg text-white/80 mb-8">
            Tell us what you're looking for in a neighborhood, and our AI will find the best matches in London
          </p>
          
          {/* Search Input */}
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-2 mb-6">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., I want to live near a tube station, park, and good pubs"
              className="flex-grow bg-white/10 text-white border-white/20 placeholder:text-white/40 h-12"
            />
            <Button 
              onClick={processSearch}
              disabled={isSearching}
              className="bg-posh-green hover:bg-green-600 text-white min-w-[120px] h-12"
            >
              {isSearching ? 
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </div> : 
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>Find Areas</span>
                </div>
              }
            </Button>
          </div>
          
          <div className="text-xs text-white/60 mb-8">
            <p>Try queries like "near a tube station and park" or "family-friendly with good schools"</p>
            <p className="mt-1">This demo is currently limited to London areas only</p>
          </div>
        </div>
        
        {/* Map Container */}
        <div className="bg-black/20 rounded-xl p-4 shadow-lg">
          <div ref={mapRef} className="w-full h-[500px] rounded-lg mb-6"></div>
          
          {/* Results */}
          <div className="mt-6">
            <h2 className="text-xl font-display font-semibold mb-4 text-white">
              {results.length > 0 ? 'Recommended Areas' : 'Enter your preferences to see matches'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((area) => (
                <div 
                  key={area.name}
                  className={cn(
                    "p-4 rounded-lg transition-all duration-200 cursor-pointer",
                    selectedArea?.name === area.name 
                      ? "bg-white/15 border border-posh-green" 
                      : "bg-white/10 border border-transparent hover:bg-white/15"
                  )}
                  onClick={() => {
                    setSelectedArea(area);
                    // Find the marker for this area and trigger a click
                    const marker = markersRef.current.find(m => m.getTitle()?.startsWith(area.name));
                    if (marker && mapInstanceRef.current) {
                      mapInstanceRef.current.panTo(marker.getPosition()!);
                      mapInstanceRef.current.setZoom(14);
                      google.maps.event.trigger(marker, 'click');
                    }
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-white">{area.name}</h3>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      area.matchPercentage > 90 ? "bg-green-600 text-white" :
                      area.matchPercentage > 80 ? "bg-green-500 text-white" :
                      "bg-green-400 text-white"
                    )}>
                      {area.matchPercentage}% Match
                    </span>
                  </div>
                  <div className="text-xs text-posh-green mb-2">Posh Score: {area.poshScore}/100</div>
                  <p className="text-sm text-white/70">{area.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {area.amenities.slice(0, 3).map((amenity, idx) => (
                      <span key={idx} className="text-xs bg-white/10 px-2 py-1 rounded">
                        {amenity}
                      </span>
                    ))}
                    {area.amenities.length > 3 && (
                      <span className="text-xs bg-white/10 px-2 py-1 rounded">
                        +{area.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {results.length === 0 && !isSearching && userInput && (
              <div className="bg-white/10 rounded-lg p-6 text-center">
                <p className="text-white/80">No areas matching your criteria were found. Try broadening your search.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DemoPage;
