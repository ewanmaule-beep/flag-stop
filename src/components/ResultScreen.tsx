import { useState } from 'react';
import type { Attempt, Difficulty, Puzzle } from '../types';
import type { Stats } from '../lib/storage';
import { buildShareText, shareOrCopy } from '../lib/share';
import { isAlternateWin } from '../lib/gameLogic';
import StatsView from './StatsView';
import AdPlaceholder from './AdPlaceholder';
import Flag from './Flag';
import MapView, { type MapPin } from './MapView';

interface ResultScreenProps {
  puzzle: Puzzle;
  difficulty: Difficulty;
  attempts: Attempt[];
  won: boolean;
  /** Full route the player ended on. Used to surface alternate-path wins. */
  playerRoute: string[] | null;
  dateKey: string;
  stats: Stats;
  onBackToStart: () => void;
}

export default function ResultScreen({
  puzzle,
  difficulty,
  attempts,
  won,
  playerRoute,
  dateKey,
  stats,
  onBackToStart,
}: ResultScreenProps) {
  const wonViaAlternate =
    won && playerRoute !== null && isAlternateWin(puzzle, playerRoute);
  const [shareState, setShareState] = useState<'idle' | 'shared' | 'copied' | 'failed'>(
    'idle'
  );

  // All canonical-route stops as green pins on the map.
  const mapPins: MapPin[] = puzzle.route.map((country) => ({
    country,
    status: 'green',
    showLabel: true,
  }));

  // If the player won via a different valid path, draw it underneath in amber.
  const altMapPins: MapPin[] | undefined =
    wonViaAlternate && playerRoute
      ? playerRoute.map((country) => ({
          country,
          status: 'yellow',
          showLabel: false,
        }))
      : undefined;

  async function handleShare() {
    const text = buildShareText({ dateKey, attempts, won, difficulty });
    const result = await shareOrCopy(text);
    setShareState(result);
    window.setTimeout(() => setShareState('idle'), 2000);
  }

  return (
    <div className="flex flex-col gap-5 px-4 py-6 max-w-md mx-auto w-full pb-10">
      <header className="text-center mt-2">
        <p className="text-xs uppercase tracking-widest text-slate-400">
          {dateKey} · {difficulty}
        </p>
        <h1 className="font-display font-extrabold text-3xl mt-1">
          {won ? 'Route complete' : 'Out of tries'}
        </h1>
        <p className="text-slate-300 text-sm mt-1">
          {won
            ? `Solved in ${attempts.length} ${attempts.length === 1 ? 'try' : 'tries'}.`
            : 'Better luck tomorrow.'}
        </p>
        {wonViaAlternate && (
          <p className="text-amber-300 text-xs mt-2">
            You found a different valid route — nicely done.
          </p>
        )}
      </header>

      {wonViaAlternate && playerRoute && (
        <section className="rounded-2xl bg-slate-900/60 ring-1 ring-amber-300/30 p-4 backdrop-blur">
          <p className="text-xs uppercase tracking-widest text-amber-300 mb-3">
            Your route
          </p>
          <RouteTiles route={playerRoute} />
        </section>
      )}

      <section className="rounded-2xl bg-slate-900/60 ring-1 ring-white/10 p-4 backdrop-blur">
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">
          {wonViaAlternate ? 'Intended route' : 'The route'}
        </p>
        <div className="mb-4">
          <MapView pins={mapPins} altPins={altMapPins} />
          {wonViaAlternate && (
            <p className="mt-2 text-[11px] text-slate-400 text-center">
              <span className="text-emerald-400">Green</span> = intended route ·{' '}
              <span className="text-amber-300">amber</span> = your route
            </p>
          )}
        </div>
        <RouteTiles route={puzzle.route} />
      </section>

      <section className="rounded-2xl bg-slate-900/60 ring-1 ring-white/10 p-4">
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">
          Your attempts
        </p>
        <div className="flex flex-col gap-1.5">
          {attempts.map((a, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs text-slate-500 w-5 text-right">
                {idx + 1}
              </span>
              <div className="flex flex-1 gap-1">
                {a.feedback.map((fb, j) => {
                  const cls =
                    fb === 'green'
                      ? 'bg-emerald-500/85'
                      : fb === 'yellow'
                      ? 'bg-amber-400/90'
                      : 'bg-slate-600/80';
                  return (
                    <div
                      key={j}
                      className={'flex-1 h-7 rounded ' + cls}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-slate-900/60 ring-1 ring-white/10 p-4">
        <StatsView stats={stats} highlightAttempt={won ? attempts.length : null} />
      </section>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleShare}
          className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] transition text-slate-950 font-display font-bold text-lg py-4 shadow-lg shadow-emerald-500/20"
        >
          {shareState === 'shared'
            ? 'Shared'
            : shareState === 'copied'
            ? 'Copied to clipboard'
            : shareState === 'failed'
            ? 'Try again'
            : 'Share result'}
        </button>
        <button
          type="button"
          onClick={onBackToStart}
          className="w-full rounded-xl bg-slate-800/70 hover:bg-slate-800 ring-1 ring-white/10 text-slate-100 font-medium py-3"
        >
          Back to start
        </button>
      </div>

      <AdPlaceholder />

      <p className="text-center text-xs text-slate-500">
        New route every day · come back tomorrow
      </p>
    </div>
  );
}

/** Shared row of flag tiles with country-name captions. */
function RouteTiles({ route }: { route: string[] }) {
  return (
    <div className="flex flex-wrap items-start justify-center gap-x-2 gap-y-4">
      {route.map((name, i) => {
        const isLast = i === route.length - 1;
        return (
          <div key={i} className="flex items-start gap-2">
            <div className="flex flex-col items-center gap-1.5 w-16">
              <div className="w-16 h-16 rounded-xl bg-slate-800 ring-1 ring-white/10 flex items-center justify-center">
                <Flag country={name} size="w-12 h-8" />
              </div>
              <span
                className="text-[10px] leading-tight text-slate-300 text-center w-full truncate"
                title={name}
              >
                {name}
              </span>
            </div>
            {!isLast && (
              <span className="route-arrow flex h-16 items-center">→</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
