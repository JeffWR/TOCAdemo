import type { ReactElement } from 'react';

interface LoadingSpinnerProps {
  label?: string;
}

export function LoadingSpinner({ label = 'Loading' }: LoadingSpinnerProps): ReactElement {
  return (
    <div role="status" aria-label={label}>
      <div
        data-testid="spinner-visual"
        aria-hidden="true"
        className="animate-spin h-8 w-8 rounded-full border-4 border-toca-bg border-t-toca-navy"
      />
    </div>
  );
}
