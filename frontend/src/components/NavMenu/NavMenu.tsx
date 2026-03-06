import type { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About TOCA' },
  { to: '/profile', label: 'Profile' },
] as const;

const BASE =
  'relative px-8 py-2 text-sm font-medium rounded-full transition-all duration-200 ease-in-out';
const ACTIVE = `${BASE} bg-white/15 text-white scale-105 shadow-sm`;
const INACTIVE = `${BASE} text-white/60 hover:text-white hover:bg-white/10 hover:scale-105`;

function navClass({ isActive }: { isActive: boolean }): string {
  return isActive ? ACTIVE : INACTIVE;
}

export function NavMenu(): ReactElement {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex items-center gap-2">
        {LINKS.map(({ to, label }) => (
          <li key={to}>
            <NavLink to={to} end={to === '/'} className={navClass}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
