
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, options?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      getCenter(): LatLng;
      setZoom(zoom: number): void;
      getZoom(): number;
      setOptions(options: MapOptions): void;
      addListener(eventName: string, handler: Function): MapsEventListener;
      panTo(latLng: LatLng | LatLngLiteral): void;
      fitBounds(bounds: LatLngBounds | LatLngBoundsLiteral, padding?: number | Padding): void;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      setPosition(latLng: LatLng | LatLngLiteral): void;
      getPosition(): LatLng | null;
      setTitle(title: string): void;
      getTitle(): string | undefined;
      setZIndex(zIndex: number): void;
      getZIndex(): number | undefined;
      setLabel(label: string | MarkerLabel): void;
      getLabel(): string | MarkerLabel | undefined;
      setIcon(icon: Icon | null): void;
      getIcon(): Icon | null | undefined;
      setVisible(visible: boolean): void;
      getVisible(): boolean | undefined;
      addListener(eventName: string, handler: Function): MapsEventListener;
    }

    class Geocoder {
      constructor();
      geocode(request: GeocoderRequest, callback: (results: GeocoderResult[], status: GeocoderStatus) => void): void;
    }

    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      open(map: Map, anchor?: Marker): void;
      setContent(content: string | Node): void;
      close(): void;
    }

    class LatLngBounds {
      constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
      extend(latLng: LatLng | LatLngLiteral): LatLngBounds;
      getCenter(): LatLng;
      isEmpty(): boolean;
    }

    // Constructor for Size
    class Size {
      constructor(width: number, height: number, widthUnit?: string, heightUnit?: string);
      width: number;
      height: number;
      equals(other: Size): boolean;
      toString(): string;
    }

    // Constructor for Point
    class Point {
      constructor(x: number, y: number);
      x: number;
      y: number;
      equals(other: Point): boolean;
      toString(): string;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
      zoomControl?: boolean;
      styles?: any[];
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      animation?: any;
      title?: string;
      label?: string | MarkerLabel;
      visible?: boolean;
      zIndex?: number;
      icon?: Icon | string | null;
    }

    type Icon = {
      url?: string;
      scaledSize?: Size;
      size?: Size;
      origin?: Point;
      anchor?: Point;
      labelOrigin?: Point;
      path?: number;
      scale?: number;
      fillColor?: string;
      fillOpacity?: number;
      strokeColor?: string;
      strokeWeight?: number;
    };

    interface MarkerLabel {
      text: string;
      color?: string;
      fontFamily?: string;
      fontSize?: string;
      fontWeight?: string;
      className?: string;
    }

    interface InfoWindowOptions {
      content?: string | Node;
      position?: LatLng | LatLngLiteral;
    }

    interface GeocoderRequest {
      address?: string;
      location?: LatLng | LatLngLiteral;
      bounds?: LatLngBounds;
      componentRestrictions?: GeocoderComponentRestrictions;
      region?: string;
    }

    interface GeocoderComponentRestrictions {
      administrativeArea?: string;
      country?: string | string[];
      locality?: string;
      postalCode?: string;
      route?: string;
    }

    interface GeocoderResult {
      address_components: GeocoderAddressComponent[];
      formatted_address: string;
      geometry: GeocoderGeometry;
      partial_match: boolean;
      place_id: string;
      plus_code?: { compound_code: string; global_code: string };
      postcode_localities?: string[];
      types: string[];
    }

    interface GeocoderAddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }

    interface GeocoderGeometry {
      bounds?: LatLngBounds;
      location: LatLng;
      location_type: GeocoderLocationType;
      viewport: LatLngBounds;
    }

    interface Padding {
      top: number;
      right: number;
      bottom: number;
      left: number;
    }

    type GeocoderLocationType = "APPROXIMATE" | "GEOMETRIC_CENTER" | "RANGE_INTERPOLATED" | "ROOFTOP";
    type GeocoderStatus = "ERROR" | "INVALID_REQUEST" | "OK" | "OVER_QUERY_LIMIT" | "REQUEST_DENIED" | "UNKNOWN_ERROR" | "ZERO_RESULTS";

    interface LatLng {
      lat(): number;
      lng(): number;
      toString(): string;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface LatLngBounds {
      contains(latLng: LatLng | LatLngLiteral): boolean;
      equals(other: LatLngBounds | LatLngBoundsLiteral): boolean;
      extend(latLng: LatLng | LatLngLiteral): LatLngBounds;
      getCenter(): LatLng;
      getNorthEast(): LatLng;
      getSouthWest(): LatLng;
      intersects(other: LatLngBounds | LatLngBoundsLiteral): boolean;
      isEmpty(): boolean;
      toJSON(): LatLngBoundsLiteral;
      toSpan(): LatLng;
      toString(): string;
      union(other: LatLngBounds | LatLngBoundsLiteral): LatLngBounds;
    }

    interface LatLngBoundsLiteral {
      east: number;
      north: number;
      south: number;
      west: number;
    }

    interface MapsEventListener {
      remove(): void;
    }

    const Animation: {
      BOUNCE: number;
      DROP: number;
      Pc: number;
    };
    
    const event: {
      trigger(instance: any, eventName: string, ...args: any[]): void;
      addListener(instance: any, eventName: string, handler: Function): MapsEventListener;
      removeListener(listener: MapsEventListener): void;
      clearInstanceListeners(instance: any): void;
      clearListeners(instance: any, eventName: string): void;
    };

    // Add SymbolPath enum
    const SymbolPath: {
      CIRCLE: number;
      BACKWARD_CLOSED_ARROW: number;
      FORWARD_CLOSED_ARROW: number;
      BACKWARD_OPEN_ARROW: number;
      FORWARD_OPEN_ARROW: number;
    };
  }
}

interface Window {
  google: typeof google;
}
