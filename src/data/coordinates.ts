/**
 * Approximate centroid (lat, lng) for each country in our dataset. Used by
 * the MapView component to plot countries on a stylised Europe map.
 *
 * For Russia we use a Moscow-area coordinate rather than the real geographic
 * centroid (which sits in Siberia, way off any Europe-focused map).
 */
export interface LatLng {
  lat: number;
  lng: number;
}

export const COORDINATES: Record<string, LatLng> = {
  Albania: { lat: 41.0, lng: 20.0 },
  Andorra: { lat: 42.5, lng: 1.5 },
  Austria: { lat: 47.5, lng: 14.5 },
  Belarus: { lat: 53.7, lng: 27.9 },
  Belgium: { lat: 50.5, lng: 4.7 },
  'Bosnia and Herzegovina': { lat: 44.0, lng: 17.7 },
  Bulgaria: { lat: 42.7, lng: 25.5 },
  Croatia: { lat: 45.1, lng: 15.3 },
  'Czech Republic': { lat: 49.8, lng: 15.4 },
  Denmark: { lat: 56.0, lng: 9.5 },
  Estonia: { lat: 58.7, lng: 25.5 },
  Finland: { lat: 64.0, lng: 26.0 },
  France: { lat: 46.6, lng: 2.5 },
  Germany: { lat: 51.1, lng: 10.4 },
  Greece: { lat: 39.0, lng: 22.0 },
  Hungary: { lat: 47.0, lng: 19.5 },
  Iceland: { lat: 64.9, lng: -19.0 },
  Ireland: { lat: 53.4, lng: -8.2 },
  Italy: { lat: 42.8, lng: 12.5 },
  Kosovo: { lat: 42.6, lng: 21.0 },
  Latvia: { lat: 56.9, lng: 24.6 },
  Liechtenstein: { lat: 47.2, lng: 9.5 },
  Lithuania: { lat: 55.2, lng: 23.9 },
  Luxembourg: { lat: 49.8, lng: 6.1 },
  Moldova: { lat: 47.4, lng: 28.5 },
  Monaco: { lat: 43.7, lng: 7.4 },
  Montenegro: { lat: 42.7, lng: 19.4 },
  Netherlands: { lat: 52.1, lng: 5.3 },
  'North Macedonia': { lat: 41.6, lng: 21.7 },
  Norway: { lat: 60.5, lng: 9.0 },
  Poland: { lat: 52.0, lng: 19.5 },
  Portugal: { lat: 39.4, lng: -8.0 },
  Romania: { lat: 45.9, lng: 25.0 },
  Russia: { lat: 55.7, lng: 37.6 }, // Moscow rather than true centroid
  'San Marino': { lat: 43.9, lng: 12.5 },
  Serbia: { lat: 44.0, lng: 21.0 },
  Slovakia: { lat: 48.7, lng: 19.7 },
  Slovenia: { lat: 46.1, lng: 14.8 },
  Spain: { lat: 40.4, lng: -3.7 },
  Sweden: { lat: 60.1, lng: 18.6 },
  Switzerland: { lat: 46.8, lng: 8.2 },
  Ukraine: { lat: 49.0, lng: 32.0 },
  'United Kingdom': { lat: 54.0, lng: -2.5 },
};

// Map covers roughly -25°W to 45°E and 35°N to 70°N. Picked to fit Iceland,
// Portugal, Greece and Moscow-as-Russia inside one viewport.
export const MAP_BOUNDS = {
  minLng: -25,
  maxLng: 45,
  minLat: 35,
  maxLat: 70,
};

/** Project lat/lng to SVG x/y for a given canvas size. Equirectangular. */
export function projectCountry(
  country: string,
  width: number,
  height: number
): { x: number; y: number } | null {
  const c = COORDINATES[country];
  if (!c) return null;
  const { minLng, maxLng, minLat, maxLat } = MAP_BOUNDS;
  const x = ((c.lng - minLng) / (maxLng - minLng)) * width;
  const y = ((maxLat - c.lat) / (maxLat - minLat)) * height;
  return { x, y };
}
