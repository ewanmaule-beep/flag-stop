import { useEffect, useMemo, useState } from 'react';
import type { Attempt, Difficulty, Feedback, Puzzle } from '../types';
import {
  MAX_ATTEMPTS,
  buildFullRoute,
  evaluateGuess,
  getBlankIndexes,
  getOptions,
  getVisibleIndexes,
  isWinningGuess,
} from '../lib/gameLogic';
import RouteDisplay from './RouteDisplay';
import OptionsList from './OptionsList';
import AttemptHistory from './AttemptHistory';

interface GameScreenProps {
  puzzle: Puzzle;
  difficulty: Difficulty;
  onExit: () => void;
  onComplete: (won: boolean, attempts: Attempt[], fullRoute: string[] | null) => void;
}

export default function GameScreen({
  puzzle,
  difficulty,
  onExit,
  onComplete,
}: GameScreenProps) {
  const visibleIndexes = useMemo(
    () => getVisibleIndexes(puzzle, difficulty),
    [puzzle, difficulty]
  );
  const blankIndexes = useMemo(
    () => getBlankIndexes(puzzle, difficulty),
    [puzzle, difficulty]
  );
  const options = useMemo(
    () => getOptions(puzzle, difficulty, blankIndexes),
    [puzzle, difficulty, blankIndexes]
  );

  const [placements, setPlacements] = useState<(string | null)[]>(
    () => blankIndexes.map(() => null)
  );
  const [selectedBlank, setSelectedBlank] = useState<number | null>(0);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [shake, setShake] = useState(false);

  // Reset when difficulty/puzzle changes (e.g. on remount).
  useEffect(() => {
    setPlacements(blankIndexes.map(() => null));
    setAttempts([]);
    setSelectedBlank(0);
  }, [puzzle.id, difficulty, blankIndexes.length]);

  const allFilled = placements.every((p) => p !== null);
  const attemptsLeft = MAX_ATTEMPTS - attempts.length;

  // Build a knowledge map: country → best feedback we've ever seen for it.
  // Priority: green > yellow > grey.
  const knowledge = useMemo(() => {
    const order: Record<Feedback, number> = { green: 3, yellow: 2, grey: 1 };
    const m: Record<string, Feedback | undefined> = {};
    attempts.forEach((a) => {
      a.guesses.forEach((g, i) => {
        const fb = a.feedback[i];
        const prev = m[g];
        if (!prev || order[fb] > order[prev]) m[g] = fb;
      });
    });
    return m;
  }, [attempts]);

  function pickOption(country: string) {
    if (attempts.length >= MAX_ATTEMPTS) return;
    setPlacements((prev) => {
      const next = prev.slice();
      // If the country is already placed somewhere, move it: clear the old slot.
      const existingSlot = next.indexOf(country);
      if (existingSlot !== -1) next[existingSlot] = null;

      // Find target slot.
      let target = selectedBlank;
      if (target === null || next[target] !== null) {
        const empty = next.findIndex((p) => p === null);
        target = empty === -1 ? selectedBlank : empty;
      }
      if (target === null) return prev;
      next[target] = country;

      // Auto-advance to next empty slot.
      const nextEmpty = next.findIndex((p, i) => i > target! && p === null);
      const wrapEmpty = next.findIndex((p) => p === null);
      setSelectedBlank(nextEmpty !== -1 ? nextEmpty : wrapEmpty);
      return next;
    });
  }

  function clearBlank(blankIdx: number) {
    setPlacements((prev) => {
      const next = prev.slice();
      next[blankIdx] = null;
      return next;
    });
    setSelectedBlank(blankIdx);
  }

  function selectBlank(blankIdx: number) {
    // Tap a filled blank → clear it. Tap an empty blank → select it.
    if (placements[blankIdx] !== null) {
      clearBlank(blankIdx);
      return;
    }
    setSelectedBlank(blankIdx);
  }

  function check() {
    if (!allFilled) return;
    const feedback = evaluateGuess(puzzle, blankIndexes, placements);
    const guesses = placements.map((p) => p as string);
    const newAttempt: Attempt = { guesses, feedback };
    const nextAttempts = [...attempts, newAttempt];
    setAttempts(nextAttempts);

    // Win if the full route is a valid border chain (canonical OR alternate).
    const won = isWinningGuess(puzzle, blankIndexes, placements);
    const fullRoute = buildFullRoute(puzzle, blankIndexes, placements);

    if (won) {
      // Briefly show the feedback tiles before transitioning.
      window.setTimeout(() => onComplete(true, nextAttempts, fullRoute), 900);
      return;
    }
    if (nextAttempts.length >= MAX_ATTEMPTS) {
      window.setTimeout(() => onComplete(false, nextAttempts, fullRoute), 900);
      return;
    }
    // Wrong but more attempts left — shake feedback.
    setShake(true);
    window.setTimeout(() => setShake(false), 350);
  }

  const placedSet = useMemo(
    () => new Set(placements.filter((p): p is string => !!p)),
    [placements]
  );

  // Last-attempt feedback, but only kept for slots the player hasn't changed
  // since that attempt. If they edit a slot, drop its colour.
  const lastAttempt = attempts[attempts.length - 1];
  const lockedFeedback: (Feedback | null)[] | null = lastAttempt
    ? placements.map((p, i) =>
        p && lastAttempt.guesses[i] === p ? lastAttempt.feedback[i] : null
      )
    : null;

  return (
    <div className="flex flex-col gap-5 px-4 py-5 max-w-md mx-auto w-full pb-32">
      <header className="flex items-center justify-between">
        <button
          type="button"
          onClick={onExit}
          className="text-slate-400 hover:text-slate-200 text-sm"
        >
          ← Back
        </button>
        <div className="text-center">
          <h2 className="font-display font-bold text-lg leading-none">
            Flag Stop
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">
            {difficulty} · {attemptsLeft} {attemptsLeft === 1 ? 'try' : 'tries'} left
          </p>
        </div>
        <div className="w-12" />
      </header>

      <section
        className={
          'rounded-2xl bg-slate-900/60 ring-1 ring-white/10 p-4 backdrop-blur ' +
          (shake ? 'animate-pop' : '')
        }
      >
        <RouteDisplay
          route={puzzle.route}
          visibleIndexes={visibleIndexes}
          blankIndexes={blankIndexes}
          placements={placements}
          selectedBlank={selectedBlank}
          lockedFeedback={lockedFeedback}
          onSelectBlank={selectBlank}
        />
        {difficulty === 'easy' && (
          <p className="mt-3 text-center text-xs text-slate-400">
            Region: <span className="text-slate-200">{puzzle.region}</span>
          </p>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-widest text-slate-400 px-1">
          Pick a country
        </p>
        <OptionsList
          options={options}
          placedSet={placedSet}
          knowledge={knowledge}
          onPick={pickOption}
        />
      </section>

      <AttemptHistory attempts={attempts} />

      <div className="fixed bottom-0 inset-x-0 px-4 pb-4 pt-3 bg-gradient-to-t from-[#0b1020] via-[#0b1020]/95 to-transparent">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <button
            type="button"
            onClick={check}
            disabled={!allFilled}
            className={
              'flex-1 rounded-xl py-4 font-display font-bold text-lg transition shadow-lg ' +
              (allFilled
                ? 'bg-sky-500 hover:bg-sky-400 active:scale-[0.99] text-slate-950 shadow-sky-500/20'
                : 'bg-slate-800/70 text-slate-500 cursor-not-allowed')
            }
          >
            {allFilled ? 'Check route' : 'Fill all stops'}
          </button>
        </div>
      </div>
    </div>
  );
}
