import { WORLD_COORDINATES, projectWorld } from '../data/worldCoordinates';
import { WORLD_OUTLINES } from '../data/worldOutlines';
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

// Must stay in sync with WORLD_MAP_BOUNDS in worldCoordinates.ts and the
// projection settings in scripts/buildWorldOutlines.mjs.
const VIEW_W = 1000;
const VIEW_H = 500;

const PIN_COLORS: Record<PinStatus, { fill: string; ring: string }> = {
  revealed: { fill: '#38bdf8', ring: 'rgba(56, 189, 248, 0.35)' },
  placed: { fill: '#cbd5e1', ring: 'rgba(203, 213, 225, 0.35)' },
  green: { fill: '#10b981', ring: 'rgba(16, 185, 129, 0.4)' },
  yellow: { fill: '#f59e0b', ring: 'rgba(245, 158, 11, 0.4)' },
  grey: { fill: '#475569', ring: 'rgba(71, 85, 105, 0.4)' },
};

export default function MapView({ pins, altPins, compact = false }: MapViewProps) {
  const width = VIEW_W;
  const height = VIEW_H;

  const backgroundDots = Object.keys(WORLD_COORDINATES).map((country) => {
    const p = projectWorld(country, width, height);
    if (!p) return null;
    return (
      <circle
        key={country}
        cx={p.x}
        cy={p.y}
        r={2.4}
        fill="rgba(148, 163, 184, 0.18)"
      />
    );
  });

  const renderRoute = (
    routePins: MapPin[],
    options: { stroke: string; opacity: number }
  ) => {
    const points = routePins
      .map((pin) => projectWorld(pin.country, width, height))
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
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="6 4"
      />
    );
  };

  // World map is 2:1 aspect. In compact mode we cap the rendered height
  // via CSS so it doesn't dominate the in-game view; the SVG viewBox stays
  // 1000x500 either way so country outlines render correctly.
  const wrapperClass =
    'w-full overflow-hidden rounded-xl bg-slate-950/60 ring-1 ring-white/5' +
    (compact ? ' max-h-56' : '');

  return (
    <div className={wrapperClass}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className="block w-full h-auto"
        role="img"
        aria-label="World map with route stops"
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
          {Object.entries(WORLD_OUTLINES).map(([country, d]) => (
            <path
              key={country}
              d={d}
              fill="rgba(148, 163, 184, 0.10)"
              stroke="rgba(148, 163, 184, 0.35)"
              strokeWidth={0.8}
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
          const p = projectWorld(pin.country, width, height);
          if (!p) return null;
          return (
            <g key={`alt-${i}-${pin.country}`}>
              <circle cx={p.x} cy={p.y} r={9} fill="rgba(245, 158, 11, 0.18)" />
              <circle
                cx={p.x}
                cy={p.y}
                r={5.5}
                fill="#f59e0b"
                stroke="rgba(15, 23, 42, 0.9)"
                strokeWidth={1.2}
              />
            </g>
          );
        })}

        {pins.map((pin, i) => {
          const p = projectWorld(pin.country, width, height);
          if (!p) return null;
          const colors = PIN_COLORS[pin.status];
          const showLabel =
            pin.showLabel ??
            (pin.status === 'revealed' || pin.status === 'green');
          return (
            <g key={`pin-${i}-${pin.country}`}>
              <circle cx={p.x} cy={p.y} r={13} fill={colors.ring} />
              <circle
                cx={p.x}
                cy={p.y}
                r={7.5}
                fill={colors.fill}
                stroke="rgba(15, 23, 42, 0.95)"
                strokeWidth={1.8}
              />
              {showLabel && (
                <text
                  x={p.x}
                  y={p.y + 24}
                  textAnchor="middle"
                  fontSize="14"
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
