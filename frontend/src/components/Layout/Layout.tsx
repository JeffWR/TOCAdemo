import type { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import { Header } from '../Header';

export function Layout(): ReactElement {
  // Fetch profile here so the Header shows "Hi, <name>" on any protected page,
  // not just on the HomePage. The hook is idempotent — it skips if already loaded.
  useProfile();
  return (
    <div className="min-h-screen bg-toca-bg">
      <Header />
      <main className="mx-auto max-w-7xl px-8 py-10 lg:px-14">
        <Outlet />
      </main>
    </div>
  );
}
