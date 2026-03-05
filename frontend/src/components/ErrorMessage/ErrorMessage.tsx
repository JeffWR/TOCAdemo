import type { ReactElement } from 'react';

interface ErrorMessageProps {
  message: string;
  heading?: string;
}

export function ErrorMessage({ message, heading = 'Error' }: ErrorMessageProps): ReactElement {
  return (
    <div role="alert" className="rounded-md bg-red-50 border border-red-200 p-4">
      <p className="text-sm font-semibold text-red-700">{heading}</p>
      <p className="mt-1 text-sm text-red-600">{message}</p>
    </div>
  );
}
