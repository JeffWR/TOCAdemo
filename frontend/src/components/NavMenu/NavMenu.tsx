import type { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About TOCA' },
  { to: '/profile', label: 'Profile' },
] as const;

function navClass({ isActive }: { isActive: boolean }): string {
  return isActive
    ? 'text-sm font-semibold text-blue-700 border-b-2 border-blue-700 pb-0.5'
    : 'text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors';
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
