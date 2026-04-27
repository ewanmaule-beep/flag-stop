import type { Attempt, Difficulty } from '../types';

const KEY = 'flagstop:v1';

export interface DailyRecord {
  puzzleId: number;
  difficulty: Difficulty;
  attempts: Attempt[];
  status: 'won' | 'lost' | 'playing';
  /** Full route the player ended on (canonical or alternate). Null if unknown. */
  playerRoute?: string[] | null;
}

export interface Stats {
  played: number;
  wins: number;
  losses: number;
  currentStreak: number;
  maxStreak: number;
  // distribution[1..5] = number of wins on attempt N
  distribution: Record<number, number>;
  lastPlayedKey: string | null;
  lastResult: 'won' | 'lost' | null;
  history: Record<string, DailyRecord>;
}

const DEFAULT_STATS: Stats = {
  played: 0,
  wins: 0,
  losses: 0,
  currentStreak: 0,
  maxStreak: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  lastPlayedKey: null,
  lastResult: null,
  history: {},
};

export function loadStats(): Stats {
  if (typeof localStorage === 'undefined') return { ...DEFAULT_STATS };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_STATS };
    const parsed = JSON.parse(raw) as Partial<Stats>;
    return {
      ...DEFAULT_STATS,
      ...parsed,
      distribution: { ...DEFAULT_STATS.distribution, ...(parsed.distribution || {}) },
      history: parsed.history || {},
    };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

export function saveStats(stats: Stats): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(stats));
  } catch {
    /* swallow quota errors — game still works without persistence */
  }
}

function dayBefore(key: string): string {
  const d = new Date(`${key}T00:00:00`);
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

/**
 * Apply the outcome of today's puzzle to a stats object.
 * `attemptsUsed` only counts when `won = true` (used for distribution).
 */
export function recordResult(
  stats: Stats,
  todayKey: string,
  won: boolean,
  attemptsUsed: number,
  record: DailyRecord
): Stats {
  // Don't double-count if the user replays today's puzzle in the same session.
  const alreadyRecordedToday =
    stats.lastPlayedKey === todayKey && stats.lastResult !== null;

  const next: Stats = {
    ...stats,
    history: { ...stats.history, [todayKey]: record },
  };

  if (alreadyRecordedToday) {
    return next;
  }

  next.played = stats.played + 1;
  if (won) {
    next.wins = stats.wins + 1;
    next.distribution = {
      ...stats.distribution,
      [attemptsUsed]: (stats.distribution[attemptsUsed] || 0) + 1,
    };
    const continued =
      stats.lastPlayedKey === dayBefore(todayKey) && stats.lastResult === 'won';
    next.currentStreak = continued ? stats.currentStreak + 1 : 1;
    next.maxStreak = Math.max(stats.maxStreak, next.currentStreak);
  } else {
    next.losses = stats.losses + 1;
    next.currentStreak = 0;
  }
  next.lastPlayedKey = todayKey;
  next.lastResult = won ? 'won' : 'lost';
  return next;
}
