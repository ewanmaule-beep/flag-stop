import { ADJACENCY, bordersOf } from '../data/borders';
import { WORLD_COORDINATES } from '../data/worldCoordinates';
import type { Puzzle } from '../types';

/**
 * Daily puzzle generator.
 *
 * We do a seeded random walk over the worldwide adjacency graph, picking a
 * random start country and a random unused neighbour at each step until we
 * hit the target length. Decoys are pulled from the one-hop neighbourhood of
 * the route (so they look plausible) and topped up with random other
 * countries if needed.
 *
 * Same date → same puzzle for everyone, because the seed comes from a hash
 * of YYYY-MM-DD.
 */

/** mulberry32: small, fast, deterministic PRNG. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rand: () => number, list: readonly T[]): T {
  return list[Math.floor(rand() * list.length)];
}

function shuffle<T>(rand: () => number, list: readonly T[]): T[] {
  const arr = list.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** All country names that appear in the adjacency graph and have coordinates. */
const STARTABLE_COUNTRIES: string[] = Object.keys(ADJACENCY).filter(
  (c) => WORLD_COORDINATES[c] && (ADJACENCY[c]?.length ?? 0) > 0
);

/** Walk the graph from `start` aiming for a route of `targetLen`. */
function walk(rand: () => number, start: string, targetLen: number): string[] | null {
  const route: string[] = [start];
  const used = new Set<string>([start]);
  while (route.length < targetLen) {
    const last = route[route.length - 1];
    const neighbours = bordersOf(last).filter((n) => !used.has(n));
    if (neighbours.length === 0) return null;
    const next = pick(rand, shuffle(rand, neighbours));
    route.push(next);
    used.add(next);
  }
  return route;
}

/** Continent each supported country belongs to. Used for the easy-mode hint. */
const CONTINENTS: Record<string, string> = {
  // Africa
  Algeria: 'Africa', Angola: 'Africa', Benin: 'Africa', Botswana: 'Africa',
  'Burkina Faso': 'Africa', Burundi: 'Africa', Cameroon: 'Africa',
  'Central African Republic': 'Africa', Chad: 'Africa', Comoros: 'Africa',
  'Democratic Republic of the Congo': 'Africa',
  'Republic of the Congo': 'Africa', Djibouti: 'Africa', Egypt: 'Africa',
  'Equatorial Guinea': 'Africa', Eritrea: 'Africa', Eswatini: 'Africa',
  Ethiopia: 'Africa', Gabon: 'Africa', Gambia: 'Africa', Ghana: 'Africa',
  Guinea: 'Africa', 'Guinea-Bissau': 'Africa', 'Ivory Coast': 'Africa',
  Kenya: 'Africa', Lesotho: 'Africa', Liberia: 'Africa', Libya: 'Africa',
  Madagascar: 'Africa', Malawi: 'Africa', Mali: 'Africa', Mauritania: 'Africa',
  Mauritius: 'Africa', Morocco: 'Africa', Mozambique: 'Africa',
  Namibia: 'Africa', Niger: 'Africa', Nigeria: 'Africa', Rwanda: 'Africa',
  Senegal: 'Africa', 'Sierra Leone': 'Africa', Somalia: 'Africa',
  'South Africa': 'Africa', 'South Sudan': 'Africa', Sudan: 'Africa',
  Tanzania: 'Africa', Togo: 'Africa', Tunisia: 'Africa', Uganda: 'Africa',
  Zambia: 'Africa', Zimbabwe: 'Africa',

  // Americas
  'Antigua and Barbuda': 'Americas', Argentina: 'Americas', Bahamas: 'Americas',
  Barbados: 'Americas', Belize: 'Americas', Bolivia: 'Americas',
  Brazil: 'Americas', Canada: 'Americas', Chile: 'Americas',
  Colombia: 'Americas', 'Costa Rica': 'Americas', Cuba: 'Americas',
  Dominica: 'Americas', 'Dominican Republic': 'Americas', Ecuador: 'Americas',
  'El Salvador': 'Americas', Grenada: 'Americas', Guatemala: 'Americas',
  Guyana: 'Americas', Haiti: 'Americas', Honduras: 'Americas',
  Jamaica: 'Americas', Mexico: 'Americas', Nicaragua: 'Americas',
  Panama: 'Americas', Paraguay: 'Americas', Peru: 'Americas',
  'Saint Kitts and Nevis': 'Americas', 'Saint Lucia': 'Americas',
  'Saint Vincent and the Grenadines': 'Americas', Suriname: 'Americas',
  'Trinidad and Tobago': 'Americas', 'United States': 'Americas',
  Uruguay: 'Americas', Venezuela: 'Americas',

  // Asia
  Afghanistan: 'Asia', Armenia: 'Asia', Azerbaijan: 'Asia', Bahrain: 'Asia',
  Bangladesh: 'Asia', Bhutan: 'Asia', Brunei: 'Asia', Cambodia: 'Asia',
  China: 'Asia', Cyprus: 'Asia', Georgia: 'Asia', India: 'Asia',
  Indonesia: 'Asia', Iran: 'Asia', Iraq: 'Asia', Israel: 'Asia',
  Japan: 'Asia', Jordan: 'Asia', Kazakhstan: 'Asia', Kuwait: 'Asia',
  Kyrgyzstan: 'Asia', Laos: 'Asia', Lebanon: 'Asia', Malaysia: 'Asia',
  Maldives: 'Asia', Mongolia: 'Asia', Myanmar: 'Asia', Nepal: 'Asia',
  'North Korea': 'Asia', Oman: 'Asia', Pakistan: 'Asia',
  Philippines: 'Asia', Qatar: 'Asia', 'Saudi Arabia': 'Asia',
  Singapore: 'Asia', 'South Korea': 'Asia', 'Sri Lanka': 'Asia',
  Syria: 'Asia', Taiwan: 'Asia', Tajikistan: 'Asia', Thailand: 'Asia',
  'Timor-Leste': 'Asia', Turkey: 'Asia', Turkmenistan: 'Asia',
  'United Arab Emirates': 'Asia', Uzbekistan: 'Asia', Vietnam: 'Asia',
  Yemen: 'Asia',

  // Europe
  Albania: 'Europe', Andorra: 'Europe', Austria: 'Europe', Belarus: 'Europe',
  Belgium: 'Europe', 'Bosnia and Herzegovina': 'Europe', Bulgaria: 'Europe',
  Croatia: 'Europe', 'Czech Republic': 'Europe', Denmark: 'Europe',
  Estonia: 'Europe', Finland: 'Europe', France: 'Europe', Germany: 'Europe',
  Greece: 'Europe', Hungary: 'Europe', Iceland: 'Europe', Ireland: 'Europe',
  Italy: 'Europe', Kosovo: 'Europe', Latvia: 'Europe', Liechtenstein: 'Europe',
  Lithuania: 'Europe', Luxembourg: 'Europe', Moldova: 'Europe', Monaco: 'Europe',
  Montenegro: 'Europe', Netherlands: 'Europe', 'North Macedonia': 'Europe',
  Norway: 'Europe', Poland: 'Europe', Portugal: 'Europe', Romania: 'Europe',
  Russia: 'Europe', 'San Marino': 'Europe', Serbia: 'Europe',
  Slovakia: 'Europe', Slovenia: 'Europe', Spain: 'Europe', Sweden: 'Europe',
  Switzerland: 'Europe', Ukraine: 'Europe', 'United Kingdom': 'Europe',

  // Oceania
  Australia: 'Oceania', Fiji: 'Oceania', Kiribati: 'Oceania',
  'Marshall Islands': 'Oceania', Micronesia: 'Oceania', Nauru: 'Oceania',
  'New Zealand': 'Oceania', Palau: 'Oceania', 'Papua New Guinea': 'Oceania',
  Samoa: 'Oceania', 'Solomon Islands': 'Oceania', Tonga: 'Oceania',
  Tuvalu: 'Oceania', Vanuatu: 'Oceania',
};

