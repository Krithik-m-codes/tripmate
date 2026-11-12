/** Minimal shared interface both Mapbox GL and MapLibre GL maps satisfy. */
export interface MapHandle {
  flyTo(options: { center: [number, number]; zoom: number; duration?: number }): void;
  fitBounds(
    bounds: [[number, number], [number, number]],
    options?: { padding?: number }
  ): void;
}

// These are just branded aliases so components can type-narrow if needed.
export type MapboxMapType = MapHandle & { _type?: "mapbox" };
export type MapLibreMapType = MapHandle & { _type?: "maplibre" };
