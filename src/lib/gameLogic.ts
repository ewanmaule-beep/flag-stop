import type { Difficulty, Feedback, Puzzle } from '../types';
import { isValidRoute } from '../data/borders';

export const MAX_ATTEMPTS = 5;

/** Seeded shuffle so option order is stable per puzzle/difficulty/day. */
function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = items.slice();
  let s = seed || 1;
  for (let i = arr.length - 1; i > 0; i--) {
    // xorshift-ish PRNG, good enough for shuffling
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    const j = Math.abs(s) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Indexes that should be revealed (visible) on the route for a difficulty. */
export function getVisibleIndexes(puzzle: Puzzle, difficulty: Difficulty): number[] {
  const last = puzzle.route.length - 1;
  if (difficulty === 'hard') {
    return [0, last];
  }
  if (difficulty === 'easy') {
    const set = new Set<number>([0, last, ...puzzle.visibleIndexes]);
    // Add a middle reveal if the route is long enough and isn't already covered.
    if (puzzle.route.length >= 4) {
      const middle = Math.floor(puzzle.route.length / 2);
      set.add(middle);
    }
    return Array.from(set).sort((a, b) => a - b);
  }
  // Medium: always include start and end, plus puzzle defaults.
  const set = new Set<number>([0, last, ...puzzle.visibleIndexes]);
  return Array.from(set).sort((a, b) => a - b);
}

/** The route positions the player must fill in. */
export function getBlankIndexes(puzzle: Puzzle, difficulty: Difficulty): number[] {
  const visible = new Set(getVisibleIndexes(puzzle, difficulty));
  return puzzle.route
    .map((_, i) => i)
    .filter((i) => !visible.has(i));
}

/** Build the country-picker options for a given difficulty. */
export function getOptions(
  puzzle: Puzzle,
  difficulty: Difficulty,
  blankIndexes: number[]
): string[] {
  const answers = blankIndexes.map((i) => puzzle.route[i]);
  let target: number;
  if (difficulty === 'easy') target = Math.min(answers.length + 3, 7);
  else if (difficulty === 'medium') target = Math.min(answers.length + 5, 10);
  else target = Math.min(answers.length + 7, 12);

  const pool = Array.from(new Set([...answers, ...puzzle.decoys]));
  const trimmed = pool.slice(0, Math.max(target, answers.length));
  return seededShuffle(trimmed, puzzle.id * 31 + difficulty.length);
}

/** Wordle-style feedback: green = correct slot, yellow = wrong slot, grey = absent. */
export function evaluateGuess(
  puzzle: Puzzle,
  blankIndexes: number[],
  guess: (string | null)[]
): Feedback[] {
  const answers = blankIndexes.map((i) => puzzle.route[i]);
  const feedback: Feedback[] = guess.map(() => 'grey');
  const remaining = answers.slice();

  // First pass — exact matches.
  guess.forEach((g, i) => {
    if (g && g === answers[i]) {
      feedback[i] = 'green';
      const idx = remaining.indexOf(g);
      if (idx !== -1) remaining.splice(idx, 1);
    }
  });

  // Second pass — present-but-wrong-slot.
  guess.forEach((g, i) => {
    if (feedback[i] === 'green' || !g) return;
    const idx = remaining.indexOf(g);
    if (idx !== -1) {
      feedback[i] = 'yellow';
      remaining.splice(idx, 1);
    }
  });

  return feedback;
}

export function isFullyCorrect(feedback: Feedback[]): boolean {
  return feedback.every((f) => f === 'green');
}

/**
 * Combine the puzzle's revealed flags with the player's blank guesses to get
 * the full route they're proposing. Returns null if any blank is empty.
 */
export function buildFullRoute(
  puzzle: Puzzle,
  blankIndexes: number[],
  guess: (string | null)[]
): string[] | null {
  const result = puzzle.route.slice();
  for (let i = 0; i < blankIndexes.length; i++) {
    const g = guess[i];
    if (!g) return null;
    result[blankIndexes[i]] = g;
  }
  return result;
}

/**
 * A guess wins if its full route is a valid border chain through the graph.
 * That includes the puzzle's canonical answer and any alternate valid path.
 */
export function isWinningGuess(
  puzzle: Puzzle,
  blankIndexes: number[],
  guess: (string | null)[]
): boolean {
  const fullRoute = buildFullRoute(puzzle, blankIndexes, guess);
  if (!fullRoute) return false;
  return isValidRoute(fullRoute);
}

/** True if the player won via a different (but still valid) route. */
export function isAlternateWin(puzzle: Puzzle, fullRoute: string[]): boolean {
  if (fullRoute.length !== puzzle.route.length) return false;
  for (let i = 0; i < fullRoute.length; i++) {
    if (fullRoute[i] !== puzzle.route[i]) return true;
  }
  return false;
}
