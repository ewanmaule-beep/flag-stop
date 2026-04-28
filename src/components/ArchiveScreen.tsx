import { useMemo } from 'react';
import { ARCHIVE_COUNT, getArchivePuzzle } from '../lib/archive';

interface ArchiveScreenProps {
  onPick: (num: number) => void;
  onBack: () => void;
}

/**
 * List of previous puzzles. Each is a stable, deterministic puzzle generated
 * from the archive number, so #5 always plays the same route.
 *
 * Plays from this list do NOT affect streaks or stats — the wiring for that
 * lives in App.tsx (skips recordResult when archiveNumber !== null).
 */
export default function ArchiveScreen({ onPick, onBack }: ArchiveScreenProps) {
  // Newest first — feels more natural in a list of "past" puzzles.
  const items = useMemo(
    () =>
      Array.from({ length: ARCHIVE_COUNT }, (_, i) => i + 1)
        .reverse()
        .map((num) => ({ num, puzzle: getArchivePuzzle(num) })),
    []
  );

  return (
    <div className="flex flex-col gap-4 px-4 py-6 max-w-md mx-auto w-full pb-10">
      <header className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-slate-400 hover:text-slate-200 text-sm"
        >
          ← Back
        </button>
        <h1 className="font-display font-bold text-lg">Previous puzzles</h1>
        <span className="w-10" aria-hidden="true" />
      </header>

      <p className="text-sm text-slate-400 text-center">
        Past puzzles for practice. Playing them won't affect your streak.
      </p>

      <div className="grid grid-cols-2 gap-2">
        {items.map(({ num, puzzle }) => (
          <button
            key={num}
            type="button"
            onClick={() => onPick(num)}
            className="rounded-xl bg-slate-900/60 ring-1 ring-white/10 hover:bg-slate-800/70 p-3 text-left flex flex-col gap-1 active:scale-[0.99] transition"
          >
            <span className="font-display font-bold text-base">#{num}</span>
            <span className="text-[11px] text-slate-400 leading-tight">
              {puzzle.region} · {puzzle.route.length} stops
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
