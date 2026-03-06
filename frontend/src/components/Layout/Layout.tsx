import type { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../Header';

export function Layout(): ReactElement {
  return (
    <div className="min-h-screen bg-toca-bg">
      <Header />
      <main className="mx-auto max-w-7xl px-8 py-10 lg:px-14">
        <Outlet />
      </main>
    </div>
  );
}
