import { useEffect } from 'react';

interface HowToPlayProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Lightweight modal that explains the rules. Shown from the start screen
 * (primary "How to play" button) and from the in-game header (the small "?"
 * button), so a player can re-read the rules mid-puzzle.
 *
 * Closes on backdrop click, the X button, or pressing Escape.
 */
export default function HowToPlay({ open, onClose }: HowToPlayProps) {
  // Lock background scroll while the modal is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape key.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-slate-950/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-to-play-title"
    >
      <div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 ring-1 ring-white/10 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 ring-1 ring-white/10 text-slate-300 flex items-center justify-center text-lg leading-none"
        >
          ×
        </button>

        <h2
          id="how-to-play-title"
          className="font-display font-extrabold text-2xl pr-10"
        >
          How to play
        </h2>
        <p className="mt-1 text-slate-300 text-sm">
          A daily route through Europe. Five tries. Same puzzle for everyone.
        </p>

        <div className="mt-5 space-y-4 text-sm text-slate-200 leading-relaxed">
          <p>
            You'll see a short route across Europe with the start and end
            countries revealed. Your job is to fill in the missing stops so
            the whole route is a chain of land borders (or the few sea links we
            allow, like UK ↔ France).
          </p>

          <div>
            <p className="font-semibold text-slate-100">Each guess</p>
            <p className="text-slate-300">
              Pick a country for every blank slot, then tap{' '}
              <span className="text-sky-300">Check route</span>. You get up to
              five tries.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-100 mb-2">Feedback colours</p>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block w-3.5 h-3.5 rounded bg-emerald-500 flex-shrink-0" />
                <span>
                  <span className="text-emerald-400 font-medium">Green</span> —
                  right country, right slot.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block w-3.5 h-3.5 rounded bg-amber-400 flex-shrink-0" />
                <span>
                  <span className="text-amber-300 font-medium">Yellow</span> —
                  the country is on the route, but in a different slot.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block w-3.5 h-3.5 rounded bg-slate-600 flex-shrink-0" />
                <span>
                  <span className="text-slate-300 font-medium">Grey</span> —
                  not on the route at all.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-slate-100">Alternate routes</p>
            <p className="text-slate-300">
              Sometimes another valid border-chain works too. If your route is a
              real chain that gets you from start to end, you win — even if it's
              not the one we picked.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-100">Difficulty</p>
            <p className="text-slate-300">
              Easy gives a region clue and a shorter list of countries to pick
              from. Medium has eight options. Hard has twelve.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-100">Daily reset & sharing</p>
            <p className="text-slate-300">
              A new route appears every day. Share your result as a colour grid
              without spoiling the answer.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-[0.99] transition text-slate-950 font-display font-bold text-base py-3"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
