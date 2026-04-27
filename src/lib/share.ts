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

/**
 * Spoiler-free share text.
 * Example:
 *   Flag Stop · 2026-04-27 · 3/5 · M
 *   ⬜🟨🟩
 *   🟨🟩🟩
 *   🟩🟩🟩
 */
export function buildShareText(args: {
  dateKey: string;
  attempts: Attempt[];
  won: boolean;
  difficulty: Difficulty;
}): string {
  const { dateKey, attempts, won, difficulty } = args;
  const score = won ? `${attempts.length}/${MAX_ATTEMPTS}` : `X/${MAX_ATTEMPTS}`;
  const header = `Flag Stop · ${dateKey} · ${score} · ${TAG[difficulty]} mode`;
  const grid = attempts
    .map((a) => a.feedback.map((f) => SQUARE[f]).join(''))
    .join('\n');
  return `${header}\n\n${grid}`;
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
