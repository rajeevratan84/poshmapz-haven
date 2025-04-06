
declare namespace maplibregl {
  export class Map {
    constructor(options: MapOptions);
    
    addControl(control: Control, position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'): this;
    addLayer(layer: AnyLayer, before?: string): this;
    addSource(id: string, source: AnySourceData): this;
    
    getCanvas(): HTMLCanvasElement;
    getCenter(): LngLat;
    getLayer(id: string): AnyLayer;
    getSource(id: string): AnySourceData;
    getZoom(): number;
    
    on(type: string, listener: Function): this;
    off(type: string, listener: Function): this;
    
    remove(): void;
    removeLayer(id: string): this;
    removeSource(id: string): this;
    
    setCenter(center: LngLatLike): this;
    setStyle(style: string | StyleSpecification): this;
    setZoom(zoom: number): this;
    setPaintProperty(layerId: string, name: string, value: any): this;
    setLayoutProperty(layerId: string, name: string, value: any): this;
    
    queryRenderedFeatures(
      pointOrBox?: PointLike | [PointLike, PointLike],
      options?: { layers?: string[]; filter?: any[] }
    ): any[];
  }
  
  export class NavigationControl implements Control {
    constructor(options?: { showCompass?: boolean; showZoom?: boolean; visualizePitch?: boolean });
    onAdd(map: Map): HTMLElement;
    onRemove(map: Map): void;
  }
  
  export class Popup {
    constructor(options?: PopupOptions);
    setLngLat(lnglat: LngLatLike): this;
    setHTML(html: string): this;
    setText(text: string): this;
    addTo(map: Map): this;
    remove(): this;
  }
  
  export interface MapOptions {
    container: string | HTMLElement;
    style: string | StyleSpecification;
    center?: LngLatLike;
    zoom?: number;
    bearing?: number;
    pitch?: number;
    minZoom?: number;
    maxZoom?: number;
    interactive?: boolean;
    attributionControl?: boolean;
    preserveDrawingBuffer?: boolean;
    antialias?: boolean;
    refreshExpiredTiles?: boolean;
    failIfMajorPerformanceCaveat?: boolean;
    transformRequest?: (url: string, resourceType: string) => { url: string; headers?: { [key: string]: string }; credentials?: string };
  }
  
  export interface Control {
    onAdd(map: Map): HTMLElement;
    onRemove(map: Map): void;
  }
  
  export type LngLatLike = LngLat | [number, number] | { lng: number; lat: number };
  
  export class LngLat {
    constructor(lng: number, lat: number);
    lng: number;
    lat: number;
    
    wrap(): LngLat;
    toArray(): [number, number];
    toString(): string;
    distanceTo(lngLat: LngLat): number;
    toBounds(radius: number): LngLatBounds;
  }
  
  export class LngLatBounds {
    constructor(sw?: LngLatLike, ne?: LngLatLike);
    extend(lngLat: LngLatLike | LngLatBounds): this;
    getCenter(): LngLat;
    getSouthWest(): LngLat;
    getNorthEast(): LngLat;
    getNorthWest(): LngLat;
    getSouthEast(): LngLat;
    isEmpty(): boolean;
    toArray(): [LngLatLike, LngLatLike];
    toString(): string;
    contains(lngLat: LngLatLike): boolean;
  }
  
  export interface PopupOptions {
    closeButton?: boolean;
    closeOnClick?: boolean;
    closeOnMove?: boolean;
    anchor?: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    offset?: number | PointLike;
    className?: string;
    maxWidth?: string;
  }
  
  export type PointLike = Point | [number, number];
  
  export class Point {
    constructor(x: number, y: number);
    x: number;
    y: number;
    
    clone(): Point;
    add(point: Point): Point;
    sub(point: Point): Point;
    mult(factor: number): Point;
    div(factor: number): Point;
    rotate(angle: number): Point;
    matMult(matrix: [number, number, number, number]): Point;
    equals(point: Point): boolean;
    dist(point: Point): number;
    mag(): number;
    unit(): Point;
    perp(): Point;
    round(): Point;
    toString(): string;
  }
  
  export interface AnyLayer {
    id: string;
    type: string;
    source?: string;
    'source-layer'?: string;
    [key: string]: any;
  }
  
  export interface AnySourceData {
    type: string;
    [key: string]: any;
  }
  
  export interface StyleSpecification {
    version: number;
    name?: string;
    metadata?: any;
    center?: number[];
    zoom?: number;
    bearing?: number;
    pitch?: number;
    light?: any;
    terrain?: any;
    sources: {
      [key: string]: AnySourceData;
    };
    layers: AnyLayer[];
  }
}

interface Window {
  maplibregl: typeof maplibregl;
}
