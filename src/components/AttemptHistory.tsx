import type { Attempt } from '../types';
import Flag from './Flag';

interface AttemptHistoryProps {
  attempts: Attempt[];
}

export default function AttemptHistory({ attempts }: AttemptHistoryProps) {
  if (attempts.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs uppercase tracking-widest text-slate-400 px-1">
        Past attempts
      </p>
      <div className="flex flex-col gap-1.5">
        {attempts.map((a, idx) => (
          <div key={idx} className="flex items-center gap-2 animate-fade-up">
            <span className="text-xs text-slate-500 w-5 text-right">
              {idx + 1}
            </span>
            <div className="flex flex-1 gap-1">
              {a.guesses.map((g, j) => {
                const fb = a.feedback[j];
                const cls =
                  fb === 'green'
                    ? 'bg-emerald-500/85 ring-emerald-300'
                    : fb === 'yellow'
                    ? 'bg-amber-400/90 ring-amber-200'
                    : 'bg-slate-600/80 ring-slate-400/40';
                return (
                  <div
                    key={j}
                    className={
                      'flex-1 h-9 rounded-md ring-1 flex items-center justify-center ' +
                      cls
                    }
                    title={g}
                  >
                    <Flag country={g} size="w-7 h-5" rounded="rounded-sm" alt={false} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
