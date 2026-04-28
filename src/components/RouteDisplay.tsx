import type { Feedback } from '../types';
import Flag from './Flag';

interface RouteDisplayProps {
  route: string[];
  visibleIndexes: number[];
  blankIndexes: number[];
  placements: (string | null)[];
  selectedBlank: number | null;
  lockedFeedback?: (Feedback | null)[] | null;
  onSelectBlank: (blankIdx: number) => void;
  /**
   * Whether to render the country-name caption under each tile. Defaults to
   * true so existing callers don't change behaviour. GameScreen sets this to
   * false on Medium/Hard so players have to recognise the flag.
   */
  showLabels?: boolean;
}

/**
 * Row of flag tiles separated by arrows. Each tile can optionally show a small
 * country-name caption underneath. Captions are hidden on Medium/Hard so the
 * player has to identify the flag without help.
 */
export default function RouteDisplay({
  route,
  visibleIndexes,
  blankIndexes,
  placements,
  selectedBlank,
  lockedFeedback,
  onSelectBlank,
  showLabels = true,
}: RouteDisplayProps) {
  const visible = new Set(visibleIndexes);
  const blankToSlotIdx = new Map<number, number>();
  blankIndexes.forEach((routeIdx, i) => blankToSlotIdx.set(routeIdx, i));

  return (
    <div className="flex flex-wrap items-start justify-center gap-x-2 gap-y-4">
      {route.map((name, i) => {
        const isLast = i === route.length - 1;

        if (visible.has(i)) {
          return (
            <RouteItem
              key={i}
              isLast={isLast}
              variant="revealed"
              country={name}
              showLabel={showLabels}
            />
          );
        }

        const slotIdx = blankToSlotIdx.get(i)!;
        const placed = placements[slotIdx];
        const selected = selectedBlank === slotIdx;
        const fb = lockedFeedback?.[slotIdx] ?? null;
        const variant: Variant = fb
          ? fb
          : selected
          ? 'selected'
          : 'blank';

        return (
          <RouteItem
            key={i}
            isLast={isLast}
            variant={variant}
            country={placed ?? null}
            onClick={() => onSelectBlank(slotIdx)}
            showLabel={showLabels}
          />
        );
      })}
    </div>
  );
}

type Variant = 'revealed' | 'blank' | 'selected' | 'green' | 'yellow' | 'grey';

const TILE_STYLES: Record<Variant, string> = {
  revealed: 'bg-slate-800 ring-1 ring-white/10',
  blank: 'bg-slate-800/40 border border-dashed border-white/25 hover:bg-slate-800/70',
  selected: 'bg-sky-500/15 ring-2 ring-sky-400 animate-pop',
  green: 'bg-emerald-500/85 ring-1 ring-emerald-300',
  yellow: 'bg-amber-400/90 ring-1 ring-amber-200',
  grey: 'bg-slate-600/80 ring-1 ring-slate-400/50',
};

function RouteItem({
  isLast,
  variant,
  country,
  onClick,
  showLabel = true,
}: {
  isLast: boolean;
  variant: Variant;
  country: string | null;
  onClick?: () => void;
  showLabel?: boolean;
}) {
  const interactive = variant !== 'revealed';
  // Caption shows the country name if we have one — empty (non-breaking
  // space so layout stays consistent) otherwise.
  const caption = country ?? '\u00A0';

  return (
    <div className="flex items-start gap-2 no-select">
      <div className="flex flex-col items-center gap-1.5 w-16">
        <button
          type="button"
          onClick={onClick}
          disabled={!interactive}
          className={
            'w-16 h-16 rounded-xl flex items-center justify-center transition ' +
            TILE_STYLES[variant] +
            (interactive ? ' active:scale-95' : '')
          }
        >
          {country ? (
            <Flag country={country} size="w-12 h-8" />
          ) : (
            <span className="text-slate-300 text-2xl font-bold">?</span>
          )}
        </button>
        {showLabel && (
          <span
            className="text-[10px] leading-tight text-slate-300 text-center w-full truncate"
            title={country ?? ''}
          >
            {caption}
          </span>
        )}
      </div>
      {!isLast && (
        // Match the tile's vertical centre (tile is 64px, arrow ~24px).
        <span className="route-arrow flex h-16 items-center">→</span>
      )}
    </div>
  );
}
