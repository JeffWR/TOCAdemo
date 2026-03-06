import type { ReactElement } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerContext } from '../../context/PlayerContext';
import tocaLogo from '../../assets/toca-logo.svg';

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
    // fixed + inset-0 locks the background to the viewport — no overscroll bleed
    <div className="fixed inset-0 overflow-auto bg-gradient-to-br from-[#020d6b] via-toca-navy to-[#120e90] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-12 shadow-2xl">
        <div className="mb-10 flex flex-col items-center gap-3">
          <img src={tocaLogo} alt="TOCA Football" className="h-12 w-auto" />
          <p className="text-xs font-semibold uppercase tracking-widest text-toca-purple">
            Player Portal
          </p>
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
              className="rounded-xl border border-gray-200 px-4 py-3.5 text-sm text-toca-navy placeholder-gray-300 focus:border-toca-navy focus:outline-none focus:ring-1 focus:ring-toca-navy"
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
            className="mt-1 rounded-xl bg-toca-navy py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-toca-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
