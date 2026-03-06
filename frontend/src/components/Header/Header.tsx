import type { ReactElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePlayerContext } from '../../context/PlayerContext';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import tocaLogo from '../../assets/toca-logo.svg';
import { NavMenu } from '../NavMenu';

interface HeaderProps {
  onLogout?: () => void;
}

export function Header({ onLogout }: HeaderProps): ReactElement {
  const { email, profile, logout } = usePlayerContext();
  const navigate = useNavigate();
  const scrollDirection = useScrollDirection();

  function handleLogout(): void {
    logout();
    void navigate('/login');
    if (onLogout !== undefined) {
      onLogout();
    }
  }

  return (
    <header
      className={[
        'sticky top-0 z-50 bg-toca-navy shadow-md',
        'transition-transform duration-300 ease-in-out',
        scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0',
      ].join(' ')}
    >
      <div className="flex items-center justify-between px-8 py-6 lg:px-14">
        {/* Logo — left edge, navigates home */}
        <Link to="/" aria-label="Go to home page">
          <img
            src={tocaLogo}
            alt="TOCA Football"
            className="h-9 w-auto brightness-0 invert transition-opacity duration-200 hover:opacity-75"
          />
        </Link>

        {/* Nav — centre */}
        {email !== null && <NavMenu />}

        {/* User info + logout — right edge */}
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
