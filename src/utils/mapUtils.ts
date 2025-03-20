
import { toast } from 'sonner';

export interface AreaInfo {
  position: { lat: number, lng: number };
  label: string;
  title: string;
  match: string;
  description: string;
  poshScore: string;
}

// Load Google Maps API script dynamically
export const loadGoogleMapsScript = (
  apiKey: string, 
  callback: () => void, 
  errorCallback: () => void
): (() => void) => {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geocoding`;
  script.async = true;
  script.defer = true;
  
  script.onload = callback;
  script.onerror = () => {
    console.error("Failed to load Google Maps API");
    toast.error("Could not load Google Maps. Please try again later.");
    errorCallback();
  };
  
  document.head.appendChild(script);
  
  return () => {
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
  };
};

// Create map styles for consistent styling - using a light theme
export const mapStyles = [
  {
    "featureType": "poi",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  }
];

// Default Richmond coordinates
export const DEFAULT_COORDINATES = { lat: 51.461, lng: -0.306 };

// Create the content string for area info windows
export const createAreaInfoContent = (area: AreaInfo): string => {
  return `
    <div class="p-3 max-w-xs">
      <div class="flex justify-between items-center mb-1">
        <div class="font-medium text-gray-800">${area.title}</div>
        <div class="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded">${area.match}</div>
      </div>
      <div class="text-xs font-semibold text-green-600 mb-1">${area.poshScore}</div>
      <div class="text-xs text-gray-600">${area.description}</div>
    </div>
  `;
};

// North London areas data
export const getNorthLondonAreas = (): AreaInfo[] => {
  return [
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
};
