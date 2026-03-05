import type { ReactElement } from 'react';

interface StatBadgeProps {
  label: string;
  value: string | number;
}

export function StatBadge({ label, value }: StatBadgeProps): ReactElement {
  return (
    <div
      aria-label={`${label}: ${String(value)}`}
      className="flex flex-col items-center rounded-lg bg-gray-50 px-3 py-2"
    >
      <span className="text-xs font-medium text-gray-500" aria-hidden="true">{label}</span>
      <span className="text-sm font-bold text-gray-900" aria-hidden="true">{value}</span>
    </div>
  );
}
