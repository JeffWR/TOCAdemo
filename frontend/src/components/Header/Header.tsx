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
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-blue-700 tracking-wide">TOCA</span>
        {email !== null && <NavMenu />}
        <div className="flex items-center gap-4">
          {profile !== null && (
            <span className="text-sm text-gray-600">Hi, {profile.firstName}</span>
          )}
          {email !== null && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Log out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
