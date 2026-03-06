import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { PlayerProvider } from '../../context/PlayerContext';
import { Layout } from './Layout';

vi.mock('../../hooks/useProfile', () => ({ useProfile: () => ({ loading: false, error: null }) }));

function renderLayout(): void {
  render(
    <MemoryRouter initialEntries={['/home']}>
      <PlayerProvider initialEmail="test@example.com">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/home" element={<p>Page content</p>} />
          </Route>
        </Routes>
      </PlayerProvider>
    </MemoryRouter>,
  );
}

describe('Layout', () => {
  it('renders the Header inside the layout', () => {
    renderLayout();
    expect(screen.getByRole('img', { name: /toca football/i })).toBeDefined();
  });

  it('renders child route content inside a main element', () => {
    renderLayout();
    const main = screen.getByRole('main');
    expect(main).toBeDefined();
    expect(main.textContent).toContain('Page content');
  });
});
