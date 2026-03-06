import type { ReactElement } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerContext } from '../../context/PlayerContext';

// RFC 5322-simplified regex — catches obvious non-emails before the API call.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage(): ReactElement {
  const { setEmail } = usePlayerContext();
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState('');
  const [formatError, setFormatError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const trimmed = emailInput.trim();
    if (trimmed === '') return;

    if (!EMAIL_RE.test(trimmed)) {
      setFormatError('Please enter a valid email address');
      return;
    }

    setFormatError(null);
    setEmail(trimmed);
    void navigate('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-toca-navy">
      <div className="w-full max-w-sm rounded-2xl bg-white p-10 shadow-2xl">
        <div className="mb-8 text-center">
          <span className="font-poppins text-3xl font-bold tracking-widest text-toca-navy">
            TOCA
          </span>
          <p className="mt-1 text-sm font-medium text-toca-purple">Player Portal</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-toca-navy/60"
            >
              Email address
            </label>
            <input
              id="email"
              type="text"
              inputMode="email"
              autoComplete="email"
              value={emailInput}
              onChange={e => {
                setEmailInput(e.target.value);
                setFormatError(null);
              }}
              placeholder="you@example.com"
              className="rounded-lg border border-gray-200 px-4 py-3 text-sm text-toca-navy placeholder-gray-300 focus:border-toca-navy focus:outline-none focus:ring-1 focus:ring-toca-navy"
            />
            {formatError !== null && (
              <p role="alert" className="text-xs text-red-500">
                {formatError}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={emailInput.trim() === ''}
            className="rounded-lg bg-toca-navy py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-toca-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
