import type { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../Header';

export function Layout(): ReactElement {
  return (
    <div className="min-h-screen bg-toca-bg">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
