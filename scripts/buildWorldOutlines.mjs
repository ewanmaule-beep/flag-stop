/**
 * One-shot generator for src/data/worldOutlines.ts.
 *
 * Reads Natural Earth 110m country polygons from the world-atlas package,
 * filters to every sovereign country we want to support worldwide, projects
 * each polygon with an equirectangular projection covering the whole globe,
 * and writes a static TypeScript file containing one SVG path string per
 * country.
 *
 * Run once with:
 *   npm install -D world-atlas topojson-client
 *   node scripts/buildWorldOutlines.mjs
 *
 * The generated file is committed to the repo; the dev dependencies above
 * are only needed at generation time and can be uninstalled afterwards.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { feature } from 'topojson-client';

// Whole-world bounds. Latitude is clipped at -60 / +80 to drop most of
// Antarctica and the Arctic so the visible viewport stays focused on
// inhabited landmasses.
const MAP_BOUNDS = { minLng: -180, maxLng: 180, minLat: -60, maxLat: 80 };
const VIEW_W = 1000;
const VIEW_H = 500;

// Canonical country names, grouped by continent for readability.
const TARGET_NAMES = [
  // Africa
  'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi',
  'Cameroon', 'Central African Republic', 'Chad', 'Comoros',
  'Democratic Republic of the Congo', 'Republic of the Congo', 'Djibouti',
  'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon',
  'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya',
  'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali',
  'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger',
  'Nigeria', 'Rwanda', 'Senegal', 'Sierra Leone', 'Somalia', 'South Africa',
  'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia',
  'Zimbabwe',

  // Americas
  'Antigua and Barbuda', 'Argentina', 'Bahamas', 'Barbados', 'Belize',
  'Bolivia', 'Brazil', 'Canada', 'Chile', 'Colombia', 'Costa Rica', 'Cuba',
  'Dominica', 'Dominican Republic', 'Ecuador', 'El Salvador', 'Grenada',
  'Guatemala', 'Guyana', 'Haiti', 'Honduras', 'Jamaica', 'Mexico',
  'Nicaragua', 'Panama', 'Paraguay', 'Peru', 'Saint Kitts and Nevis',
  'Saint Lucia', 'Saint Vincent and the Grenadines', 'Suriname',
  'Trinidad and Tobago', 'United States', 'Uruguay', 'Venezuela',

  // Asia
  'Afghanistan', 'Armenia', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Bhutan',
  'Brunei', 'Cambodia', 'China', 'Cyprus', 'Georgia', 'India', 'Indonesia',
  'Iran', 'Iraq', 'Israel', 'Japan', 'Jordan', 'Kazakhstan', 'Kuwait',
  'Kyrgyzstan', 'Laos', 'Lebanon', 'Malaysia', 'Maldives', 'Mongolia',
  'Myanmar', 'Nepal', 'North Korea', 'Oman', 'Pakistan', 'Philippines',
  'Qatar', 'Saudi Arabia', 'Singapore', 'South Korea', 'Sri Lanka', 'Syria',
  'Taiwan', 'Tajikistan', 'Thailand', 'Timor-Leste', 'Turkey',
  'Turkmenistan', 'United Arab Emirates', 'Uzbekistan', 'Vietnam', 'Yemen',

  // Europe
  'Albania', 'Andorra', 'Austria', 'Belarus', 'Belgium',
  'Bosnia and Herzegovina', 'Bulgaria', 'Croatia', 'Czech Republic',
  'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece',
  'Hungary', 'Iceland', 'Ireland', 'Italy', 'Kosovo', 'Latvia',
  'Liechtenstein', 'Lithuania', 'Luxembourg', 'Moldova', 'Monaco',
  'Montenegro', 'Netherlands', 'North Macedonia', 'Norway', 'Poland',
  'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia',
  'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine',
  'United Kingdom',

  // Oceania
  'Australia', 'Fiji', 'Kiribati', 'Marshall Islands', 'Micronesia',
  'Nauru', 'New Zealand', 'Palau', 'Papua New Guinea', 'Samoa',
  'Solomon Islands', 'Tonga', 'Tuvalu', 'Vanuatu',
];

// world-atlas 110m uses Natural Earth `name` properties. Map any names that
// differ from our canonical list. Entries mapped to `null` are skipped
// entirely (territories we don't want as countries — Western Sahara,
// Palestine, Somaliland, etc.).
const NAME_MAP = {
  // Africa
  'Dem. Rep. Congo': 'Democratic Republic of the Congo',
  'Congo': 'Republic of the Congo',
  'Central African Rep.': 'Central African Republic',
  'Eq. Guinea': 'Equatorial Guinea',
  'W. Sahara': null,
  'S. Sudan': 'South Sudan',
  "Côte d'Ivoire": 'Ivory Coast',
  'eSwatini': 'Eswatini',
  'Somaliland': null,

  // Europe
  'Bosnia and Herz.': 'Bosnia and Herzegovina',
  'Czechia': 'Czech Republic',
  'Macedonia': 'North Macedonia',
  'Republic of Serbia': 'Serbia',
  'Russian Federation': 'Russia',

  // Americas
  'United States of America': 'United States',
  'Dominican Rep.': 'Dominican Republic',

  // Asia
  'Timor-Leste': 'Timor-Leste',
  'Lao PDR': 'Laos',
  'Korea': 'South Korea',
  'Dem. Rep. Korea': 'North Korea',
  'Myanmar': 'Myanmar',
  'Taiwan': 'Taiwan',
  'Palestine': null,
  'W. Bank': null,

  // Oceania
  'Solomon Is.': 'Solomon Islands',
};

function project([lng, lat]) {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * VIEW_W;
  const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * VIEW_H;
  return [x, y];
}

function ringToPath(ring) {
  return ring
    .map(([lng, lat], i) => {
      const [x, y] = project([lng, lat]);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ') + ' Z';
}

function polygonToPath(coords) {
  // coords = [outerRing, ...holes]; SVG even-odd / nonzero handles holes.
  return coords.map(ringToPath).join(' ');
}

function geometryToPath(geom) {
  if (!geom) return '';
  if (geom.type === 'Polygon') return polygonToPath(geom.coordinates);
  if (geom.type === 'MultiPolygon') return geom.coordinates.map(polygonToPath).join(' ');
  return '';
}

const topo = JSON.parse(
  readFileSync('node_modules/world-atlas/countries-110m.json', 'utf-8')
);
const fc = feature(topo, topo.objects.countries);

const outlines = {};
const seenNames = new Set();
for (const f of fc.features) {
  const rawName = f.properties?.name ?? '';
  seenNames.add(rawName);

  // Resolve via NAME_MAP if present, otherwise use the raw name.
  let ourName;
  if (Object.prototype.hasOwnProperty.call(NAME_MAP, rawName)) {
    ourName = NAME_MAP[rawName];
    if (ourName === null) continue; // explicitly skipped territory
  } else {
    ourName = rawName;
  }

  if (!TARGET_NAMES.includes(ourName)) continue;
  outlines[ourName] = geometryToPath(f.geometry);
}

const missing = TARGET_NAMES.filter((n) => !(n in outlines));
if (missing.length) {
  console.warn('\nMissing outlines for:');
  for (const name of missing) console.warn('  -', name);
  console.warn('\nLikely-related names found in dataset:');
  const lower = (s) => s.toLowerCase();
  for (const name of missing) {
    const candidates = Array.from(seenNames).filter((n) =>
      lower(n).includes(lower(name).split(' ')[0])
    );
    if (candidates.length) {
      console.warn(`  ${name}: ${candidates.join(', ')}`);
    }
  }
}

const sortedKeys = Object.keys(outlines).sort();
const lines = [
  '// Auto-generated by scripts/buildWorldOutlines.mjs. Do not edit by hand.',
  '// Source: Natural Earth 110m via world-atlas@2.',
  '// Each value is one or more SVG path commands projected with',
  '// WORLD_MAP_BOUNDS in src/data/worldCoordinates.ts (viewBox 1000x500).',
  '',
  '/* eslint-disable */',
  'export const WORLD_OUTLINES: Record<string, string> = {',
];
for (const name of sortedKeys) {
  const v = outlines[name].replace(/"/g, '\\"');
  lines.push(`  ${JSON.stringify(name)}: "${v}",`);
}
lines.push('};');
lines.push('');

const outPath = 'src/data/worldOutlines.ts';
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, lines.join('\n'), 'utf-8');

console.log(`\nWrote ${sortedKeys.length}/${TARGET_NAMES.length} outlines to ${outPath}.`);
