import { generatePuzzle } from './puzzleGenerator';
import type { Puzzle } from '../types';

/**
 * How many archive puzzles are available. Stable so existing players see the
 * same numbering. Bump this in the future to release more — earlier numbers
 * keep their puzzles because the seed is derived from the number itself.
 */
export const ARCHIVE_COUNT = 30;

/**
 * Deterministic past puzzle. Number 1 is the oldest, ARCHIVE_COUNT the newest
 * archive entry. The seed is independent of date hashes, so an archive puzzle
 * cannot collide with a real daily puzzle for any plausible date.
 */
export function getArchivePuzzle(num: number): Puzzle {
  // Large odd multiplier + offset gives a well-spread seed sequence and keeps
  // archive puzzle #N reproducing identically every time the user opens it.
  const seed = Math.abs((num * 1_000_003 + 7) | 0);
  return generatePuzzle(seed);
}
