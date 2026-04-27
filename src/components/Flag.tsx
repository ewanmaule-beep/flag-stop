import { useState } from 'react';
import { getCountryCode } from '../data/countries';

interface FlagProps {
  country: string;
  /** Tailwind size classes — e.g. 'w-12 h-8'. */
  size?: string;
  /** Tailwind rounding — e.g. 'rounded' or 'rounded-md'. */
  rounded?: string;
  /** Whether to expose the country name to assistive tech. */
  alt?: boolean;
}

/**
 * Real flag image rendered from flagcdn.com (free SVG flag CDN).
 * Falls back to a country code chip if offline / lookup fails.
 *
 * We use real images rather than emoji because Windows doesn't ship a colour
 * flag font, so emoji flags display as letter pairs there (e.g. "HR" instead
 * of the Croatia flag).
 */
export default function Flag({
  country,
  size = 'w-12 h-8',
  rounded = 'rounded',
  alt = true,
}: FlagProps) {
  const code = getCountryCode(country);
  const [errored, setErrored] = useState(false);

  if (!code || errored) {
    return (
      <span
        aria-label={alt ? country : undefined}
        className={
          'inline-flex items-center justify-center bg-slate-700 text-slate-200 ' +
          'text-[10px] font-bold tracking-wider ring-1 ring-white/10 ' +
          size +
          ' ' +
          rounded
        }
      >
        {(code ?? country.slice(0, 2)).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt={alt ? country : ''}
      loading="lazy"
      onError={() => setErrored(true)}
      className={
        'object-cover ring-1 ring-white/10 shadow-sm ' + size + ' ' + rounded
      }
    />
  );
}
