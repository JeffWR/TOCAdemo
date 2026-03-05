import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { PlayerProvider } from '../../context/PlayerContext';
import { ProtectedRoute } from './ProtectedRoute';

function renderWithRouter(initialEmail: string | null): void {
  render(
    <MemoryRouter initialEntries={['/protected']}>
      <PlayerProvider initialEmail={initialEmail ?? undefined}>
        <Routes>
          <Route path="/login" element={<p>Login page</p>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<p>Protected content</p>} />
          </Route>
        </Routes>
      </PlayerProvider>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  it('renders child route when user is logged in', () => {
    renderWithRouter('player@example.com');
    expect(screen.getByText('Protected content')).toBeDefined();
  });

  it('redirects to /login when no email is in context', () => {
    renderWithRouter(null);
    expect(screen.getByText('Login page')).toBeDefined();
    expect(screen.queryByText('Protected content')).toBeNull();
  });
});