/** Build a region label from the route stops. Used as the easy-mode hint. */
function deriveRegion(route: string[]): string {
  const continents = Array.from(
    new Set(route.map((c) => CONTINENTS[c] ?? 'Unknown'))
  );
  if (continents.length === 1) return continents[0];
  if (continents.length === 2) return continents.join(' & ');
  return 'Multiple continents';
}

function difficultyRatingFor(len: number): 1 | 2 | 3 {
  if (len <= 4) return 1;
  if (len === 5) return 2;
  return 3;
}

/**
 * Build a puzzle deterministically from a numeric seed.
 *
 * Falls back to a small hand-picked route if every random walk dead-ends,
 * which shouldn't realistically happen with the current graph.
 */
export function generatePuzzle(seed: number): Puzzle {
  const rand = mulberry32(seed);

  // Target length 4–6, biased towards 5.
  const lenRoll = rand();
  const targetLen = lenRoll < 0.25 ? 4 : lenRoll < 0.85 ? 5 : 6;

  let route: string[] | null = null;
  for (let attempt = 0; attempt < 50 && !route; attempt++) {
    const start = pick(rand, STARTABLE_COUNTRIES);
    route = walk(rand, start, targetLen);
  }

  if (!route) {
    // Defensive fallback. Real graph + 50 retries should never hit this.
    route = ['Portugal', 'Spain', 'France', 'Germany', 'Poland'];
  }

  // Decoys: build a pool of plausible-looking countries that aren't on the
  // route. Start with one-hop neighbours of route stops, expand to two-hop
  // neighbours if needed, then top up with random others. We aim for 10 so
  // Hard difficulty (12 options total) always has enough material to draw on.
  const onRoute = new Set(route);
  const TARGET_DECOYS = 10;

  const oneHop = new Set<string>();
  for (const c of route) {
    for (const n of bordersOf(c)) {
      if (!onRoute.has(n)) oneHop.add(n);
    }
  }

  let decoys = shuffle(rand, Array.from(oneHop)).slice(0, TARGET_DECOYS);

  // Expand to second-hop neighbours (neighbours-of-neighbours) if we still
  // don't have enough.
  if (decoys.length < TARGET_DECOYS) {
    const decoySet = new Set(decoys);
    const twoHop = new Set<string>();
    for (const c of oneHop) {
      for (const n of bordersOf(c)) {
        if (!onRoute.has(n) && !decoySet.has(n)) twoHop.add(n);
      }
    }
    const extra = shuffle(rand, Array.from(twoHop)).slice(
      0,
      TARGET_DECOYS - decoys.length
    );
    decoys = decoys.concat(extra);
  }

  // Last-resort top-up with random other startable countries.
  if (decoys.length < TARGET_DECOYS) {
    const decoySet = new Set(decoys);
    const filler = shuffle(
      rand,
      STARTABLE_COUNTRIES.filter((c) => !onRoute.has(c) && !decoySet.has(c))
    );
    decoys = decoys.concat(filler.slice(0, TARGET_DECOYS - decoys.length));
  }

  // Visible indexes: always first and last. We don't preset middle reveals
  // here — GameScreen.getVisibleIndexes derives those per difficulty.
  const visibleIndexes = [0, route.length - 1];

  return {
    id: seed,
    route,
    visibleIndexes,
    decoys,
    region: deriveRegion(route),
    difficultyRating: difficultyRatingFor(route.length),
  };
}
