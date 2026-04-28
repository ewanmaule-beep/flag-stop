import type { Attempt, Difficulty } from '../types';
import { MAX_ATTEMPTS } from './gameLogic';

const SQUARE: Record<'green' | 'yellow' | 'grey', string> = {
  green: '🟩',
  yellow: '🟨',
  grey: '⬜',
};

const TAG: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

/** Best-effort live link for the deployed game. Falls back to a sensible default
 * if window isn't available (e.g. SSR or test environments). */
function gameLink(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'https://flagstop.game';
}

interface DailyShareArgs {
  kind: 'daily';
  dateKey: string;
  attempts: Attempt[];
  won: boolean;
  difficulty: Difficulty;
  /** Current streak after recording today's result. Hidden when 0. */
  currentStreak: number;
}

interface ArchiveShareArgs {
  kind: 'archive';
  archiveNumber: number;
  attempts: Attempt[];
  won: boolean;
  difficulty: Difficulty;
}

export type ShareArgs = DailyShareArgs | ArchiveShareArgs;

/**
 * Spoiler-free share text.
 *
 * Daily example:
 *   Flag Stop · 2026-04-27 · 3/5 · Medium
 *   ⬜🟨🟩
 *   🟨🟩🟩
 *   🟩🟩🟩
 *
 *   Current streak: 4 days
 *   Can you beat my route? https://flagstop.game
 *
 * Archive example:
 *   Flag Stop Archive #12 · 4/5 · Hard
 *   ...
 *   Try a past puzzle: https://flagstop.game
 */
export function buildShareText(args: ShareArgs): string {
  const { attempts, won, difficulty } = args;
  const score = won ? `${attempts.length}/${MAX_ATTEMPTS}` : `X/${MAX_ATTEMPTS}`;
  const grid = attempts
    .map((a) => a.feedback.map((f) => SQUARE[f]).join(''))
    .join('\n');
  const link = gameLink();

  if (args.kind === 'archive') {
    const header = `Flag Stop Archive #${args.archiveNumber} · ${score} · ${TAG[difficulty]}`;
    return `${header}\n\n${grid}\n\nTry a past puzzle: ${link}`;
  }

  const header = `Flag Stop · ${args.dateKey} · ${score} · ${TAG[difficulty]}`;
  const streakLine =
    args.currentStreak >= 1
      ? `\nCurrent streak: ${args.currentStreak} day${args.currentStreak === 1 ? '' : 's'}`
      : '';
  return `${header}\n\n${grid}${streakLine}\n\nCan you beat my route? ${link}`;
}

/** Try Web Share, fall back to clipboard. Returns 'shared' | 'copied' | 'failed'. */
export async function shareOrCopy(text: string): Promise<'shared' | 'copied' | 'failed'> {
  // Web Share — works on most mobile browsers.
  const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
  if (nav.share) {
    try {
      await nav.share({ text });
      return 'shared';
    } catch {
      // user cancelled or share failed — fall through to clipboard
    }
  }
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return 'copied';
    } catch {
      // fall through
    }
  }
  // Last-resort textarea copy.
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok ? 'copied' : 'failed';
  } catch {
    return 'failed';
  }
}
