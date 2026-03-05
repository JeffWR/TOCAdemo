import type { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../Header';

export function Layout(): ReactElement {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
