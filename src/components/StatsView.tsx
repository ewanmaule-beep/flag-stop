import type { Stats } from '../lib/storage';
import { MAX_ATTEMPTS } from '../lib/gameLogic';

interface StatsViewProps {
  stats: Stats;
  highlightAttempt?: number | null;
}

export default function StatsView({ stats, highlightAttempt }: StatsViewProps) {
  const winRate =
    stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;
  const max = Math.max(1, ...Object.values(stats.distribution));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-2 text-center">
        <Stat label="Played" value={stats.played} />
        <Stat label="Win %" value={winRate} />
        <Stat label="Streak" value={stats.currentStreak} />
        <Stat label="Best" value={stats.maxStreak} />
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">
          Guess distribution
        </p>
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: MAX_ATTEMPTS }, (_, i) => i + 1).map((n) => {
            const count = stats.distribution[n] || 0;
            const widthPct = Math.max(6, (count / max) * 100);
            const isHi = highlightAttempt === n;
            return (
              <div key={n} className="flex items-center gap-2">
                <span className="w-3 text-xs text-slate-400">{n}</span>
                <div className="flex-1 bg-slate-800/50 rounded">
                  <div
                    style={{ width: `${widthPct}%` }}
                    className={
                      'h-5 rounded text-[11px] font-semibold flex items-center justify-end pr-2 ' +
                      (isHi
                        ? 'bg-sky-500 text-slate-950'
                        : count > 0
                        ? 'bg-slate-600 text-slate-100'
                        : 'bg-slate-800 text-slate-500')
                    }
                  >
                    {count}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg bg-slate-800/60 ring-1 ring-white/5 py-2">
      <div className="font-display font-bold text-2xl">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-slate-400">
        {label}
      </div>
    </div>
  );
}
