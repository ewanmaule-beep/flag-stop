import Flag from './Flag';

interface OptionsListProps {
  options: string[];
  placedSet: Set<string>;
  /** Map of country -> last-known feedback across attempts. */
  knowledge: Record<string, 'green' | 'yellow' | 'grey' | undefined>;
  onPick: (country: string) => void;
  disabled?: boolean;
  /**
   * Whether to render the country-name caption under each option tile.
   * Defaults to true. GameScreen sets this to false on Hard so the picker is
   * flag-only.
   */
  showLabels?: boolean;
}

/**
 * Country picker — flag-dominant tiles in a 3-column grid.
 * Country name is a small caption underneath each flag (Easy and Medium).
 * Hard mode hides the captions for a flag-only picker.
 */
export default function OptionsList({
  options,
  placedSet,
  knowledge,
  onPick,
  disabled,
  showLabels = true,
}: OptionsListProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((name) => {
        const placed = placedSet.has(name);
        const k = knowledge[name];
        const ringClass =
          k === 'green'
            ? 'ring-emerald-400/70'
            : k === 'yellow'
            ? 'ring-amber-300/70'
            : k === 'grey'
            ? 'ring-slate-500/40'
            : 'ring-white/10';
        const bgClass = k === 'grey' ? 'bg-slate-900/50' : 'bg-slate-800/70';
        return (
          <button
            key={name}
            type="button"
            disabled={disabled}
            onClick={() => onPick(name)}
            className={
              'flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-xl ' +
              'transition ring-1 ' +
              bgClass +
              ' ' +
              ringClass +
              (placed
                ? ' opacity-50'
                : ' hover:bg-slate-700/70 active:scale-[0.98]') +
              (disabled ? ' cursor-not-allowed' : '')
            }
          >
            <Flag country={name} size="w-14 h-9" rounded="rounded-md" />
            {showLabels && (
              <span
                className="text-[11px] font-medium text-slate-100 leading-tight text-center w-full truncate"
                title={name}
              >
                {name}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
