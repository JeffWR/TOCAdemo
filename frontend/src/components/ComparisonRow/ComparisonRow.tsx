import type { ReactElement } from 'react';

interface ComparisonRowProps {
  label: string;
  thisValue: number;
  avgValue: number;
}

export function ComparisonRow({ label, thisValue, avgValue }: ComparisonRowProps): ReactElement {
  const max = Math.max(thisValue, avgValue) * 1.25 || 1;
  const thisPct = Math.min(100, Math.round((thisValue / max) * 100));
  const avgPct = Math.min(100, Math.round((avgValue / max) * 100));
  const isAbove = thisValue >= avgValue;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-toca-navy/50">
          {label}
        </span>
        <span
          className={[
            'text-[10px] font-bold uppercase tracking-wider',
            isAbove ? 'text-emerald-500' : 'text-rose-400',
          ].join(' ')}
        >
          {isAbove ? 'Above avg' : 'Below avg'}
        </span>
      </div>

      {/* This session */}
      <div className="flex items-center gap-3">
        <span className="w-10 text-right font-poppins text-sm font-bold text-toca-navy">
          {thisValue}
        </span>
        <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-toca-bg">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-toca-purple"
            style={{ width: `${thisPct}%` }}
          />
        </div>
        <span className="w-20 text-[10px] font-medium text-toca-navy/40">This session</span>
      </div>

      {/* Average */}
      <div className="flex items-center gap-3">
        <span className="w-10 text-right font-poppins text-sm font-medium text-toca-navy/40">
          {avgValue.toFixed(1)}
        </span>
        <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-toca-bg">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-toca-navy/25"
            style={{ width: `${avgPct}%` }}
          />
        </div>
        <span className="w-20 text-[10px] font-medium text-toca-navy/40">Your average</span>
      </div>
    </div>
  );
}
