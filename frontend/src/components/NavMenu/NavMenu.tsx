import type { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About TOCA' },
  { to: '/profile', label: 'Profile' },
] as const;

function navClass({ isActive }: { isActive: boolean }): string {
  return isActive
    ? 'text-sm font-semibold text-white border-b-2 border-toca-purple pb-0.5'
    : 'text-sm font-medium text-white/60 hover:text-white transition-colors';
}

export function NavMenu(): ReactElement {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex items-center gap-6">
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
