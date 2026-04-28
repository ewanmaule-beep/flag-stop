/**
 * Approximate centroid (lat, lng) for every sovereign country in our
 * worldwide dataset. Used by the world-map view (planned) to plot
 * countries on a stylised whole-world map.
 *
 * For very large countries (Russia, Canada, United States, China,
 * Australia) we use a representative populated-area centroid rather
 * than the true geographic centre, so pins land somewhere meaningful
 * on a world map instead of in the middle of empty wilderness.
 */

import type { LatLng } from './coordinates';

export const WORLD_COORDINATES: Record<string, LatLng> = {
  // --- Africa ---
  Algeria: { lat: 28.0, lng: 1.7 },
  Angola: { lat: -11.2, lng: 17.9 },
  Benin: { lat: 9.3, lng: 2.3 },
  Botswana: { lat: -22.3, lng: 24.7 },
  'Burkina Faso': { lat: 12.2, lng: -1.6 },
  Burundi: { lat: -3.4, lng: 29.9 },
  Cameroon: { lat: 7.4, lng: 12.4 },
  'Central African Republic': { lat: 6.6, lng: 20.9 },
  Chad: { lat: 15.5, lng: 18.7 },
  Comoros: { lat: -11.9, lng: 43.9 },
  'Democratic Republic of the Congo': { lat: -2.9, lng: 23.7 },
  'Republic of the Congo': { lat: -0.2, lng: 15.8 },
  Djibouti: { lat: 11.8, lng: 42.6 },
  Egypt: { lat: 26.8, lng: 30.8 },
  'Equatorial Guinea': { lat: 1.7, lng: 10.3 },
  Eritrea: { lat: 15.2, lng: 39.8 },
  Eswatini: { lat: -26.5, lng: 31.5 },
  Ethiopia: { lat: 9.1, lng: 40.5 },
  Gabon: { lat: -0.8, lng: 11.6 },
  Gambia: { lat: 13.4, lng: -15.5 },
  Ghana: { lat: 7.9, lng: -1.0 },
  Guinea: { lat: 9.9, lng: -9.7 },
  'Guinea-Bissau': { lat: 11.8, lng: -15.2 },
  'Ivory Coast': { lat: 7.5, lng: -5.5 },
  Kenya: { lat: -0.0, lng: 37.9 },
  Lesotho: { lat: -29.6, lng: 28.2 },
  Liberia: { lat: 6.4, lng: -9.4 },
  Libya: { lat: 26.3, lng: 17.2 },
  Madagascar: { lat: -18.8, lng: 47.0 },
  Malawi: { lat: -13.3, lng: 34.3 },
  Mali: { lat: 17.6, lng: -4.0 },
  Mauritania: { lat: 21.0, lng: -10.9 },
  Mauritius: { lat: -20.3, lng: 57.6 },
  Morocco: { lat: 31.8, lng: -7.1 },
  Mozambique: { lat: -18.7, lng: 35.5 },
  Namibia: { lat: -22.9, lng: 18.5 },
  Niger: { lat: 17.6, lng: 8.1 },
  Nigeria: { lat: 9.1, lng: 8.7 },
  Rwanda: { lat: -1.9, lng: 29.9 },
  Senegal: { lat: 14.5, lng: -14.5 },
  'Sierra Leone': { lat: 8.5, lng: -11.8 },
  Somalia: { lat: 5.2, lng: 46.2 },
  'South Africa': { lat: -30.6, lng: 22.9 },
  'South Sudan': { lat: 6.9, lng: 31.3 },
  Sudan: { lat: 12.9, lng: 30.2 },
  Tanzania: { lat: -6.4, lng: 34.9 },
  Togo: { lat: 8.6, lng: 0.8 },
  Tunisia: { lat: 33.9, lng: 9.5 },
  Uganda: { lat: 1.4, lng: 32.3 },
  Zambia: { lat: -13.1, lng: 27.8 },
  Zimbabwe: { lat: -19.0, lng: 29.2 },

  // --- Americas ---
  'Antigua and Barbuda': { lat: 17.1, lng: -61.8 },
  Argentina: { lat: -38.4, lng: -63.6 },
  Bahamas: { lat: 25.0, lng: -77.4 },
  Barbados: { lat: 13.2, lng: -59.5 },
  Belize: { lat: 17.2, lng: -88.5 },
  Bolivia: { lat: -16.3, lng: -63.6 },
  Brazil: { lat: -14.2, lng: -51.9 },
  // Canada: representative populated centroid near the southern populated belt
  Canada: { lat: 50.0, lng: -90.0 },
  Chile: { lat: -35.7, lng: -71.5 },
  Colombia: { lat: 4.6, lng: -74.3 },
  'Costa Rica': { lat: 9.7, lng: -83.8 },
  Cuba: { lat: 21.5, lng: -77.8 },
  Dominica: { lat: 15.4, lng: -61.4 },
  'Dominican Republic': { lat: 18.7, lng: -70.2 },
  Ecuador: { lat: -1.8, lng: -78.2 },
  'El Salvador': { lat: 13.8, lng: -88.9 },
  Grenada: { lat: 12.1, lng: -61.7 },
  Guatemala: { lat: 15.8, lng: -90.2 },
  Guyana: { lat: 4.9, lng: -58.9 },
  Haiti: { lat: 18.9, lng: -72.3 },
  Honduras: { lat: 15.2, lng: -86.2 },
  Jamaica: { lat: 18.1, lng: -77.3 },
  Mexico: { lat: 23.6, lng: -102.6 },
  Nicaragua: { lat: 12.9, lng: -85.2 },
  Panama: { lat: 8.5, lng: -80.8 },
  Paraguay: { lat: -23.4, lng: -58.4 },
  Peru: { lat: -9.2, lng: -75.0 },
  'Saint Kitts and Nevis': { lat: 17.3, lng: -62.7 },
  'Saint Lucia': { lat: 13.9, lng: -61.0 },
  'Saint Vincent and the Grenadines': { lat: 13.0, lng: -61.3 },
  Suriname: { lat: 3.9, lng: -56.0 },
  'Trinidad and Tobago': { lat: 10.7, lng: -61.2 },
  // United States: geographic centre of the contiguous 48 states
  'United States': { lat: 39.8, lng: -98.6 },
  Uruguay: { lat: -32.5, lng: -55.8 },
  Venezuela: { lat: 6.4, lng: -66.6 },

  // --- Asia ---
  Afghanistan: { lat: 33.9, lng: 67.7 },
  Armenia: { lat: 40.1, lng: 45.0 },
  Azerbaijan: { lat: 40.1, lng: 47.6 },
  Bahrain: { lat: 26.0, lng: 50.6 },
  Bangladesh: { lat: 23.7, lng: 90.4 },
  Bhutan: { lat: 27.5, lng: 90.4 },
  Brunei: { lat: 4.5, lng: 114.7 },
  Cambodia: { lat: 12.6, lng: 104.9 },
  // China: representative populated centroid (eastern populated heartland)
  China: { lat: 34.0, lng: 108.0 },
  Cyprus: { lat: 35.1, lng: 33.4 },
  Georgia: { lat: 42.3, lng: 43.4 },
  India: { lat: 20.6, lng: 78.9 },
  Indonesia: { lat: -0.8, lng: 113.9 },
  Iran: { lat: 32.4, lng: 53.7 },
  Iraq: { lat: 33.2, lng: 43.7 },
  Israel: { lat: 31.0, lng: 34.9 },
  Japan: { lat: 36.2, lng: 138.3 },
  Jordan: { lat: 30.6, lng: 36.2 },
  Kazakhstan: { lat: 48.0, lng: 66.9 },
  Kuwait: { lat: 29.3, lng: 47.5 },
  Kyrgyzstan: { lat: 41.2, lng: 74.8 },
  Laos: { lat: 19.9, lng: 102.5 },
  Lebanon: { lat: 33.9, lng: 35.9 },
  Malaysia: { lat: 4.2, lng: 101.9 },
  Maldives: { lat: 3.2, lng: 73.2 },
  Mongolia: { lat: 46.9, lng: 103.8 },
  Myanmar: { lat: 21.9, lng: 95.9 },
  Nepal: { lat: 28.4, lng: 84.1 },
  'North Korea': { lat: 40.3, lng: 127.5 },
  Oman: { lat: 21.5, lng: 55.9 },
  Pakistan: { lat: 30.4, lng: 69.3 },
  Philippines: { lat: 12.9, lng: 121.8 },
  Qatar: { lat: 25.4, lng: 51.2 },
  'Saudi Arabia': { lat: 23.9, lng: 45.1 },
  Singapore: { lat: 1.4, lng: 103.8 },
  'South Korea': { lat: 35.9, lng: 127.8 },
  'Sri Lanka': { lat: 7.9, lng: 80.8 },
  Syria: { lat: 34.8, lng: 38.9 },
  Taiwan: { lat: 23.7, lng: 121.0 },
  Tajikistan: { lat: 38.9, lng: 71.3 },
  Thailand: { lat: 15.9, lng: 100.9 },
  'Timor-Leste': { lat: -8.9, lng: 125.7 },
  Turkey: { lat: 38.9, lng: 35.2 },
  Turkmenistan: { lat: 39.0, lng: 59.6 },
  'United Arab Emirates': { lat: 24.0, lng: 53.8 },
  Uzbekistan: { lat: 41.4, lng: 64.6 },
  Vietnam: { lat: 14.1, lng: 108.3 },
  Yemen: { lat: 15.6, lng: 48.5 },

  // --- Europe ---
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
  // Russia: Moscow rather than the true Siberian centroid
  Russia: { lat: 55.7, lng: 37.6 },
  'San Marino': { lat: 43.9, lng: 12.5 },
  Serbia: { lat: 44.0, lng: 21.0 },
  Slovakia: { lat: 48.7, lng: 19.7 },
  Slovenia: { lat: 46.1, lng: 14.8 },
  Spain: { lat: 40.4, lng: -3.7 },
  Sweden: { lat: 60.1, lng: 18.6 },
  Switzerland: { lat: 46.8, lng: 8.2 },
  Ukraine: { lat: 49.0, lng: 32.0 },
  'United Kingdom': { lat: 54.0, lng: -2.5 },

  // --- Oceania ---
  // Australia: shifted southeast to sit near the populated belt
  Australia: { lat: -28.0, lng: 140.0 },
  Fiji: { lat: -17.7, lng: 178.1 },
  Kiribati: { lat: 1.4, lng: 173.0 },
  'Marshall Islands': { lat: 7.1, lng: 171.2 },
  Micronesia: { lat: 7.4, lng: 150.5 },
  Nauru: { lat: -0.5, lng: 166.9 },
  'New Zealand': { lat: -40.9, lng: 174.9 },
  Palau: { lat: 7.5, lng: 134.6 },
  'Papua New Guinea': { lat: -6.3, lng: 143.9 },
  Samoa: { lat: -13.7, lng: -172.1 },
  'Solomon Islands': { lat: -9.6, lng: 160.2 },
  Tonga: { lat: -21.2, lng: -175.2 },
  Tuvalu: { lat: -7.5, lng: 178.7 },
  Vanuatu: { lat: -15.4, lng: 166.9 },
};

// World-wide bounds. Latitude clipped at -60 / +80 to drop most of
// Antarctica and the Arctic so the visible viewport stays focused on
// inhabited landmasses. Must stay in sync with scripts/buildWorldOutlines.mjs.
export const WORLD_MAP_BOUNDS = {
  minLng: -180,
  maxLng: 180,
  minLat: -60,
  maxLat: 80,
};

/**
 * Project lat/lng to SVG x/y on a world map. Equirectangular projection,
 * matches the projection used by scripts/buildWorldOutlines.mjs.
 *
 * Returns null if the country has no entry in WORLD_COORDINATES.
 */
export function projectWorld(
  country: string,
  width: number = 1000,
  height: number = 500
): { x: number; y: number } | null {
  const c = WORLD_COORDINATES[country];
  if (!c) return null;
  const { minLng, maxLng, minLat, maxLat } = WORLD_MAP_BOUNDS;
  const x = ((c.lng - minLng) / (maxLng - minLng)) * width;
  const y = ((maxLat - c.lat) / (maxLat - minLat)) * height;
  return { x, y };
}
