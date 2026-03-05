import type { ReactElement } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerContext } from '../../context/PlayerContext';

export default function LoginPage(): ReactElement {
  const { setEmail } = usePlayerContext();
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const trimmed = emailInput.trim();
    if (trimmed === '') return;
    setEmail(trimmed);
    void navigate('/sessions');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-blue-700">TOCA Player Portal</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="you@example.com"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={emailInput.trim() === ''}
            className="rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
