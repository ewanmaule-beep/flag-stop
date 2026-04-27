/**
 * European country adjacency.
 *
 * `LAND_BORDER_PAIRS` lists each shared land border once (alphabetical pair
 * order to make audits easy). `CURATED_LINK_PAIRS` adds the small set of
 * non-land connections we accept as travel links: Ireland↔UK (the land
 * border on the island of Ireland, treated as a curated link to match the
 * design brief), UK↔France (Channel Tunnel) and Sweden↔Denmark (Øresund
 * Bridge).
 *
 * Together they form an undirected graph used to validate routes and to
 * accept alternate winning paths in addition to a puzzle's canonical answer.
 *
 * Names must match those in `src/data/countries.ts` exactly.
 */

const LAND_BORDER_PAIRS: [string, string][] = [
  ['Albania', 'Greece'],
  ['Albania', 'Kosovo'],
  ['Albania', 'Montenegro'],
  ['Albania', 'North Macedonia'],
  ['Andorra', 'France'],
  ['Andorra', 'Spain'],
  ['Austria', 'Czech Republic'],
  ['Austria', 'Germany'],
  ['Austria', 'Hungary'],
  ['Austria', 'Italy'],
  ['Austria', 'Liechtenstein'],
  ['Austria', 'Slovakia'],
  ['Austria', 'Slovenia'],
  ['Austria', 'Switzerland'],
  ['Belarus', 'Latvia'],
  ['Belarus', 'Lithuania'],
  ['Belarus', 'Poland'],
  ['Belarus', 'Russia'],
  ['Belarus', 'Ukraine'],
  ['Belgium', 'France'],
  ['Belgium', 'Germany'],
  ['Belgium', 'Luxembourg'],
  ['Belgium', 'Netherlands'],
  ['Bosnia and Herzegovina', 'Croatia'],
  ['Bosnia and Herzegovina', 'Montenegro'],
  ['Bosnia and Herzegovina', 'Serbia'],
  ['Bulgaria', 'Greece'],
  ['Bulgaria', 'North Macedonia'],
  ['Bulgaria', 'Romania'],
  ['Bulgaria', 'Serbia'],
  ['Croatia', 'Hungary'],
  ['Croatia', 'Montenegro'],
  ['Croatia', 'Serbia'],
  ['Croatia', 'Slovenia'],
  ['Czech Republic', 'Germany'],
  ['Czech Republic', 'Poland'],
  ['Czech Republic', 'Slovakia'],
  ['Denmark', 'Germany'],
  ['Estonia', 'Latvia'],
  ['Estonia', 'Russia'],
  ['Finland', 'Norway'],
  ['Finland', 'Russia'],
  ['Finland', 'Sweden'],
  ['France', 'Germany'],
  ['France', 'Italy'],
  ['France', 'Luxembourg'],
  ['France', 'Monaco'],
  ['France', 'Spain'],
  ['France', 'Switzerland'],
  ['Germany', 'Luxembourg'],
  ['Germany', 'Netherlands'],
  ['Germany', 'Poland'],
  ['Germany', 'Switzerland'],
  ['Greece', 'North Macedonia'],
  ['Hungary', 'Romania'],
  ['Hungary', 'Serbia'],
  ['Hungary', 'Slovakia'],
  ['Hungary', 'Slovenia'],
  ['Hungary', 'Ukraine'],
  ['Italy', 'San Marino'],
  ['Italy', 'Slovenia'],
  ['Italy', 'Switzerland'],
  ['Kosovo', 'Montenegro'],
  ['Kosovo', 'North Macedonia'],
  ['Kosovo', 'Serbia'],
  ['Latvia', 'Lithuania'],
  ['Latvia', 'Russia'],
  ['Liechtenstein', 'Switzerland'],
  ['Lithuania', 'Poland'],
  ['Lithuania', 'Russia'],
  ['Moldova', 'Romania'],
  ['Moldova', 'Ukraine'],
  ['Montenegro', 'Serbia'],
  ['North Macedonia', 'Serbia'],
  ['Norway', 'Russia'],
  ['Norway', 'Sweden'],
  ['Poland', 'Russia'],
  ['Poland', 'Slovakia'],
  ['Poland', 'Ukraine'],
  ['Portugal', 'Spain'],
  ['Romania', 'Serbia'],
  ['Romania', 'Ukraine'],
  ['Russia', 'Ukraine'],
  ['Slovakia', 'Ukraine'],
];

const CURATED_LINK_PAIRS: [string, string][] = [
  ['Ireland', 'United Kingdom'],
  ['United Kingdom', 'France'],
  ['Sweden', 'Denmark'],
];

/** Adjacency map: country name → sorted array of neighbours. */
export const ADJACENCY: Readonly<Record<string, readonly string[]>> = (() => {
  const sets: Record<string, Set<string>> = {};
  const add = (a: string, b: string) => {
    if (!sets[a]) sets[a] = new Set();
    if (!sets[b]) sets[b] = new Set();
    sets[a].add(b);
    sets[b].add(a);
  };
  LAND_BORDER_PAIRS.forEach(([a, b]) => add(a, b));
  CURATED_LINK_PAIRS.forEach(([a, b]) => add(a, b));
  const out: Record<string, string[]> = {};
  for (const k of Object.keys(sets)) {
    out[k] = Array.from(sets[k]).sort();
  }
  return out;
})();

/** All neighbours of a country (land + curated). Empty array if unknown. */
export function bordersOf(country: string): readonly string[] {
  return ADJACENCY[country] ?? [];
}

/** Whether two countries share a land border or curated travel link. */
export function isAdjacent(a: string, b: string): boolean {
  const list = ADJACENCY[a];
  if (!list) return false;
  return list.includes(b);
}

/**
 * A route is "valid" if it has at least two stops, contains no repeated
 * country, and every consecutive pair is adjacent in the graph above.
 */
export function isValidRoute(route: string[]): boolean {
  if (route.length < 2) return false;
  const seen = new Set<string>();
  for (const c of route) {
    if (!c || seen.has(c)) return false;
    seen.add(c);
  }
  for (let i = 0; i < route.length - 1; i++) {
    if (!isAdjacent(route[i], route[i + 1])) return false;
  }
  return true;
}
