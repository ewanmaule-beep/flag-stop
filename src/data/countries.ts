export interface Country {
  name: string;
  code: string; // ISO 3166-1 alpha-2 (lowercase) — used for SVG flag URLs
  flag: string; // emoji fallback (kept for legacy / share grids)
}

// Europe-focused list. Names match exactly what's used in puzzles.
export const COUNTRIES: Country[] = [
  { name: 'Albania', code: 'al', flag: '🇦🇱' },
  { name: 'Andorra', code: 'ad', flag: '🇦🇩' },
  { name: 'Austria', code: 'at', flag: '🇦🇹' },
  { name: 'Belarus', code: 'by', flag: '🇧🇾' },
  { name: 'Belgium', code: 'be', flag: '🇧🇪' },
  { name: 'Bosnia and Herzegovina', code: 'ba', flag: '🇧🇦' },
  { name: 'Bulgaria', code: 'bg', flag: '🇧🇬' },
  { name: 'Croatia', code: 'hr', flag: '🇭🇷' },
  { name: 'Czech Republic', code: 'cz', flag: '🇨🇿' },
  { name: 'Denmark', code: 'dk', flag: '🇩🇰' },
  { name: 'Estonia', code: 'ee', flag: '🇪🇪' },
  { name: 'Finland', code: 'fi', flag: '🇫🇮' },
  { name: 'France', code: 'fr', flag: '🇫🇷' },
  { name: 'Germany', code: 'de', flag: '🇩🇪' },
  { name: 'Greece', code: 'gr', flag: '🇬🇷' },
  { name: 'Hungary', code: 'hu', flag: '🇭🇺' },
  { name: 'Iceland', code: 'is', flag: '🇮🇸' },
  { name: 'Ireland', code: 'ie', flag: '🇮🇪' },
  { name: 'Italy', code: 'it', flag: '🇮🇹' },
  { name: 'Kosovo', code: 'xk', flag: '🇽🇰' },
  { name: 'Latvia', code: 'lv', flag: '🇱🇻' },
  { name: 'Liechtenstein', code: 'li', flag: '🇱🇮' },
  { name: 'Lithuania', code: 'lt', flag: '🇱🇹' },
  { name: 'Luxembourg', code: 'lu', flag: '🇱🇺' },
  { name: 'Moldova', code: 'md', flag: '🇲🇩' },
  { name: 'Monaco', code: 'mc', flag: '🇲🇨' },
  { name: 'Montenegro', code: 'me', flag: '🇲🇪' },
  { name: 'Netherlands', code: 'nl', flag: '🇳🇱' },
  { name: 'North Macedonia', code: 'mk', flag: '🇲🇰' },
  { name: 'Norway', code: 'no', flag: '🇳🇴' },
  { name: 'Poland', code: 'pl', flag: '🇵🇱' },
  { name: 'Portugal', code: 'pt', flag: '🇵🇹' },
  { name: 'Romania', code: 'ro', flag: '🇷🇴' },
  { name: 'Russia', code: 'ru', flag: '🇷🇺' },
  { name: 'San Marino', code: 'sm', flag: '🇸🇲' },
  { name: 'Serbia', code: 'rs', flag: '🇷🇸' },
  { name: 'Slovakia', code: 'sk', flag: '🇸🇰' },
  { name: 'Slovenia', code: 'si', flag: '🇸🇮' },
  { name: 'Spain', code: 'es', flag: '🇪🇸' },
  { name: 'Sweden', code: 'se', flag: '🇸🇪' },
  { name: 'Switzerland', code: 'ch', flag: '🇨🇭' },
  { name: 'Ukraine', code: 'ua', flag: '🇺🇦' },
  { name: 'United Kingdom', code: 'gb', flag: '🇬🇧' },
];

const BY_NAME: Record<string, Country> = COUNTRIES.reduce((acc, c) => {
  acc[c.name] = c;
  return acc;
}, {} as Record<string, Country>);

export function getFlag(name: string): string {
  return BY_NAME[name]?.flag ?? '🏳️';
}

export function getCountryCode(name: string): string | undefined {
  return BY_NAME[name]?.code;
}

export function getCountry(name: string): Country | undefined {
  return BY_NAME[name];
}
