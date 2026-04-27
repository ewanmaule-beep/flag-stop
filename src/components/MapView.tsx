import { COORDINATES, projectCountry } from '../data/coordinates';
import { COUNTRY_OUTLINES } from '../data/europeOutline';
import type { Feedback } from '../types';

/**
 * One stop on the rendered route. `status` controls how the pin looks and
 * whether its label is shown.
 *
 * - 'revealed' = a stop the puzzle gives the player for free (start/end)
 * - 'placed'   = a country the player has dropped into a blank but not checked
 * - 'green' | 'yellow' | 'grey' = post-check feedback colour for a placed slot
 */
export type PinStatus = 'revealed' | 'placed' | Feedback;

export interface MapPin {
  country: string;
  status: PinStatus;
  /** Force the country name to display under the pin even if status would hide it. */
  showLabel?: boolean;
}

interface MapViewProps {
  pins: MapPin[];
  /** Optional second route drawn underneath in amber, used on the result screen. */
  altPins?: MapPin[];
  /** Render compact map (smaller height) for the in-game view. */
  compact?: boolean;
}

const VIEW_W = 500;
const VIEW_H = 380;

const PIN_COLORS: Record<PinStatus, { fill: string; ring: string }> = {
  revealed: { fill: '#38bdf8', ring: 'rgba(56, 189, 248, 0.35)' },
  placed: { fill: '#cbd5e1', ring: 'rgba(203, 213, 225, 0.35)' },
  green: { fill: '#10b981', ring: 'rgba(16, 185, 129, 0.4)' },
  yellow: { fill: '#f59e0b', ring: 'rgba(245, 158, 11, 0.4)' },
  grey: { fill: '#475569', ring: 'rgba(71, 85, 105, 0.4)' },
};

export default function MapView({ pins, altPins, compact = false }: MapViewProps) {
  const height = compact ? 220 : VIEW_H;
  const width = VIEW_W;

  const backgroundDots = Object.keys(COORDINATES).map((country) => {
    const p = projectCountry(country, width, height);
    if (!p) return null;
    return (
      <circle
        key={country}
        cx={p.x}
        cy={p.y}
        r={1.6}
        fill="rgba(148, 163, 184, 0.18)"
      />
    );
  });

  const renderRoute = (
    routePins: MapPin[],
    options: { stroke: string; opacity: number }
  ) => {
    const points = routePins
      .map((pin) => projectCountry(pin.country, width, height))
      .filter((p): p is { x: number; y: number } => p !== null);
    if (points.length < 2) return null;
    const d = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' ');
    return (
      <path
        d={d}
        fill="none"
        stroke={options.stroke}
        strokeOpacity={options.opacity}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 3"
      />
    );
  };

  return (
    <div className="w-full overflow-hidden rounded-xl bg-slate-950/60 ring-1 ring-white/5">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        className="block w-full h-auto"
        role="img"
        aria-label="Map of Europe with route stops"
      >
        <defs>
          <pattern
            id="map-grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="rgba(148, 163, 184, 0.06)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#map-grid)" />

        <g aria-hidden="true">
          {Object.entries(COUNTRY_OUTLINES).map(([country, d]) => (
            <path
              key={country}
              d={d}
              fill="rgba(148, 163, 184, 0.10)"
              stroke="rgba(148, 163, 184, 0.35)"
              strokeWidth={0.6}
              strokeLinejoin="round"
              fillRule="evenodd"
            />
          ))}
        </g>

        {backgroundDots}

        {altPins && altPins.length >= 2 &&
          renderRoute(altPins, { stroke: '#f59e0b', opacity: 0.7 })}

        {pins.length >= 2 &&
          renderRoute(pins, { stroke: '#38bdf8', opacity: 0.85 })}

        {altPins?.map((pin, i) => {
          const p = projectCountry(pin.country, width, height);
          if (!p) return null;
          return (
            <g key={`alt-${i}-${pin.country}`}>
              <circle cx={p.x} cy={p.y} r={6} fill="rgba(245, 158, 11, 0.18)" />
              <circle
                cx={p.x}
                cy={p.y}
                r={3.5}
                fill="#f59e0b"
                stroke="rgba(15, 23, 42, 0.9)"
                strokeWidth={1}
              />
            </g>
          );
        })}

        {pins.map((pin, i) => {
          const p = projectCountry(pin.country, width, height);
          if (!p) return null;
          const colors = PIN_COLORS[pin.status];
          const showLabel =
            pin.showLabel ??
            (pin.status === 'revealed' || pin.status === 'green');
          return (
            <g key={`pin-${i}-${pin.country}`}>
              <circle cx={p.x} cy={p.y} r={9} fill={colors.ring} />
              <circle
                cx={p.x}
                cy={p.y}
                r={5}
                fill={colors.fill}
                stroke="rgba(15, 23, 42, 0.95)"
                strokeWidth={1.5}
              />
              {showLabel && (
                <text
                  x={p.x}
                  y={p.y + 18}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="#e2e8f0"
                  style={{ paintOrder: 'stroke', stroke: 'rgba(2, 6, 23, 0.85)', strokeWidth: 3 }}
                >
                  {pin.country}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
