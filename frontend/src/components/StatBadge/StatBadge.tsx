import React from 'react';

interface StatBadgeProps {
  label: string;
  value: string | number;
}

export function StatBadge({ label, value }: StatBadgeProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center rounded-lg bg-gray-50 px-3 py-2">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="text-sm font-bold text-gray-900">{value}</span>
    </div>
  );
}
