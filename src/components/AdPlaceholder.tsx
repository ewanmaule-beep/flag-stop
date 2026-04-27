/**
 * Placeholder ad slot. Swap the inner markup with your AdSense / ad-network
 * tag when you're ready. Keep the wrapper so we can reserve space and signal
 * "ad area" clearly to the user (privacy-friendly UX).
 */
export default function AdPlaceholder({ label = 'Sponsored' }: { label?: string }) {
  return (
    <div
      role="complementary"
      aria-label="Advertisement placeholder"
      className="w-full rounded-xl border border-dashed border-white/10 bg-slate-900/40 p-4 text-center"
    >
      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
        {label}
      </p>
      <p className="text-sm text-slate-400">
        Ad placement (replace this with AdSense or another network).
      </p>
      <p className="text-xs text-slate-500 mt-1">
        Shown only after the round is complete.
      </p>
    </div>
  );
}
