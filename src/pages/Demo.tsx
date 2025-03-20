import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { MapPin, ArrowLeft, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { analyzeAreaPreferences } from '@/services/openaiService';
import { Link } from 'react-router-dom';
import AreaDetailCard from '@/components/AreaDetailCard';
import SearchLoadingAnimation from '@/components/SearchLoadingAnimation';

interface AreaStats {
  crimeRate: string;
  transportScore: string;
  walkability: string;
  propertyGrowth: {
    flats: string;
    houses: string;
  };
  areaVibe: string[];
}

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
  areaStats: AreaStats;
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
  
  const apiKey = "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";

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = () => {
      if (!mapRef.current) return;
      
      try {
        const londonCoordinates = { lat: 51.507, lng: -0.127 };
        
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
  }, []);

  const processSearch = async () => {
    if (!userInput.trim()) {
      toast.error("Please enter your preferences");
      return;
    }

    setIsSearching(true);
    setResults([]);
    setSelectedArea(null);
    
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    try {
      console.log("Sending request to analyze:", userInput);
      
      const startTime = Date.now();
      const areas = await analyzeAreaPreferences(userInput, apiKey);
      const elapsedTime = Date.now() - startTime;
      
      if (elapsedTime < 3000) {
        await new Promise(resolve => setTimeout(resolve, 3000 - elapsedTime));
      }
      
      if (areas && areas.length > 0) {
        console.log("Received area matches:", areas);
        setResults(areas);
        toast.success(`Found ${areas.length} matching areas in London!`);
        
        if (mapInstanceRef.current) {
          areas.forEach(area => addMarkerForArea(area));
          
          if (areas.length && mapInstanceRef.current) {
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
    
    const areaInfo = {
      position: area.coordinates,
      label: area.name.charAt(0),
      title: area.name,
      match: `${area.matchPercentage}% match`,
      description: area.description,
      poshScore: area.poshScore,
      amenities: area.amenities,
      areaStats: area.areaStats
    };
    
    const marker = new google.maps.Marker({
      position: area.coordinates,
      map: mapInstanceRef.current,
      animation: google.maps.Animation.DROP,
      label: {
        text: area.name.charAt(0),
        color: 'white',
        fontWeight: 'bold',
        fontSize: '14px',
      },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: area.matchPercentage > 90 ? '#22c55e' : 
                  area.matchPercentage > 80 ? '#4ade80' : 
                  area.matchPercentage > 70 ? '#86efac' : '#a3e635',
        fillOpacity: 0.9,
        strokeWeight: 2,
        strokeColor: '#ffffff',
        scale: 12,
      },
      title: `${area.name} - ${area.matchPercentage}% match`
    });
    
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
        
        const areaElement = document.getElementById(`area-${area.name.replace(/\s+/g, '-').toLowerCase()}`);
        if (areaElement && window.innerWidth < 768) {
          areaElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
    
    markersRef.current.push(marker);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processSearch();
    }
  };

  const handleAreaClick = (area: AreaMatch) => {
    setSelectedArea(area);
    const marker = markersRef.current.find(m => m.getTitle()?.startsWith(area.name));
    if (marker && mapInstanceRef.current) {
      mapInstanceRef.current.panTo(marker.getPosition()!);
      mapInstanceRef.current.setZoom(14);
      google.maps.event.trigger(marker, 'click');
    }
  };

  const searchSuggestions = [
    "Family-friendly area with good schools and parks",
    "Young professional area with great nightlife and transport",
    "Quiet residential area with good amenities",
    "Trendy area with cafes and cultural activities"
  ];

  return (
    <div className="min-h-screen bg-black pb-20">
      <header className="w-full bg-black/90 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-1 text-white">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-coral" />
            <span className="font-display text-xl font-semibold text-white">PoshMaps London</span>
          </div>
          <div className="w-20"></div>
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
              variant="glow"
              size="lg"
              className="min-w-[120px] h-12"
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
          
          <div className="text-white/70 mb-4 text-sm">
            <p className="mb-2">Try queries like:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {searchSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  className="bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full text-xs transition-colors"
                  onClick={() => {
                    setUserInput(suggestion);
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-xs text-posh-green font-semibold bg-black/30 py-2 px-4 rounded-full mx-auto w-fit">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Early Access Beta - London areas only</span>
          </div>
        </div>
        
        <div className="bg-black/20 rounded-xl p-4 shadow-lg">
          <div ref={mapRef} className="w-full h-[500px] rounded-lg mb-6"></div>
          
          <SearchLoadingAnimation isVisible={isSearching} />
          
          <div className="mt-6">
            <h2 className="text-xl font-display font-semibold mb-4 text-white flex items-center gap-2">
              {results.length > 0 ? (
                <>
                  <MapPin className="h-5 w-5 text-coral" />
                  <span>Recommended Areas in London</span>
                  <span className="text-sm bg-posh-green text-white px-2 py-0.5 rounded-full ml-2">
                    {results.length} matches
                  </span>
                </>
              ) : (
                !isSearching && 'Enter your preferences to see London matches'
              )}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {results.map((area) => (
                <div 
                  key={area.name}
                  id={`area-${area.name.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  <AreaDetailCard 
                    areaName={area.name}
                    matchPercentage={area.matchPercentage}
                    description={area.description}
                    poshScore={area.poshScore}
                    amenities={area.amenities}
                    areaStats={area.areaStats}
                    isSelected={selectedArea?.name === area.name}
                    onClick={() => handleAreaClick(area)}
                  />
                </div>
              ))}
            </div>
            
            {results.length === 0 && !isSearching && userInput && (
              <div className="bg-white/10 rounded-lg p-6 text-center">
                <p className="text-white/80">No areas matching your criteria were found. Try broadening your search.</p>
              </div>
            )}
            
            {!results.length && !userInput && (
              <div className="bg-gradient-to-br from-black/40 to-black/20 rounded-lg p-8 text-center border border-white/10">
                <MapPin className="h-12 w-12 text-coral mx-auto mb-4 opacity-80" />
                <h3 className="text-xl font-display font-medium text-white mb-2">Discover Your Perfect London Area</h3>
                <p className="text-white/70 mb-6 max-w-xl mx-auto">
                  Get detailed area insights including transport links, walkability scores, property growth forecasts, 
                  and more - tailored to your unique lifestyle preferences.
                </p>
                <Button
                  onClick={() => {
                    const inputEl = document.querySelector('input');
                    if (inputEl) inputEl.focus();
                  }}
                  variant="glow"
                  size="lg"
                  className="mx-auto"
                >
                  <Search className="h-4 w-4" />
                  <span>Start Your Search</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DemoPage;
