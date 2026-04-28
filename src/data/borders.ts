/**
 * Worldwide country adjacency.
 *
 * `LAND_BORDER_PAIRS` lists each shared land border once (alphabetical pair
 * order to make audits easy). `CURATED_LINK_PAIRS` adds the small set of
 * non-land travel connections we accept:
 *  - Ireland↔UK (the land border on the island of Ireland, treated as a
 *    curated link to match the design brief)
 *  - UK↔France (Channel Tunnel)
 *  - Sweden↔Denmark (Øresund Bridge)
 *  - Bahrain↔Saudi Arabia (King Fahd Causeway)
 *  - Malaysia↔Singapore (Johor-Singapore Causeway)
 *
 * Together they form an undirected graph used to validate routes and to
 * accept alternate winning paths in addition to a puzzle's canonical answer.
 *
 * Names must match those in `src/data/countries.ts` and
 * `src/data/worldCoordinates.ts` exactly.
 */

const LAND_BORDER_PAIRS: [string, string][] = [
  // Africa
  ['Algeria', 'Libya'],
  ['Algeria', 'Mali'],
  ['Algeria', 'Mauritania'],
  ['Algeria', 'Morocco'],
  ['Algeria', 'Niger'],
  ['Algeria', 'Tunisia'],
  ['Angola', 'Democratic Republic of the Congo'],
  ['Angola', 'Namibia'],
  ['Angola', 'Republic of the Congo'],
  ['Angola', 'Zambia'],
  ['Benin', 'Burkina Faso'],
  ['Benin', 'Niger'],
  ['Benin', 'Nigeria'],
  ['Benin', 'Togo'],
  ['Botswana', 'Namibia'],
  ['Botswana', 'South Africa'],
  ['Botswana', 'Zambia'],
  ['Botswana', 'Zimbabwe'],
  ['Burkina Faso', 'Ghana'],
  ['Burkina Faso', 'Ivory Coast'],
  ['Burkina Faso', 'Mali'],
  ['Burkina Faso', 'Niger'],
  ['Burkina Faso', 'Togo'],
  ['Burundi', 'Democratic Republic of the Congo'],
  ['Burundi', 'Rwanda'],
  ['Burundi', 'Tanzania'],
  ['Cameroon', 'Central African Republic'],
  ['Cameroon', 'Chad'],
  ['Cameroon', 'Equatorial Guinea'],
  ['Cameroon', 'Gabon'],
  ['Cameroon', 'Nigeria'],
  ['Cameroon', 'Republic of the Congo'],
  ['Central African Republic', 'Chad'],
  ['Central African Republic', 'Democratic Republic of the Congo'],
  ['Central African Republic', 'Republic of the Congo'],
  ['Central African Republic', 'South Sudan'],
  ['Central African Republic', 'Sudan'],
  ['Chad', 'Libya'],
  ['Chad', 'Niger'],
  ['Chad', 'Nigeria'],
  ['Chad', 'Sudan'],
  ['Democratic Republic of the Congo', 'Republic of the Congo'],
  ['Democratic Republic of the Congo', 'Rwanda'],
  ['Democratic Republic of the Congo', 'South Sudan'],
  ['Democratic Republic of the Congo', 'Tanzania'],
  ['Democratic Republic of the Congo', 'Uganda'],
  ['Democratic Republic of the Congo', 'Zambia'],
  ['Djibouti', 'Eritrea'],
  ['Djibouti', 'Ethiopia'],
  ['Djibouti', 'Somalia'],
  ['Egypt', 'Libya'],
  ['Egypt', 'Sudan'],
  ['Equatorial Guinea', 'Gabon'],
  ['Eritrea', 'Ethiopia'],
  ['Eritrea', 'Sudan'],
  ['Eswatini', 'Mozambique'],
  ['Eswatini', 'South Africa'],
  ['Ethiopia', 'Kenya'],
  ['Ethiopia', 'Somalia'],
  ['Ethiopia', 'South Sudan'],
  ['Ethiopia', 'Sudan'],
  ['Gabon', 'Republic of the Congo'],
  ['Gambia', 'Senegal'],
  ['Ghana', 'Ivory Coast'],
  ['Ghana', 'Togo'],
  ['Guinea', 'Guinea-Bissau'],
  ['Guinea', 'Ivory Coast'],
  ['Guinea', 'Liberia'],
  ['Guinea', 'Mali'],
  ['Guinea', 'Senegal'],
  ['Guinea', 'Sierra Leone'],
  ['Guinea-Bissau', 'Senegal'],
  ['Ivory Coast', 'Liberia'],
  ['Ivory Coast', 'Mali'],
  ['Kenya', 'Somalia'],
  ['Kenya', 'South Sudan'],
  ['Kenya', 'Tanzania'],
  ['Kenya', 'Uganda'],
  ['Lesotho', 'South Africa'],
  ['Liberia', 'Sierra Leone'],
  ['Libya', 'Niger'],
  ['Libya', 'Sudan'],
  ['Libya', 'Tunisia'],
  ['Malawi', 'Mozambique'],
  ['Malawi', 'Tanzania'],
  ['Malawi', 'Zambia'],
  ['Mali', 'Mauritania'],
  ['Mali', 'Niger'],
  ['Mali', 'Senegal'],
  ['Mauritania', 'Senegal'],
  ['Mozambique', 'South Africa'],
  ['Mozambique', 'Tanzania'],
  ['Mozambique', 'Zambia'],
  ['Mozambique', 'Zimbabwe'],
  ['Namibia', 'South Africa'],
  ['Namibia', 'Zambia'],
  ['Niger', 'Nigeria'],
  ['Rwanda', 'Tanzania'],
  ['Rwanda', 'Uganda'],
  ['South Sudan', 'Sudan'],
  ['South Sudan', 'Uganda'],
  ['Tanzania', 'Uganda'],
  ['Tanzania', 'Zambia'],
  ['Zambia', 'Zimbabwe'],

  // Americas
  ['Argentina', 'Bolivia'],
  ['Argentina', 'Brazil'],
  ['Argentina', 'Chile'],
  ['Argentina', 'Paraguay'],
  ['Argentina', 'Uruguay'],
  ['Belize', 'Guatemala'],
  ['Belize', 'Mexico'],
  ['Bolivia', 'Brazil'],
  ['Bolivia', 'Chile'],
  ['Bolivia', 'Paraguay'],
  ['Bolivia', 'Peru'],
  ['Brazil', 'Colombia'],
  ['Brazil', 'Guyana'],
  ['Brazil', 'Paraguay'],
  ['Brazil', 'Peru'],
  ['Brazil', 'Suriname'],
  ['Brazil', 'Uruguay'],
  ['Brazil', 'Venezuela'],
  ['Canada', 'United States'],
  ['Chile', 'Peru'],
  ['Colombia', 'Ecuador'],
  ['Colombia', 'Panama'],
  ['Colombia', 'Peru'],
  ['Colombia', 'Venezuela'],
  ['Costa Rica', 'Nicaragua'],
  ['Costa Rica', 'Panama'],
  ['Dominican Republic', 'Haiti'],
  ['Ecuador', 'Peru'],
  ['El Salvador', 'Guatemala'],
  ['El Salvador', 'Honduras'],
  ['Guatemala', 'Honduras'],
  ['Guatemala', 'Mexico'],
  ['Guyana', 'Suriname'],
  ['Guyana', 'Venezuela'],
  ['Honduras', 'Nicaragua'],
  ['Mexico', 'United States'],

  // Asia (and Asia-Europe / Asia-Africa cross-region)
  ['Afghanistan', 'China'],
  ['Afghanistan', 'Iran'],
  ['Afghanistan', 'Pakistan'],
  ['Afghanistan', 'Tajikistan'],
  ['Afghanistan', 'Turkmenistan'],
  ['Afghanistan', 'Uzbekistan'],
  ['Armenia', 'Azerbaijan'],
  ['Armenia', 'Georgia'],
  ['Armenia', 'Iran'],
  ['Armenia', 'Turkey'],
  ['Azerbaijan', 'Georgia'],
  ['Azerbaijan', 'Iran'],
  ['Azerbaijan', 'Russia'],
  ['Azerbaijan', 'Turkey'],
  ['Bangladesh', 'India'],
  ['Bangladesh', 'Myanmar'],
  ['Bhutan', 'China'],
  ['Bhutan', 'India'],
  ['Brunei', 'Malaysia'],
  ['Bulgaria', 'Turkey'],
  ['Cambodia', 'Laos'],
  ['Cambodia', 'Thailand'],
  ['Cambodia', 'Vietnam'],
  ['China', 'India'],
  ['China', 'Kazakhstan'],
  ['China', 'Kyrgyzstan'],
  ['China', 'Laos'],
  ['China', 'Mongolia'],
  ['China', 'Myanmar'],
  ['China', 'Nepal'],
  ['China', 'North Korea'],
  ['China', 'Pakistan'],
  ['China', 'Russia'],
  ['China', 'Tajikistan'],
  ['China', 'Vietnam'],
  ['Egypt', 'Israel'],
  ['Georgia', 'Russia'],
  ['Georgia', 'Turkey'],
  ['Greece', 'Turkey'],
  ['India', 'Myanmar'],
  ['India', 'Nepal'],
  ['India', 'Pakistan'],
  ['Indonesia', 'Malaysia'],
  ['Indonesia', 'Papua New Guinea'],
  ['Indonesia', 'Timor-Leste'],
  ['Iran', 'Iraq'],
  ['Iran', 'Pakistan'],
  ['Iran', 'Turkey'],
  ['Iran', 'Turkmenistan'],
  ['Iraq', 'Jordan'],
  ['Iraq', 'Kuwait'],
  ['Iraq', 'Saudi Arabia'],
  ['Iraq', 'Syria'],
  ['Iraq', 'Turkey'],
  ['Israel', 'Jordan'],
  ['Israel', 'Lebanon'],
  ['Israel', 'Syria'],
  ['Jordan', 'Saudi Arabia'],
  ['Jordan', 'Syria'],
  ['Kazakhstan', 'Kyrgyzstan'],
  ['Kazakhstan', 'Russia'],
  ['Kazakhstan', 'Turkmenistan'],
  ['Kazakhstan', 'Uzbekistan'],
  ['Kuwait', 'Saudi Arabia'],
  ['Kyrgyzstan', 'Tajikistan'],
  ['Kyrgyzstan', 'Uzbekistan'],
  ['Laos', 'Myanmar'],
  ['Laos', 'Thailand'],
  ['Laos', 'Vietnam'],
  ['Lebanon', 'Syria'],
  ['Malaysia', 'Thailand'],
  ['Mongolia', 'Russia'],
  ['Morocco', 'Spain'],
  ['North Korea', 'Russia'],
  ['North Korea', 'South Korea'],
  ['Oman', 'Saudi Arabia'],
  ['Oman', 'United Arab Emirates'],
  ['Oman', 'Yemen'],
  ['Qatar', 'Saudi Arabia'],
  ['Saudi Arabia', 'United Arab Emirates'],
  ['Saudi Arabia', 'Yemen'],
  ['Tajikistan', 'Uzbekistan'],
  ['Turkmenistan', 'Uzbekistan'],

  // Europe
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
  ['Bahrain', 'Saudi Arabia'],
  ['Malaysia', 'Singapore'],
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
