import { generatePuzzle } from './puzzleGenerator';
import type { Puzzle } from '../types';

/** Stable YYYY-MM-DD key in the user's local timezone. */
export function getTodayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Deterministic 32-bit hash of a string. */
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Today's puzzle — generated deterministically from the date so every player
 * gets the same one. The hand-curated list in `data/puzzles.ts` is no longer
 * used by the daily picker but is kept in the repo for reference.
 */
export function getDailyPuzzle(date: Date = new Date()): Puzzle {
  const seed = hashString(getTodayKey(date));
  return generatePuzzle(seed);
}
