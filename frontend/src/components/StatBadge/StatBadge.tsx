import type { ReactElement } from 'react';

interface StatBadgeProps {
  label: string;
  value: string | number;
}

export function StatBadge({ label, value }: StatBadgeProps): ReactElement {
  return (
    <div
      aria-label={`${label}: ${String(value)}`}
      className="flex flex-col items-center rounded-lg bg-toca-bg px-4 py-3 shadow-sm"
    >
      <span
        className="text-[10px] font-semibold uppercase tracking-wider text-toca-navy/50"
        aria-hidden="true"
      >
        {label}
      </span>
      <span className="mt-0.5 text-base font-bold text-toca-navy" aria-hidden="true">
        {value}
      </span>
    </div>
  );
}
