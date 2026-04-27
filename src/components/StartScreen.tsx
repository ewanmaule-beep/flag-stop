import type { Difficulty, Puzzle } from '../types';
import Flag from './Flag';

interface StartScreenProps {
  puzzle: Puzzle;
  difficulty: Difficulty;
  onChangeDifficulty: (d: Difficulty) => void;
  onStart: () => void;
  alreadyPlayed: boolean;
  lastResult: 'won' | 'lost' | null;
  onViewResult: () => void;
}

const DIFFICULTIES: { id: Difficulty; label: string; hint: string }[] = [
  { id: 'easy', label: 'Easy', hint: 'Extra reveals · short option list · region clue' },
  { id: 'medium', label: 'Medium', hint: 'Start & end revealed · default mode' },
  { id: 'hard', label: 'Hard', hint: 'Only the start and end · larger picker' },
];

export default function StartScreen({
  puzzle,
  difficulty,
  onChangeDifficulty,
  onStart,
  alreadyPlayed,
  lastResult,
  onViewResult,
}: StartScreenProps) {
  // Teaser is always start + end only, regardless of difficulty.
  // We don't want difficulty selection to leak info about today's puzzle.
  const lastIdx = puzzle.route.length - 1;
  const totalBlanks = puzzle.route.length - 2;

  return (
    <div className="flex flex-col gap-8 px-5 py-8 max-w-md mx-auto w-full">
      <header className="text-center mt-4">
        <h1 className="font-display font-extrabold text-4xl tracking-tight">
          Flag <span className="text-sky-400">Stop</span>
        </h1>
        <p className="mt-2 text-slate-300 text-sm">
          A daily route through Europe. Five tries. Same puzzle for everyone.
        </p>
      </header>

      <section className="rounded-2xl bg-slate-900/60 ring-1 ring-white/10 p-5 backdrop-blur">
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">
          Today's route
        </p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-3 justify-center">
          {puzzle.route.map((name, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={
                  'w-16 h-16 rounded-xl flex items-center justify-center ' +
                  (i === 0 || i === lastIdx
                    ? 'bg-slate-800 ring-1 ring-white/10'
                    : 'bg-slate-800/40 border border-dashed border-white/20')
                }
              >
                {i === 0 || i === lastIdx ? (
                  <Flag country={name} size="w-12 h-8" />
                ) : (
                  <span className="text-slate-400 text-2xl">?</span>
                )}
              </div>
              {i < puzzle.route.length - 1 && (
                <span className="route-arrow">→</span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-slate-400">
          You'll fill {totalBlanks} stop{totalBlanks === 1 ? '' : 's'} between
          the start and the end.
        </p>
      </section>

      <section>
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-2 px-1">
          Difficulty
        </p>
        <div className="flex flex-col gap-2">
          {DIFFICULTIES.map((d) => {
            const active = d.id === difficulty;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => onChangeDifficulty(d.id)}
                className={
                  'text-left rounded-xl px-4 py-3 transition ring-1 ' +
                  (active
                    ? 'bg-sky-500/15 ring-sky-400/60'
                    : 'bg-slate-900/60 ring-white/10 hover:bg-slate-800/60')
                }
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-lg">{d.label}</span>
                  {active && (
                    <span className="text-xs text-sky-300 font-semibold">
                      Selected
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{d.hint}</div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onStart}
          className="w-full rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-[0.99] transition text-slate-950 font-display font-bold text-lg py-4 shadow-lg shadow-sky-500/20"
        >
          {alreadyPlayed ? 'Replay today' : "Play today's puzzle"}
        </button>
        {alreadyPlayed && (
          <button
            type="button"
            onClick={onViewResult}
            className="w-full rounded-xl bg-slate-800/70 hover:bg-slate-800 ring-1 ring-white/10 text-slate-100 font-medium py-3"
          >
            View today's result
            {lastResult ? ` (${lastResult})` : ''}
          </button>
        )}
      </div>

      <p className="text-center text-xs text-slate-500">
        New route every day · streak preserved if you play daily
      </p>
    </div>
  );
}
