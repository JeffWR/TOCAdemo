import type { ReactElement } from 'react';
import { usePlayerContext } from '../../context/PlayerContext';
import { NavMenu } from '../NavMenu';

interface HeaderProps {
  onLogout?: () => void;
}

export function Header({ onLogout }: HeaderProps): ReactElement {
  const { email, profile, logout } = usePlayerContext();

  function handleLogout(): void {
    logout();
    if (onLogout !== undefined) {
      onLogout();
    }
  }

  return (
    <header className="bg-toca-navy px-6 py-4">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <span className="font-poppins text-xl font-bold tracking-widest text-white">TOCA</span>
        {email !== null && <NavMenu />}
        <div className="flex items-center gap-4">
          {profile !== null && (
            <span className="text-sm text-white/70">Hi, {profile.firstName}</span>
          )}
          {email !== null && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded border border-white/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/90 transition-colors hover:bg-white hover:text-toca-navy"
            >
              Log out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
