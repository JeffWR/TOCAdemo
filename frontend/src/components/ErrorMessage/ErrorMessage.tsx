import type { ReactElement } from 'react';

interface ErrorMessageProps {
  message: string;
  heading?: string;
}

export function ErrorMessage({ message, heading = 'Error' }: ErrorMessageProps): ReactElement {
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4">
      <p className="font-poppins text-sm font-semibold text-red-700">{heading}</p>
      <p className="mt-1 text-sm text-red-600">{message}</p>
    </div>
  );
}
