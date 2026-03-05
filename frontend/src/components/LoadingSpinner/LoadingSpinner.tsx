import React from 'react';

interface LoadingSpinnerProps {
  label?: string;
}

export function LoadingSpinner({ label = 'Loading' }: LoadingSpinnerProps): React.ReactElement {
  return (
    <div role="status" aria-label={label}>
      <div className="animate-spin h-8 w-8 rounded-full border-4 border-gray-200 border-t-blue-600" />
    </div>
  );
}
